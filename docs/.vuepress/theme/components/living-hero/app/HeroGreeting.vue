<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props = defineProps<{ text: string }>()
const letters = computed(() => Array.from(props.text))
// SSR renders the complete greeting. The client owns one monotonic reveal count.
const visibleCount = ref(Infinity)
const typing = ref(false)
let mounted = false
let timer: ReturnType<typeof setTimeout> | undefined
let media: MediaQueryList | undefined

function stop(): void {
  clearTimeout(timer)
  timer = undefined
  typing.value = false
}
function finish(): void {
  stop()
  visibleCount.value = letters.value.length
}
function advance(): void {
  visibleCount.value += 1
  if (visibleCount.value >= letters.value.length) finish()
  else timer = setTimeout(advance, 60)
}
function start(): void {
  if (!mounted) return
  stop()
  if (media?.matches || !letters.value.length) { finish(); return }
  visibleCount.value = 1
  typing.value = letters.value.length > 1
  if (typing.value) timer = setTimeout(advance, 60)
}
function preferenceChanged(): void { if (media?.matches) finish() }
// The clock can update every second without restarting an unchanged greeting.
watch(() => props.text, start)
onMounted(() => {
  mounted = true
  media = matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', preferenceChanged)
  start()
})
onBeforeUnmount(() => {
  mounted = false
  stop()
  media?.removeEventListener('change', preferenceChanged)
})
</script>

<template>
  <span class="hero-greeting-text" :data-typing="typing">
    <span class="horizon-sr-only">{{ text }}</span>
    <span aria-hidden="true"><span v-for="(letter, index) in letters" :key="index" class="greeting-letter" :class="{ 'is-hidden': index >= visibleCount, 'has-caret': typing && index === visibleCount - 1 }">{{ letter }}</span></span>
  </span>
</template>

<style scoped>
.hero-greeting-text { min-width: 0; }
.greeting-letter { position: relative; display: inline-block; white-space: pre; }
.greeting-letter.is-hidden { opacity: 0; }
.greeting-letter.has-caret::after { content: '▎'; position: absolute; left: 100%; top: 0; color: var(--accent); }
@media (prefers-reduced-motion: reduce) {
  .greeting-letter.is-hidden { opacity: 1; }
  .greeting-letter.has-caret::after { content: none; }
}
</style>
