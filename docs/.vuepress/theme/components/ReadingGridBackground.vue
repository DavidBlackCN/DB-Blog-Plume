<script setup lang="ts">
import { ref } from 'vue'
import { useReadingPixelBurst } from '../composables/useReadingPixelBurst'

defineProps<{ variant: 'blog' | 'docs' }>()
const canvas = ref<HTMLCanvasElement | null>(null)
useReadingPixelBurst(canvas)
</script>

<template>
  <div class="reading-grid" :class="`reading-grid--${variant}`" aria-hidden="true">
    <div class="reading-grid__lines"></div>
    <canvas ref="canvas" class="reading-grid__pixels"></canvas>
  </div>
</template>

<style scoped>
.reading-grid {
  --grid-fine: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  /* Fine and major lines coincide every fourth cell, giving a gentle accent. */
  --grid-major: color-mix(in srgb, var(--vp-c-brand-1) 2%, transparent);
  --grid-strength: 1;
  --grid-glow: color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent);
  position: fixed;
  inset: var(--vp-nav-height, 64px) 0 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: var(--vp-c-bg);
}
.reading-grid::before,
.reading-grid::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 12% 8%, var(--grid-glow), transparent 55%);
}
.reading-grid::after {
  background: radial-gradient(ellipse at 94% 92%, var(--grid-glow), transparent 48%);
}
.reading-grid--docs {
  --grid-strength: .65;
  --grid-glow: color-mix(in srgb, var(--vp-c-brand-1) 1.5%, transparent);
}
.reading-grid--docs::after { display: none; }
.reading-grid__lines {
  position: absolute;
  inset: 0;
  opacity: var(--grid-strength);
  background-image:
    linear-gradient(to right, var(--grid-major) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-major) 1px, transparent 1px),
    linear-gradient(to right, var(--grid-fine) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-fine) 1px, transparent 1px);
  background-size: 104px 104px, 104px 104px, 26px 26px, 26px 26px;
  /* Quiet center, more structure at the sides, feathered outer edges. */
  -webkit-mask-image: radial-gradient(ellipse at center, rgb(0 0 0 / .65) 25%, #000 70%, transparent 100%);
  mask-image: radial-gradient(ellipse at center, rgb(0 0 0 / .65) 25%, #000 70%, transparent 100%);
}
.reading-grid__pixels {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-2);
}
:global(html.dark) .reading-grid,
:global(html[data-theme='dark']) .reading-grid {
  --grid-fine: color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent);
}
</style>
