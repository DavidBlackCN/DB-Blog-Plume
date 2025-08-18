<!-- 加了一点动画 -->
<!-- 点击页面其他区域也能关闭面板 -->
<template>
  <div class="color-picker" ref="colorPicker">
    <button class="toggle-button" @click.stop="togglePanel">主题颜色</button>
    
    <transition name="panel">
      <div 
        v-if="showPanel" 
        class="control-panel"
        ref="panel"
      >
        <div class="slider-container">
          <input 
            type="range" 
            min="0" 
            max="360" 
            v-model="hue" 
            @input="updateTheme"
            class="slider"
          >
        </div>
        
        <div class="color-preview" :style="{ backgroundColor: `hsl(${hue}, 50%, 50%)` }"></div>

        <div class="actions">
          <button class="reset-button" @click="resetTheme">
            <span class="icon">↺</span> 重置默认
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPanel: false,
      hue: 200, // 默认蓝色
      defaulthue: 200,
    }
  },
  mounted() {
    // 从本地存储加载保存的颜色
    const savedHue = localStorage.getItem('themeHue')
    if (savedHue) {
      this.hue = parseInt(savedHue)
      this.updateTheme()
    }
    
    // 添加全局点击监听
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    // 移除全局点击监听
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    togglePanel() {
      this.showPanel = !this.showPanel
    },
    updateTheme() {
      // 更新 CSS 变量
      document.documentElement.style.setProperty('--theme-hue', `${this.hue}deg`)
      
      // 保存到本地存储
      localStorage.setItem('themeHue', this.hue)
    },
    resetTheme() {
      // 重置为默认值
      this.hue = this.defaulthue
      
      // 更新主题
      this.updateTheme()
    },
    handleClickOutside(event) {
      // 如果面板已显示，且点击的不是面板/按钮区域
      if (this.showPanel && 
          !this.$refs.colorPicker.contains(event.target)) {
        this.showPanel = false
      }
    }
  }
}
</script>

<style scoped>
  .toggle-button {
    padding: 8px 16px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: transparent;
    color: var(--vp-button-brand-text);
    border: 1px solid var(--vp-button-brand-border);
    border-radius: 4px;
  }

  .toggle-button:hover {
    background-color: transparent;
    transform: scale(1.05);
  }

  .control-panel {
    margin-top: 10px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 250px;
    position: fixed;
    bottom: 10%;
    right: 10%;
    background-color: var(--vp-code-block-bg);
    display: flex;
    flex-direction: column;
    z-index: 100;
  }

  .slider-container {
    margin-bottom: 15px;
    color: var(--vp-c-text-1);
  }

  .slider {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .slider:hover {
    transform: scale(1.02);
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--vp-c-divider);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .color-preview {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin: 10px auto;
    border: 1px solid var(--vp-c-divider);
    transition: all 0.3s ease;
  }

  .reset-button {
    padding: 8px 16px;
    margin-top: 10px;
    background-color: var(--vp-button-alt-bg);
    color: var(--vp-button-alt-text);
    border: 1px solid var(--vp-button-alt-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-weight: 500;
  }

  .reset-button:hover {
    background-color: var(--vp-button-alt-hover-bg);
    transform: scale(1.05);
  }

  .reset-button .icon {
    transition: transform 0.5s ease;
  }

  .reset-button:hover .icon {
    transform: rotate(360deg);
  }

  /* 面板动画 */
  .panel-enter-active,
  .panel-leave-active {
    transition: all 0.3s ease;
  }

  .panel-enter-from,
  .panel-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>