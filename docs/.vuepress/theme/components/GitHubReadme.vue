<template>
  <article
    class="github-readme"
    :class="{ 'is-loading': loading, 'is-error': error }"
    :aria-busy="loading"
  >
    <div v-if="loading" class="github-readme__loading" role="status">
      <span class="sr-only">正在加载 GitHub README</span>
      <div class="github-readme__skeleton-head">
        <span class="github-readme__skeleton-icon"></span>
        <span class="github-readme__skeleton-title"></span>
        <span class="github-readme__skeleton-badge"></span>
      </div>
      <div class="github-readme__skeleton-body">
        <span class="is-heading"></span>
        <span></span>
        <span></span>
        <span class="is-short"></span>
        <span class="is-block"></span>
      </div>
    </div>

    <div v-else-if="error" class="github-readme__error" role="alert">
      <Icon icon="octicon:alert-16" aria-hidden="true" />
      <div>
        <strong>README 加载失败</strong>
        <p>{{ error }}</p>
      </div>
      <button type="button" @click="loadReadme">重试</button>
    </div>

    <template v-else-if="repo && renderedReadme">
      <header class="github-readme__header">
        <div class="github-readme__identity">
          <span class="github-readme__mark" aria-hidden="true">
            <Icon icon="mdi:github" />
          </span>
          <div>
            <span class="github-readme__eyebrow">GITHUB / README</span>
            <div class="github-readme__repo-name">{{ repo.full_name }}</div>
          </div>
        </div>

        <div class="github-readme__actions">
          <span class="github-readme__branch">
            <Icon icon="octicon:git-branch-16" aria-hidden="true" />
            {{ activeBranch }}
          </span>
          <a :href="repo.html_url" target="_blank" rel="noopener noreferrer">
            查看仓库
            <Icon icon="mdi:open-in-new" aria-hidden="true" />
          </a>
        </div>
      </header>

      <div
        ref="readmeViewport"
        class="github-readme__viewport"
        :class="{ 'is-collapsed': canCollapse && !expanded }"
        :style="collapsedStyle"
      >
        <div class="github-readme__content" v-html="renderedReadme"></div>
        <div v-if="canCollapse && !expanded" class="github-readme__fade" aria-hidden="true"></div>
      </div>

      <footer v-if="canCollapse" class="github-readme__footer">
        <button
          type="button"
          :aria-expanded="expanded"
          @click="toggleExpanded"
        >
          <Icon :icon="expanded ? 'octicon:fold-16' : 'octicon:unfold-16'" aria-hidden="true" />
          {{ expanded ? '收起 README' : '展开完整 README' }}
        </button>
      </footer>
    </template>
  </article>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  url: { type: String, required: true },
  branch: { type: String, default: '' },
  collapsedHeight: { type: Number, default: 760 },
  collapsible: { type: Boolean, default: true },
})

const responseCache = new Map()
const repo = ref(null)
const renderedReadme = ref('')
const loading = ref(true)
const error = ref('')
const expanded = ref(false)
const canCollapse = ref(false)
const readmeViewport = ref(null)
let activeController = null

const parseRepo = (input) => {
  if (!input) return null
  const value = input.trim().replace(/\.git$/, '').replace(/\/$/, '')
  const match = value.match(/github\.com\/([^/]+)\/([^/#?]+)/i) || value.match(/^([^/\s]+)\/([^/\s]+)$/)
  return match ? { owner: match[1], name: match[2] } : null
}

const activeBranch = computed(() => props.branch || repo.value?.default_branch || 'main')
const collapsedStyle = computed(() => (
  canCollapse.value && !expanded.value
    ? { '--github-readme-collapsed-height': `${Math.max(320, props.collapsedHeight)}px` }
    : undefined
))

const safeUrl = (value, repositoryUrl) => {
  if (!value) return ''
  if (/^(https?:|mailto:|#)/i.test(value)) return value
  if (/^(javascript|data):/i.test(value)) return ''
  try {
    return new URL(value, `${repositoryUrl}/blob/${activeBranch.value}/README.md`).href
  } catch {
    return ''
  }
}

const sanitizeReadme = (html, repositoryUrl) => {
  if (typeof DOMParser === 'undefined') return ''

  const documentNode = new DOMParser().parseFromString(html, 'text/html')
  const anchorPrefix = `github-readme-${repo.value?.full_name || 'repository'}-`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
  const anchorMap = new Map()
  documentNode.querySelectorAll('script, style, iframe, object, embed, form, input, button').forEach(node => node.remove())
  documentNode.body.querySelectorAll('a.anchor[aria-label^="Permalink"], a[aria-label^="Permalink:"]').forEach(node => node.remove())

  documentNode.body.querySelectorAll('[id]').forEach((element) => {
    const originalId = element.id
    const scopedId = `${anchorPrefix}${originalId}`
    anchorMap.set(originalId, scopedId)
    if (originalId.startsWith('user-content-')) {
      anchorMap.set(originalId.slice('user-content-'.length), scopedId)
    }
    element.id = scopedId
  })

  documentNode.body.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach(({ name }) => {
      if (/^on/i.test(name) || name === 'style' || name === 'srcdoc') element.removeAttribute(name)
    })

    if (element.hasAttribute('href')) {
      const originalHref = element.getAttribute('href')
      const href = originalHref?.startsWith('#')
        ? `#${anchorMap.get(originalHref.slice(1)) || `${anchorPrefix}${originalHref.slice(1)}`}`
        : safeUrl(originalHref, repositoryUrl)
      if (href) element.setAttribute('href', href)
      else element.removeAttribute('href')
    }

    if (element.hasAttribute('src')) {
      const src = safeUrl(element.getAttribute('src'), repositoryUrl)
      if (src) element.setAttribute('src', src)
      else element.removeAttribute('src')
    }

    if (element.tagName === 'A' && !element.getAttribute('href')?.startsWith('#')) {
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noopener noreferrer')
    }
  })

  return documentNode.body.innerHTML
}

const measureOverflow = async () => {
  await nextTick()
  const element = readmeViewport.value
  canCollapse.value = Boolean(
    props.collapsible
    && element
    && element.scrollHeight > Math.max(320, props.collapsedHeight) + 48,
  )
}

const loadReadme = async () => {
  const info = parseRepo(props.url)
  if (!info) {
    loading.value = false
    error.value = '请输入有效的 GitHub 仓库链接或 owner/repo。'
    return
  }

  activeController?.abort()
  const controller = new AbortController()
  activeController = controller
  loading.value = true
  error.value = ''
  expanded.value = false
  canCollapse.value = false
  repo.value = null
  renderedReadme.value = ''

  const cacheKey = `${info.owner}/${info.name}@${props.branch || 'default'}`

  try {
    let payload = responseCache.get(cacheKey)

    if (!payload) {
      const query = props.branch ? `?ref=${encodeURIComponent(props.branch)}` : ''
      const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }

      const [repoResponse, readmeResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${info.owner}/${info.name}`, { headers, signal: controller.signal }),
        fetch(`https://api.github.com/repos/${info.owner}/${info.name}/readme${query}`, {
          headers: { ...headers, Accept: 'application/vnd.github.html+json' },
          signal: controller.signal,
        }),
      ])

      if (!repoResponse.ok) throw new Error(`仓库信息请求失败（${repoResponse.status}）`)
      if (!readmeResponse.ok) {
        const message = readmeResponse.status === 404 ? '该仓库没有可展示的 README。' : `README 请求失败（${readmeResponse.status}）`
        throw new Error(message)
      }

      payload = {
        repository: await repoResponse.json(),
        html: await readmeResponse.text(),
      }
      responseCache.set(cacheKey, payload)
    }

    if (controller.signal.aborted) return
    repo.value = payload.repository
    renderedReadme.value = sanitizeReadme(payload.html, payload.repository.html_url)
    loading.value = false
    await measureOverflow()
  } catch (reason) {
    if (reason?.name !== 'AbortError') error.value = reason instanceof Error ? reason.message : '未知错误'
  } finally {
    if (activeController === controller) loading.value = false
  }
}

const toggleExpanded = () => {
  expanded.value = !expanded.value
  if (!expanded.value) readmeViewport.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(loadReadme)
onBeforeUnmount(() => activeController?.abort())
watch(() => [props.url, props.branch], loadReadme)
</script>

<style scoped>
.github-readme {
  position: relative;
  box-sizing: border-box;
  margin: 1.5rem 0;
  overflow: hidden;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  text-align: left;
  transition: border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease;
}

.github-readme__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.github-readme__identity,
.github-readme__actions,
.github-readme__branch,
.github-readme__actions a {
  display: flex;
  align-items: center;
}

.github-readme__identity {
  min-width: 0;
  gap: 12px;
}

.github-readme__mark {
  display: grid;
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 10px;
  background: #161b22;
  color: #fff;
  font-size: 23px;
}

.github-readme__eyebrow {
  display: block;
  margin-bottom: 2px;
  color: var(--vp-c-text-3);
  font-family: var(--font-code);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.github-readme__repo-name {
  margin: 0;
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.github-readme__actions {
  flex: 0 0 auto;
  gap: 8px;
}

.github-readme__branch,
.github-readme__actions a,
.github-readme__footer button {
  min-height: 32px;
  gap: 6px;
  padding: 5px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-family: var(--font-ui);
  font-size: 0.75rem;
  line-height: 1.2;
}

.github-readme__actions a {
  color: var(--vp-c-brand-hard);
  text-decoration: none;
  transition: color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.github-readme__viewport {
  position: relative;
  scroll-margin-top: 88px;
}

.github-readme__viewport.is-collapsed {
  max-height: var(--github-readme-collapsed-height);
  overflow: hidden;
}

.github-readme__content {
  box-sizing: border-box;
  max-width: 100%;
  padding: clamp(18px, 4vw, 32px);
  overflow-wrap: anywhere;
  color: var(--vp-c-text-1);
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  line-height: 1.72;
}

.github-readme__content :deep(h1),
.github-readme__content :deep(h2),
.github-readme__content :deep(h3),
.github-readme__content :deep(h4),
.github-readme__content :deep(h5),
.github-readme__content :deep(h6) {
  color: var(--vp-c-text-1);
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.35;
}

.github-readme__content :deep(h1),
.github-readme__content :deep(h2) {
  padding-bottom: 0.45em;
  border-bottom: 1px solid var(--vp-c-divider);
}

.github-readme__content :deep(h1) { font-size: clamp(1.55rem, 4vw, 2rem); }
.github-readme__content :deep(h2) { margin-top: 1.8em; font-size: clamp(1.25rem, 3vw, 1.5rem); }
.github-readme__content :deep(h3) { margin-top: 1.5em; font-size: 1.125rem; }

.github-readme__content :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.github-readme__content :deep(img) {
  display: inline-block;
  max-width: 100%;
  height: auto;
  margin: 4px 0;
  border-radius: 6px;
  background: transparent;
  box-shadow: none;
  vertical-align: middle;
}

.github-readme__content :deep(pre) {
  max-width: 100%;
  padding: 16px;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-code-block-bg);
}

.github-readme__content :deep(code),
.github-readme__content :deep(kbd) {
  font-family: var(--font-code);
  font-size: 0.875em;
}

.github-readme__content :deep(:not(pre) > code) {
  padding: 0.15em 0.35em;
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-hard);
}

.github-readme__content :deep(blockquote) {
  margin: 1em 0;
  padding: 0.2em 0 0.2em 1em;
  border-left: 3px solid var(--vp-c-brand-1);
  color: var(--vp-c-text-2);
}

.github-readme__content :deep(table) {
  display: block;
  width: max-content;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
}

.github-readme__content :deep(th),
.github-readme__content :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
}

.github-readme__content :deep(th) {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}

.github-readme__content :deep(details) {
  margin: 1em 0;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.github-readme__fade {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 112px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--vp-c-bg-elv) 88%);
}

.github-readme__footer {
  display: flex;
  justify-content: center;
  padding: 10px 16px 14px;
  border-top: 1px solid var(--vp-c-divider);
}

.github-readme__footer button {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  border-color: var(--vp-c-brand-3);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-hard);
  font-family: var(--font-ui);
  cursor: pointer;
  transition: border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.github-readme__loading {
  min-height: 360px;
  padding: 18px;
}

.github-readme__skeleton-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.github-readme__skeleton-icon,
.github-readme__skeleton-title,
.github-readme__skeleton-badge,
.github-readme__skeleton-body span {
  display: block;
  border-radius: 6px;
  background: var(--vp-c-divider);
  animation: github-readme-pulse 1.1s ease-in-out infinite alternate;
}

.github-readme__skeleton-icon { width: 38px; height: 38px; border-radius: 10px; }
.github-readme__skeleton-title { width: min(40%, 210px); height: 18px; }
.github-readme__skeleton-badge { width: 82px; height: 30px; margin-left: auto; }

.github-readme__skeleton-body {
  display: grid;
  gap: 14px;
  padding: 26px 12px;
}

.github-readme__skeleton-body span { width: 100%; height: 12px; }
.github-readme__skeleton-body .is-heading { width: 46%; height: 26px; margin-bottom: 8px; }
.github-readme__skeleton-body .is-short { width: 72%; }
.github-readme__skeleton-body .is-block { width: 100%; height: 96px; margin-top: 14px; }

.github-readme__error {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  min-height: 128px;
  gap: 12px;
  padding: 20px;
  color: var(--vp-c-danger-1);
}

.github-readme__error > svg { font-size: 22px; }
.github-readme__error strong { color: var(--vp-c-text-1); }
.github-readme__error p { margin: 3px 0 0; color: var(--vp-c-text-2); font-size: 0.875rem; }
.github-readme__error button {
  min-height: 34px;
  padding: 5px 10px;
  border: 1px solid var(--vp-c-danger-3);
  border-radius: 7px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  font: inherit;
  cursor: pointer;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (hover: hover) and (pointer: fine) {
  .github-readme:hover { border-color: var(--vp-c-brand-3); }

  .github-readme__actions a:hover,
  .github-readme__footer button:hover {
    border-color: var(--vp-c-brand-2);
    background: var(--vp-c-brand-soft);
    transform: translateY(-1px);
  }
}

.github-readme__actions a:focus-visible,
.github-readme__footer button:focus-visible,
.github-readme__error button:focus-visible,
.github-readme__content :deep(a:focus-visible) {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.github-readme__actions a:active,
.github-readme__footer button:active,
.github-readme__error button:active {
  transform: scale(0.97);
}

@media (max-width: 640px) {
  .github-readme__header {
    align-items: flex-start;
    flex-direction: column;
    padding: 14px;
  }

  .github-readme__actions {
    width: 100%;
    justify-content: space-between;
  }

  .github-readme__content { padding: 18px 14px; }
  .github-readme__error { grid-template-columns: auto minmax(0, 1fr); }
  .github-readme__error button { grid-column: 2; justify-self: start; }
}

@media (prefers-reduced-motion: reduce) {
  .github-readme,
  .github-readme__actions a,
  .github-readme__footer button {
    transition: color var(--motion-duration-fast) ease,
      border-color var(--motion-duration-fast) ease,
      background-color var(--motion-duration-fast) ease;
  }

  .github-readme__skeleton-icon,
  .github-readme__skeleton-title,
  .github-readme__skeleton-badge,
  .github-readme__skeleton-body span {
    animation: none;
  }
}

@keyframes github-readme-pulse {
  from { opacity: 0.5; }
  to { opacity: 1; }
}
</style>
