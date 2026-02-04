<template>
  <div class="github-card" :class="{ 'is-loading': loading, 'is-error': error }">
    <!-- 1. 加载状态：骨架屏 -->
    <div v-if="loading" class="skeleton">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-info">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
        </div>
      </div>
      <div class="skeleton-stats"></div>
    </div>

    <!-- 2. 错误状态 -->
    <div v-else-if="error" class="error-message">
      <Icon name="octicon:alert-16" color="var(--vp-c-red-1)" />
      <span>{{ error }}</span>
    </div>

    <!-- 3. 正常内容 -->
    <div v-else-if="repoData" class="card-content">
      <!-- 头部：头像与标题 -->
      <div class="header">
        <img :src="repoData.owner.avatar_url" class="avatar" alt="avatar" loading="lazy">
        <div class="repo-info">
          <h3>
            <a :href="repoData.html_url" target="_blank" rel="noopener">
              {{ repoData.full_name }}
            </a>
          </h3>
          <p class="description">{{ repoData.description || 'No description provided.' }}</p>
        </div>
      </div>
      
      <!-- 中间：统计指标 -->
      <div class="stats">
        <a :href="`${repoData.html_url}/stargazers`" target="_blank" class="stat-item">
          <Icon name="octicon:star-fill-16" color="#e3b341" />
          <span class="label">Stars</span>
          <span class="value">{{ formatNumber(repoData.stargazers_count) }}</span>
        </a>
        
        <a :href="`${repoData.html_url}/issues`" target="_blank" class="stat-item">
          <Icon name="octicon:issue-opened-16" color="#3fb950" />
          <span class="label">Issues</span>
          <span class="value">{{ formatNumber(repoData.open_issues_count) }}</span>
        </a>
        
        <a :href="`${repoData.html_url}/network/members`" target="_blank" class="stat-item">
          <Icon name="octicon:repo-forked-16" color="#58a6ff" />
          <span class="label">Forks</span>
          <span class="value">{{ formatNumber(repoData.forks_count) }}</span>
        </a>

        <div v-if="repoData.license" class="stat-item" @click="viewLicense">
          <Icon name="octicon:law-16" color="#bc8cff" />
          <span class="value">{{ repoData.license.spdx_id }}</span>
        </div>
      </div>
      
      <!-- 底部：语言与更新时间 -->
      <div class="footer">
        <div class="left">
          <span v-if="repoData.language" class="language">
            <span class="language-color" :style="{ backgroundColor: getLanguageColor(repoData.language) }"></span>
            {{ repoData.language }}
          </span>
        </div>
        <div class="dates">
          <span>
            <Icon name="octicon:history-16" />
            Last updated: {{ formatDate(repoData.updated_at) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  url: { type: String, required: true }
});

const repoData = ref(null);
const loading = ref(true);
const error = ref(null);

// 语言颜色全局缓存
let cachedColors = null;

// 解析 URL 获取 owner 和 repo
const parseRepoUrl = (url) => {
  if (!url) return null;
  const cleanUrl = url.replace(/\/$/, ""); 
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/) || cleanUrl.match(/^([^/]+)\/([^/]+)$/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

const fetchRepoData = async () => {
  const info = parseRepoUrl(props.url);
  if (!info) {
    error.value = "Invalid GitHub URL";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const [repoRes, colorRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${info.owner}/${info.repo}`),
      cachedColors 
        ? Promise.resolve(cachedColors) 
        : fetch('https://gh.llkk.cc/https://raw.githubusercontent.com/ozh/github-colors/master/colors.json').then(r => r.json())
    ]);

    if (!repoRes.ok) throw new Error(`Repo not found (${repoRes.status})`);
    
    cachedColors = colorRes;
    const data = await repoRes.json();
    data._colors = colorRes; // 存储颜色表
    repoData.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const getLanguageColor = (lang) => repoData.value?._colors?.[lang]?.color || '#ccc';
const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
const formatDate = (date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const viewLicense = () => {
  if (repoData.value) {
    window.open(`${repoData.value.html_url}/blob/${repoData.value.default_branch}/LICENSE`, '_blank');
  }
};

onMounted(fetchRepoData);
watch(() => props.url, fetchRepoData);
</script>

<style scoped>
/* 基础容器 */
.github-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 18px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin: 1.2rem 0;
  overflow: hidden;
}

.github-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* 头部样式 */
.header {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
}

.repo-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.repo-info h3 a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.repo-info h3 a:hover {
  text-decoration: underline;
}

.description {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 统计区域样式 */
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 16px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  font-size: 13px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

/* Hover 时整个按钮的高亮逻辑 */
.stat-item:hover {
  background: var(--vp-c-default-soft);
  border-color: var(--vp-c-divider);
}

/* 当父级 stat-item 被 hover 时，内部所有文字同步变亮 */
.stat-item:hover .label,
.stat-item:hover .value {
  color: var(--vp-c-text-1);
}

.stat-item .label {
  font-weight: 500;
  color: var(--vp-c-text-3); /* 初始颜色较淡 */
  transition: color 0.2s ease;
}

.stat-item .value {
  font-weight: 600;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
}

/* 底部区域 */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 12px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.language {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.language-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dates span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 骨架屏加载动画 */
.skeleton {
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.skeleton-header { display: flex; gap: 12px; }
.skeleton-avatar { width: 50px; height: 50px; background: var(--vp-c-divider); border-radius: 10px; }
.skeleton-title { width: 140px; height: 18px; background: var(--vp-c-divider); border-radius: 4px; margin-bottom: 8px; }
.skeleton-text { width: 90%; height: 14px; background: var(--vp-c-divider); border-radius: 4px; }
.skeleton-stats { margin-top: 18px; width: 100%; height: 32px; background: var(--vp-c-divider); border-radius: 8px; }

/* 错误消息 */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  color: var(--vp-c-red-1);
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
