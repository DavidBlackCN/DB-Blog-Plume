<template>
  <section class="horizon-terminal-card" aria-label="终端个人介绍">
    <div class="horizon-terminal__bar" aria-hidden="true">
      <span class="horizon-terminal__dots">
        <i class="is-red" />
        <i class="is-yellow" />
        <i class="is-green" />
      </span>
      <small>{{ terminal.path }}</small>
    </div>
    <div class="horizon-terminal__body">
      <div class="horizon-terminal__command" aria-hidden="true">
        <span class="horizon-terminal__shell">{{ terminal.user }}@{{ terminal.host }}:~$</span>
        <span>{{ displayedCommand }}</span>
        <span v-if="!showResponse" class="horizon-terminal__cursor">_</span>
      </div>
      <div :class="['horizon-terminal__output', { 'is-visible': showResponse }]" aria-hidden="true">
        <span class="horizon-terminal__prompt">›</span>
        <span class="horizon-terminal__typed">{{ displayedName }}</span>
        <span class="horizon-terminal__cursor">_</span>
      </div>
      <span class="horizon-sr-only">user@davidblackcn:~$ whoami，DavidBlackCN</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const terminal = {
  path: '~/profile',
  user: 'user',
  host: 'davidblackcn',
  command: 'whoami',
  response: 'DavidBlackCN',
}

const displayedCommand = ref('')
const displayedName = ref('')
const showResponse = ref(false)
const timers: number[] = []

function later(callback: () => void, delay: number) {
  timers.push(window.setTimeout(callback, delay))
}

function typeText(text: string, target: typeof displayedCommand, speed: number, done?: () => void) {
  let index = 0
  const step = () => {
    index += 1
    target.value = text.slice(0, index)
    if (index < text.length) later(step, speed)
    else done?.()
  }
  step()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayedCommand.value = terminal.command
    displayedName.value = terminal.response
    showResponse.value = true
    return
  }

  later(() => {
    typeText(terminal.command, displayedCommand, 82, () => {
      later(() => {
        showResponse.value = true
        typeText(terminal.response, displayedName, 88)
      }, 260)
    })
  }, 260)
})

onUnmounted(() => {
  timers.forEach(timer => window.clearTimeout(timer))
})
</script>
