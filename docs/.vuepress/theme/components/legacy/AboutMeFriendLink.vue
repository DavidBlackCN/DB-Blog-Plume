<template>
  <div class="about-me-card-bg vp-blog-post-item about-me-friends">
    <!-- 顶部标题区 -->
    <div class="friends-header">
      <div class="title-group">
        <p class="about-me-card-title-normal">𝓕𝓻𝓲𝓮𝓷𝓭 𝓛𝓲𝓷𝓴𝓼</p>
        <p class="subtitle">部分友链w</p>
      </div>
      <router-link to="/more/friends/" class="all-friends-button">
        <icon name="game-icons:three-friends" />
        <span>所有好友</span>
      </router-link>
    </div>

    <!-- 友链网格 -->
    <div class="friends-grid">
      <a 
        v-for="(item, index) in displayFriends" 
        :key="index"
        :href="item.link" 
        target="_blank" 
        class="friend-card"
        :title="`${item.name}: ${item.descr || item.link}`"
      >
        <div class="avatar-wrapper">
          <img :src="item.avatar" :alt="item.name" loading="lazy" @error="handleImgError">
          <div class="avatar-overlay">
            <span class="friend-name">{{ item.name }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import FRIENDS from '../data/friends.json';

// 仅展示前 8 个友链，避免卡片过长
const displayFriends = computed(() => FRIENDS.slice(0, 8));

// 图片加载失败处理
const handleImgError = (e) => {
  e.target.src = 'https://www.davidblackcn.cc/avatar/davidblack-round.png'; // 替换为你的默认头像
};
</script>

<style scoped>
.about-me-friends {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 头部样式 */
.friends-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.about-me-card-title-normal {
  font-size: 1.2rem;
  line-height: 0.4;
}

.subtitle {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.3s ease;
  width: fit-content;
}

/* 按钮样式优化 */
.all-friends-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background-color: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 14px;
  font-size: 1.4rem;
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
  text-decoration: none;
}

.all-friends-button:hover {
  background-color: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

/* 网格布局优化 */
.friends-grid {
  display: grid;
  /* 自动填充网格，最小宽度 70px */
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 16px;
}

.friend-card {
  text-decoration: none;
  position: relative;
}

.avatar-wrapper {
  aspect-ratio: 1 / 1; /* 强制正方形 */
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid transparent;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin: 0;
  padding: 0;
}

/* 悬浮效果 */
.friend-card:hover .avatar-wrapper {
  transform: translateY(-4px) scale(1.05);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.friend-card:hover img {
  transform: scale(1.1);
}

/* 悬浮时显示名字的微型遮罩（可选） */
.avatar-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.friend-card:hover .avatar-overlay {
  opacity: 1;
}

.friend-name {
  color: white;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .friends-grid {
    grid-template-columns: repeat(4, 1fr); /* 移动端固定 4 列 */
    gap: 12px;
  }
}
</style>