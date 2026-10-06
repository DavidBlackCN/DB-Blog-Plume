<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps<{ text: string }>()
const mounted = ref(false)
const complete = ref(false)
let finishTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  mounted.value = true
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) complete.value = true
  else finishTimer = setTimeout(() => { complete.value = true }, props.text.length * 60 + 1500)
})
onBeforeUnmount(() => { clearTimeout(finishTimer) })
</script>

<template>
  <span class="hero-greeting-text" :class="{ 'is-ready': mounted && !complete }" :style="{ '--typing-duration': `${text.length * 60}ms` }">
    <span class="horizon-sr-only">{{ text }}</span>
    <span :key="text" aria-hidden="true"><span v-for="(letter, index) in text" :key="index" class="greeting-letter" :style="{ '--letter-index': index }">{{ letter }}</span><span class="greeting-cursor">▎</span></span>
  </span>
</template>

<style scoped>
.hero-greeting-text { min-width: 0; }
.greeting-letter { position: relative; display: inline-block; white-space: pre; }
.greeting-letter::after { content: '▎'; position: absolute; left: 100%; top: 0; opacity: 0; color: var(--accent); }
.greeting-cursor { opacity: 0; color: var(--accent); }
/* One introductory typing pass; opacity leaves the full sentence's layout stable. */
.is-ready .greeting-letter { animation: greeting-type 1ms steps(1, end) both; animation-delay: calc(var(--letter-index) * 60ms); }
.is-ready .greeting-letter::after { animation: greeting-caret 60ms steps(1, end); animation-delay: calc(var(--letter-index) * 60ms); }
.is-ready .greeting-cursor { animation: greeting-blink 700ms steps(1, end) 2; animation-delay: var(--typing-duration); }
@keyframes greeting-type { from { opacity: 0; } to { opacity: 1; } }
@keyframes greeting-caret { from { opacity: 1; } to { opacity: 0; } }
@keyframes greeting-blink { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .is-ready .greeting-letter, .is-ready .greeting-letter::after, .is-ready .greeting-cursor { animation: none; }
}
</style>
