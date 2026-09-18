<template>
  <div :class="['blog-horizon', { 'is-mounted': mounted, 'is-ready': ready, 'is-scrolled': scrolled }]">
    <section ref="heroElement" class="horizon-hero" aria-labelledby="horizon-profile-title">
      <HorizonStage ref="stageComponent" @settled="revealContent" />

      <div class="horizon-hero__content">
        <HorizonTerminal class="horizon-terminal-entry" />
        <div class="horizon-hero__intro horizon-reveal horizon-reveal--intro">
          <HorizonProfile />
          <HorizonSocial />
        </div>
      </div>

      <div class="horizon-hero__footer">
        <div class="horizon-scroll-hint" aria-hidden="true">
          <span>向下滑动</span>
          <i><b /></i>
        </div>
        <HorizonHitokoto />
      </div>
    </section>

    <section class="horizon-content" aria-label="站点介绍与导航">
      <AboutPage :show-hero="false" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AboutPage from './AboutPage.vue'
import HorizonHitokoto from './horizon/HorizonHitokoto.vue'
import HorizonProfile from './horizon/HorizonProfile.vue'
import HorizonSocial from './horizon/HorizonSocial.vue'
import HorizonStage from './horizon/HorizonStage.vue'
import HorizonTerminal from './horizon/HorizonTerminal.vue'

const mounted = ref(false)
const ready = ref(false)
const scrolled = ref(false)
const heroElement = ref<HTMLElement>()
const stageComponent = ref<InstanceType<typeof HorizonStage>>()
let safetyTimer: number | undefined
let scrollFrame: number | undefined

function revealContent() {
  ready.value = true
  if (safetyTimer !== undefined) {
    window.clearTimeout(safetyTimer)
    safetyTimer = undefined
  }
}

onMounted(() => {
  document.documentElement.classList.add('horizon-home-active')
  mounted.value = true
  const updateScrollState = () => {
    scrollFrame = undefined
    const offset = window.scrollY
    scrolled.value = offset > 44
    const heroHeight = heroElement.value?.offsetHeight || window.innerHeight
    const progress = Math.min(offset / Math.max(heroHeight, 1), 1)
    stageComponent.value?.setParallax(progress)
  }
  const handleScroll = () => {
    if (scrollFrame === undefined) scrollFrame = window.requestAnimationFrame(updateScrollState)
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  cleanupScroll = () => window.removeEventListener('scroll', handleScroll)
  updateScrollState()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealContent()
    return
  }
  safetyTimer = window.setTimeout(revealContent, 1200)
})

onUnmounted(() => {
  document.documentElement.classList.remove('horizon-home-active')
  cleanupScroll?.()
  if (scrollFrame !== undefined) window.cancelAnimationFrame(scrollFrame)
  if (safetyTimer !== undefined) window.clearTimeout(safetyTimer)
})

let cleanupScroll: (() => void) | undefined
</script>

<style src="../styles/blog-horizon.css"></style>
