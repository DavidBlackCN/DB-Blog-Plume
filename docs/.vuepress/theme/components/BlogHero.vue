<template>
  <section class="blog-hero" aria-labelledby="blog-hero-title">
    <div class="ambient-grid" aria-hidden="true"></div>

    <div class="hero-shell">
      <div class="identity-panel">
        <div class="avatar-frame">
          <img
            src="/avatar/davidblack-round.png"
            alt="DavidBlackCN 的头像"
            class="avatar-img"
            width="280"
            height="280"
            fetchpriority="high"
          />
          <span class="avatar-status" aria-label="保持热爱">
            <Icon icon="ph:sparkle-fill" aria-hidden="true" />
          </span>
        </div>

        <div class="identity-note" aria-label="个人定位">
          <span class="status-dot" aria-hidden="true"></span>
          <span>Developer · Blogger</span>
        </div>
      </div>

      <div class="hero-content">
        <div class="terminal-window" aria-label="终端身份信息：user@davidblackcn 执行 whoami，输出 DavidBlackCN">
          <div class="terminal-header" aria-hidden="true">
            <span class="terminal-dot"></span>
            <span class="terminal-dot"></span>
            <span class="terminal-dot"></span>
            <span class="terminal-label">~/profile</span>
          </div>

          <div class="terminal-body">
            <div class="command-line" aria-hidden="true">
              <span class="prompt">user@davidblackcn</span><span class="path">:~$</span>
              <span class="typing-text">{{ displayedCommand }}</span>
            </div>
            <h1
              id="blog-hero-title"
              class="main-name"
              :class="{ 'is-visible': showResponse }"
              aria-label="DavidBlackCN"
            >
              <span aria-hidden="true">
                <span class="command-arrow">›</span>
                {{ displayedName }}
                <span v-if="nameFinished" class="blink-cursor">_</span>
              </span>
            </h1>
          </div>
        </div>

        <div class="motto-strip" aria-label="座右铭">
          <Icon icon="ph:quotes" aria-hidden="true" />
          <p>有些事你不要太当真。</p>
          <span>——《售梦者》</span>
        </div>

        <div class="tech-stack-card">
          <div class="section-heading">
            <Icon icon="ph:stack" aria-hidden="true" />
            <span>技术栈</span>
            <span class="section-count">{{ techStack.length }}</span>
          </div>

          <div
            class="tech-carousel"
            tabindex="0"
            aria-label="技术栈跑马灯，悬停或聚焦时暂停"
          >
            <div class="tech-track">
              <ul class="tech-list">
                <li v-for="tech in techStack" :key="tech.name" class="tech-item">
                  <Icon :icon="tech.icon" aria-hidden="true" />
                  <span>{{ tech.name }}</span>
                </li>
              </ul>
              <ul class="tech-list" aria-hidden="true">
                <li v-for="tech in techStack" :key="`copy-${tech.name}`" class="tech-item">
                  <Icon :icon="tech.icon" aria-hidden="true" />
                  <span>{{ tech.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <nav class="social-links" aria-label="个人链接">
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.href"
            class="social-link"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            :title="link.label"
            :aria-label="link.external ? `${link.label}（在新标签页打开）` : link.label"
          >
            <Icon :icon="link.icon" aria-hidden="true" />
            <span class="sr-only">{{ link.label }}</span>
          </a>
        </nav>
      </div>
    </div>

    <footer class="hitokoto-footer">
      <Icon icon="ph:quotes" aria-hidden="true" />
      <p>{{ hitokoto }}</p>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

const hitokoto = ref('保持热爱，奔赴山海。')
let hitokotoController: AbortController | undefined
const displayedCommand = ref('')
const displayedName = ref('')
const showResponse = ref(false)
const nameFinished = ref(false)
const typingTimers: number[] = []

const fullCommand = 'whoami'
const fullResponseName = 'DavidBlackCN'

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
  { name: 'VS Code', icon: 'logos:visual-studio-code' },
  { name: 'Linux', icon: 'logos:linux-tux' },
  { name: 'Markdown', icon: 'logos:markdown' },
  { name: 'IntelliJ IDEA', icon: 'logos:intellij-idea' },
  { name: 'GitHub', icon: 'logos:github-icon' },
  { name: 'PyCharm', icon: 'logos:pycharm' },
]

const socialLinks = [
  { label: '关于我', href: '/more/index', icon: 'ph:user-circle' },
  { label: 'GitHub', href: 'https://github.com/DavidBlackCN', icon: 'ph:github-logo', external: true },
  { label: '哔哩哔哩', href: 'https://space.bilibili.com/453841968', icon: 'ri:bilibili-line', external: true },
  { label: '邮件', href: 'mailto:davidblackcn@outlook.com', icon: 'ph:paper-plane-tilt' },
  { label: 'QQ', href: 'https://qm.qq.com/q/FWDv0T5OYG', icon: 'ri:qq-line', external: true },
  { label: 'Plume', href: 'https://theme-plume.vuejs.press/', icon: 'ph:feather', external: true },
]

async function fetchHitokoto() {
  hitokotoController = new AbortController()

  try {
    const response = await fetch('https://v1.hitokoto.cn/?c=d&c=i', {
      signal: hitokotoController.signal,
    })

    if (!response.ok) return

    const data = await response.json()
    if (data?.hitokoto && data?.from) {
      hitokoto.value = `${data.hitokoto} —— ${data.from}`
    }
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      hitokoto.value = '保持热爱，奔赴山海。'
    }
  }
}

function scheduleTyping(callback: () => void, delay: number) {
  typingTimers.push(window.setTimeout(callback, delay))
}

function startTyping() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayedCommand.value = fullCommand
    displayedName.value = fullResponseName
    showResponse.value = true
    nameFinished.value = true
    return
  }

  let commandIndex = 0
  const typeCommand = () => {
    displayedCommand.value += fullCommand[commandIndex]
    commandIndex += 1

    if (commandIndex < fullCommand.length) {
      scheduleTyping(typeCommand, 120)
      return
    }

    scheduleTyping(() => {
      showResponse.value = true
      let nameIndex = 0

      const typeName = () => {
        displayedName.value += fullResponseName[nameIndex]
        nameIndex += 1

        if (nameIndex < fullResponseName.length) {
          scheduleTyping(typeName, 150)
        } else {
          nameFinished.value = true
        }
      }

      typeName()
    }, 500)
  }

  scheduleTyping(typeCommand, 220)
}

onMounted(() => {
  fetchHitokoto()
  startTyping()
})

onUnmounted(() => {
  hitokotoController?.abort()
  typingTimers.forEach(window.clearTimeout)
})
</script>

<style scoped>
.blog-hero {
  --hero-surface: color-mix(in srgb, var(--vp-c-bg-elv) 94%, transparent);
  --hero-border: var(--vp-c-divider);
  --terminal-bg: #1e1f22;
  --terminal-header: #17181b;
  --terminal-border: #303238;
  --terminal-text: #f1f1f2;
  --terminal-muted: #a9abb2;
  position: relative;
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: calc(100dvh - var(--vp-nav-height, 64px));
  padding: clamp(48px, 7vw, 88px) clamp(20px, 4vw, 48px) 32px;
  overflow: hidden;
  color: var(--vp-c-text-1);
  background:
    radial-gradient(circle at 16% 38%, var(--vp-c-brand-soft), transparent 30%),
    var(--vp-c-bg);
  box-sizing: border-box;
  isolation: isolate;
}

.blog-hero::before {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 0;
  width: min(58vw, 760px);
  aspect-ratio: 1;
  content: '';
  pointer-events: none;
  background: radial-gradient(circle, var(--vp-c-brand-soft), transparent 67%);
  opacity: 0.55;
  transform: translate(-28%, 18%) scale(0.96);
  animation: ambient-glow 14s var(--motion-ease-in-out) infinite alternate;
}

.ambient-grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.3;
  background-image: radial-gradient(var(--vp-c-brand-3) 0.8px, transparent 0.8px);
  background-size: 24px 24px;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 82%);
  mask-image: linear-gradient(to bottom, #000 0%, transparent 82%);
  transform: translate3d(-16px, -10px, 0) scale(1.04);
  animation: ambient-drift 8s var(--motion-ease-in-out) infinite alternate;
  will-change: transform, opacity;
}

.ambient-grid::after {
  position: absolute;
  inset: -30%;
  content: '';
  background: radial-gradient(circle, var(--vp-c-brand-soft) 0%, transparent 42%);
  opacity: 0.72;
  transform: translate3d(-18%, -8%, 0) scale(0.94);
  animation: ambient-orbit 10s var(--motion-ease-in-out) infinite alternate;
  will-change: transform, opacity;
}

.hero-shell,
.hitokoto-footer {
  position: relative;
  z-index: 1;
}

.hero-shell {
  display: grid;
  grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.45fr);
  align-items: center;
  gap: clamp(48px, 8vw, 104px);
  width: min(1120px, 100%);
  margin: auto;
}

.identity-panel {
  display: grid;
  justify-items: center;
  gap: 20px;
}

.avatar-frame {
  position: relative;
  width: clamp(220px, 25vw, 280px);
  aspect-ratio: 1;
  padding: 8px;
  border: 1px solid var(--hero-border);
  border-radius: 14px;
  background: var(--hero-surface);
  transition:
    transform var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease;
}

.avatar-frame::before,
.avatar-frame::after {
  position: absolute;
  width: 18px;
  height: 18px;
  content: '';
  pointer-events: none;
}

.avatar-frame::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid var(--vp-c-brand-1);
  border-left: 2px solid var(--vp-c-brand-1);
  border-radius: 6px 0 0;
}

.avatar-frame::after {
  right: -1px;
  bottom: -1px;
  border-right: 2px solid var(--vp-c-brand-1);
  border-bottom: 2px solid var(--vp-c-brand-1);
  border-radius: 0 0 6px;
}

.avatar-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
  background: var(--vp-c-bg-soft);
}

.avatar-status {
  position: absolute;
  right: -14px;
  bottom: 22px;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  color: var(--vp-c-brand-hard);
  border: 1px solid var(--vp-c-brand-3);
  border-radius: 10px;
  background: var(--vp-c-bg-elv);
  box-shadow: 0 8px 24px rgb(29 37 42 / 10%);
  transition: transform var(--motion-duration-fast) ease;
}

.avatar-status svg {
  width: 21px;
  height: 21px;
}

.identity-note {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--hero-border);
  border-radius: 6px;
  background: var(--hero-surface);
  font-family: var(--font-code);
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  transition:
    transform var(--motion-duration-fast) ease,
    color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-success-1);
  box-shadow: 0 0 0 3px var(--vp-c-success-soft);
}

.hero-content {
  min-width: 0;
}

.terminal-window {
  overflow: hidden;
  color: var(--terminal-text);
  border: 1px solid var(--terminal-border);
  border-radius: 10px;
  background: var(--terminal-bg);
  box-shadow: 0 18px 48px rgb(8 10 12 / 20%);
  transition:
    transform var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    box-shadow var(--motion-duration-fast) ease;
}

.terminal-header {
  display: flex;
  min-height: 40px;
  align-items: center;
  gap: 7px;
  padding: 0 14px;
  color: var(--terminal-muted);
  border-bottom: 1px solid var(--terminal-border);
  background: var(--terminal-header);
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border: 1px solid rgb(0 0 0 / 18%);
  border-radius: 50%;
}

.terminal-dot:first-child {
  background: #ff5f57;
}

.terminal-dot:nth-child(2) {
  background: #febc2e;
}

.terminal-dot:nth-child(3) {
  background: #28c840;
}

.terminal-label {
  margin-left: 5px;
  font-family: var(--font-code);
  font-size: 0.75rem;
}

.terminal-body {
  min-height: 150px;
  padding: clamp(22px, 4vw, 32px);
}

.command-line {
  display: flex;
  min-height: 24px;
  align-items: center;
  color: var(--terminal-muted);
  font-family: var(--font-code);
  font-size: clamp(0.95rem, 1.8vw, 1.05rem);
  white-space: nowrap;
}

.prompt {
  color: #7ed99c;
  font-weight: 600;
}

.path {
  margin-right: 10px;
  color: #84bfd3;
}

.typing-text {
  display: inline-block;
  width: 6ch;
  overflow: hidden;
}

.main-name {
  min-height: 1.08em;
  margin: 14px 0 0;
  color: var(--terminal-text);
  font-family: var(--font-heading-primary);
  font-size: clamp(2rem, 5vw, 3.6rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.08;
  text-wrap: balance;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity var(--motion-duration-normal) var(--motion-ease-out),
    transform var(--motion-duration-normal) var(--motion-ease-out);
}

.main-name.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.main-name > span {
  display: inline-flex;
  align-items: center;
}

.command-arrow {
  margin-right: 14px;
  color: #84bfd3;
  font-family: var(--font-code);
  font-weight: 400;
}

.blink-cursor {
  display: inline-block;
  margin-left: 0.08em;
  color: #84bfd3;
  font-family: var(--font-code);
  font-weight: 600;
  animation: cursor-blink 1.1s step-end infinite;
}

.motto-strip {
  display: flex;
  min-height: 48px;
  align-items: center;
  gap: 10px;
  margin: 24px 0;
  padding: 0 14px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--hero-border);
  border-radius: 6px;
  background: var(--hero-surface);
  font-family: var(--font-ui);
  line-height: 1.7;
  transition:
    transform var(--motion-duration-fast) ease,
    color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease;
}

.motto-strip > svg {
  width: 18px;
  height: 18px;
  flex: none;
  color: var(--vp-c-brand-1);
}

.motto-strip p {
  margin: 0;
}

.motto-strip span {
  margin-left: auto;
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
  white-space: nowrap;
}

.tech-stack-card {
  overflow: hidden;
  padding: 16px;
  border: 1px solid var(--hero-border);
  border-radius: 10px;
  background: var(--hero-surface);
  transition:
    transform var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--vp-c-text-2);
  font-family: var(--font-heading);
  font-size: 0.85rem;
}

.section-heading > svg {
  width: 18px;
  height: 18px;
  color: var(--vp-c-brand-1);
}

.section-count {
  min-width: 24px;
  margin-left: auto;
  padding: 2px 6px;
  color: var(--vp-c-text-3);
  border: 1px solid var(--hero-border);
  border-radius: 6px;
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.tech-carousel {
  width: 100%;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 6px;
  box-sizing: border-box;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
}

.tech-carousel:focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.tech-track {
  display: flex;
  width: max-content;
  animation: tech-marquee 32s linear infinite;
  will-change: transform;
}

.tech-carousel:focus .tech-track {
  animation-play-state: paused;
}

.tech-list {
  display: flex;
  flex: none;
  gap: 8px;
  margin: 0;
  padding: 0 8px 0 0;
  list-style: none;
}

.tech-item {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--hero-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  font-family: var(--font-code);
  font-size: 0.75rem;
  transition:
    color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) ease;
}

.tech-item svg {
  width: 16px;
  height: 16px;
  flex: none;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(6, 56px);
  gap: 10px;
  margin-top: 16px;
}

.social-link {
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  color: var(--vp-c-text-2);
  border: 1px solid var(--hero-border);
  border-radius: 8px;
  background: var(--hero-surface);
  box-sizing: border-box;
  text-decoration: none;
  touch-action: manipulation;
  transition:
    color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) ease;
}

.social-link > svg:first-child {
  width: 26px;
  height: 26px;
  flex: none;
}

.social-link:active {
  transform: scale(0.97);
}

.social-link:focus-visible {
  color: var(--vp-c-brand-hard);
  border: 2px solid var(--vp-c-brand-1);
  outline: none;
}

.hitokoto-footer {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  width: min(720px, 100%);
  margin: clamp(40px, 6vw, 64px) auto 0;
  color: var(--vp-c-text-2);
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 1rem;
  letter-spacing: 0.06em;
  line-height: 1.65;
  text-align: center;
  transition:
    color var(--motion-duration-fast) ease,
    opacity var(--motion-duration-fast) ease;
}

.hitokoto-footer svg {
  width: 16px;
  height: 16px;
  flex: none;
  margin-top: 3px;
  color: var(--vp-c-brand-1);
}

.hitokoto-footer p {
  margin: 0;
  overflow-wrap: anywhere;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes ambient-drift {
  to { transform: translate3d(16px, 10px, 0) scale(1.045); opacity: 0.5; }
}

@keyframes ambient-glow {
  to { transform: translate(-22%, 12%) scale(1.04); opacity: 0.72; }
}

@keyframes ambient-orbit {
  to { transform: translate3d(18%, 8%, 0) scale(1.06); opacity: 0.9; }
}

@keyframes tech-marquee {
  to { transform: translateX(-50%); }
}

@keyframes cursor-blink {
  50% { opacity: 0; }
}

@media (hover: hover) and (pointer: fine) {
  .avatar-frame:hover {
    transform: translateY(-4px);
  }

  .avatar-frame:hover .avatar-status {
    transform: rotate(6deg) scale(1.04);
  }

  .identity-note:hover,
  .tech-stack-card:hover {
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-brand-3);
    background: var(--vp-c-brand-soft);
    transform: translateY(-2px);
  }

  .terminal-window:hover {
    border-color: #4b7d91;
    box-shadow: 0 22px 56px rgb(8 10 12 / 28%);
    transform: translateY(-3px);
  }

  .motto-strip:hover {
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-brand-3);
    background: var(--vp-c-brand-soft);
    transform: translateX(4px);
  }

  .tech-item:hover {
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-brand-3);
    background: var(--vp-c-brand-soft);
    transform: translateY(-2px) scale(1.03);
  }

  .tech-carousel:hover .tech-track,
  .tech-carousel:focus-within .tech-track {
    animation-play-state: paused;
  }

  .social-link:hover {
    color: var(--vp-c-brand-hard);
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    transform: translateY(-3px) scale(1.03);
  }

  .hitokoto-footer:hover {
    color: var(--vp-c-text-1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-hero::before,
  .ambient-grid,
  .ambient-grid::after,
  .tech-track,
  .blink-cursor {
    animation: none;
  }

  .main-name {
    transform: none;
  }

  .tech-carousel {
    overflow-x: auto;
    -webkit-mask-image: none;
    mask-image: none;
    scrollbar-width: thin;
  }

  .tech-list[aria-hidden='true'] {
    display: none;
  }

  .avatar-frame,
  .identity-note,
  .terminal-window,
  .motto-strip,
  .tech-stack-card,
  .tech-item,
  .social-link {
    transition-property: color, border-color, background-color, opacity;
  }
}

@media (max-width: 900px) {
  .blog-hero {
    padding-top: 48px;
  }

  .hero-shell {
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 680px;
  }

  .avatar-frame {
    width: 200px;
  }

  .identity-panel {
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .blog-hero {
    min-height: auto;
    padding: 32px 16px 24px;
  }

  .hero-shell {
    gap: 32px;
  }

  .avatar-frame {
    width: 168px;
    padding: 6px;
  }

  .avatar-status {
    right: -12px;
    bottom: 14px;
  }

  .terminal-body {
    min-height: 128px;
    padding: 22px 18px;
  }

  .main-name {
    font-size: clamp(1.78rem, 9vw, 2.45rem);
  }

  .command-arrow {
    margin-right: 9px;
  }

  .tech-item {
    flex: none;
  }

  .social-link {
    width: 56px;
    height: 56px;
  }

  .social-links {
    grid-template-columns: repeat(3, 56px);
    justify-content: center;
    gap: 12px;
  }

  .hitokoto-footer {
    margin-top: 40px;
    text-align: center;
  }
}

@media (max-height: 720px) and (min-width: 901px) {
  .blog-hero {
    min-height: auto;
    padding-block: 40px 24px;
  }

  .hero-shell {
    gap: 56px;
  }

  .avatar-frame {
    width: 220px;
  }

  .hitokoto-footer {
    margin-top: 32px;
  }
}
</style>
