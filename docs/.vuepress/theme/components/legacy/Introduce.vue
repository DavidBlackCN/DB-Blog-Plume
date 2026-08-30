<template>
  <div class="container">
    <canvas ref="canvasRef"></canvas>
    
    <div class="about-me">
      <!-- 第一行 -->
      <div class="card-content grid-row-3-2">
        <AboutMeName />
        <AboutMeText>
          <template #motto>
            <slot name="motto">
              <p class="about-me-card-title-normal">𝓟𝓮𝓻𝓼𝓸𝓷𝓪𝓵𝓲𝔃𝓮𝓭 𝓢𝓲𝓰𝓷𝓪𝓽𝓾𝓻𝓮</p>
              <p class="about-me-card-text-big">有些事你不要太当真。</p>
              <p class="about-me-card-text-color">——《售梦者》</p>
            </slot>
          </template>
        </AboutMeText>
      </div>
      
      <!-- 第二行 -->
      <div class="card-content grid-row-3-2">
        <AboutMeSkill />
        <AboutMeCharacter />
      </div>
      
      <!-- 第三行 -->
      <div class="card-content grid-row-1">
        <AboutMeFriendLink />
      </div>

      <!-- 新增：Dock 栏部分 -->
      <div class="dock-section">
        <DockBar :items="dockItems" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: auto; 
  min-height: 100vh;
  /* 增加底部 padding，为 Dock 留出空间，防止被页脚遮挡 */
  padding-bottom: 150px; 
  overflow: visible;
}

canvas {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
}

.about-me {
  max-width: 1380px;
  margin: 0 auto;
  width: 95%;
  padding: 20px 10px;
}

.about-me-card-title-normal {
  font-size: 1.2rem;
  line-height: 0.4;
}

.about-me-card-text-big {
  font-size: 2.5rem;
  line-height: 1.5;
}

.about-me-card-text-color {
  text-align: right;
  line-height: 1.5;
  font-size: 1.5rem;
}

/* Dock 栏专属容器样式 */
.dock-section {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.card-content {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 10px;
  overflow: visible !important; 
}

/* 桌面布局 */
@media screen and (min-width: 1024px) {
  .container {
    padding-bottom: 180px; /* 桌面端 Dock 较大，增加留白 */
  }
  
  .card-content {
    display: grid;
    margin-top: 20px;
    gap: 20px;
    overflow: visible !important;
  }
  
  .grid-row-1 { grid-template-columns: 1fr; align-items: start; }
  .grid-row-3-2 { grid-template-columns: 3fr 2fr; }
  .grid-row-2-3 { grid-template-columns: 2fr 3fr; }
}

/* 移动端处理：DockBar 内部已有 display:none，这里确保间距收缩 */
@media screen and (max-width: 768px) {
  .container {
    padding-bottom: 40px;
  }
  .dock-section {
    display: none; /* 如果 DockBar 内部没隐藏，这里强制隐藏 */
  }
}
</style>

<script setup lang="ts">
import AboutMeName from "./AboutMeName.vue";
import AboutMeText from "./AboutMeText.vue";
import AboutMeSkill from "./AboutMeAbilities.vue";
import AboutMeCharacter from "./AboutMeCharacter.vue";
import AboutMeFriendLink from "./AboutMeFriendLink.vue";
import DockBar from './DockBar.vue'; 

// Dock 栏数据
const dockItems = [
  { id: 1, name: "Sun-Panel", icon: "mingcute:windows-fill", link: "https://nav.davidblackcn.cc/" },
  { id: 2, name: "GitHub", icon: "mdi:github", link: "https://github.com/DavidBlackCN" },    
  { id: 3, name: "Bilibili", icon: "ri:bilibili-fill", link: "https://space.bilibili.com/453841968" },
  { id: 4, name: "Email", icon: "mdi:email-edit-outline", link: "mailto:davidblackcn@outlook.com" },
  { id: 5, name: "Discord", icon: "ic:baseline-discord", link: "https://discord.com/" },
  { id: 6, name: "Kook", icon: "meteor-icons:discord", link: "https://discord.com/" },        
  { id: 7, name: "DeepSeek", icon: "hugeicons:deepseek", link: "https://chat.deepseek.com/" },
  { id: 8, name: "Theme-Plume", icon: "ph:feather", link: "https://theme-plume.vuejs.press/" }
];
</script>
