<template>
  <div
    class="word-count-display"
    :class="{ 'is-loading': loading, 'is-error': error, 'has-no-icon': !showIcon }"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <span v-if="showIcon" class="word-count-icon-shell" aria-hidden="true">
      <Icon
        class="word-count-icon"
        :icon="error ? 'octicon:alert-16' : loading ? 'octicon:graph-16' : icon"
      />
    </span>

    <span class="word-count-copy">
      <span class="word-count-eyebrow">{{ eyebrow }}</span>
      <span class="word-count-label">{{ labelText }}</span>
    </span>

    <span v-if="loading" class="word-count-state-text word-count-loading">
      {{ loadingText }}
    </span>

    <span v-else-if="error" class="word-count-state-text word-count-error">
      {{ errorText }}
    </span>

    <span v-else class="word-count-value">
      <strong>{{ displayNumber }}</strong>
      <small>{{ suffix.trim() }}</small>
    </span>
  </div>
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

  eyebrow: {
    type: String,
    default: 'READING / WORDS'
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

const displayNumber = computed(() => wordCount.value.toLocaleString())
const labelText = computed(() => props.label.replace(/[：:]\s*$/, '') || '当前分组字数')

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
  display: grid;
  box-sizing: border-box;
  width: 100%;
  align-items: center;
  min-height: 88px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  margin: 1rem 0;
  padding: 14px 16px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-family: var(--font-ui);
  line-height: 1.35;
  transition: border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    color var(--motion-duration-fast) ease;
}

.word-count-icon-shell {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-hard);
}

.word-count-display.is-error {
  border-color: var(--vp-c-danger-3);
}

.word-count-display.has-no-icon {
  grid-template-columns: minmax(0, 1fr) auto;
}

.word-count-display.is-error .word-count-icon-shell {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
}

.word-count-copy {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.word-count-eyebrow {
  color: var(--vp-c-text-3);
  font-family: var(--font-code);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.word-count-icon {
  flex-shrink: 0;
  font-size: 22px;
}

.word-count-label {
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.word-count-value {
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 5px;
  min-width: 7rem;
  color: var(--vp-c-brand-hard);
  font-family: var(--font-ui);
  font-variant-numeric: tabular-nums;
  transition: opacity var(--motion-duration-normal) var(--motion-ease-out),
    transform var(--motion-duration-normal) var(--motion-ease-out);
}

.word-count-value strong {
  font-size: clamp(1.45rem, 4vw, 1.9rem);
  font-weight: 600;
  line-height: 1;
}

.word-count-value small {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
}

.word-count-state-text {
  justify-self: end;
  color: var(--vp-c-text-3);
  font-size: 0.8125rem;
}

.word-count-error {
  color: var(--vp-c-danger-1);
}

.word-count-display.is-loading .word-count-icon {
  animation: word-count-pulse 900ms ease-in-out infinite alternate;
}

@starting-style {
  .word-count-value {
    opacity: 0;
    transform: translateY(3px);
  }
}

@media (max-width: 480px) {
  .word-count-display {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 10px 12px;
    padding: 13px;
  }

  .word-count-value,
  .word-count-state-text {
    grid-column: 2;
    justify-self: start;
    justify-content: flex-start;
    min-width: 0;
  }


  .word-count-display.has-no-icon {
    grid-template-columns: minmax(0, 1fr);
  }

  .word-count-display.has-no-icon .word-count-value,
  .word-count-display.has-no-icon .word-count-state-text {
    grid-column: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .word-count-value {
    transition: opacity var(--motion-duration-fast) ease;
  }

  .word-count-display.is-loading .word-count-icon {
    animation: none;
  }

  @starting-style {
    .word-count-value {
      opacity: 0;
      transform: none;
    }
  }
}

@keyframes word-count-pulse {
  from { opacity: 0.5; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}
</style>
