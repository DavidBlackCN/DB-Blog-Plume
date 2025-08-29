<template>
  <div class="color-picker" ref="colorPicker">
    <button class="toggle-button" @click.stop="togglePanel">
      <i class="icon-palette"></i> 主题颜色
    </button>
    
    <transition name="panel">
      <div 
        v-if="showPanel" 
        class="control-panel"
        ref="panel"
      >
        <div class="slider-container">
          <div class="slider-label">
            <span>色调选择</span>
            <span>{{ hue }}°</span>
          </div>
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
    
    // 隐藏社交链接图标
    this.hideSocialIcons()
    
    // 初始设置按钮样式
    this.updateButtonAppearance()
    
    // 监听主题变化
    this.observeThemeChange()
  },
  beforeUnmount() {
    // 移除全局点击监听
    document.removeEventListener('click', this.handleClickOutside)
    
    // 移除主题变化监听
    if (this.themeObserver) {
      this.themeObserver.disconnect()
    }
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
    },
    hideSocialIcons() {
      // 隐藏社交链接图标
      setTimeout(() => {
        const socialLinks = document.querySelectorAll('.social-links a, .social-links button')
        if (socialLinks.length > 0) {
          socialLinks[0].style.display = 'none'
        }
      }, 100)
    },
    updateButtonAppearance() {
      // 检测当前是否深色模式
      const isDark = document.documentElement.classList.contains('dark')
      
      // 根据模式更新按钮样式
      const button = this.$el.querySelector('.toggle-button')
      if (button) {
        if (isDark) {
          button.style.setProperty('color', 'var(--vp-c-text-2)')
          button.style.setProperty('border-color', 'var(--vp-c-text-2)')
        } else {
          button.style.setProperty('color', 'var(--vp-c-text-1)')
          button.style.setProperty('border-color', 'var(--vp-c-text-1)')
        }
      }
    },
    observeThemeChange() {
      // 监听主题变化
      this.themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            this.updateButtonAppearance()
          }
        })
      })
      
      // 观察html元素的class变化
      this.themeObserver.observe(document.documentElement, { 
        attributes: true 
      })
    }
  }
}
</script>

<style scoped>
  .color-picker {
    position: relative;
    display: inline-block;
    margin-left: 15px;
  }

  .toggle-button {
    padding: 8px 16px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    color: var(--vp-c-text-1);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toggle-button:hover {
    transform: scale(1.05);
  }

  .icon-palette {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: linear-gradient(45deg, #FF5252, #FF4081, #E040FB, #7C4DFF, #536DFE, #448AFF, #40C4FF, #18FFFF, #64FFDA, #69F0AE, #B2FF59, #EEFF41, #FFFF00, #FFEB3B, #FFC107, #FF9800, #FF5722);
    border-radius: 2px;
  }

  .control-panel {
    margin-top: 10px;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    width: 280px;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--vp-code-block-bg);
    display: flex;
    flex-direction: column;
    z-index: 100;
  }

  .slider-container {
    margin-bottom: 20px;
    color: var(--vp-c-text-1);
  }

  .slider-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .slider {
    width: 100%;
    height: 10px;
    border-radius: 5px;
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
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--vp-c-divider);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .color-preview {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    margin: 15px auto;
    border: 2px solid var(--vp-c-divider);
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .reset-button {
    padding: 10px 16px;
    margin-top: 15px;
    background-color: var(--vp-button-alt-bg);
    color: var(--vp-button-alt-text);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  .reset-button:hover {
    background-color: var(--vp-button-alt-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
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

  /* 响应式设计 */
  @media (max-width: 768px) {
    .control-panel {
      width: 260px;
      right: -20px;
    }
  }
</style>