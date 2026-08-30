<template>
  <div class="about-me-card-bg vp-blog-post-item about-me-character">
    <!-- 标题 -->
    <div class="header">
      <p class="about-me-card-title-normal">𝓟𝓮𝓻𝓼𝓸𝓷𝓪𝓵𝓲𝓽𝔂</p>
    </div>

    <div class="about-me-character-content">
      <!-- 左侧文字区 -->
      <div class="character-info">
        <div class="about-me-card-text-color type-badge">{{ character.role }}</div>
        <h3 class="about-me-card-text-color type-code">{{ character.code }}</h3>
        
        <a :href="character.link" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="intro-link">
          <span>查看介绍</span>
          <icon name="material-symbols:arrow-right-alt-rounded" class="arrow-icon" />
        </a>
      </div>

      <!-- 右侧形象区 -->
      <div class="character-visual">
        <div class="image-container">
          <img :src="character.imageUrl" :alt="character.code" class="avatar">
          <!-- 装饰性光晕 -->
          <div class="glow-effect"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const character = {
  role: '提倡者',
  code: 'INFJ-T',
  link: 'https://www.16personalities.com/ch/infj-%E4%BA%BA%E6%A0%BC',
  imageUrl: 'https://www.16personalities.com/static/images/personality-types/avatars/email/large/INFJ_male.png?v=1'
};
</script>

<style scoped>
.about-me-character {
  padding: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.about-me-card-title-normal {
  font-size: 1.2rem;
  line-height: 0.4;
  margin-bottom: 8px;
}

.about-me-character-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

/* 左侧信息样式 */
.character-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}

.type-badge {
  font-size: 2.5rem;
  line-height: 1.5;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: 1px;
}

.type-code {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--vp-c-brand-1), #8e44ad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.intro-link {
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

.intro-link:hover {
  color: var(--vp-c-brand-1);
  transform: translateX(5px);
}

.arrow-icon {
  font-size: 1.2rem;
}

/* 右侧视觉样式 */
.character-visual {
  position: relative;
  width: 240px; 
  height: 240px; 
  /* 使用负边距让图片更靠右靠下，减少对文字空间的挤压 */
  margin-right: -15px;
  margin-bottom: -24px; 
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.avatar {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: bottom right;
  z-index: 2;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
}

/* 悬浮时小人放大并稍微跳动 */
.about-me-character:hover .avatar {
  transform: scale(1.15) translateY(-5px);
}

/* 背景光晕效果 */
.glow-effect {
  position: absolute;
  bottom: 10%;
  right: 0%;
  width: 80px;
  height: 80px;
  background: var(--vp-c-brand-1);
  filter: blur(40px);
  opacity: 0.1;
  border-radius: 50%;
  transition: opacity 0.5s;
}

.about-me-character:hover .glow-effect {
  opacity: 0.25;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .type-code {
    font-size: 1.8rem;
  }
  .character-visual {
    width: 100px;
  }
}
</style>