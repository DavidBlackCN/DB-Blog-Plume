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
              <p class="about-me-card-text-big about-me-card-text-color">——《售梦者》</p>
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
      <div class="card-content grid-row-2-3">
        <AboutMeProject />
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
  }
  
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
import { ref, onMounted, onUnmounted } from 'vue'
import AboutMeName from "./AboutMeName.vue";
import AboutMeText from "./AboutMeText.vue";
import AboutMeSkill from "./AboutMeSkill.vue";
import AboutMeCharacter from "./AboutMeCharacter.vue";
import AboutMeFriendLink from "./AboutMeFriendLink.vue";
import AboutMeProject from './AboutMeProject.vue';
import DockBar from './DockBar.vue'; // 引入 Dock 组件

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

// --- Canvas 逻辑保持不变 ---
interface Comet {
  direction: 'horizontal' | 'vertical'
  position: number
  progress: number
  speed: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const linesGap = ref(80)
const comets = ref<Comet[]>([])
const mouseX = ref(-1)
const mouseY = ref(-1)
const touchActive = ref(false)
let animationFrameId: number
let cometIntervalId: number

const updateLinesGap = () => {
  linesGap.value = window.innerWidth < 768 ? 100 : 80
}

const handlePointerMove = (x: number, y: number) => {
  mouseX.value = x
  mouseY.value = y
  touchActive.value = true
}

const handleMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY)
const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
}

onMounted(() => {
  initCanvas()
  animate()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove)
  updateLinesGap()
  cometIntervalId = setInterval(createComet, window.innerWidth < 768 ? 1200 : 600)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
  clearInterval(cometIntervalId)
  cancelAnimationFrame(animationFrameId)
})

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx.value = canvas.getContext('2d')
  resizeCanvas()
}

const handleResize = () => {
  resizeCanvas()
  updateLinesGap()
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas || !ctx.value) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

const drawGrid = () => {
  const canvas = canvasRef.value
  const context = ctx.value
  if (!canvas || !context) return
  context.clearRect(0, 0, canvas.width, canvas.height)
  const radius = 100
  const useMouseEffect = window.innerWidth >= 768 || touchActive.value

  for (let y = 0; y < canvas.height; y += linesGap.value) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(canvas.width, y)
    let alpha = 0.1
    if (useMouseEffect && mouseX.value >= 0 && mouseY.value >= 0) {
      const dy = Math.abs(y - mouseY.value)
      if (dy < radius) alpha = 0.1 + (1 - dy / radius) * 0.9
    }
    context.strokeStyle = `rgba(80, 134, 161, ${alpha})`
    context.stroke()
  }

  for (let x = 0; x < canvas.width; x += linesGap.value) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, canvas.height)
    let alpha = 0.1
    if (useMouseEffect && mouseX.value >= 0 && mouseY.value >= 0) {
      const dx = Math.abs(x - mouseX.value)
      if (dx < radius) alpha = 0.1 + (1 - dx / radius) * 0.9
    }
    context.strokeStyle = `rgba(80, 134, 161, ${alpha})`
    context.stroke()
  }
}

const createComet = () => {
  if (window.innerWidth < 768 && comets.value.length > 3) return
  const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical'
  const maxPosition = direction === 'horizontal'
    ? Math.floor(window.innerHeight / linesGap.value)
    : Math.floor(window.innerWidth / linesGap.value)
  const position = Math.floor(Math.random() * maxPosition) * linesGap.value
  comets.value.push({
    direction, position, progress: 0,
    speed: Math.random() * 0.005 + 0.002,
  })
}

const drawComet = (comet: Comet) => {
  const context = ctx.value
  const canvas = canvasRef.value
  if (!context || !canvas) return
  const length = 80
  const { direction, position, progress } = comet
  const isH = direction === 'horizontal'
  const x = isH ? progress * canvas.width : position
  const y = isH ? position : progress * canvas.height
  const gradient = isH 
    ? context.createLinearGradient(x - length, y, x, y)
    : context.createLinearGradient(x, y - length, x, y)
  gradient.addColorStop(0, 'rgba(80, 134, 161, 0)')
  gradient.addColorStop(1, '#4483a2')
  context.strokeStyle = gradient
  context.beginPath()
  isH ? context.moveTo(x - length, y) : context.moveTo(x, y - length)
  context.lineTo(x, y)
  context.stroke()
}

const animate = () => {
  drawGrid()
  comets.value = comets.value.filter(comet => {
    comet.progress += comet.speed
    drawComet(comet)
    return comet.progress < 1.2
  })
  animationFrameId = requestAnimationFrame(animate)
}
</script>
