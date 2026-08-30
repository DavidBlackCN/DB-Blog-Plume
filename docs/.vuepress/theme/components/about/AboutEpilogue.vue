<template>
  <button class="about-epilogue" type="button" :aria-busy="loading" @click="loadHitokoto">
    <Icon name="ph:quotes" aria-hidden="true" />
    <span>{{ sentence }}</span>
    <small>{{ source }}</small>
  </button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const sentence = ref('正在寻找一句合适的话……')
const source = ref('')
const loading = ref(false)
let controller: AbortController | undefined

async function loadHitokoto() {
  controller?.abort()
  controller = new AbortController()
  loading.value = true

  try {
    const response = await fetch('https://v1.hitokoto.cn', { signal: controller.signal })
    if (!response.ok) throw new Error(`Hitokoto request failed: ${response.status}`)
    const data = await response.json()
    sentence.value = data.hitokoto || '生活不止眼前的苟且。'
    source.value = data.from ? `—— ${data.from}` : ''
  }
  catch (error) {
    if ((error as Error).name !== 'AbortError') {
      sentence.value = '生活不止眼前的苟且。'
      source.value = ''
    }
  }
  finally {
    loading.value = false
  }
}

onMounted(loadHitokoto)
onUnmounted(() => controller?.abort())
</script>
