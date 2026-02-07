<template>
  <div class="about-me-card-bg vp-blog-post-item about-me-abilities">
    <!-- 标题区域 -->
    <div class="header-section">
      <p class="title-cursive">𝓐𝓫𝓲𝓵𝓲𝓽𝓲𝓮𝓼</p>
      <p class="about-me-card-text-big about-me-card-text-color">会的一点点</p>
    </div>

    <!-- 跑马灯展示区 -->
    <div class="marquee-container">
      <div 
        v-for="(row, rowIndex) in marqueeRows" 
        :key="rowIndex"
        :class="['marquee-row', rowIndex === 0 ? 'first-row' : 'second-row']"
      >
        <div class="marquee-content">
          <!-- 复制一份以实现无缝滚动 -->
          <span v-for="(item, index) in [...row, ...row]" :key="index" class="icon-wrapper">
            <icon :name="item.icon" />
          </span>
        </div>
      </div>
    </div>

    <!-- 悬浮详情层 -->
    <div class="abilities-detail-overlay">
      <div class="detail-tag" v-for="(item, index) in allAbilities" :key="index">
        <icon :name="item.icon" />
        <span class="tag-text">{{ item.type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const technology = [
  { type: 'Vue', icon: 'logos:vue' },
  { type: 'Vite', icon: 'logos:vitejs' },
  { type: 'JavaScript', icon: 'vscode-icons:file-type-js' },
  { type: 'TypeScript', icon: 'vscode-icons:file-type-typescriptdef' },
  { type: 'CSS3', icon: 'logos:css-3' },
  { type: 'HTML5', icon: 'logos:html-5' },
  { type: 'Spring', icon: 'devicon:spring' },
  { type: 'MySQL', icon: 'devicon:mysql' },
  { type: 'Rust', icon: 'logos:rust' },
  { type: 'Java', icon: 'logos:java' },
  { type: 'C++', icon: 'logos:c-plusplus' },
  { type: 'Python', icon: 'logos:python' },
  { type: 'Golang', icon: 'logos:go' },
];

const tools = [
  { type: 'WebStorm', icon: 'devicon:webstorm' },
  { type: 'VSCode', icon: 'vscode-icons:file-type-vscode' },
  { type: 'Android Studio', icon: 'devicon:androidstudio' },
  { type: 'pnpm', icon: 'vscode-icons:file-type-light-pnpm' },
  { type: 'npm', icon: 'logos:npm' },
  { type: 'IDEA', icon: 'logos:intellij-idea' },
  { type: 'Netlify', icon: 'devicon:netlify' },
];

// 计算属性：组合数据，减少模板逻辑
const marqueeRows = [technology, tools];
const allAbilities = computed(() => [...technology.slice(1), ...tools]); // 排除第一条幽默文案
</script>

<style scoped>
/* 变量定义，方便统一修改 */
.about-me-abilities {
  --row-rotation: -6deg;
  --anim-speed-normal: 30s;
  --anim-speed-slow: 50s;
  --transition-main: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  position: relative;
  min-height: 320px;
  padding: 20px 0;
  overflow: hidden; /* 防止倾斜导致的溢出 */
  z-index: 1;
}

.header-section {
  margin-left: 24px;
  margin-bottom: 10px;
}

.title-cursive {
  font-size: 1.2rem;
  line-height: 0.4;
  margin-bottom: 8px;
}

/* 跑马灯容器 */
.marquee-container {
  transition: var(--transition-main);
  transform: rotateZ(var(--row-rotation));
  width: 120%; /* 增加宽度以覆盖旋转后的边缘 */
  margin-left: -10%;
}

.marquee-row {
  display: flex;
  overflow: hidden;
  white-space: nowrap;
  margin: 15px 0;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-content {
  display: flex;
  gap: 20px;
  padding-right: 20px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--about-me-abilities-item-bg, rgba(125, 125, 125, 0.1));
  width: 70px;
  height: 70px;
  border-radius: 16px;
  font-size: 40px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

/* 动画方向 */
.first-row .marquee-content {
  animation: scroll-left var(--anim-speed-normal) linear infinite;
}

.second-row .marquee-content {
  animation: scroll-right var(--anim-speed-slow) linear infinite;
}

/* 详情层优化 */
.abilities-detail-overlay {
  position: absolute;
  inset: 0;
  padding: 60px 20px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  align-content: center;
  opacity: 0;
  pointer-events: none;
  transition: var(--transition-main);
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(4px); /* 增加模糊效果 */
}

.detail-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 10px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* 交互状态 */
.about-me-abilities:hover .marquee-container {
  opacity: 0.1;
  filter: blur(2px);
  transform: rotateZ(var(--row-rotation)) scale(0.95);
}

.about-me-abilities:hover .abilities-detail-overlay {
  opacity: 1;
  pointer-events: auto;
}

/* 动画定义 */
@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes scroll-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

/* 移动端适配 */
@media (max-width: 640px) {
  .about-me-abilities {
    min-height: 400px;
  }
  .icon-wrapper {
    width: 50px;
    height: 50px;
    font-size: 30px;
  }
}
</style>