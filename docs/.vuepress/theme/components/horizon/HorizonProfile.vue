<template>
  <section class="horizon-profile" aria-labelledby="horizon-profile-title">
    <p class="horizon-profile__greeting"><i />{{ greeting }}</p>
    <h1 id="horizon-profile-title">黑姐姐 <small>DavidBlackCN</small></h1>
    <p class="horizon-profile__role">Developer · Blogger · INFJ-T</p>
    <p class="horizon-profile__intro">
      欢迎来到黑姐姐の驿站。这里记录代码、文字与折腾过程，
      也收藏那些值得慢下来观察的事物。
    </p>
    <p class="horizon-profile__motto">
      <Icon name="ph:signature" aria-hidden="true" />
      <span>
        <strong>有些事你不要太当真。</strong>
        <small>《售梦者》</small>
      </span>
    </p>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const greeting = ref('GOOD NIGHT, NICE TO MEET YOU')

function resolveGreeting() {
  const hour = new Date().getHours()
  if (hour < 6) return 'STILL AWAKE, NICE TO MEET YOU'
  if (hour < 12) return 'GOOD MORNING, NICE TO MEET YOU'
  if (hour < 18) return 'GOOD AFTERNOON, NICE TO MEET YOU'
  return 'GOOD NIGHT, NICE TO MEET YOU'
}

onMounted(() => {
  greeting.value = resolveGreeting()
})
</script>
