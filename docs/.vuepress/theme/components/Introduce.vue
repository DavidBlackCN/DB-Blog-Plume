<template>
  <div class="spacer"></div>
  <div class="container">
    <canvas ref="canvasRef"></canvas>
    <div class="about-me">
      <!-- 桌面布局保持不变 -->
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
      
      <div class="card-content grid-row-3-2">
        <AboutMeSkill />
        <AboutMeCharacter />
      </div>
      
      <div class="card-content grid-row-2-3">
        <AboutMeProject />
        <AboutMeFriendLink />
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  height: 60px; /* 移动端较小的顶部间距 */
  background-color: transparent;
}

.container {
  position: relative;
  top: 20px; /* 移动端较小的偏移 */
  z-index: 1;
  width: 100%;
  height: auto; /* 移动端自适应高度 */
  overflow-x: visible;
  padding-bottom: 40px; /* 添加底部内边距 */
}

canvas {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
}

.about-me {
  max-width: 1380px;
  margin: 0 auto;
  width: 95%; /* 移动端增加边距 */
  padding: 0 10px; /* 添加内边距 */
}

.card-content {
  margin-top: 15px;
  display: flex; /* 移动端默认使用flex单列布局 */
  flex-direction: column;
  gap: 15px;
}

/* 桌面布局 - 保持原有的网格结构 */
@media screen and (min-width: 1024px) {
  .spacer {
    height: 100px; /* 桌面端恢复原始高度 */
  }
  
  .container {
    top: 125px; /* 桌面端恢复原始位置 */
    height: 950px; /* 桌面端固定高度 */
  }
  
  .about-me {
    width: 100%; /* 桌面端恢复宽度 */
    padding: 0; /* 移除内边距 */
  }
  
  .card-content {
    display: grid;
    margin-top: 20px;
    gap: 20px;
  }
  
  .grid-row-3-2 {
    grid-template-columns: 3fr 2fr;
  }
  
  .grid-row-2-3 {
    grid-template-columns: 2fr 3fr;
  }
}

/* 平板布局 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  /* 平板端保持两列布局 */
  .grid-row-3-2,
  .grid-row-2-3 {
    grid-template-columns: 1fr 1fr;
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

interface Comet {
  direction: 'horizontal' | 'vertical'
  position: number
  progress: number
  speed: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const linesGap = ref(80) // 响应式变量
const comets = ref<Comet[]>([])
const mouseX = ref(-1)
const mouseY = ref(-1)
const touchActive = ref(false)
let animationFrameId: number
let cometIntervalId: number

// 响应式调整网格密度
const updateLinesGap = () => {
  linesGap.value = window.innerWidth < 768 ? 100 : 80
}

// 统一的指针处理
const handlePointerMove = (x: number, y: number) => {
  mouseX.value = x
  mouseY.value = y
  touchActive.value = true
  
  // 移动端触摸后3秒内保持激活状态
  if (window.innerWidth < 768) {
    clearTimeout((window as any).touchTimeout)
    ;(window as any).touchTimeout = setTimeout(() => {
      touchActive.value = false
    }, 3000)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  handlePointerMove(e.clientX, e.clientY)
}

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
    e.preventDefault() // 防止页面滚动
  }
}

onMounted(() => {
  initCanvas()
  animate()
  
  // 根据设备类型添加事件监听
  if ('ontouchstart' in window) {
    window.addEventListener('touchmove', handleTouchMove)
  } else {
    window.addEventListener('mousemove', handleMouseMove)
  }
  
  // 初始化彗星效果
  updateLinesGap()
  cometIntervalId = setInterval(createComet, window.innerWidth < 768 ? 1200 : 600)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  
  if ('ontouchstart' in window) {
    window.removeEventListener('touchmove', handleTouchMove)
  } else {
    window.removeEventListener('mousemove', handleMouseMove)
  }
  
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
  context.lineWidth = 1

  // 移动端优化：只在触摸激活时显示高亮
  const radius = 100
  const useMouseEffect = window.innerWidth >= 768 || touchActive.value

  // 水平线
  for (let y = 0; y < canvas.height; y += linesGap.value) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(canvas.width, y)

    let alpha = 0.1
    if (useMouseEffect && mouseX.value >= 0 && mouseY.value >= 0) {
      const dy = Math.abs(y - mouseY.value)
      if (dy < radius) {
        alpha = 0.1 + (1 - dy / radius) * 0.9
      }
    }
    context.strokeStyle = `rgba(80, 134, 161, ${alpha})`
    context.stroke()
  }

  // 垂直线
  for (let x = 0; x < canvas.width; x += linesGap.value) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, canvas.height)

    let alpha = 0.1
    if (useMouseEffect && mouseX.value >= 0 && mouseY.value >= 0) {
      const dx = Math.abs(x - mouseX.value)
      if (dx < radius) {
        alpha = 0.1 + (1 - dx / radius) * 0.9
      }
    }
    context.strokeStyle = `rgba(80, 134, 161, ${alpha})`
    context.stroke()
  }
}

const createComet = () => {
  // 移动端减少彗星数量
  if (window.innerWidth < 768 && comets.value.length > 3) return
  
  const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical'
  const maxPosition = direction === 'horizontal'
    ? Math.floor(window.innerHeight / linesGap.value)
    : Math.floor(window.innerWidth / linesGap.value)

  const position = Math.floor(Math.random() * maxPosition) * linesGap.value

  comets.value.push({
    direction,
    position,
    progress: 0,
    speed: Math.random() * 0.005 + 0.002,
  })
}

const drawComet = (comet: Comet) => {
  const context = ctx.value
  const canvas = canvasRef.value
  if (!context || !canvas) return

  const length = 80
  const { direction, position, progress } = comet

  if (direction === 'horizontal') {
    const x = progress * canvas.width
    const y = position

    const gradient = context.createLinearGradient(x - length, y, x, y)
    gradient.addColorStop(0, 'rgba(80, 134, 161, 0)')
    gradient.addColorStop(0.4, 'rgba(80,134,161,0.3)')
    gradient.addColorStop(1, '#4483a2')

    context.strokeStyle = gradient
    context.beginPath()
    context.moveTo(x - length, y)
    context.lineTo(x, y)
    context.stroke()
  } else {
    const x = position
    const y = progress * canvas.height

    const gradient = context.createLinearGradient(x, y - length, x, y)
    gradient.addColorStop(0, 'rgba(80, 134, 161, 0)')
    gradient.addColorStop(0.4, 'rgba(80,134,161,0.3)')
    gradient.addColorStop(1, '#4483a2')

    context.strokeStyle = gradient
    context.beginPath()
    context.moveTo(x, y - length)
    context.lineTo(x, y)
    context.stroke()
  }
}

const animate = () => {
  const canvas = canvasRef.value
  const context = ctx.value
  if (!canvas || !context) return

  context.clearRect(0, 0, canvas.width, canvas.height)
  drawGrid()

  comets.value = comets.value.filter(comet => {
    comet.progress += comet.speed
    drawComet(comet)
    return comet.progress < 1.2
  })

  // 移动端降低帧率
  const fps = window.innerWidth < 768 ? 30 : 60
  animationFrameId = setTimeout(() => {
    requestAnimationFrame(animate)
  }, 1000 / fps)
}
</script>