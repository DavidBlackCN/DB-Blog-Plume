<template>
  <article class="about-card about-stats-card" :aria-busy="loading">
    <header>
      <div>
        <p class="about-eyebrow">SITE INSIGHTS</p>
        <h3>驿站来访记录</h3>
      </div>
      <span :class="['about-stats-state', { 'is-ready': !loading && !unavailable }]">
        <i /> {{ unavailable ? 'UNAVAILABLE' : loading ? 'SYNCING' : 'LIVE' }}
      </span>
    </header>

    <div class="about-stats-grid" aria-live="polite">
      <div>
        <Icon name="ph:eye" aria-hidden="true" />
        <span>
          <strong>{{ sitePv }}</strong>
          <small>累计访问</small>
        </span>
      </div>
      <div>
        <Icon name="ph:users-three" aria-hidden="true" />
        <span>
          <strong>{{ siteUv }}</strong>
          <small>独立访客</small>
        </span>
      </div>
    </div>

    <div class="about-runtime">
      <div class="about-runtime__title">
        <Icon name="ph:timer" aria-hidden="true" />
        <span>
          <small>SITE UPTIME</small>
          <strong>驿站已平稳运行</strong>
        </span>
      </div>
      <time
        class="about-runtime__clock"
        datetime="2025-08-12T00:00:00+08:00"
        :aria-label="runtimeLabel"
        title="自 2025 年 8 月 12 日起"
      >
        <span><b>{{ runtime.years }}</b><small>年</small></span>
        <span><b>{{ runtime.days }}</b><small>天</small></span>
        <span><b>{{ runtime.hours }}</b><small>时</small></span>
        <span><b>{{ runtime.minutes }}</b><small>分</small></span>
        <span><b>{{ runtime.seconds }}</b><small>秒</small></span>
      </time>
    </div>

    <footer>
      <span>数据由不蒜子实时统计</span>
      <a href="https://busuanzi.ibruce.info/" target="_blank" rel="noopener noreferrer">BUSUANZI</a>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface BusuanziStats {
  site_pv?: number | string
  site_uv?: number | string
}

const API_URL = 'https://busuanzi.ibruce.info/busuanzi'
const sitePv = ref('--')
const siteUv = ref('--')
const loading = ref(true)
const unavailable = ref(false)
const callbackName = `__aboutBusuanzi_${Date.now().toString(36)}`
const SITE_STARTED_AT = Date.UTC(2025, 7, 11, 16)
const SITE_STARTED_YEAR = 2025
const runtime = ref(getRuntime())
let requestScript: HTMLScriptElement | undefined
let timeoutId: number | undefined
let runtimeTimer: number | undefined

const runtimeLabel = computed(() => {
  const value = runtime.value
  return `网站已运行 ${Number(value.years)} 年 ${Number(value.days)} 天 ${Number(value.hours)} 小时 ${Number(value.minutes)} 分钟 ${Number(value.seconds)} 秒`
})

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function getRuntime(now = Date.now()) {
  if (now <= SITE_STARTED_AT) {
    return { years: '00', days: '00', hours: '00', minutes: '00', seconds: '00' }
  }

  const shanghaiNow = new Date(now + 8 * 60 * 60 * 1000)
  let years = shanghaiNow.getUTCFullYear() - SITE_STARTED_YEAR
  let anniversary = Date.UTC(SITE_STARTED_YEAR + years, 7, 11, 16)

  if (now < anniversary) {
    years -= 1
    anniversary = Date.UTC(SITE_STARTED_YEAR + years, 7, 11, 16)
  }

  let remaining = Math.max(0, now - anniversary)
  const days = Math.floor(remaining / 86_400_000)
  remaining %= 86_400_000
  const hours = Math.floor(remaining / 3_600_000)
  remaining %= 3_600_000
  const minutes = Math.floor(remaining / 60_000)
  const seconds = Math.floor((remaining % 60_000) / 1000)

  return {
    years: pad(Math.max(0, years)),
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  }
}

function formatCount(value: number | string | undefined) {
  const count = Number(value)
  return Number.isFinite(count) ? new Intl.NumberFormat('zh-CN').format(count) : '--'
}

function cleanupRequest() {
  if (timeoutId) window.clearTimeout(timeoutId)
  requestScript?.remove()
  delete (window as unknown as Record<string, unknown>)[callbackName]
}

onMounted(() => {
  runtime.value = getRuntime()
  runtimeTimer = window.setInterval(() => {
    runtime.value = getRuntime()
  }, 1000)

  ;(window as unknown as Record<string, unknown>)[callbackName] = (stats: BusuanziStats) => {
    sitePv.value = formatCount(stats.site_pv)
    siteUv.value = formatCount(stats.site_uv)
    loading.value = false
    unavailable.value = sitePv.value === '--' && siteUv.value === '--'
    if (timeoutId) window.clearTimeout(timeoutId)
  }

  requestScript = document.createElement('script')
  requestScript.src = `${API_URL}?jsonpCallback=${encodeURIComponent(callbackName)}`
  requestScript.async = true
  requestScript.addEventListener('error', () => {
    loading.value = false
    unavailable.value = true
  }, { once: true })
  document.head.append(requestScript)

  timeoutId = window.setTimeout(() => {
    loading.value = false
    unavailable.value = true
  }, 8000)
})

onUnmounted(() => {
  cleanupRequest()
  if (runtimeTimer) window.clearInterval(runtimeTimer)
})
</script>
