<template>
  <article
    class="gitee-card"
    :class="{ 'is-loading': loading, 'is-error': error }"
    :aria-busy="loading"
  >
    <!-- 加载状态：保留稳定尺寸，避免内容跳动 -->
    <div v-if="loading" class="gt-skeleton" role="status">
      <span class="sr-only">正在加载 Gitee 仓库信息</span>
      <div class="gt-skeleton-header">
        <div class="gt-skeleton-avatar"></div>
        <div class="gt-skeleton-info">
          <div class="gt-skeleton-title"></div>
          <div class="gt-skeleton-text"></div>
        </div>
      </div>
      <div class="gt-skeleton-stats">
        <span></span><span></span><span></span>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="gt-error-message" role="alert">
      <Icon class="gt-error-icon" icon="octicon:alert-16" aria-hidden="true" />
      <span>{{ error }}</span>
    </div>

    <!-- 正常内容 -->
    <div v-else-if="repoData" class="gt-card-content">
      <!-- 头部：头像与标题 -->
      <header class="gt-header">
        <img
          :src="repoData.owner.avatar_url"
          class="gt-avatar"
          :alt="`${repoData.owner.login} 的头像`"
          loading="lazy"
        >
        <div class="gt-repo-info">
          <h3 class="gt-title">
            <a :href="repoData.html_url" target="_blank" rel="noopener noreferrer">
              {{ repoData.full_name }}
              <Icon class="gt-external-icon" icon="mdi:arrow-top-right" aria-hidden="true" />
            </a>
          </h3>
          <p class="gt-description">{{ repoData.description || '暂无项目描述' }}</p>
        </div>
      </header>

      <!-- 统计指标 -->
      <div class="gt-stats" aria-label="仓库统计">
        <a
          :href="`${repoData.html_url}/stargazers`"
          target="_blank"
          rel="noopener noreferrer"
          class="gt-stat-item"
          aria-label="查看 Star 数"
        >
          <Icon class="gt-stat-icon" icon="octicon:star-fill-16" aria-hidden="true" />
          <span class="gt-label">Stars</span>
          <span class="gt-value">{{ formatNumber(repoData.stargazers_count) }}</span>
        </a>

        <a
          :href="`${repoData.html_url}/issues`"
          target="_blank"
          rel="noopener noreferrer"
          class="gt-stat-item"
          aria-label="查看 Issues"
        >
          <Icon class="gt-stat-icon" icon="octicon:issue-opened-16" aria-hidden="true" />
          <span class="gt-label">Issues</span>
          <span class="gt-value">{{ formatNumber(repoData.open_issues_count) }}</span>
        </a>

        <a
          :href="`${repoData.html_url}/members`"
          target="_blank"
          rel="noopener noreferrer"
          class="gt-stat-item"
          aria-label="查看 Fork 数"
        >
          <Icon class="gt-stat-icon" icon="octicon:repo-forked-16" aria-hidden="true" />
          <span class="gt-label">Forks</span>
          <span class="gt-value">{{ formatNumber(repoData.forks_count) }}</span>
        </a>

        <a
          v-if="licenseLabel"
          :href="licenseUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="gt-stat-item gt-license"
          :aria-label="`查看 ${licenseLabel} 许可证`"
        >
          <Icon class="gt-stat-icon" icon="octicon:law-16" aria-hidden="true" />
          <span class="gt-value">{{ licenseLabel }}</span>
        </a>
      </div>

      <!-- 底部：语言与更新时间 -->
      <footer class="gt-footer">
        <span v-if="repoData.language" class="gt-language">
          <span class="gt-language-color" :style="{ backgroundColor: getLanguageColor(repoData.language) }"></span>
          {{ repoData.language }}
        </span>
        <time class="gt-date" :datetime="repoData.updated_at">
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
  const match = cleanUrl.match(/gitee\.com\/([^/]+)\/([^/]+)/) || cleanUrl.match(/^([^/]+)\/([^/]+)$/)
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
    error.value = '无效的 Gitee 地址'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const [repoRes, colorRes] = await Promise.all([
      fetch(`https://gitee.com/api/v5/repos/${info.owner}/${info.repo}`),
      cachedColors
        ? Promise.resolve(cachedColors)
        : fetch('https://gh.llkk.cc/https://raw.githubusercontent.com/ozh/github-colors/master/colors.json').then((response) => response.json())
    ])

    if (!repoRes.ok) {
      if (repoRes.status === 404) throw new Error('项目未找到（可能为私有仓库）')
      throw new Error(`API 错误（${repoRes.status}）`)
    }

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
   Gitee 仓库卡片
   ========================================================================== */

.gitee-card {
  --repo-accent: #c71d23;
  --repo-accent-hover: #a8171c;
  --repo-accent-soft: rgba(199, 29, 35, 0.09);
  --repo-accent-border: rgba(199, 29, 35, 0.38);
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

:global(html.dark .gitee-card),
:global([data-theme="dark"] .gitee-card) {
  --repo-accent: #f18a8e;
  --repo-accent-hover: #ffb3b5;
  --repo-accent-soft: rgba(241, 138, 142, 0.16);
  --repo-accent-border: rgba(241, 138, 142, 0.48);
}

.gt-card-content,
.gt-skeleton,
.gt-error-message {
  padding: 16px;
}

.gt-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.gt-avatar {
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

.gitee-card .gt-avatar:hover {
  transform: none;
}

.gt-repo-info {
  min-width: 0;
}

.gt-title {
  margin: 0;
  color: var(--repo-accent);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

.gt-title a {
  display: inline;
  color: inherit;
  text-decoration: none;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: color var(--motion-duration-fast) ease,
    text-decoration-color var(--motion-duration-fast) ease;
}

.gt-external-icon {
  display: inline-block;
  margin-left: 2px;
  font-size: 0.9em;
  vertical-align: -0.08em;
}

.gt-description {
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
.gt-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.gt-stat-item {
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

.gt-stat-icon {
  flex-shrink: 0;
  color: var(--repo-accent);
  font-size: 14px;
}

.gt-label {
  color: var(--vp-c-text-2);
}

.gt-value {
  color: var(--vp-c-text-1);
  font-family: var(--font-code);
  font-variant-numeric: tabular-nums;
}

/* 底部 */
.gt-footer {
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

.gt-language,
.gt-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.gt-language {
  color: var(--vp-c-text-2);
}

.gt-date {
  text-align: right;
}

.gt-language-color {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

/* 加载与错误状态 */
.gt-skeleton-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.gt-skeleton-info {
  display: grid;
  flex: 1;
  gap: 8px;
}

.gt-skeleton-avatar,
.gt-skeleton-title,
.gt-skeleton-text,
.gt-skeleton-stats span {
  border-radius: 6px;
  background: var(--vp-c-divider);
  animation: gt-skeleton-pulse 1.1s ease-in-out infinite alternate;
}

.gt-skeleton-avatar {
  width: 52px;
  height: 52px;
  border-radius: 10px;
}

.gt-skeleton-title { width: min(42%, 180px); height: 16px; }
.gt-skeleton-text { width: min(88%, 320px); height: 12px; }

.gt-skeleton-stats {
  display: flex;
  gap: 8px;
  margin-top: 18px;
}

.gt-skeleton-stats span {
  width: 68px;
  height: 28px;
}

.gt-error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 84px;
  color: var(--vp-c-danger-1);
  font-size: 0.875rem;
}

.gt-error-icon {
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
  .gitee-card:hover {
    border-color: var(--repo-accent-border);
    background: var(--vp-c-bg-safe);
    transform: translateY(-2px);
  }

  .gitee-card:hover .gt-title a {
    color: var(--repo-accent-hover);
    text-decoration: underline;
  }

  .gt-stat-item:hover {
    border-color: var(--repo-accent-border);
    background: var(--repo-accent-soft);
    color: var(--vp-c-text-1);
    transform: translateY(-1px);
  }
}

.gt-title a:focus-visible,
.gt-stat-item:focus-visible {
  outline: 2px solid var(--repo-accent);
  outline-offset: 2px;
}

.gt-stat-item:active {
  transform: scale(0.97);
}

@media (max-width: 480px) {
  .gt-card-content,
  .gt-skeleton,
  .gt-error-message {
    padding: 14px;
  }

  .gt-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .gt-date {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gitee-card,
  .gt-stat-item,
  .gt-title a {
    transition: color var(--motion-duration-fast) ease,
      background-color var(--motion-duration-fast) ease,
      border-color var(--motion-duration-fast) ease;
  }

  .gt-skeleton-avatar,
  .gt-skeleton-title,
  .gt-skeleton-text,
  .gt-skeleton-stats span {
    animation: none;
  }
}

@keyframes gt-skeleton-pulse {
  from { opacity: 0.55; }
  to { opacity: 1; }
}
</style>
