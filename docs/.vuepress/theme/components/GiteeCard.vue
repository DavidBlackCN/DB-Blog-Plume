<template>
  <div class="gitee-card" :class="{ 'is-loading': loading, 'is-error': error }">
    <!-- 1. 加载状态：骨架屏 -->
    <div v-if="loading" class="gt-skeleton">
      <div class="gt-skeleton-header">
        <div class="gt-skeleton-avatar"></div>
        <div class="gt-skeleton-info">
          <div class="gt-skeleton-title"></div>
          <div class="gt-skeleton-text"></div>
        </div>
      </div>
      <div class="gt-skeleton-stats"></div>
    </div>

    <!-- 2. 错误状态 -->
    <div v-else-if="error" class="gt-error-message">
      <Icon name="octicon:alert-16" color="var(--vp-c-red-1)" />
      <span>{{ error }}</span>
    </div>

    <!-- 3. 正常内容 -->
    <div v-else-if="repoData" class="gt-card-content">
      <!-- 头部：头像与标题 -->
      <div class="gt-header">
        <img :src="repoData.owner.avatar_url" class="gt-avatar" alt="avatar" loading="lazy">
        <div class="gt-repo-info">
          <h3 class="gt-title">
            <a :href="repoData.html_url" target="_blank" rel="noopener">
              {{ repoData.full_name }}
            </a>
          </h3>
          <p class="gt-description">{{ repoData.description || '暂无项目描述' }}</p>
        </div>
      </div>
      
      <!-- 中间：统计指标 -->
      <div class="gt-stats">
        <a :href="`${repoData.html_url}/stargazers`" target="_blank" class="gt-stat-item">
          <Icon name="octicon:star-fill-16" color="#e3b341" size="14" />
          <span class="gt-label">Stars</span>
          <span class="gt-value">{{ formatNumber(repoData.stargazers_count) }}</span>
        </a>
        
        <a :href="`${repoData.html_url}/issues`" target="_blank" class="gt-stat-item">
          <Icon name="octicon:issue-opened-16" color="#3fb950" size="14" />
          <span class="gt-label">Issues</span>
          <span class="gt-value">{{ formatNumber(repoData.open_issues_count) }}</span>
        </a>
        
        <a :href="`${repoData.html_url}/members`" target="_blank" class="gt-stat-item">
          <Icon name="octicon:repo-forked-16" color="#58a6ff" size="14" />
          <span class="gt-label">Forks</span>
          <span class="gt-value">{{ formatNumber(repoData.forks_count) }}</span>
        </a>

        <div v-if="repoData.license" class="gt-stat-item">
          <Icon name="octicon:law-16" color="#bc8cff" size="14" />
          <span class="gt-value">{{ repoData.license }}</span>
        </div>
      </div>
      
      <!-- 底部：语言与更新时间 -->
      <div class="gt-footer">
        <div class="gt-footer-left">
          <span v-if="repoData.language" class="gt-language">
            <span class="gt-language-color" :style="{ backgroundColor: getLanguageColor(repoData.language) }"></span>
            {{ repoData.language }}
          </span>
        </div>
        <div class="gt-dates">
          <span>
            <Icon name="octicon:history-16" size="12" />
            更新于: {{ formatDate(repoData.updated_at) }}
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

let cachedColors = null;

const parseRepoUrl = (url) => {
  if (!url) return null;
  const cleanUrl = url.replace(/\/$/, ""); 
  // 适配 gitee.com/owner/repo 或 owner/repo 格式
  const match = cleanUrl.match(/gitee\.com\/([^/]+)\/([^/]+)/) || cleanUrl.match(/^([^/]+)\/([^/]+)$/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

const fetchRepoData = async () => {
  const info = parseRepoUrl(props.url);
  if (!info) {
    error.value = "无效的 Gitee 地址";
    loading.value = false;
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    // Gitee API V5: https://gitee.com/api/v5/repos/{owner}/{repo}
    const [repoRes, colorRes] = await Promise.all([
      fetch(`https://gitee.com/api/v5/repos/${info.owner}/${info.repo}`),
      cachedColors 
        ? Promise.resolve(cachedColors) 
        : fetch('https://gh.llkk.cc/https://raw.githubusercontent.com/ozh/github-colors/master/colors.json').then(r => r.json())
    ]);

    if (!repoRes.ok) {
        if(repoRes.status === 404) throw new Error("项目未找到 (可能为私有)");
        throw new Error(`API 错误 (${repoRes.status})`);
    }

    cachedColors = colorRes;
    const data = await repoRes.json();
    data._colors = colorRes;
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

onMounted(fetchRepoData);
watch(() => props.url, fetchRepoData);
</script>

<style scoped>
.gitee-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px 16px; 
  background-color: var(--vp-c-bg-soft);
  transition: all 0.25s ease;
  margin: 1rem 0;
  overflow: hidden;
  text-align: left !important;
  box-sizing: border-box;
  font-family: "MapleMono-SemiBold";
}

.gitee-card:hover {
  border-color: #c71d23; /* Gitee 品牌红 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.gt-header {
  display: flex !important;
  align-items: center !important; 
  justify-content: flex-start !important;
  gap: 16px;
  margin-bottom: 8px; 
}

.gt-avatar {
  width: 56px !important; 
  height: 56px !important;
  border-radius: 10px !important;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
  margin: 0 !important; 
  display: block;
}

.gt-repo-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left !important;
}

.gt-title {
  margin: 0 !important;
  font-size: 1.1rem !important;
  font-weight: 600;
  line-height: 1.3;
}

.gt-title a {
  color: #c71d23 !important;
  text-decoration: none;
}
.gitee-card:hover .gt-title a {
  color: #c71d23 !important;
}

.gt-description {
  margin: 4px 0 0 !important;
  font-size: 0.92rem !important;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gt-stats {
  display: flex !important;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
  justify-content: flex-start !important;
}

.gt-stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  font-size: 12px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.gt-stat-item:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.gt-footer {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 10px;
  margin-top: 4px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.gt-language {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-2);
}

.gt-language-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.gt-dates span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.gt-error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--vp-c-red-1);
}

/* 骨架屏 */
.gt-skeleton-header { display: flex; align-items: center; gap: 16px; }
.gt-skeleton-avatar { width: 56px; height: 56px; background: var(--vp-c-divider); border-radius: 10px; }
.gt-skeleton-title { width: 140px; height: 20px; background: var(--vp-c-divider); border-radius: 4px; margin-bottom: 8px; }
.gt-skeleton-text { width: 85%; height: 16px; background: var(--vp-c-divider); border-radius: 4px; }
</style>