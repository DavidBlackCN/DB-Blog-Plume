// Regression checks for the demand-driven reading background (no browser required).
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const root = 'docs/.vuepress/theme/'
function compile(source, dependencies = {}, globals = {}) {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, require: name => dependencies[name], ...globals })
  return exports
}
const physicsSource = fs.readFileSync(root + 'utils/pixelBurst.ts', 'utf8')
const physics = compile(physicsSource)
let mounted, unmount, now = 0, nextFrame = 0, draws = []
const frames = new Map(), observers = []
function target(extra = {}) {
  const listeners = new Map()
  return { ...extra, listeners,
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: type => listeners.delete(type),
  }
}
const motion = target({ matches: false }), pointer = target({ matches: true })
const win = target({ devicePixelRatio: 3, getSelection: () => null })
const doc = target({ hidden: false, documentElement: {} })
const context = {
  fillRect: (...args) => draws.push([context.fillStyle, ...args]),
  clearRect() {}, setTransform() {},
}
const canvas = { width: 0, height: 0, getContext: () => context,
  getBoundingClientRect: () => ({ left: 0, top: 64, width: 1000, height: 700 }) }
let palette = { color: '#5086a1', borderTopColor: '#3d6f87' }
class Observer {
  constructor(callback) { this.callback = callback; this.connected = false; observers.push(this) }
  observe() { this.connected = true }
  disconnect() { this.connected = false }
}
class Element { constructor(blocked = false) { this.blocked = blocked } matches() { return this.blocked } }
const controller = compile(fs.readFileSync(root + 'composables/useReadingPixelBurst.ts', 'utf8'), {
  vue: { onMounted: fn => { mounted = fn }, onBeforeUnmount: fn => { unmount = fn } },
  '../utils/pixelBurst': physics,
}, {
  window: win, document: doc, Element, ResizeObserver: Observer, MutationObserver: Observer,
  matchMedia: query => query.includes('reduced-motion') ? motion : pointer,
  getComputedStyle: () => palette, performance: { now: () => now },
  requestAnimationFrame: fn => { frames.set(++nextFrame, fn); return nextFrame },
  cancelAnimationFrame: id => frames.delete(id),
})
controller.useReadingPixelBurst({ value: canvas }); mounted()
assert.equal(frames.size, 0, 'idle must not schedule RAF')
assert.equal(canvas.width, 1500, 'DPR capped at 1.5')
function click(extra = {}) {
  now += 200
  win.listeners.get('click')({ button: 0, detail: 1, clientX: 200, clientY: 264,
    composedPath: () => [new Element()], ...extra })
}
function tick() {
  now += 1000 / 60
  const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(now))
}
click(); assert.equal(frames.size, 1); tick()
assert.equal(draws.length, 8, 'small eight-pixel burst')
assert(draws.every(draw => Object.values(palette).includes(draw[0])))
palette = { color: '#ad4506', borderTopColor: '#b06d88' }
observers[0].callback(); draws = []; tick()
assert(draws.every(draw => Object.values(palette).includes(draw[0])), 'live theme update')
for (let i = 0; i < 40; i++) tick()
assert.equal(frames.size, 0, 'burst must stop and clear')
for (const extra of [{ composedPath: () => [new Element(true)] }, { detail: 0 }, { defaultPrevented: true }, { button: 2 }, { ctrlKey: true }]) {
  click(extra); assert.equal(frames.size, 0, 'interactive / synthetic / modified clicks ignored')
}
motion.matches = true; click(); assert.equal(frames.size, 0)
motion.matches = false; pointer.matches = false; click(); assert.equal(frames.size, 0)
pointer.matches = true; click(); assert.equal(frames.size, 1)
doc.hidden = true; doc.listeners.get('visibilitychange')(); assert.equal(frames.size, 0)
click(); assert.equal(frames.size, 0); doc.hidden = false
click(); motion.matches = true; motion.listeners.get('change')(); assert.equal(frames.size, 0)
motion.matches = false; click(); win.listeners.get('resize')(); assert.equal(frames.size, 0)
click(); unmount(); assert.equal(frames.size, 0)
assert.equal(win.listeners.size + doc.listeners.size + motion.listeners.size + pointer.listeners.size, 0)
assert(observers.every(observer => !observer.connected))

// Verify the extracted physics preserves Home's previous calculations exactly.
const stable = compile(physicsSource, {}, { Math: Object.assign(Object.create(Math), { random: () => .5 }) })
const pixels = []; stable.spawnPixelDebris(pixels, 100, 200, 1, ['brand'])
assert.equal(pixels[0].maxLife, 44); assert.equal(pixels[0].size, 3)
assert.equal(pixels[0].vx, -3.0999999999999996)
stable.drawPixelDebris(context, pixels, .94)
assert.equal(pixels[0].life, 1); assert.equal(pixels[0].x, 96.9)
assert.equal(pixels[0].vx, -3.0999999999999996 * .94)

// Exercise actual route predicates, including navigation back to excluded pages.
let route = { path: '/' }, frontmatter = { value: {} }
const wrapper = fs.readFileSync(root + 'components/ReadingBackground.vue', 'utf8').split('<script setup lang="ts">')[1].split('</script>')[0]
const routing = compile(wrapper + '\nexport { isReadingPage, variant }', {
  vue: { computed: fn => ({ get value() { return fn() } }), onMounted() {}, onUnmounted() {} },
  'vuepress/client': { useRoute: () => route, usePageFrontmatter: () => frontmatter },
  './ReadingGridBackground.vue': {},
})
for (const [path, meta, expected] of [
  ['/blog/', { pageLayout: 'posts' }, 'blog'], ['/article/k35r07t6/', {}, 'blog'],
  ['/notes/demo/plume-zhu-ti-yu-lan/', {}, 'docs'], ['/', {}, null],
  ['/random/', { pageLayout: 'custom' }, null], ['/friends/', { pageLayout: 'friends' }, null],
  ['/404.html', { layout: 'NotFound' }, null],
]) {
  route.path = path; frontmatter.value = meta
  assert.equal(routing.isReadingPage.value ? routing.variant.value : null, expected, path)
}
console.log('PASS: route variants, shared Home physics, idle/finish RAF, 8 pixels, theme colors, interaction guards, reduced motion, touch, DPR, resize, background and unmount cleanup')
