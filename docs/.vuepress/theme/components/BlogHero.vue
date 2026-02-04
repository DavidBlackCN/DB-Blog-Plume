<template>
  <div class="blog-home-wrapper">
    <!-- 背景层 -->
    <div class="pixel-bg-container">
      <canvas ref="pixelCanvas" class="pixel-canvas"></canvas>
    </div>

    <!-- 主体内容层 -->
    <div class="home-content">
      <div class="home-layout">
        <!-- 左侧：头像 -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img src="/avatar/davidblack-round.png" alt="Avatar" class="avatar-img" />
            <div class="emoji-badge">🥳</div>
          </div>
        </div>

        <!-- 右侧：信息区 -->
        <div class="info-section">
          <!-- 模拟终端窗口 -->
          <div class="terminal-window">
            <div class="terminal-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="terminal-body">
              <div class="command-line">
                <span class="user-prefix">user@davidblackcn</span>
                <span class="path-prefix">:~$</span>
                <span class="typing-text">{{ displayedCommand }}</span>
              </div>
              <div class="response-line" v-if="showResponse">
                <h1 class="main-name">
                  <span class="arrow">&gt;</span>
                  {{ displayedName }}<span class="blink-cursor" v-if="nameFinished">_</span>
                </h1>
              </div>
            </div>
          </div>

          <!-- 简介 -->
          <div class="description-quote">
            有些事你不要太当真。——《售梦者》
          </div>

          <!-- 新增：技术栈传送带卡片 -->
          <div class="tech-stack-card">
            <div class="tech-stack-header">
              <Icon icon="ph:stack-bold" class="stack-icon" />
              <span>技术栈</span>
            </div>
            <div class="tech-carousel">
              <div class="tech-track">
                <!-- 渲染两遍以实现无缝滚动 -->
                <div v-for="n in 2" :key="n" class="tech-group">
                  <div v-for="tech in techStack" :key="tech.name" class="tech-item" :title="tech.name">
                    <Icon :icon="tech.icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 社交链接 -->
          <div class="social-links">
            <a href="/more/index" class="social-box About Me">
              <Icon icon="mdi:account-circle" />
            </a>
            <a href="https://github.com/DavidBlackCN" target="_blank" class="social-box Github">
              <Icon icon="ri:github-fill" />
            </a>
            <a href="https://space.bilibili.com/453841968" target="_blank" class="social-box Bilibili">
              <Icon icon="ri:bilibili-fill" />
            </a>
            <a href="mailto:davidblackcn@outlook.com" class="social-box Email">
              <Icon icon="ri:mail-send-fill" />
            </a>
            <a href="https://qm.qq.com/q/FWDv0T5OYG" class="social-box QQ">
              <Icon icon="ri:qq-fill" />
            </a>
            <a href="https://theme-plume.vuejs.press/" class="social-box Theme-Plume">
              <Icon icon="ph:feather" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 优化：一言放在页面底部居中 -->
    <div class="hitokoto-footer">
      <p class="hitokoto-text">{{ hitokoto }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const hitokoto = ref('加载一言中...')
const pixelCanvas = ref(null)

// 技术栈数据
const techStack = [
  { name: 'Vue', icon: 'logos:vue' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Vite', icon: 'logos:vitejs' },
  { name: 'Node.js', icon: 'logos:nodejs-icon' },
  { name: 'Git', icon: 'logos:git-icon' },
  { name: 'Python', icon: 'logos:python' },
  { name: 'C++', icon: 'logos:c-plusplus' },
  { name: 'Java', icon: 'logos:java' },
  { name: 'Docker', icon: 'logos:docker-icon' },
  { name: 'MySQL', icon: 'logos:mysql' },
  { name: 'VSCode', icon: 'logos:visual-studio-code' },
  { name: 'Linux', icon: 'logos:linux-tux' },
  { name: 'Markdown', icon: 'logos:markdown' },
  { name: 'IJ', icon: 'logos:intellij-idea' },
  { name: 'GitHub', icon: 'logos:github-icon' },
  { name: 'PyCharm', icon: 'logos:pycharm' },
]

// --- 动画逻辑控制 ---
const fullCommand = 'whoami'
const fullResponseName = 'DavidBlackCN'
const displayedCommand = ref('')
const displayedName = ref('')
const showResponse = ref(false)
const nameFinished = ref(false)

const startTyping = () => {
  let i = 0
  const commandTimer = setInterval(() => {
    displayedCommand.value += fullCommand[i]
    i++
    if (i === fullCommand.length) {
      clearInterval(commandTimer)
      setTimeout(() => {
        showResponse.value = true
        startTypingName()
      }, 500)
    }
  }, 120)
}

const startTypingName = () => {
  let j = 0
  const nameTimer = setInterval(() => {
    displayedName.value += fullResponseName[j]
    j++
    if (j === fullResponseName.length) {
      clearInterval(nameTimer)
      nameFinished.value = true
    }
  }, 150)
}

const fetchHitokoto = async () => {
  try {
    const res = await fetch('https://v1.hitokoto.cn/?c=d&c=i')
    const data = await res.json()
    hitokoto.value = `${data.hitokoto} —— ${data.from}`
  } catch (e) {
    hitokoto.value = '保持热爱，奔赴山海。'
  }
}

let animationFrame
const mouse = { x: null, y: null, radius: 150 }
const handleMouseMove = (e) => { mouse.x = e.x; mouse.y = e.y }

const initPixelBackground = () => {
  const canvas = pixelCanvas.value
  const ctx = canvas.getContext('2d')
  let particles = []
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  class Particle {
    constructor() { this.reset() }
    reset() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 3 + 1 
      this.vx = (Math.random() - 0.5) * 0.5
      this.vy = (Math.random() - 0.5) * 0.5
    }
    update() {
      this.x += this.vx; this.y += this.vy
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      if (mouse.x != null) {
        let dx = mouse.x - this.x; let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < mouse.radius) { this.x -= dx * 0.01; this.y -= dy * 0.01 }
      }
    }
    draw() {
      ctx.fillStyle = 'rgba(100, 160, 255, 0.4)'
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill()
    }
  }
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x
        let dy = particles[i].y - particles[j].y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 150) {
          ctx.strokeStyle = `rgba(100, 160, 255, ${0.4 - distance / 150})`
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke()
        }
      }
    }
  }
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => { p.update(); p.draw() })
    drawLines()
    animationFrame = requestAnimationFrame(animate)
  }
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handleMouseMove)
  resize()
  for (let i = 0; i < 80; i++) particles.push(new Particle())
  animate()
}

onMounted(() => {
  fetchHitokoto()
  initPixelBackground()
  startTyping()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', () => {})
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.blog-home-wrapper {
  position: relative;
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  padding: 40px 24px;
  box-sizing: border-box;
  overflow: hidden;
}

.home-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out;
}

.home-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5rem;
  width: 100%;
}

.pixel-bg-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, transparent 0%, var(--vp-c-bg) 100%);
}
.pixel-canvas { opacity: 0.6; }

/* 头像 */
.avatar-wrapper {
  position: relative;
  width: 340px;
  height: 340px;
  flex-shrink: 0;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  object-fit: cover;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  border: 8px solid var(--vp-c-brand-soft);
  animation: morphing 8s infinite alternate ease-in-out;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.avatar-img:hover { transform: scale(1.05) rotate(3deg); }

.emoji-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 4rem;
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
  animation: bounce 2s infinite;
}

/* 终端 */
.terminal-window {
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  margin-bottom: 1.5rem;
  border: 1px solid #333;
  width: fit-content;
  min-width: 450px;
}
.terminal-header { background: #333; padding: 10px 15px; display: flex; align-items: center; gap: 8px; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.terminal-body { padding: 24px; }
.command-line { font-size: 1.1rem; color: #fff; display: flex; align-items: center; min-height: 1.5rem; }
.user-prefix { color: #50fa7b; font-weight: bold; }
.path-prefix { color: #8be9fd; margin: 0 8px; }

.main-name {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 12px 0 0 0;
  color: #fff;
  display: flex;
  align-items: flex-end;
}
.arrow { color: #bd93f9; margin-right: 12px; }
.blink-cursor { color: #fff; animation: blink 1s step-end infinite; }

.description-quote {
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
  border-left: 4px solid var(--vp-c-brand-1);
  padding-left: 1.2rem;
  margin: 1.5rem 0;
  font-style: italic;
}

/* 技术栈卡片优化 */
.tech-stack-card {
  background: var(--vp-c-bg-soft);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  padding: 1.2rem;
  margin-bottom: 2rem;
  max-width: 500px;
}
.tech-stack-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}
.stack-icon { 
  color: var(--vp-c-brand-1); 
  width: 24px; 
  height: 24px;
}
 
/* 传送带动画 */
.tech-carousel {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}
.tech-track {
  display: flex;
  width: max-content;
  animation: scroll 20s linear infinite;
}
.tech-group {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-right: 2rem;
}
.tech-item {
  font-size: 2rem;
  display: flex;
  align-items: center;
  filter: grayscale(0.2) opacity(0.8);
  transition: all 0.3s ease;
}
.tech-item:hover {
  filter: grayscale(0) opacity(1);
  transform: scale(1.2);
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* 社交链接 */
.social-links { display: flex; gap: 1rem; }
.social-box {
  width: 54px; height: 54px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; color: var(--vp-c-text-2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid var(--vp-c-divider);
}
.social-box:hover {
  transform: translateY(-5px) rotate(5deg);
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* 底部一言优化 */
.hitokoto-footer {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  text-align: center;
  width: 80%;
}
.hitokoto-text {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin: 0;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 1px;
}

/* 动画 */
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes morphing {
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%; }
}

@media (max-width: 1024px) {
  .home-layout { flex-direction: column; text-align: center; gap: 2rem; }
  .terminal-window { min-width: unset; width: 100%; max-width: 450px; margin: 0 auto 1.5rem auto; }
  .main-name { justify-content: center; }
  .description-quote { border-left: none; border-top: 3px solid var(--vp-c-brand-1); padding: 1rem 0; }
  .avatar-wrapper { width: 240px; height: 240px; }
  .social-links { justify-content: center; }
  .tech-stack-card { margin: 0 auto 2rem auto; }
}
</style>
