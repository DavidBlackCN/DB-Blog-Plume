<template>
  <div
    ref="root"
    class="space-background"
    :class="{ 'is-reading': props.variant === 'reading' }"
    aria-hidden="true"
  >
    <canvas ref="canvas" class="space-background__canvas"></canvas>
    <div class="space-background__orbits">
      <span class="space-background__orbit orbit-a"></span>
      <span class="space-background__orbit orbit-b"></span>
      <span class="space-background__orbit orbit-c"></span>
    </div>
    <div class="space-background__glow glow-left"></div>
    <div class="space-background__glow glow-right"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Star3D {
  x: number
  y: number
  z: number
  size: number
  colorType: number
  phase: number
  twinkleSpeed: number
}

interface PixelDebris {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

interface DataPacket {
  x: number
  y: number
  axis: 'x' | 'y'
  direction: number
  length: number
  speed: number
  traveled: number
  maxDistance: number
  color: string
}

interface Shockwave {
  x: number
  y: number
  radius: number
  maxRadius: number
  color: string
}

interface Meteor {
  active: boolean
  x: number
  y: number
  dx: number
  dy: number
  length: number
  speed: number
  life: number
  maxLife: number
  color: string
}

const props = withDefaults(defineProps<{
  interactive?: boolean
  variant?: 'full' | 'reading'
}>(), {
  interactive: true,
  variant: 'full',
})

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let cleanup: (() => void) | undefined
let fireBurst: ((x: number, y: number, count: number, color?: string) => void) | undefined
let fireShockwave: ((x: number, y: number, color?: string) => void) | undefined

function burstAt(x: number, y: number, color?: string) {
  fireBurst?.(x, y, 24, color)
}

function shockwaveAt(x: number, y: number, color?: string) {
  fireShockwave?.(x, y, color)
}

function celebrateAt(x: number, y: number, color?: string) {
  burstAt(x, y, color)
  shockwaveAt(x, y, color)
}

defineExpose({ burstAt, shockwaveAt, celebrateAt })

function initBackground() {
  const canvasElement = canvas.value
  const rootElement = root.value
  if (!canvasElement || !rootElement) return
  const context = canvasElement.getContext('2d', { alpha: true })
  if (!context) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const readingMode = props.variant === 'reading'
  const starCount = readingMode ? (finePointer ? 96 : 64) : (finePointer ? 150 : 92)
  const maxDepth = 1000
  const fieldOfView = 410
  const gridSpacing = 38
  const frameInterval = 1000 / (readingMode ? 30 : (finePointer ? 45 : 30))
  let width = 0
  let height = 0
  let centerX = 0
  let centerY = 0
  let animationFrame: number | undefined
  let lastFrameTime = 0
  let lastBurstTime = 0
  let targetMouseX = 0
  let targetMouseY = 0
  let smoothMouseX = 0
  let smoothMouseY = 0
  let lastMouseX = -9999
  let lastMouseY = -9999

  const palettes = {
    light: {
      grid: 'rgba(69, 96, 107, .15)', gridMajor: 'rgba(42, 116, 139, .28)',
      star: '#617985', cyan: '#1689aa', violet: '#755baa',
      packetA: '#1689aa', packetB: '#755baa', meteor: '#1689aa', meteorHead: '#315d72', neutral: '#6b8490',
    },
    dark: {
      grid: 'rgba(137, 158, 168, .12)', gridMajor: 'rgba(91, 184, 207, .22)',
      star: '#e1edf1', cyan: '#59c9e6', violet: '#aa92ef',
      packetA: '#59c9e6', packetB: '#aa92ef', meteor: '#59c9e6', meteorHead: '#f5fbfd', neutral: '#c5d7de',
    },
  } as const

  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark'
    || document.documentElement.classList.contains('dark')
  const palette = () => isDark() ? palettes.dark : palettes.light
  const stars: Star3D[] = []
  const particles: PixelDebris[] = []
  const packets: DataPacket[] = []
  const shockwaves: Shockwave[] = []
  const meteor: Meteor = {
    active: false, x: 0, y: 0, dx: 0, dy: 0, length: 0, speed: 0, life: 0, maxLife: 0, color: palette().meteor,
  }

  function createStar(randomDepth = true): Star3D {
    return {
      x: (Math.random() - .5) * (width || 1200) * 1.65,
      y: (Math.random() - .5) * Math.min(height || 800, 1200) * 1.5,
      z: randomDepth ? Math.random() * maxDepth : maxDepth,
      size: .9 + Math.random() * 1.8,
      colorType: Math.random() > .65 ? (Math.random() > .5 ? 1 : 2) : 0,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: .018 + Math.random() * .028,
    }
  }

  function resize() {
    const rect = rootElement.getBoundingClientRect()
    width = rect.width
    height = rect.height
    const dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.15 : 1.5)
    canvasElement.width = Math.max(1, Math.floor(width * dpr))
    canvasElement.height = Math.max(1, Math.floor(height * dpr))
    centerX = width / 2
    centerY = width < 760 ? Math.min(520, height * .23) : height * .48
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function localPoint(clientX: number, clientY: number) {
    const rect = rootElement.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top, rect }
  }

  function spawnPixels(x: number, y: number, count = 6, color?: string) {
    if (reducedMotion) return
    const colors = [palette().packetA, palette().packetB, palette().neutral]
    for (let index = 0; index < count; index++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.4 + Math.random() * 3.4
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        life: 0,
        maxLife: 34 + Math.random() * 20,
        color: color || colors[Math.floor(Math.random() * colors.length)],
      })
    }
  }

  function addShockwave(clientX: number, clientY: number, color = palette().packetA) {
    if (reducedMotion) return
    const point = localPoint(clientX, clientY)
    shockwaves.push({ x: point.x, y: point.y, radius: 4, maxRadius: 180, color })
  }

  fireBurst = (clientX, clientY, count, color) => {
    const point = localPoint(clientX, clientY)
    spawnPixels(point.x, point.y, count, color)
  }
  fireShockwave = addShockwave

  function spawnPacket() {
    if (reducedMotion || packets.length >= 6) return
    const horizontal = Math.random() > .5
    packets.push({
      x: Math.floor(Math.random() * (width / gridSpacing)) * gridSpacing,
      y: Math.floor(Math.random() * (height / gridSpacing)) * gridSpacing,
      axis: horizontal ? 'x' : 'y',
      direction: Math.random() > .5 ? 1 : -1,
      length: 12 + Math.random() * 18,
      speed: 1.8 + Math.random() * 2.2,
      traveled: 0,
      maxDistance: gridSpacing * (2 + Math.floor(Math.random() * 3)),
      color: Math.random() > .5 ? palette().packetA : palette().packetB,
    })
  }

  function spawnMeteor() {
    if (meteor.active || reducedMotion) return
    meteor.active = true
    meteor.x = Math.random() * width * .62 + width * .1
    meteor.y = Math.random() * Math.min(height * .3, 340)
    const angle = Math.PI / 5 + (Math.random() - .5) * .22
    meteor.speed = 10 + Math.random() * 4
    meteor.dx = Math.cos(angle) * meteor.speed
    meteor.dy = Math.sin(angle) * meteor.speed
    meteor.length = 140 + Math.random() * 80
    meteor.life = 0
    meteor.maxLife = 64 + Math.random() * 18
    meteor.color = palette().meteor
  }

  function handleMouseMove(event: MouseEvent) {
    if (!props.interactive || readingMode || reducedMotion || !finePointer) return
    const point = localPoint(event.clientX, event.clientY)
    if (point.x < 0 || point.x > width || point.y < 0 || point.y > height) return
    targetMouseX = ((event.clientX / window.innerWidth) * 2 - 1) * 48
    targetMouseY = ((event.clientY / window.innerHeight) * 2 - 1) * 36
    const distance = Math.hypot(point.x - lastMouseX, point.y - lastMouseY)
    const now = performance.now()
    if (distance > 34 && now - lastBurstTime > 100) {
      const snapX = Math.round(point.x / gridSpacing) * gridSpacing
      const snapY = Math.round(point.y / gridSpacing) * gridSpacing
      if (Math.hypot(snapX - point.x, snapY - point.y) < 22) {
        spawnPixels(snapX, snapY, 4)
        lastBurstTime = now
      }
      lastMouseX = point.x
      lastMouseY = point.y
    }
  }

  function handlePointerDown(event: PointerEvent) {
    if (!props.interactive || reducedMotion || !finePointer) return
    if (event.target instanceof Element && event.target.closest('[data-space-burst="manual"]')) return
    if (readingMode && event.target instanceof Element && event.target.closest('a, button, input, textarea, select, summary')) return
    const point = localPoint(event.clientX, event.clientY)
    if (point.x < 0 || point.x > width || point.y < 0 || point.y > height) return
    spawnPixels(point.x, point.y, readingMode ? 8 : 18, palette().packetA)
    if (!readingMode) addShockwave(event.clientX, event.clientY, palette().packetA)
  }

  function render(now = 0, force = false) {
    if (!force && now - lastFrameTime < frameInterval) {
      animationFrame = requestAnimationFrame(render)
      return
    }
    lastFrameTime = now
    context.clearRect(0, 0, width, height)
    const colors = palette()
    const dark = isDark()
    smoothMouseX += (targetMouseX - smoothMouseX) * .05
    smoothMouseY += (targetMouseY - smoothMouseY) * .05

    let column = 0
    for (let x = gridSpacing / 2; x < width; x += gridSpacing) {
      let row = 0
      for (let y = gridSpacing / 2; y < height; y += gridSpacing) {
        const major = column % 4 === 0 && row % 4 === 0
        const arm = major ? 4 : 2
        context.fillStyle = major ? colors.gridMajor : colors.grid
        context.fillRect(x - arm, y - .5, arm * 2 + 1, 1)
        context.fillRect(x - .5, y - arm, 1, arm * 2 + 1)
        if (major) context.fillRect(x - 1, y - 1, 2, 2)
        row++
      }
      column++
    }

    for (let index = 0; index < stars.length; index++) {
      const star = stars[index]
      if (!reducedMotion) {
        if (!readingMode) star.z -= .82
        star.phase += star.twinkleSpeed * (readingMode ? .12 : 1)
        if (star.z <= 1) { stars[index] = createStar(false); continue }
      }
      const projection = fieldOfView / star.z
      const depth = Math.max(0, 1 - star.z / maxDepth)
      const x = (star.x - smoothMouseX * depth) * projection + centerX
      const y = (star.y - smoothMouseY * depth) * projection + centerY
      if (x < -20 || x > width + 20 || y < -20 || y > height + 20) {
        if (!reducedMotion) stars[index] = createStar(false)
        continue
      }
      const twinkle = .75 + .25 * Math.sin(star.phase)
      const size = Math.min(2.8, Math.max(dark ? .72 : .82, star.size * projection * .95))
      const alpha = Math.min(1, Math.max(dark ? .16 : .2, depth ** .95 * twinkle * (dark ? .92 : .72)))
      context.beginPath()
      context.arc(x, y, size, 0, Math.PI * 2)
      context.fillStyle = star.colorType === 1 ? colors.cyan : star.colorType === 2 ? colors.violet : colors.star
      context.globalAlpha = alpha
      context.fill()
      if (depth > .72) {
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x - (x - centerX) * .024, y - (y - centerY) * .024)
        context.strokeStyle = star.colorType === 2 ? colors.violet : colors.cyan
        context.globalAlpha = alpha * .34
        context.lineWidth = Math.max(.8, size * .58)
        context.stroke()
      }
      context.globalAlpha = 1
    }

    for (let index = packets.length - 1; index >= 0; index--) {
      const packet = packets[index]
      if (packet.axis === 'x') packet.x += packet.direction * packet.speed
      else packet.y += packet.direction * packet.speed
      packet.traveled += packet.speed
      const progress = packet.traveled / packet.maxDistance
      const alpha = progress < .2 ? progress / .2 : Math.max(0, 1 - (progress - .2) / .8)
      const tailX = packet.axis === 'x' ? packet.x - packet.direction * packet.length : packet.x
      const tailY = packet.axis === 'y' ? packet.y - packet.direction * packet.length : packet.y
      const gradient = context.createLinearGradient(tailX, tailY, packet.x, packet.y)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(1, packet.color)
      context.fillStyle = gradient
      context.globalAlpha = alpha * (dark ? .82 : .72)
      if (packet.axis === 'x') context.fillRect(Math.min(tailX, packet.x), packet.y - .75, Math.abs(packet.x - tailX), 1.5)
      else context.fillRect(packet.x - .75, Math.min(tailY, packet.y), 1.5, Math.abs(packet.y - tailY))
      context.fillStyle = packet.color
      context.fillRect(packet.x - 1.5, packet.y - 1.5, 3, 3)
      context.globalAlpha = 1
      if (packet.traveled >= packet.maxDistance || packet.x < 0 || packet.x > width || packet.y < 0 || packet.y > height) packets.splice(index, 1)
    }

    for (let index = shockwaves.length - 1; index >= 0; index--) {
      const wave = shockwaves[index]
      wave.radius += 5.5
      const alpha = Math.max(0, 1 - wave.radius / wave.maxRadius)
      context.beginPath()
      context.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
      context.strokeStyle = wave.color
      context.globalAlpha = alpha * (dark ? .72 : .62)
      context.lineWidth = 1.4
      context.stroke()
      context.globalAlpha = 1
      if (wave.radius >= wave.maxRadius) shockwaves.splice(index, 1)
    }

    for (let index = particles.length - 1; index >= 0; index--) {
      const particle = particles[index]
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vx *= .94
      particle.vy *= .94
      particle.life++
      context.fillStyle = particle.color
      context.globalAlpha = Math.max(0, 1 - particle.life / particle.maxLife) * (dark ? .94 : .88)
      context.fillRect(Math.round(particle.x), Math.round(particle.y), particle.size, particle.size)
      context.globalAlpha = 1
      if (particle.life >= particle.maxLife) particles.splice(index, 1)
    }

    if (meteor.active && !reducedMotion) {
      meteor.x += meteor.dx
      meteor.y += meteor.dy
      meteor.life++
      const progress = meteor.life / meteor.maxLife
      const opacity = progress < .2 ? progress / .2 : Math.max(0, 1 - (progress - .2) / .8)
      if (meteor.life >= meteor.maxLife || meteor.x > width + 100 || meteor.y > height + 100) meteor.active = false
      else {
        const tailX = meteor.x - meteor.dx / meteor.speed * meteor.length
        const tailY = meteor.y - meteor.dy / meteor.speed * meteor.length
        const gradient = context.createLinearGradient(meteor.x, meteor.y, tailX, tailY)
        gradient.addColorStop(0, colors.meteorHead)
        gradient.addColorStop(.28, meteor.color)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        context.beginPath()
        context.moveTo(meteor.x, meteor.y)
        context.lineTo(tailX, tailY)
        context.strokeStyle = gradient
        context.globalAlpha = opacity
        context.lineWidth = 2
        context.lineCap = 'round'
        context.stroke()
        context.beginPath()
        context.arc(meteor.x, meteor.y, 2.4, 0, Math.PI * 2)
        context.fillStyle = colors.meteorHead
        context.globalAlpha = opacity * .96
        context.fill()
        context.globalAlpha = 1
      }
    }
    if (!reducedMotion) animationFrame = requestAnimationFrame(render)
  }

  resize()
  for (let index = 0; index < starCount; index++) stars.push(createStar(true))
  const resizeObserver = new ResizeObserver(() => { resize(); if (reducedMotion) render(0, true) })
  const themeObserver = new MutationObserver(() => { meteor.color = palette().meteor; if (reducedMotion) render(0, true) })
  resizeObserver.observe(rootElement)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
  if (props.interactive && finePointer && !reducedMotion) {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
  }
  const firstMeteorTimer = reducedMotion || readingMode ? undefined : window.setTimeout(spawnMeteor, 2400)
  const meteorTimer = reducedMotion || readingMode ? undefined : window.setInterval(spawnMeteor, 9000)
  const packetTimer = reducedMotion || readingMode ? undefined : window.setInterval(spawnPacket, 1500)
  render(0, true)

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('pointerdown', handlePointerDown)
    if (firstMeteorTimer !== undefined) window.clearTimeout(firstMeteorTimer)
    if (meteorTimer !== undefined) window.clearInterval(meteorTimer)
    if (packetTimer !== undefined) window.clearInterval(packetTimer)
    if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
    resizeObserver.disconnect()
    themeObserver.disconnect()
    fireBurst = undefined
    fireShockwave = undefined
  }
}

onMounted(() => { cleanup = initBackground() })
onUnmounted(() => cleanup?.())
</script>

<style scoped>
.space-background {
  --space-orbit: color-mix(in srgb, var(--vp-c-brand-1) 38%, transparent);
  --space-orbit-soft: color-mix(in srgb, var(--vp-c-brand-3) 24%, transparent);
  --space-glow: color-mix(in srgb, var(--vp-c-brand-soft) 54%, transparent);
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(ellipse 44% 38% at 50% 34%, color-mix(in srgb, var(--vp-c-brand-soft) 52%, transparent) 0, transparent 72%),
    radial-gradient(circle at 9% 68%, color-mix(in srgb, var(--vp-c-brand-soft) 30%, transparent) 0, transparent 30%),
    radial-gradient(circle at 92% 74%, color-mix(in srgb, var(--vp-c-brand-soft) 24%, transparent) 0, transparent 27%),
    linear-gradient(145deg, color-mix(in srgb, var(--vp-c-bg-soft) 52%, var(--vp-c-bg)) 0%, var(--vp-c-bg) 47%, color-mix(in srgb, var(--vp-c-bg-soft) 38%, var(--vp-c-bg)) 100%);
}

.space-background.is-reading {
  position: fixed;
  inset: var(--vp-nav-height, 64px) 0 0;
  z-index: 0;
}

.space-background.is-reading::before {
  opacity: .34;
  animation: none;
}

.space-background.is-reading::after {
  display: none;
}

.space-background.is-reading .space-background__canvas {
  opacity: .52;
  -webkit-mask-image: none;
  mask-image: none;
}

.space-background.is-reading .space-background__orbits {
  opacity: .36;
}

.space-background.is-reading .space-background__orbit,
.space-background.is-reading .space-background__glow {
  animation: none;
}

.space-background.is-reading .space-background__glow {
  opacity: .2;
}

.space-background::before {
  position: absolute;
  top: 84px;
  left: 50%;
  width: min(74vw, 980px);
  aspect-ratio: 1.18;
  border-radius: 50%;
  background: radial-gradient(ellipse, var(--space-glow) 0, transparent 69%);
  opacity: .58;
  content: '';
  transform: translateX(-50%) scale(.98);
  animation: ambient-breathe 18s cubic-bezier(.77, 0, .175, 1) infinite alternate;
}

.space-background::after {
  position: absolute;
  inset: -18% -38%;
  background: linear-gradient(108deg, transparent 38%, color-mix(in srgb, var(--vp-c-brand-soft) 42%, transparent) 49%, transparent 61%);
  opacity: .16;
  content: '';
  transform: translate3d(-12%, 0, 0);
  animation: ambient-sweep 22s cubic-bezier(.77, 0, .175, 1) infinite alternate;
}

.space-background__canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  -webkit-mask-image: radial-gradient(ellipse 108% 98% at 50% 48%, #000 62%, transparent 100%);
  mask-image: radial-gradient(ellipse 108% 98% at 50% 48%, #000 62%, transparent 100%);
}

.space-background__orbits {
  position: absolute;
  top: 82px;
  left: 50%;
  z-index: 2;
  width: min(1420px, 112vw);
  height: min(780px, 66vw);
  transform: translateX(-50%);
}

.space-background__orbit {
  position: absolute;
  border: 1px solid var(--space-orbit);
  border-radius: 50%;
  box-shadow: 0 0 38px var(--space-orbit-soft), inset 0 0 24px var(--space-orbit-soft);
}

.orbit-a { inset: 8% 2%; opacity: .72; transform: rotate(-8deg); animation: orbit-a 44s cubic-bezier(.77, 0, .175, 1) infinite alternate; }
.orbit-b { inset: 0 12%; border-style: dashed; opacity: .58; transform: rotate(7deg); animation: orbit-b 56s cubic-bezier(.77, 0, .175, 1) infinite alternate; }
.orbit-c { inset: 17% 19%; opacity: .48; transform: rotate(-18deg); animation: orbit-c 68s cubic-bezier(.77, 0, .175, 1) infinite alternate; }
.space-background__glow { position: absolute; width: min(48vw, 680px); aspect-ratio: 1.25; border: 1px solid var(--space-orbit-soft); border-radius: 50%; background: radial-gradient(ellipse, var(--space-glow), transparent 70%); opacity: .36; }
.glow-left { top: 10%; left: -16%; animation: glow-left 24s cubic-bezier(.77, 0, .175, 1) infinite alternate; }
.glow-right { right: -17%; bottom: -10%; opacity: .22; animation: glow-right 32s cubic-bezier(.77, 0, .175, 1) infinite alternate; }

:global(html[data-theme='dark']) .space-background {
  --space-orbit: color-mix(in srgb, var(--vp-c-brand-1) 34%, transparent);
  --space-orbit-soft: color-mix(in srgb, var(--vp-c-brand-3) 20%, transparent);
  --space-glow: color-mix(in srgb, var(--vp-c-brand-soft) 42%, transparent);
}

:global(html[data-theme='light'] .space-background.is-reading .space-background__canvas) {
  opacity: .42;
}

@keyframes glow-left { to { transform: translate3d(9%, 7%, 0) scale(1.06); opacity: .48; } }
@keyframes glow-right { to { transform: translate3d(-8%, -6%, 0) scale(1.05); opacity: .38; } }
@keyframes ambient-breathe { to { transform: translateX(-50%) scale(1.055); opacity: .76; } }
@keyframes ambient-sweep { to { transform: translate3d(12%, 0, 0); opacity: .24; } }
@keyframes orbit-a { to { transform: rotate(4deg) scale(1.025); opacity: .88; } }
@keyframes orbit-b { to { transform: rotate(-5deg) scale(.985); opacity: .72; } }
@keyframes orbit-c { to { transform: rotate(-9deg) scale(1.035); opacity: .64; } }

@media (max-width: 760px) {
  .space-background__orbits { top: 150px; width: 170vw; height: 520px; }
  .orbit-c { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .space-background::before,
  .space-background::after,
  .space-background__glow,
  .space-background__orbit { animation: none; }
}
</style>
