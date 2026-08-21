<template>
  <span
    class="word-count-display"
    :class="{ 'is-loading': loading, 'is-error': error }"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <span v-if="loading" class="word-count-loading">
      <Icon class="word-count-status-icon" icon="octicon:graph-16" aria-hidden="true" />
      {{ loadingText }}
    </span>

    <span v-else-if="error" class="word-count-error">
      <Icon class="word-count-status-icon" icon="octicon:alert-16" aria-hidden="true" />
      {{ errorText }}
    </span>

    <span v-else class="word-count-value">
      <Icon v-if="showIcon" class="word-count-icon" :icon="icon" aria-hidden="true" />
      <span v-if="label" class="word-count-label">{{ label }}</span>
      <span class="word-count-text">{{ displayText }}</span>
    </span>
  </span>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

let cachedData = null
let cachedPromise = null

function normalizePath(input) {
  if (!input) return '/'

  let path = String(input).trim()
  path = path.split('#')[0].split('?')[0]
  path = path.replace(/\\/g, '/')
  path = path.replace(/\.html$/i, '')

  if (!path.startsWith('/')) path = `/${path}`
  path = path.replace(/\/+/g, '/')
  path = path.replace(/\/index\/?$/i, '/')

  if (path !== '/' && !path.endsWith('/')) {
    path += '/'
  }

  return path
}

/**
 * 根据当前路径和 depth 得到所属分组
 * 例：
 * /guide/install/start/ + depth=1 => /guide/
 * /guide/install/start/ + depth=2 => /guide/install/
 */
function resolveGroupPath(routePath, depth = 1) {
  const normalized = normalizePath(routePath)

  if (normalized === '/') return '/'

  const segments = normalized.replace(/^\/|\/$/g, '').split('/').filter(Boolean)

  if (segments.length === 0) return '/'
  if (depth <= 0) return '/'

  const finalDepth = Math.min(depth, segments.length)
  return `/${segments.slice(0, finalDepth).join('/')}/`
}

async function loadWordCountData() {
  if (cachedData) return cachedData
  if (cachedPromise) return cachedPromise

  cachedPromise = fetch('/wordcount.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then((json) => {
      cachedData = json
      return json
    })
    .finally(() => {
      cachedPromise = null
    })

  return cachedPromise
}

const props = defineProps({
  /**
   * 分组层级：
   * 1 => /guide/
   * 2 => /guide/install/
   */
  depth: {
    type: Number,
    default: 1
  },

  /**
   * 可选：手动指定分组路径
   * 不传时自动根据当前页面识别
   */
  path: {
    type: String,
    default: ''
  },

  label: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    default: 'octicon:book-16'
  },

  showIcon: {
    type: Boolean,
    default: true
  },

  suffix: {
    type: String,
    default: ' 字'
  },

  loadingText: {
    type: String,
    default: '统计加载中…'
  },

  errorText: {
    type: String,
    default: '统计加载失败'
  },

  fallback: {
    type: Number,
    default: 0
  }
})

const route = useRoute()
const loading = ref(true)
const error = ref(false)
const wordCountData = ref(null)

const currentRoutePath = computed(() => normalizePath(route.path))

const targetGroupPath = computed(() => {
  if (props.path) {
    return normalizePath(props.path)
  }
  return resolveGroupPath(currentRoutePath.value, props.depth)
})

const wordCount = computed(() => {
  const data = wordCountData.value
  if (!data || !data.groups) return props.fallback

  return Number(data.groups[targetGroupPath.value] || 0)
})

const displayText = computed(() => {
  return `${wordCount.value.toLocaleString()}${props.suffix}`
})

onMounted(async () => {
  try {
    wordCountData.value = await loadWordCountData()
    loading.value = false
  } catch (e) {
    console.error('[WordCount] 获取字数统计失败：', e)
    error.value = true
    loading.value = false
  }
})
</script>

<style scoped>
.word-count-display {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 4px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  line-height: 1.45;
  transition: border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    color var(--motion-duration-fast) ease;
}

.word-count-display.is-loading,
.word-count-display.is-error {
  color: var(--vp-c-text-2);
}

.word-count-display.is-error {
  border-color: var(--vp-c-danger-3);
  background: var(--vp-c-danger-soft);
}

.word-count-loading,
.word-count-error,
.word-count-value {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.word-count-value {
  transition: opacity var(--motion-duration-normal) var(--motion-ease-out),
    transform var(--motion-duration-normal) var(--motion-ease-out);
}

@starting-style {
  .word-count-value {
    opacity: 0;
    transform: translateY(3px);
  }
}

.word-count-status-icon,
.word-count-icon {
  flex-shrink: 0;
  font-size: 1em;
}

.word-count-icon {
  color: var(--vp-c-brand-1);
}

.word-count-label {
  color: var(--vp-c-text-2);
}

.word-count-text {
  color: var(--vp-c-brand-hard);
  font-family: var(--font-code);
  font-variant-numeric: tabular-nums;
  font-weight: 400;
}

.word-count-error {
  color: var(--vp-c-danger-1);
}

@media (prefers-reduced-motion: reduce) {
  .word-count-value {
    transition: opacity var(--motion-duration-fast) ease;
  }

  @starting-style {
    .word-count-value {
      opacity: 0;
      transform: none;
    }
  }
}
</style>
