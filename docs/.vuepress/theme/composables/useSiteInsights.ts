import { computed, onMounted, onUnmounted, ref } from 'vue'

interface BusuanziStats {
  site_pv?: number | string
  site_uv?: number | string
}

interface SiteRuntime {
  years: string
  days: string
  hours: string
  minutes: string
  seconds: string
}

const API_URL = 'https://busuanzi.ibruce.info/busuanzi'
const SITE_STARTED_AT = Date.UTC(2025, 7, 11, 16)
const SITE_STARTED_YEAR = 2025
let instanceCount = 0

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function getRuntime(now = Date.now()): SiteRuntime {
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

export function useSiteInsights() {
  const sitePv = ref('--')
  const siteUv = ref('--')
  const loading = ref(true)
  const unavailable = ref(false)
  const runtime = ref<SiteRuntime>(getRuntime())
  const callbackName = `__siteInsights_${Date.now().toString(36)}_${instanceCount++}`

  let requestScript: HTMLScriptElement | undefined
  let timeoutId: number | undefined
  let runtimeTimer: number | undefined
  let settled = false

  const status = computed<'syncing' | 'live' | 'unavailable'>(() => {
    if (loading.value) return 'syncing'
    return unavailable.value ? 'unavailable' : 'live'
  })

  const runtimeLabel = computed(() => {
    const value = runtime.value
    return `网站已运行 ${Number(value.years)} 年 ${Number(value.days)} 天 ${Number(value.hours)} 小时 ${Number(value.minutes)} 分钟 ${Number(value.seconds)} 秒`
  })

  function clearRequest() {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId)
      timeoutId = undefined
    }
    requestScript?.remove()
    requestScript = undefined
    delete (window as unknown as Record<string, unknown>)[callbackName]
  }

  function settle(nextUnavailable: boolean) {
    if (settled) return
    settled = true
    loading.value = false
    unavailable.value = nextUnavailable
    clearRequest()
  }

  onMounted(() => {
    runtime.value = getRuntime()
    runtimeTimer = window.setInterval(() => {
      runtime.value = getRuntime()
    }, 1000)

    ;(window as unknown as Record<string, unknown>)[callbackName] = (stats: BusuanziStats) => {
      sitePv.value = formatCount(stats.site_pv)
      siteUv.value = formatCount(stats.site_uv)
      settle(sitePv.value === '--' && siteUv.value === '--')
    }

    requestScript = document.createElement('script')
    requestScript.src = `${API_URL}?jsonpCallback=${encodeURIComponent(callbackName)}`
    requestScript.async = true
    requestScript.addEventListener('error', () => settle(true), { once: true })
    document.head.append(requestScript)

    timeoutId = window.setTimeout(() => settle(true), 8000)
  })

  onUnmounted(() => {
    clearRequest()
    if (runtimeTimer !== undefined) window.clearInterval(runtimeTimer)
  })

  return {
    sitePv,
    siteUv,
    loading,
    unavailable,
    status,
    runtime,
    runtimeLabel,
  }
}
