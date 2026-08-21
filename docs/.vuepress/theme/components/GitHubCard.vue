<template>
  <article
    class="github-card"
    :class="{ 'is-loading': loading, 'is-error': error }"
    :aria-busy="loading"
  >
    <!-- 加载状态：保留稳定尺寸，避免内容跳动 -->
    <div v-if="loading" class="gh-skeleton" role="status">
      <span class="sr-only">正在加载 GitHub 仓库信息</span>
      <div class="gh-skeleton-header">
        <div class="gh-skeleton-avatar"></div>
        <div class="gh-skeleton-info">
          <div class="gh-skeleton-title"></div>
          <div class="gh-skeleton-text"></div>
        </div>
      </div>
      <div class="gh-skeleton-stats">
        <span></span><span></span><span></span>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="gh-error-message" role="alert">
      <Icon class="gh-error-icon" icon="octicon:alert-16" aria-hidden="true" />
      <span>{{ error }}</span>
    </div>

    <!-- 正常内容 -->
    <div v-else-if="repoData" class="gh-card-content">
      <!-- 头部：头像与标题 -->
      <header class="gh-header">
        <img
          :src="repoData.owner.avatar_url"
          class="gh-avatar"
          :alt="`${repoData.owner.login} 的头像`"
          loading="lazy"
        >
        <div class="gh-repo-info">
          <h3 class="gh-title">
            <a :href="repoData.html_url" target="_blank" rel="noopener noreferrer">
              {{ repoData.full_name }}
              <Icon class="gh-external-icon" icon="mdi:arrow-top-right" aria-hidden="true" />
            </a>
          </h3>
          <p class="gh-description">{{ repoData.description || '暂无项目描述' }}</p>
        </div>
      </header>

      <!-- 统计指标 -->
      <div class="gh-stats" aria-label="仓库统计">
        <a
          :href="`${repoData.html_url}/stargazers`"
          target="_blank"
          rel="noopener noreferrer"
          class="gh-stat-item"
          aria-label="查看 Star 数"
        >
          <Icon class="gh-stat-icon gh-stat-icon-star" icon="octicon:star-fill-16" aria-hidden="true" />
          <span class="gh-label">Stars</span>
          <span class="gh-value">{{ formatNumber(repoData.stargazers_count) }}</span>
        </a>

        <a
          :href="`${repoData.html_url}/issues`"
          target="_blank"
          rel="noopener noreferrer"
          class="gh-stat-item"
          aria-label="查看 Issues"
        >
          <Icon class="gh-stat-icon gh-stat-icon-issue" icon="octicon:issue-opened-16" aria-hidden="true" />
          <span class="gh-label">Issues</span>
          <span class="gh-value">{{ formatNumber(repoData.open_issues_count) }}</span>
        </a>

        <a
          :href="`${repoData.html_url}/network/members`"
          target="_blank"
          rel="noopener noreferrer"
          class="gh-stat-item"
          aria-label="查看 Fork 数"
        >
          <Icon class="gh-stat-icon gh-stat-icon-fork" icon="octicon:repo-forked-16" aria-hidden="true" />
          <span class="gh-label">Forks</span>
          <span class="gh-value">{{ formatNumber(repoData.forks_count) }}</span>
        </a>

        <a
          v-if="licenseLabel"
          :href="licenseUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="gh-stat-item gh-license"
          :aria-label="`查看 ${licenseLabel} 许可证`"
        >
          <Icon class="gh-stat-icon gh-stat-icon-license" icon="octicon:law-16" aria-hidden="true" />
          <span class="gh-value">{{ licenseLabel }}</span>
        </a>
      </div>

      <!-- 底部：语言与更新时间 -->
      <footer class="gh-footer">
        <span v-if="repoData.language" class="gh-language">
          <span class="gh-language-color" :style="{ backgroundColor: getLanguageColor(repoData.language) }"></span>
          {{ repoData.language }}
        </span>
        <time class="gh-date" :datetime="repoData.updated_at">
          <Icon icon="octicon:history-16" aria-hidden="true" />
          更新于 {{ formatDate(repoData.updated_at) }}
        </time>
      </footer>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  url: { type: String, required: true }
})

const repoData = ref(null)
const loading = ref(true)
const error = ref(null)

let cachedColors = null

const parseRepoUrl = (url) => {
  if (!url) return null
  const cleanUrl = url.replace(/\/$/, '')
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/) || cleanUrl.match(/^([^/]+)\/([^/]+)$/)
  return match ? { owner: match[1], repo: match[2] } : null
}

const licenseLabel = computed(() => {
  const license = repoData.value?.license
  if (!license) return ''
  return typeof license === 'string' ? license : license.spdx_id || license.name || ''
})

const licenseUrl = computed(() => {
  if (!repoData.value) return '#'
  return `${repoData.value.html_url}/blob/${repoData.value.default_branch}/LICENSE`
})

const fetchRepoData = async () => {
  const info = parseRepoUrl(props.url)
  if (!info) {
    error.value = '无效的 GitHub 地址'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const [repoRes, colorRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${info.owner}/${info.repo}`),
      cachedColors
        ? Promise.resolve(cachedColors)
        : fetch('https://gh.llkk.cc/https://raw.githubusercontent.com/ozh/github-colors/master/colors.json').then((response) => response.json())
    ])

    if (!repoRes.ok) throw new Error(`项目未找到（${repoRes.status}）`)

    cachedColors = colorRes
    const data = await repoRes.json()
    data._colors = colorRes
    repoData.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const getLanguageColor = (lang) => repoData.value?._colors?.[lang]?.color || 'var(--vp-c-text-3)'
const formatNumber = (num) => num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num
const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })

onMounted(fetchRepoData)
watch(() => props.url, fetchRepoData)
</script>

<style scoped>
/* ===========================================================================
   GitHub 仓库卡片
   ========================================================================== */

.github-card {
  --repo-accent: var(--vp-c-brand-1);
  --repo-accent-hover: var(--vp-c-brand-2);
  --repo-accent-soft: var(--vp-c-brand-soft);
  --repo-accent-border: var(--vp-c-brand-3);
  position: relative;
  box-sizing: border-box;
  margin: 1.25rem 0;
  overflow: hidden;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  text-align: left;
  font-family: var(--font-ui);
  overflow-wrap: anywhere;
  transition: border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-normal) var(--motion-ease-out);
}

.gh-card-content,
.gh-skeleton,
.gh-error-message {
  padding: 16px;
}

.gh-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.gh-avatar {
  display: block;
  flex: 0 0 auto;
  width: 52px;
  height: 52px;
  margin: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-alt);
  box-shadow: none;
  object-fit: cover;
}

.github-card .gh-avatar:hover {
  transform: none;
}

.gh-repo-info {
  min-width: 0;
}

.gh-title {
  margin: 0;
  color: var(--repo-accent);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

.gh-title a {
  display: inline;
  color: inherit;
  text-decoration: none;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: color var(--motion-duration-fast) ease,
    text-decoration-color var(--motion-duration-fast) ease;
}

.gh-external-icon {
  display: inline-block;
  margin-left: 2px;
  font-size: 0.9em;
  vertical-align: -0.08em;
}

.gh-description {
  display: -webkit-box;
  margin: 4px 0 0;
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* 统计区域 */
.gh-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.gh-stat-item {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  gap: 5px;
  padding: 4px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  line-height: 1.2;
  text-decoration: none;
  transition: color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.gh-stat-icon {
  flex-shrink: 0;
  font-size: 14px;
}

.gh-stat-icon-star { color: #a56a00; }
.gh-stat-icon-issue { color: var(--vp-c-success-1); }
.gh-stat-icon-fork { color: var(--vp-c-info-1); }
.gh-stat-icon-license { color: var(--vp-c-warning-1); }

.gh-label {
  color: var(--vp-c-text-2);
}

.gh-value {
  color: var(--vp-c-text-1);
  font-family: var(--font-code);
  font-variant-numeric: tabular-nums;
}

/* 底部 */
.gh-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  line-height: 1.35;
}

.gh-language,
.gh-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.gh-language {
  color: var(--vp-c-text-2);
}

.gh-date {
  text-align: right;
}

.gh-language-color {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

/* 加载与错误状态 */
.gh-skeleton-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.gh-skeleton-info {
  display: grid;
  flex: 1;
  gap: 8px;
}

.gh-skeleton-avatar,
.gh-skeleton-title,
.gh-skeleton-text,
.gh-skeleton-stats span {
  border-radius: 6px;
  background: var(--vp-c-divider);
  animation: gh-skeleton-pulse 1.1s ease-in-out infinite alternate;
}

.gh-skeleton-avatar {
  width: 52px;
  height: 52px;
  border-radius: 10px;
}

.gh-skeleton-title { width: min(42%, 180px); height: 16px; }
.gh-skeleton-text { width: min(88%, 320px); height: 12px; }

.gh-skeleton-stats {
  display: flex;
  gap: 8px;
  margin-top: 18px;
}

.gh-skeleton-stats span {
  width: 68px;
  height: 28px;
}

.gh-error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 84px;
  color: var(--vp-c-danger-1);
  font-size: 0.875rem;
}

.gh-error-icon {
  flex-shrink: 0;
  font-size: 16px;
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
  .github-card:hover {
    border-color: var(--repo-accent-border);
    background: var(--vp-c-bg-safe);
    transform: translateY(-2px);
  }

  .github-card:hover .gh-title a {
    color: var(--repo-accent-hover);
    text-decoration: underline;
  }

  .gh-stat-item:hover {
    border-color: var(--repo-accent-border);
    background: var(--repo-accent-soft);
    color: var(--vp-c-text-1);
    transform: translateY(-1px);
  }
}

.gh-title a:focus-visible,
.gh-stat-item:focus-visible {
  outline: 2px solid var(--repo-accent);
  outline-offset: 2px;
}

.gh-stat-item:active {
  transform: scale(0.97);
}

@media (max-width: 480px) {
  .gh-card-content,
  .gh-skeleton,
  .gh-error-message {
    padding: 14px;
  }

  .gh-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .gh-date {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .github-card,
  .gh-stat-item,
  .gh-title a {
    transition: color var(--motion-duration-fast) ease,
      background-color var(--motion-duration-fast) ease,
      border-color var(--motion-duration-fast) ease;
  }

  .gh-skeleton-avatar,
  .gh-skeleton-title,
  .gh-skeleton-text,
  .gh-skeleton-stats span {
    animation: none;
  }
}

@keyframes gh-skeleton-pulse {
  from { opacity: 0.55; }
  to { opacity: 1; }
}
</style>
