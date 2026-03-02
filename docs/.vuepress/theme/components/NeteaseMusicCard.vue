<template>
  <div class="nm-card" :class="{ 'is-loading': loading, 'is-error': error }">
    <!-- 1. 加载状态 -->
    <div v-if="loading" class="nm-skeleton">
      <div class="nm-skeleton-content">
        <div class="nm-skeleton-cover"></div>
        <div class="nm-skeleton-info">
          <div class="nm-skeleton-title"></div>
          <div class="nm-skeleton-text"></div>
        </div>
      </div>
    </div>

    <!-- 2. 错误状态 -->
    <div v-else-if="error" class="nm-error-message">
      <Icon name="octicon:alert-16" />
      <span>{{ error }}</span>
    </div>

    <!-- 3. 正常内容 -->
    <div v-else-if="songData" class="nm-card-content">
      <!-- 右上角网易云 Logo -->
      <div class="nm-brand-logo" @click="openNetease">
        <Icon name="simple-icons:neteasecloudmusic" size="18" color="#e03f3c" />
      </div>

      <div class="nm-main">
        <!-- 左侧：封面 -->
        <div class="nm-cover-wrapper" @click="openNetease">
          <img :src="songData.al.picUrl + '?param=140y140'" class="nm-cover" loading="lazy">
          <div class="nm-play-btn">
            <Icon name="ic:baseline-play-circle-filled" size="30" color="#e03f3c" />
          </div>
        </div>

        <!-- 右侧：详情 -->
        <div class="nm-info">
          <div class="nm-title-row">
            <h3 class="nm-title" @click="openNetease">{{ songData.name }}</h3>
            <div class="nm-quality-tags">
              <span v-if="isHiRes" class="tag hires">Hi-Res</span>
              <span v-else-if="isSQ" class="tag sq">SQ</span>
            </div>
          </div>

          <div class="nm-meta">
            <span class="nm-artist">{{ formatArtists(songData.ar) }}</span>
            <span class="nm-dot">·</span>
            <span class="nm-album">{{ songData.al.name }}</span>
          </div>

          <!-- 精彩歌词 -->
          <div v-if="hotLyric" class="nm-lyric-box">
            <p class="nm-lyric-text">“ {{ hotLyric }} ”</p>
          </div>
        </div>
      </div>

      <!-- 底部：统计与评论 -->
      <div class="nm-footer">
        <!-- 统计信息全部靠左 -->
        <div class="nm-stats">
          <div class="nm-stat-item highlight">
             <Icon name="ic:outline-mode-comment" size="14" />
             <span>{{ formatNumber(commentCount) }} 评论</span>
          </div>
          <div v-if="publishTime" class="nm-stat-item">
             <Icon name="ic:outline-calendar-month" size="14" />
             <span>{{ publishTime }} 发行</span>
          </div>
        </div>
        
        <!-- 热门评论 -->
        <div v-if="hotComment" class="nm-hot-comment">
          <img :src="hotComment.user.avatarUrl + '?param=60y60'" class="comment-avatar">
          <div class="comment-text-group">
            <div class="comment-user">{{ hotComment.user.nickname }}</div>
            <div class="comment-content">{{ hotComment.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  baseUrl: { type: String, default: 'https://api.voicehub.lao-shui.top' } 
});

const songData = ref(null);
const hotLyric = ref("");
const hotComment = ref(null);
const commentCount = ref(0); 
const loading = ref(true);
const error = ref(null);
const isHiRes = ref(false);
const isSQ = ref(false);

const fetchAllData = async () => {
  const songId = props.id.toString().match(/\d+/)?.[0];
  if (!songId) {
    error.value = "ID 格式错误";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const apiBase = props.baseUrl.replace(/\/$/, '');
    
    const [detailRes, lyricRes, commentRes, dynamicRes] = await Promise.all([
      fetch(`${apiBase}/song/detail?ids=${songId}`),
      fetch(`${apiBase}/lyric?id=${songId}`),
      fetch(`${apiBase}/comment/music?id=${songId}&limit=1`),
      fetch(`${apiBase}/song/detail/dynamic?id=${songId}`)
    ]);

    const detailData = await detailRes.json();
    const lyricData = await lyricRes.json();
    const commentData = await commentRes.json();
    const dynamicDataRaw = await dynamicRes.json();

    if (!detailData.songs?.[0]) throw new Error("未找到歌曲");

    songData.value = detailData.songs[0];
    
    // 数据解析
    const dynamicData = dynamicDataRaw.data || dynamicDataRaw;
    commentCount.value = dynamicData.commentCount || commentData.total || 0;

    // 音质
    if (detailData.privileges?.[0]) {
      const p = detailData.privileges[0];
      isHiRes.value = p.hr || p.maxbr > 320000;
      isSQ.value = p.sq || (p.fl > 0 && p.fl <= 320000);
    }

    // 歌词
    if (lyricData.lrc?.lyric) {
      const lines = lyricData.lrc.lyric.split('\n')
        .map(l => l.replace(/\[.*\]/, '').trim())
        .filter(l => l.length > 3 && !l.includes(':') && !l.includes('：'));
      hotLyric.value = lines[Math.floor(lines.length / 2)] || lines[0];
    }

    // 评论
    if (commentData.hotComments?.length > 0) {
      hotComment.value = commentData.hotComments[0];
    } else if (commentData.comments?.length > 0) {
       hotComment.value = commentData.comments[0];
    }

  } catch (err) {
    error.value = `加载失败: ${err.message}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatArtists = (ar) => ar ? ar.map(a => a.name).join('/') : '未知歌手';
const formatNumber = (num) => {
  if (!num || num <= 0) return 0;
  return num > 10000 ? (num / 10000).toFixed(1) + 'w' : num;
};
const publishTime = computed(() => {
  if (!songData.value?.publishTime) return null;
  return new Date(songData.value.publishTime).getFullYear();
});

const openNetease = () => {
  if (songData.value) window.open(`https://music.163.com/#/song?id=${songData.value.id}`, '_blank');
};

onMounted(fetchAllData);
watch(() => props.id, fetchAllData);
</script>

<style scoped>
.nm-card {
  position: relative; /* 必须，为了定位 Logo */
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s;
  margin: 1.5rem 0;
  text-align: left !important;
  overflow: hidden;
}

.nm-card:hover {
  border-color: #e03f3c;
  box-shadow: 0 8px 24px rgba(224,63,60,0.12);
}

/* 网易云 Logo 样式 */
.nm-brand-logo {
  position: absolute;
  top: 14px;
  right: 14px;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.3s;
  z-index: 10;
}
.nm-brand-logo:hover { opacity: 1; }

.nm-main {
  display: flex !important;
  align-items: center !important; /* 歌曲图片与文字垂直居中 */
  gap: 16px;
  margin-right: 20px; /* 为 Logo 留出空间 */
}

.nm-cover-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  line-height: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.nm-cover {
  width: 90px !important;
  height: 90px !important;
  object-fit: cover;
  display: block !important;
  margin: 0 !important;
}

.nm-play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.15);
  opacity: 0;
  transition: opacity 0.3s;
}
.nm-card:hover .nm-play-btn { opacity: 1; }

.nm-info { flex: 1; min-width: 0; }

.nm-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.nm-title {
  margin: 0 !important;
  font-size: 1.15rem !important;
  font-weight: 700;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  font-size: 10px;
  padding: 0 4px;
  border-radius: 3px;
  border: 1px solid;
  font-weight: bold;
}
.tag.hires { color: #e03f3c; border-color: #e03f3c; }
.tag.sq { color: #feac2c; border-color: #feac2c; }

.nm-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}

.nm-lyric-box {
  background: var(--vp-c-default-soft);
  padding: 6px 12px;
  border-radius: 6px;
  border-left: 3px solid #e03f3c;
}
.nm-lyric-text {
  margin: 0 !important;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nm-footer {
  margin-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 12px;
}

.nm-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  justify-content: flex-start !important;
}

.nm-stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.nm-stat-item.highlight { color: #e03f3c; }

/* 核心优化：评论头像与文字完美垂直居中 */
.nm-hot-comment {
  display: flex !important;
  align-items: center !important; /* 强制垂直居中 */
  gap: 12px;
  background: var(--vp-c-bg-alt);
  padding: 8px 12px;
  border-radius: 10px;
  width: 100%;
}

.comment-avatar {
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
  flex-shrink: 0;
  margin: 0 !important;
  border: 1px solid var(--vp-c-divider);
}

.comment-text-group {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column; /* 垂直排列用户名和内容 */
  justify-content: center;
}

.comment-user {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 1px;
}

.comment-content {
  font-size: 12px;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left !important;
}
</style>