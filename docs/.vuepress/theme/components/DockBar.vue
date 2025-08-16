<!-- DeepSeek生成后人工精修 -->
<!-- 已修复浅色模式显示问题 -->
<template>
  <div class="dock-container">
    <div class="dock">
      <a 
        v-for="item in items" 
        :key="item.id" 
        :href="item.link" 
        target="_blank" 
        class="dock-item"
        @click.prevent="handleClick(item)"
      >
        <div class="icon-container" :class="item.bgClass">
          <Icon :icon="item.icon" class="custom-icon" />
        </div>
        <span class="app-name">{{ item.name }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'DockBar',
  components: {
    Icon
  },
  props: {
    items: {
      type: Array,
      required: true,
      /* --- 此处添加Dock内容 --- */
      default: () => [
        {
          id: 1,
          name: "GitHub",
          icon: "mdi:github",
          link: "https://github.com",
        },    
        {
          id: 2,
          name: "Bilibili",
          icon: "ri:bilibili-fill",
          link: "https://www.bilibili.com",
        },
        {
          id: 3,
          name: "Email",
          icon: "mdi:email-edit-outline",
          link: "mailto:davidblackcn@outlook.com",
        },
        {
          id: 4,
          name: "Discord",
          icon: "meteor-icons:discord",
          link: "https://discord.com/",
        },
        {
          id: 5,
          name: "Kook",
          icon: "ic:baseline-discord",
          link: "https://discord.com/",
        },        
        {
          id: 6,
          name: "DeepSeek",
          icon: "hugeicons:deepseek",
          link: "https://chat.deepseek.com/",
        },
        {
          id: 7,
          name: "Theme-Plume",
          icon: "ph:feather",
          link: "https://theme-plume.vuejs.press/",
        }
      ]
    }
  },
  methods: {
    handleClick(item) {
      if (item.link) {
        window.open(item.link, '_blank');
      }
      this.$emit('item-click', item);
    }
  }
}
</script>

<style scoped>
/* 使用VuePress主题变量 */
.dock-container {
  position: relative;
  bottom: 1080px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: var(--z-index-dock, 100);
  transition: all 0.3s ease;
}

.dock {
  display: flex;
  padding: 10px 20px;
  background: var(--dock-bg, rgba(var(--c-bg-soft-rgb), 0.85));
  backdrop-filter: blur(12px);
  border-radius: 30px;
  border: 2px solid var(--vp-c-divider);
  box-shadow: 0 5px 15px var(--vp-c-shadow);
  transition: all 0.3s ease;
}

.dock:hover {
  background: var(--dock-hover-bg, rgba(var(--c-bg-soft-rgb), 0.95));
  transform: translateY(-5px);
  box-shadow: 
    0 15px 40px var(--dock-hover-shadow, rgba(0, 0, 0, 0.4)),
    inset 0 1px 0 var(--dock-hover-highlight, rgba(255, 255, 255, 0.15));
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  text-decoration: none;
}

.icon-container {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  /* 修复：使用主题背景色确保对比度 */
  background: var(--c-bg-soft);
  box-shadow: 
    0 5px 15px var(--icon-shadow, rgba(0, 0, 0, 0.2)),
    inset 0 0 0 1px var(--vp-c-divider);
}

.icon-container:hover {
  transform: translateY(-15px) scale(1.2);
  /* 悬停时增加对比度 */
  box-shadow: 
    0 8px 20px var(--icon-hover-shadow, rgba(0, 0, 0, 0.3)),
    inset 0 0 0 1px var(--vp-c-divider);
}

.icon-container:hover ~ .app-name {
  opacity: 1;
  transform: translateY(0);
}

.custom-icon {
  width: 30px;
  height: 30px;
  /* 修复：使用主题文本颜色确保对比度 */
  color: var(--c-text);
  transition: color 0.3s ease;
}

.app-name {
  position: absolute;
  bottom: -35px;
  /* 修复：使用主题背景色确保可读性 */
  background: var(--c-bg-soft);
  color: var(--c-text);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1;
  white-space: nowrap;
  pointer-events: none;
  /* 增加边框提升可读性 */
  box-shadow: 
    0 2px 8px var(--app-name-shadow, rgba(0, 0, 0, 0.1)),
    0 0 0 1px var(--vp-c-divider);
}

/* 响应式设计 */
@media (max-width: 900px) {
  .dock {
    padding: 12px 15px;
    border-radius: 20px;
  }
  
  .icon-container {
    width: 55px;
    height: 55px;
    margin: 0 8px;
  }
}

@media (max-width: 768px) {
  .dock-container {
    display: none; /* 在手机端隐藏整个dock栏 */
  }
}

@media (max-width: 600px) {
  .dock {
    flex-wrap: wrap;
    max-width: 320px;
    padding: 15px;
  }
  
  .dock-item {
    margin: 8px;
  }
}
</style>