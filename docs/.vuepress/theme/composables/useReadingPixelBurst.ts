import { onMounted, onBeforeUnmount, type Ref } from 'vue'
import { drawPixelDebris, spawnPixelDebris, type PixelDebris } from '../utils/pixelBurst'

// Only blank-space clicks animate. No idle RAF, timers, pointermove, or touch work.
export function useReadingPixelBurst(canvas: Ref<HTMLCanvasElement | null>): void {
  let dispose: (() => void) | undefined
  onMounted(() => {
    const element = canvas.value
    const context = element?.getContext('2d', { alpha: true })
    if (!element || !context) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = matchMedia('(hover: hover) and (pointer: fine)')
    const particles: PixelDebris[] = []
    let frame: number | undefined
    let lastFrame = 0
    let lastBurst = -Infinity
    let width = 0
    let height = 0
    let colors: string[] = []

    function readColors() {
      // Computed longhand colors resolve CSS variables and color-mix for Canvas.
      const styles = getComputedStyle(element!)
      colors = [styles.color, styles.borderTopColor]
      particles.forEach((particle, index) => { particle.color = colors[index % colors.length] })
    }
    function stop() {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
      particles.length = 0
      context!.clearRect(0, 0, width, height)
    }
    function resize() {
      stop()
      const rect = element!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      element!.width = Math.max(1, Math.round(width * dpr))
      element!.height = Math.max(1, Math.round(height * dpr))
      context!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    function render(now: number) {
      frame = undefined
      context!.clearRect(0, 0, width, height)
      drawPixelDebris(context!, particles, .8, Math.min((now - lastFrame) / (1000 / 60), 2))
      lastFrame = now
      if (particles.length) frame = requestAnimationFrame(render)
      else context!.clearRect(0, 0, width, height)
    }
    function click(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.detail === 0
        || motion.matches || !pointer.matches || document.hidden
        || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      const blocked = 'a,button,input,textarea,select,summary,label,[role="button"],[role="link"],[role="dialog"],[aria-modal="true"],[tabindex],[contenteditable]:not([contenteditable="false"]),[data-space-burst],.vp-navbar,.vp-sidebar,.vp-local-nav,.vp-blog-post-item,p,h1,h2,h3,h4,h5,h6,li,pre,table,blockquote,figure,img,video,audio,iframe'
      if (event.composedPath().some(node => node instanceof Element && node.matches(blocked))) return
      if (window.getSelection()?.toString()) return
      const now = performance.now()
      if (now - lastBurst < 160) return
      const rect = element!.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (x < 0 || y < 0 || x > width || y > height) return
      readColors()
      // Bound rapid-click work and retain the original square, drag and fade.
      if (particles.length > 40) particles.splice(0, particles.length - 40)
      spawnPixelDebris(particles, x, y, 8, colors, undefined, .65)
      lastBurst = now
      if (frame === undefined) {
        lastFrame = now
        frame = requestAnimationFrame(render)
      }
    }
    const theme = new MutationObserver(() => { if (particles.length) readColors() })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-color-style'] })
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    resize()
    window.addEventListener('click', click, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', stop)
    motion.addEventListener('change', stop)
    pointer.addEventListener('change', stop)
    dispose = () => {
      stop()
      observer.disconnect()
      theme.disconnect()
      window.removeEventListener('click', click)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', stop)
      motion.removeEventListener('change', stop)
      pointer.removeEventListener('change', stop)
    }
  })
  onBeforeUnmount(() => dispose?.())
}
