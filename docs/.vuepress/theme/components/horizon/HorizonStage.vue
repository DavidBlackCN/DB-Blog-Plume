<template>
  <div ref="stageElement" :class="['horizon-stage', { 'is-failed': failed }]" aria-hidden="true">
    <div class="horizon-stage__placeholder" />
    <picture>
      <source srcset="/assets/site/插画5-1.webp" type="image/webp">
      <img
        ref="imageElement"
        :class="['horizon-stage__image', { 'is-loaded': loaded }]"
        src="/assets/site/插画5-1.png"
        width="1672"
        height="941"
        alt=""
        decoding="async"
        fetchpriority="high"
        @load="handleLoad"
        @error="handleError"
      >
    </picture>
    <div class="horizon-stage__shade" aria-hidden="true" />
    <div class="horizon-stage__fade" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits<{
  settled: []
}>()

const imageElement = ref<HTMLImageElement>()
const stageElement = ref<HTMLElement>()
const loaded = ref(false)
const failed = ref(false)
let settled = false

function settle() {
  if (settled) return
  settled = true
  emit('settled')
}

async function handleLoad() {
  try {
    await imageElement.value?.decode()
  }
  catch {
    // 部分浏览器在图片已完成绘制后仍可能拒绝 decode，继续显示即可。
  }
  loaded.value = true
  failed.value = false
  settle()
}

function handleError() {
  failed.value = true
  settle()
}

onMounted(() => {
  const image = imageElement.value
  if (!image?.complete) return
  if (image.naturalWidth > 0) handleLoad()
  else handleError()
})

function setParallax(progress: number) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  stageElement.value?.style.setProperty('--horizon-parallax', `${Math.round(progress * 54)}px`)
}

defineExpose({ setParallax })
</script>
