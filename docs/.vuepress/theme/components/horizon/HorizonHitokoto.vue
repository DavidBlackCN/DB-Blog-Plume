<template>
  <button class="horizon-hitokoto" type="button" :disabled="loading" @click="loadHitokoto">
    <span class="horizon-hitokoto__sentence">
      <Icon name="ph:quotes-fill" aria-hidden="true" />
      <strong aria-live="polite">{{ sentence }}</strong>
    </span>
    <small class="horizon-sr-only">{{ loading ? '正在拾取一句话' : '点击换一句' }}</small>
  </button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const FALLBACK = '生活明朗，万物可爱。'
const sentence = ref(FALLBACK)
const loading = ref(false)
let controller: AbortController | undefined

async function loadHitokoto() {
  controller?.abort()
  const requestController = new AbortController()
  controller = requestController
  loading.value = true

  try {
    const response = await fetch('https://v1.hitokoto.cn/?encode=json&c=i&c=d&c=k', {
      signal: requestController.signal,
    })
    if (!response.ok) throw new Error(`Hitokoto responded with ${response.status}`)
    const data = await response.json() as { hitokoto?: string, from?: string }
    sentence.value = data.hitokoto
      ? `${data.hitokoto}${data.from ? ` —— ${data.from}` : ''}`
      : FALLBACK
  }
  catch (error) {
    if ((error as Error).name !== 'AbortError') sentence.value = FALLBACK
  }
  finally {
    if (controller === requestController) loading.value = false
  }
}

onMounted(loadHitokoto)
onUnmounted(() => controller?.abort())
</script>
