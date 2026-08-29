<template>
  <section
    class="blog-home"
    :class="{ 'is-loading': isLoading, 'is-revealed': pageRevealed }"
    :aria-busy="isLoading"
    aria-labelledby="blog-home-title"
  >
    <SpaceBackground ref="spaceBackground" />

    <Transition name="home-loader">
      <div v-if="isLoading" class="home-loader">
        <div class="home-loader-mark">
          <LoadingBars :size="76" label="正在加载主页" />
          <span aria-hidden="true">LOADING HOME</span>
        </div>
      </div>
    </Transition>

    <main class="home-layout" :aria-hidden="!pageRevealed" :inert="!pageRevealed">
      <div class="home-column left-column">
        <nav
          class="home-card navigation-card reveal-item"
          style="--reveal-delay: 192ms; --reveal-x: -12px; --reveal-y: 0px"
          aria-label="主页栏目"
        >
          <header class="card-heading nav-heading">
            <div class="heading-copy">
              <h2>内容目录</h2>
              <span class="card-kicker">GENERAL</span>
            </div>
            <span class="card-count">05</span>
          </header>
          <div class="navigation-list">
            <a
              v-for="item in navigationLinks"
              :key="item.label"
              :href="item.href"
              class="navigation-link"
            >
              <span class="navigation-icon" aria-hidden="true"><Icon :icon="item.icon" /></span>
              <span class="navigation-copy">
                <strong>{{ item.label }}</strong>
                <small>{{ item.description }}</small>
              </span>
            </a>
          </div>
        </nav>

        <article
          class="home-card latest-card reveal-item"
          style="--reveal-delay: 256ms; --reveal-x: -12px; --reveal-y: 0px"
        >
          <header class="card-heading compact-heading">
            <div class="heading-copy">
              <h2>最新文章</h2>
              <span class="card-kicker">LATEST</span>
            </div>
            <Icon icon="ph:article" aria-hidden="true" />
          </header>
          <a :href="latestPost.path" class="post-preview">
            <span class="post-cover" aria-hidden="true">
              <img v-if="latestPost.cover" :src="latestPost.cover" alt="" loading="lazy" />
              <Icon v-else icon="ph:article-medium" />
            </span>
            <span class="post-copy">
              <strong>{{ latestPost.title }}</strong>
              <span>{{ latestPost.excerpt }}</span>
              <time :datetime="latestPost.isoDate">{{ latestPost.date }}</time>
            </span>
          </a>
        </article>

        <a
          class="home-card random-card reveal-item"
          style="--reveal-delay: 512ms; --reveal-x: -10px; --reveal-y: 0px"
          href="/more/random/"
          aria-label="打开随机推荐，随机跳转到站内页面"
        >
          <span class="random-icon" aria-hidden="true"><Icon icon="ph:shuffle-angular" /></span>
          <span class="random-copy">
            <span class="card-kicker">DISCOVERY</span>
            <strong>随机推荐</strong>
            <small>从 {{ postCount }} 篇文章里，抽取一段意外相遇。</small>
          </span>
        </a>
      </div>

      <div class="home-column center-column">
        <article
          class="terminal-card reveal-item"
          style="--reveal-delay: 128ms; --reveal-y: -12px"
          aria-label="终端个人介绍"
        >
          <header class="terminal-header">
            <span class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="terminal-path">{{ terminalConfig.path }}</span>
          </header>
          <div class="terminal-body">
            <div class="terminal-command">
              <span class="terminal-prompt">{{ terminalConfig.user }}@{{ terminalConfig.host }}:~$</span>
              <span>{{ displayedCommand }}</span>
              <span v-if="!showResponse" class="terminal-cursor" aria-hidden="true">_</span>
            </div>
            <div class="terminal-output" :class="{ 'is-visible': showResponse }" aria-live="polite">
              <span class="terminal-chevron" aria-hidden="true">›</span>
              <span class="terminal-name">{{ displayedName }}</span>
              <span class="terminal-cursor" aria-hidden="true">_</span>
            </div>
          </div>
        </article>

        <article
          class="home-card profile-card reveal-item"
          style="--reveal-delay: 0ms; --reveal-y: 10px; --reveal-scale: .97"
        >
          <span class="profile-index">PROFILE / 01</span>
          <div class="profile-avatar-wrap">
            <span class="profile-orbit orbit-outer" aria-hidden="true"></span>
            <span class="profile-orbit orbit-inner" aria-hidden="true"></span>
            <img
              :src="profileConfig.avatar"
              :alt="`${profileConfig.name} 的头像`"
              class="profile-avatar"
              width="200"
              height="200"
              fetchpriority="high"
            />
            <span class="profile-badge" :title="profileConfig.badgeTooltip" aria-hidden="true">
              <Icon icon="ph:sparkle-fill" />
            </span>
          </div>
          <p class="profile-greeting">{{ dynamicGreeting }}, NICE TO MEET YOU</p>
          <h1 id="blog-home-title">{{ profileConfig.name }}</h1>
          <p class="profile-role"><span class="online-dot" aria-hidden="true"></span>{{ profileConfig.role }}</p>
          <p class="profile-signature">{{ profileConfig.signature }}</p>
        </article>

        <nav
          class="social-dock reveal-item"
          style="--reveal-delay: 320ms; --reveal-y: 10px; --reveal-scale: .97"
          aria-label="社交链接"
        >
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            class="social-link"
            :class="[{ 'is-featured': social.featured }, `social-${social.brand}`]"
            :target="social.external ? '_blank' : undefined"
            :rel="social.external ? 'noopener noreferrer' : undefined"
            :aria-label="social.external ? `${social.label}（在新标签页打开）` : social.label"
            :title="social.label"
          >
            <img :src="social.logo" alt="" class="social-logo" width="28" height="28" aria-hidden="true" />
            <span v-if="social.featured" class="social-label">{{ social.label }}</span>
          </a>
        </nav>

        <div class="center-utilities">
          <button
            type="button"
            class="home-card like-card reveal-item"
            style="--reveal-delay: 576ms; --reveal-x: 10px; --reveal-y: 0px"
            :class="{ 'is-liked': liked }"
            :aria-pressed="liked"
            :aria-label="liked ? '取消喜欢这个主页' : '喜欢这个主页'"
            data-space-burst="manual"
            @click="toggleLike"
          >
            <span class="like-icon" aria-hidden="true">
              <Icon :icon="liked ? 'ph:heart-fill' : 'ph:heart'" />
            </span>
            <strong>{{ likeCount }}</strong>
            <small>{{ liked ? 'THANK YOU' : 'LIKE' }}</small>
          </button>

          <article
            class="home-card tech-card reveal-item"
            style="--reveal-delay: 448ms; --reveal-y: 12px"
            tabindex="0"
            aria-label="技术栈自动滚动展示，悬停或聚焦时暂停"
          >
            <header class="tech-heading">
              <div class="heading-copy">
                <h2>技术栈</h2>
                <span class="card-kicker">TOOLBOX</span>
              </div>
            </header>
            <div class="marquee-row" aria-label="常用技术栈第一行">
              <div class="marquee-track">
                <ul class="tech-list">
                  <li v-for="tech in techRowOne" :key="tech.name" class="tech-chip">
                    <Icon :icon="tech.icon" aria-hidden="true" />
                    <span>{{ tech.name }}</span>
                  </li>
                </ul>
                <ul class="tech-list" aria-hidden="true">
                  <li v-for="tech in techRowOne" :key="`one-copy-${tech.name}`" class="tech-chip">
                    <Icon :icon="tech.icon" aria-hidden="true" />
                    <span>{{ tech.name }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="marquee-row marquee-reverse" aria-label="常用技术栈第二行">
              <div class="marquee-track">
                <ul class="tech-list">
                  <li v-for="tech in techRowTwo" :key="tech.name" class="tech-chip">
                    <Icon :icon="tech.icon" aria-hidden="true" />
                    <span>{{ tech.name }}</span>
                  </li>
                </ul>
                <ul class="tech-list" aria-hidden="true">
                  <li v-for="tech in techRowTwo" :key="`two-copy-${tech.name}`" class="tech-chip">
                    <Icon :icon="tech.icon" aria-hidden="true" />
                    <span>{{ tech.name }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="home-column right-column">
        <article
          class="home-card clock-card reveal-item"
          style="--reveal-delay: 64ms; --reveal-x: 12px; --reveal-y: 0px"
        >
          <header class="clock-heading"><span>LOCAL TIME</span><span>UTC +08</span></header>
          <div class="clock-display">
            <time :datetime="currentDateTime" :aria-label="`${hours}点${minutes}分${seconds}秒`">
              <span
                v-for="(digit, index) in clockDigits"
                :key="`${digit}-${index}`"
                class="segment-digit"
                :data-digit="digit"
                aria-hidden="true"
              >
                <i v-for="segment in segmentNames" :key="segment" class="clock-segment" :class="`segment-${segment}`"></i>
              </span>
              <span class="segment-colon" aria-hidden="true"><i></i><i></i></span>
              <span
                v-for="(digit, index) in minuteDigits"
                :key="`minute-${digit}-${index}`"
                class="segment-digit"
                :data-digit="digit"
                aria-hidden="true"
              >
                <i v-for="segment in segmentNames" :key="segment" class="clock-segment" :class="`segment-${segment}`"></i>
              </span>
            </time>
            <span class="clock-seconds" aria-hidden="true">
              <span
                v-for="(digit, index) in secondDigits"
                :key="`second-${digit}-${index}`"
                class="segment-digit segment-digit-small"
                :data-digit="digit"
              >
                <i v-for="segment in segmentNames" :key="segment" class="clock-segment" :class="`segment-${segment}`"></i>
              </span>
            </span>
          </div>
          <footer class="clock-footer">
            <span>{{ currentDateLabel }}</span>
            <span>{{ currentWeekday }}</span>
          </footer>
        </article>

        <article
          class="home-card calendar-card reveal-item"
          style="--reveal-delay: 384ms; --reveal-x: 12px; --reveal-y: 0px"
        >
          <header class="calendar-heading">
            <div>
              <span class="card-kicker">CALENDAR</span>
              <h2>{{ monthTitle }}</h2>
            </div>
            <span class="today-badge">{{ todayNumber }}</span>
          </header>
          <div class="calendar-grid calendar-weekdays" aria-hidden="true">
            <span v-for="label in weekdayLabels" :key="label">{{ label }}</span>
          </div>
          <ol class="calendar-grid calendar-days" :aria-label="`${monthTitle}日历`">
            <li
              v-for="cell in calendarCells"
              :key="cell.key"
              :class="{ 'is-empty': cell.day === null, 'is-today': cell.isToday }"
              :aria-current="cell.isToday ? 'date' : undefined"
              :aria-label="cell.isToday ? `今天，${cell.day}日` : cell.day ? `${cell.day}日` : undefined"
            >
              <span v-if="cell.day !== null">{{ cell.day }}</span>
            </li>
          </ol>
          <footer class="calendar-footer">
            <span class="online-dot" aria-hidden="true"></span>
            <span>今天也在认真生活</span>
          </footer>
        </article>
      </div>
    </main>

    <button
      type="button"
      class="home-quote reveal-item"
      style="--reveal-delay: 640ms; --reveal-y: 8px"
      title="点击刷新一言"
      :disabled="!pageRevealed"
      @click="fetchHitokoto"
    >
      <Icon icon="ph:quotes" aria-hidden="true" />
      <span>{{ hitokotoText }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { usePostsData } from 'vuepress-theme-plume/client'
import type { ThemePostsItem } from 'vuepress-theme-plume'
import LoadingBars from './LoadingBars.vue'
import SpaceBackground from './SpaceBackground.vue'

interface CalendarCell { key: string; day: number | null; isToday: boolean }

const profileConfig = {
  avatar: '/avatar/davidblack-round.png',
  name: 'David_Black_',
  role: 'Developer · Blogger',
  signature: '有些事你不要太当真。——《售梦者》',
  badgeTooltip: '保持热爱，奔赴山海',
}
const terminalConfig = { path: '~/profile', user: 'user', host: 'davidblackcn', command: 'whoami', responseName: 'DavidBlackCN' }
const navigationLinks = [
  { label: '博客 - Blog', description: '技术与生活随笔', href: '/blog/', icon: 'ph:article' },
  { label: '项目 - Project', description: '作品与实验记录', href: '/ghProject/', icon: 'ph:squares-four' },
  { label: '导航 - Navigation', description: '常用站点收藏', href: '/nav/minecraft-nav/', icon: 'ph:compass' },
  { label: '笔记 - Notes', description: '知识与实践沉淀', href: '/notes/qian-ru-shi-kai-fa/readme/', icon: 'ph:notebook' },
  { label: '简介 - About', description: '更多个人信息', href: '/more/index/', icon: 'ph:user-circle' },
]
const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/DavidBlackCN', logo: '/logos/github-light.svg', external: true, featured: true, brand: 'github' },
  { label: 'BiliBili', href: 'https://space.bilibili.com/453841968', logo: '/logos/bilibili.svg', external: true, featured: true, brand: 'bilibili' },
  { label: 'Email', href: 'mailto:davidblackcn@outlook.com', logo: '/logos/email.svg', external: false, featured: false, brand: 'mail' },
  { label: 'QQ', href: 'https://qm.qq.com/q/FWDv0T5OYG', logo: '/logos/qq.svg', external: true, featured: false, brand: 'qq' },
  { label: 'Plume', href: 'https://theme-plume.vuejs.press/', logo: '/logos/plume.svg', external: true, featured: false, brand: 'plume' },
]
const techRowOne = [
  { name: 'Vue 3', icon: 'logos:vue' }, { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Vite', icon: 'logos:vitejs' }, { name: 'Node.js', icon: 'logos:nodejs-icon' },
  { name: 'Python', icon: 'logos:python' }, { name: 'Git', icon: 'logos:git-icon' },
]
const techRowTwo = [
  { name: 'Docker', icon: 'logos:docker-icon' }, { name: 'Linux', icon: 'logos:linux-tux' },
  { name: 'C++', icon: 'logos:c-plusplus' }, { name: 'Java', icon: 'logos:java' },
  { name: 'MySQL', icon: 'logos:mysql' }, { name: 'VS Code', icon: 'logos:visual-studio-code' },
]

const defaultMotto = '有些事你不要太当真。 ——《售梦者》'
const postsData = usePostsData()
const cleanExcerpt = (excerpt = '') => excerpt.replace(/<[^>]+>/g, ' ').replace(/&(?:nbsp|amp|lt|gt|quot);/g, ' ').replace(/\s+/g, ' ').trim()
const postTimestamp = (post: ThemePostsItem) => { const value = Date.parse(post.createTime); return Number.isNaN(value) ? 0 : value }
const formatPostDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '最近更新' : new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}
const sortedPosts = computed(() =>
  Object.values(postsData.value)
    .flat()
    .filter(post => !post.draft)
    .sort((a, b) => postTimestamp(b) - postTimestamp(a)),
)
const postCount = computed(() => sortedPosts.value.length)
const latestPost = computed(() => {
  const post = sortedPosts.value[0]
  if (!post) return { title: '文章正在整理中', excerpt: '去博客列表看看已经发布的内容。', date: '等待更新', isoDate: '', path: '/blog/', cover: '' }
  return { title: post.title, excerpt: cleanExcerpt(post.excerpt) || '点击阅读全文，继续这段记录。', date: formatPostDate(post.createTime), isoDate: post.createTime, path: post.path, cover: post.cover || '' }
})

const currentTime = ref<Date | null>(null)
const isLoading = ref(true)
const pageRevealed = ref(false)
const calendarCells = ref<CalendarCell[]>(Array.from({ length: 42 }, (_, index) => ({ key: `placeholder-${index}`, day: null, isToday: false })))
const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日']
let clockTimer: number | undefined
let loadingTimer: number | undefined
let revealTimer: number | undefined
const hours = computed(() => currentTime.value ? String(currentTime.value.getHours()).padStart(2, '0') : '--')
const minutes = computed(() => currentTime.value ? String(currentTime.value.getMinutes()).padStart(2, '0') : '--')
const seconds = computed(() => currentTime.value ? String(currentTime.value.getSeconds()).padStart(2, '0') : '--')
const clockDigits = computed(() => hours.value.split(''))
const minuteDigits = computed(() => minutes.value.split(''))
const secondDigits = computed(() => seconds.value.split(''))
const segmentNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const
const currentDateTime = computed(() => currentTime.value?.toISOString() || '')
const currentDateLabel = computed(() => currentTime.value ? new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(currentTime.value) : '正在同步')
const currentWeekday = computed(() => currentTime.value ? new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(currentTime.value) : '')
const dynamicGreeting = computed(() => {
  const hour = currentTime.value?.getHours()
  if (hour === undefined) return 'HELLO'
  return hour < 6 ? 'GOOD NIGHT' : hour < 12 ? 'GOOD MORNING' : hour < 18 ? 'GOOD AFTERNOON' : hour < 22 ? 'GOOD EVENING' : 'GOOD NIGHT'
})
const monthTitle = computed(() => currentTime.value ? new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long' }).format(currentTime.value) : '本月')
const todayNumber = computed(() => currentTime.value ? String(currentTime.value.getDate()).padStart(2, '0') : '--')

function buildCalendar(now: Date) {
  const year = now.getFullYear(); const month = now.getMonth(); const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  calendarCells.value = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1; const valid = day > 0 && day <= daysInMonth
    return { key: `${year}-${month}-${index}`, day: valid ? day : null, isToday: valid && day === now.getDate() }
  })
}
function updateClock() { const now = new Date(); const previousDay = currentTime.value?.getDate(); currentTime.value = now; if (previousDay !== now.getDate()) buildCalendar(now) }

const displayedCommand = ref(''); const displayedName = ref(''); const showResponse = ref(false); let typingTimers: number[] = []
function clearTypingTimers() { typingTimers.forEach(window.clearTimeout); typingTimers = [] }
function scheduleTyping(callback: () => void, delay: number) { typingTimers.push(window.setTimeout(callback, delay)) }
function startTyping() {
  clearTypingTimers(); displayedCommand.value = ''; displayedName.value = ''; showResponse.value = false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { displayedCommand.value = terminalConfig.command; displayedName.value = terminalConfig.responseName; showResponse.value = true; return }
  let commandIndex = 0
  const typeCommand = () => {
    displayedCommand.value += terminalConfig.command[commandIndex]; commandIndex += 1
    if (commandIndex < terminalConfig.command.length) { scheduleTyping(typeCommand, 82); return }
    scheduleTyping(() => {
      showResponse.value = true; let nameIndex = 0
      const typeName = () => { displayedName.value += terminalConfig.responseName[nameIndex]; nameIndex += 1; if (nameIndex < terminalConfig.responseName.length) scheduleTyping(typeName, 96) }
      typeName()
    }, 320)
  }
  scheduleTyping(typeCommand, 220)
}

function startHomeSequence() {
  isLoading.value = true
  pageRevealed.value = false
  loadingTimer = window.setTimeout(() => {
    isLoading.value = false
    revealTimer = window.setTimeout(() => {
      pageRevealed.value = true
      startTyping()
    }, 120)
  }, 1000)
}

const liked = ref(false); const likeCount = computed(() => 2036 + (liked.value ? 1 : 0))
const spaceBackground = ref<InstanceType<typeof SpaceBackground> | null>(null)
function toggleLike(e?: MouseEvent) {
  liked.value = !liked.value
  window.localStorage.setItem('blog-home-liked', liked.value ? '1' : '0')
  if (liked.value && e) spaceBackground.value?.celebrateAt(e.clientX, e.clientY, '#dc7388')
}

const hitokotoText = ref(defaultMotto); let hitokotoController: AbortController | undefined
async function fetchHitokoto() {
  hitokotoController?.abort(); hitokotoController = new AbortController()
  try {
    const response = await fetch('https://v1.hitokoto.cn/?c=d&c=i&c=k', { signal: hitokotoController.signal })
    if (!response.ok) return
    const data = await response.json()
    if (data?.hitokoto) hitokotoText.value = data.from_who ? `${data.hitokoto} —— ${data.from_who}「${data.from}」` : `${data.hitokoto} ——「${data.from}」`
  } catch (error) { if ((error as Error).name !== 'AbortError') hitokotoText.value = defaultMotto }
}

onMounted(() => {
  updateClock()
  clockTimer = window.setInterval(updateClock, 1000)
  liked.value = window.localStorage.getItem('blog-home-liked') === '1'
  startHomeSequence()
  fetchHitokoto()
})

onUnmounted(() => {
  if (clockTimer !== undefined) window.clearInterval(clockTimer)
  if (loadingTimer !== undefined) window.clearTimeout(loadingTimer)
  if (revealTimer !== undefined) window.clearTimeout(revealTimer)
  clearTypingTimers()
  hitokotoController?.abort()
})
</script>

<style scoped>
.blog-home {
  --home-surface: color-mix(in srgb, var(--vp-c-bg-elv) 94%, transparent); --home-surface-soft: color-mix(in srgb, var(--vp-c-bg-soft) 84%, transparent);
  --home-border: color-mix(in srgb, var(--vp-c-divider) 86%, transparent); --home-border-strong: color-mix(in srgb, var(--vp-c-brand-3) 68%, var(--home-border));
  --home-shadow: 0 18px 44px rgb(15 25 32 / 10%); --font-ui: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-mono: "Maple Mono", var(--vp-font-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --ease-out: cubic-bezier(0.23, 1, 0.32, 1); --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  position: relative; min-height: calc(100dvh - var(--vp-nav-height, 64px)); padding: clamp(28px, 4vw, 56px) clamp(16px, 3.5vw, 48px) 32px;
  overflow: hidden; color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  box-sizing: border-box; isolation: isolate;
}

.home-loader { position: fixed; inset: var(--vp-nav-height,64px) 0 0; z-index: 50; display: grid; place-items: center; overflow: hidden; background: transparent; }
.home-loader::before { position: absolute; width: min(52vw,520px); aspect-ratio: 1; pointer-events: none; border: 1px solid color-mix(in srgb,var(--vp-c-brand-3) 20%,transparent); border-radius: 50%; box-shadow: 0 0 72px color-mix(in srgb,var(--vp-c-brand-soft) 28%,transparent),inset 0 0 54px color-mix(in srgb,var(--vp-c-brand-soft) 12%,transparent); opacity: .62; content: ''; }
.home-loader-mark { position: relative; display: flex; flex-direction: column; align-items: center; gap: 18px; color: var(--vp-c-brand-1); }
.home-loader-mark>span { font-family: var(--font-mono); font-size: .68rem; font-weight: 600; letter-spacing: .22em; }
.home-loader-leave-active { transition: opacity 220ms var(--ease-out); }
.home-loader-leave-active .home-loader-mark { transition: opacity 220ms var(--ease-out),transform 220ms var(--ease-out); }
.home-loader-leave-to { opacity: 0; }
.home-loader-leave-to .home-loader-mark { opacity: 0; transform: translate3d(0,-6px,0) scale(.98); }
.blog-home:not(.is-revealed) .reveal-item { visibility: hidden; opacity: 0; transform: translate3d(var(--reveal-x,0),var(--reveal-y,8px),0) scale(var(--reveal-scale,1)); }
.blog-home.is-revealed .reveal-item { animation: home-card-reveal 260ms var(--ease-out) var(--reveal-delay,0ms) backwards; }
.home-layout { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(248px, .82fr) minmax(430px, 1.5fr) minmax(300px, 1fr); gap: clamp(16px, 1.7vw, 24px); width: min(1180px, 100%); margin: 0 auto; align-items: start; }
.home-column { display: flex; min-width: 0; flex-direction: column; gap: 18px; }
.left-column { padding-top: 108px; } .right-column { padding-top: 68px; }
.home-card,.terminal-card { position: relative; overflow: hidden; border: 1px solid var(--home-border); background: var(--home-surface); box-shadow: var(--home-shadow); box-sizing: border-box; }
.home-card { border-radius: 20px; transition: transform 180ms var(--ease-out), border-color 160ms ease, background-color 160ms ease; }
.card-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.heading-copy { display: flex; align-items: flex-start; gap: 0; }
.heading-copy h2::before { display: none; content: none; }
.heading-copy h2::after { display: block; width: 100%; height: 2px; margin-top: 3px; border-radius: 999px; background: var(--vp-c-brand-1); content: ''; }
.card-kicker { display: inline-flex; align-items: center; color: var(--vp-c-text-3); font-family: var(--font-mono); font-size: .58rem; font-weight: 500; letter-spacing: .08em; line-height: 1.2; }
.heading-copy .card-kicker { margin-top: 5px; }
.heading-copy .card-kicker::before { margin: 0 7px; color: var(--vp-c-brand-1); content: '·'; font-family: var(--font-ui); font-size: .72rem; }
.card-heading h2,.tech-heading h2 { margin: 0; padding: 0; color: var(--vp-c-text-1); border: 0; font-family: var(--font-ui); font-size: 1rem; font-weight: 650; line-height: 1.3; }
.calendar-heading h2 { margin: 4px 0 0; padding: 0; color: var(--vp-c-text-1); border: 0; font-family: var(--font-ui); font-size: 1rem; font-weight: 650; line-height: 1.3; }
.card-count { display: grid; min-width: 30px; height: 30px; place-items: center; color: var(--vp-c-text-3); border: 1px solid var(--home-border); border-radius: 9px; font-family: var(--font-mono); font-size: .7rem; }
.navigation-card { min-height: 426px; padding: 24px 20px 20px; border-radius: 20px; }
.navigation-list { display: grid; gap: 8px; margin-top: 16px; }
.navigation-link { display: grid; min-height: 58px; grid-template-columns: 40px minmax(0,1fr); align-items: center; gap: 10px; padding: 7px 10px; color: var(--vp-c-text-2); border: 2px solid transparent; border-radius: 14px; background: transparent; box-sizing: border-box; text-decoration: none; touch-action: manipulation; transition: transform 150ms var(--ease-out), color 150ms ease, border-color 150ms ease, background-color 150ms ease; }
.navigation-icon { display: grid; width: 40px; height: 40px; place-items: center; color: var(--vp-c-brand-1); border: 1px solid var(--home-border); border-radius: 12px; background: var(--home-surface-soft); }
.navigation-icon svg { width: 21px; height: 21px; } .navigation-copy { min-width: 0; } .navigation-copy strong { display: block; padding: 0; color: var(--vp-c-text-1); font-size: .91rem; font-weight: 600; line-height: 1.35; } .navigation-copy small { display: block; margin-top: 2px; overflow: hidden; color: var(--vp-c-text-3); font-size: .69rem; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
.latest-card { min-height: 205px; padding: 22px; border-radius: 20px; } .compact-heading>svg { width: 22px; height: 22px; color: var(--vp-c-brand-1); }
.post-preview { display: grid; min-height: 112px; grid-template-columns: 68px minmax(0,1fr); align-items: center; gap: 12px; margin-top: 14px; padding: 10px; color: inherit; border: 2px solid transparent; border-radius: 14px; background: var(--home-surface-soft); box-sizing: border-box; text-decoration: none; transition: transform 150ms var(--ease-out), border-color 150ms ease, background-color 150ms ease; }
.post-cover { display: grid; width: 68px; aspect-ratio: 1; overflow: hidden; place-items: center; color: var(--vp-c-brand-1); border: 1px solid var(--home-border); border-radius: 12px; background: var(--vp-c-brand-soft); } .post-cover img { width: 100%; height: 100%; object-fit: cover; } .post-cover svg { width: 28px; height: 28px; }
.post-copy { min-width: 0; } .post-copy strong { display: -webkit-box; overflow: hidden; color: var(--vp-c-text-1); font-size: .84rem; line-height: 1.35; -webkit-box-orient: vertical; -webkit-line-clamp: 2; } .post-copy>span { display: -webkit-box; margin-top: 4px; overflow: hidden; color: var(--vp-c-text-3); font-size: .68rem; line-height: 1.45; -webkit-box-orient: vertical; -webkit-line-clamp: 2; } .post-copy time { display: block; margin-top: 7px; color: var(--vp-c-text-3); font-family: var(--font-mono); font-size: .65rem; }
.random-card { display: grid; min-height: 142px; grid-template-columns: 52px minmax(0,1fr); align-items: center; gap: 14px; padding: 20px; color: inherit; border-radius: 20px; text-decoration: none; }
.random-icon { display: grid; width: 52px; height: 52px; place-items: center; color: var(--vp-c-brand-1); border-radius: 15px; background: var(--vp-c-brand-soft); } .random-icon svg { width: 26px; height: 26px; } .random-copy { min-width: 0; } .random-copy strong { display: block; margin-top: 3px; font-size: 1rem; } .random-copy small { display: block; margin-top: 6px; color: var(--vp-c-text-3); font-size: .72rem; line-height: 1.5; }
.terminal-card { height: 188px; flex: 0 0 188px; color: var(--vp-c-text-1); border-color: color-mix(in srgb,var(--vp-c-brand-3) 28%,var(--home-border)); border-radius: 20px; background: color-mix(in srgb,var(--vp-c-brand-soft) 36%,var(--vp-c-bg-elv)); box-shadow: 0 20px 48px rgb(38 73 88 / 12%); }
.terminal-header { display: flex; height: 48px; align-items: center; gap: 10px; padding: 0 12px; color: var(--vp-c-text-3); border-bottom: 1px solid color-mix(in srgb,var(--vp-c-brand-3) 22%,var(--home-border)); background: color-mix(in srgb,var(--vp-c-brand-soft) 58%,var(--vp-c-bg-soft)); box-sizing: border-box; }
.terminal-dots { display: inline-flex; gap: 7px; } .terminal-dots i { width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; } .terminal-dots i:nth-child(2) { background: #febc2e; } .terminal-dots i:nth-child(3) { background: #28c840; } .terminal-path { font-family: var(--font-mono); font-size: .73rem; }
.terminal-body { display: grid; height: 140px; grid-template-rows: 32px 66px; align-content: center; padding: 14px 24px; box-sizing: border-box; }
.terminal-command { display: flex; min-width: 0; align-items: center; gap: 9px; color: var(--vp-c-text-2); font-family: var(--font-mono); font-size: clamp(.88rem,1.25vw,1.02rem); white-space: nowrap; } .terminal-prompt { color: #4b8d69; font-weight: 600; }
.terminal-output { display: flex; min-width: 0; align-items: center; overflow: hidden; opacity: 0; transform: translateY(6px); transition: opacity 180ms var(--ease-out), transform 180ms var(--ease-out); } .terminal-output.is-visible { opacity: 1; transform: translateY(0); } .terminal-chevron { margin-right: 12px; color: var(--vp-c-brand-1); font-family: var(--font-mono); font-size: 3rem; line-height: 1; } .terminal-name { overflow: hidden; color: var(--vp-c-text-1); font-family: var(--font-mono); font-size: clamp(2rem,4vw,3.3rem); font-weight: 700; letter-spacing: -.055em; line-height: 1; white-space: nowrap; } .terminal-cursor { color: var(--vp-c-brand-1); font-family: var(--font-mono); font-weight: 700; animation: cursor-blink 1.05s step-end infinite; } .terminal-output .terminal-cursor { align-self: center; margin-left: 2px; font-size: clamp(2rem,4vw,3.3rem); line-height: 1; }
.profile-card { min-height: 446px; padding: 26px 30px 30px; border-radius: 20px; text-align: center; }
.profile-index { display: block; color: var(--vp-c-text-3); font-family: var(--font-mono); font-size: .68rem; letter-spacing: .1em; text-align: left; } .profile-avatar-wrap { position: relative; width: 224px; margin: 12px auto 14px; aspect-ratio: 1; } .profile-avatar-wrap::before { position: absolute; inset: -4px; z-index: 1; border: 2px solid transparent; border-top-color: var(--vp-c-brand-1); border-right-color: var(--home-border-strong); border-radius: 50%; opacity: .72; content: ''; pointer-events: none; animation: orbit-spin 9s linear infinite; } .profile-avatar { position: absolute; inset: 12px; z-index: 2; width: calc(100% - 24px); height: calc(100% - 24px); border: 6px solid var(--vp-c-bg); border-radius: 42% 58% 45% 55% / 52% 42% 58% 48%; object-fit: cover; box-sizing: border-box; transition: transform 180ms var(--ease-out), border-radius 180ms var(--ease-out); } .profile-orbit { position: absolute; border: 1px solid var(--home-border-strong); border-radius: 50%; pointer-events: none; } .orbit-outer { inset: 0; opacity: .62; } .orbit-inner { inset: 7px; border-style: dashed; opacity: .58; animation: orbit-spin 16s linear infinite reverse; }
.profile-badge { position: absolute; right: 5px; bottom: 30px; z-index: 3; display: grid; width: 48px; height: 48px; place-items: center; color: var(--vp-c-brand-1); border: 0; border-radius: 0; background: transparent; box-shadow: none; filter: drop-shadow(0 2px 7px color-mix(in srgb,var(--vp-c-brand-1) 32%,transparent)); } .profile-badge svg { width: 23px; height: 23px; } .profile-greeting { margin: 0; color: var(--vp-c-brand-1); font-family: var(--font-mono); font-size: .73rem; font-weight: 600; letter-spacing: .09em; } .profile-card h1 { margin: 8px 0 0; color: var(--vp-c-text-1); font-family: var(--font-mono); font-size: clamp(1.8rem,3.2vw,2.6rem); letter-spacing: -.045em; line-height: 1.1; } .profile-role { display: inline-flex; min-height: 30px; align-items: center; gap: 8px; margin: 12px 0 0; padding: 0 12px; color: var(--vp-c-text-2); border: 1px solid var(--home-border); border-radius: 9px; background: var(--home-surface-soft); font-family: var(--font-mono); font-size: .72rem; } .online-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--vp-c-success-1,#4fba75); box-shadow: 0 0 0 3px var(--vp-c-success-soft,rgb(79 186 117 / 14%)); } .profile-signature { max-width: 34em; margin: 16px auto 0; color: var(--vp-c-text-2); font-family: var(--font-ui); font-size: .91rem; line-height: 1.75; }
.social-dock { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 0; }
.social-link { --social-color: var(--vp-c-brand-1); --social-bg: var(--home-surface); --social-hover: var(--vp-c-brand-soft); display: grid; width: 58px; height: 58px; overflow: hidden; place-items: center; color: var(--social-color); border: 0; border-radius: 14px; outline: 0 solid transparent; background: var(--social-bg); box-shadow: 0 10px 24px rgb(15 25 32 / 9%); box-sizing: border-box; text-decoration: none; touch-action: manipulation; transition: transform 150ms var(--ease-out),color 150ms ease,background-color 150ms ease,box-shadow 150ms ease; }
.social-github { --social-color: #fff; --social-bg: #24292f; --social-hover: #111317; }
.social-bilibili { --social-color: #b43e61; --social-bg: #fff0f4; --social-hover: #ffe1ea; }
.social-mail { --social-color: #a54752; --social-bg: #fff0f0; --social-hover: #ffe1e1; }
.social-qq { --social-color: #8a5a00; --social-bg: #fff5e3; --social-hover: #ffebc8; }
.social-plume { --social-color: #376d79; --social-bg: #eaf5f6; --social-hover: #dceef0; }
.social-logo { display: block; width: 28px; height: 28px; object-fit: contain; }
.social-bilibili .social-logo,.social-mail .social-logo { width: 30px; height: 30px; }
.social-github .social-logo { width: 26px; height: 26px; }
.social-qq .social-logo { width: 26px; height: 26px; transform: scale(2.15); }
.social-plume .social-logo { width: 31px; height: 31px; }
.social-link.is-featured { display: inline-flex; width: auto; min-width: 116px; justify-content: center; gap: 9px; padding: 0 15px; border-radius: 14px; }
.social-link.is-featured .social-logo { flex: none; }
.social-label { font-family: var(--font-mono); font-size: .72rem; font-weight: 600; white-space: nowrap; }
.center-utilities { display: grid; grid-template-columns: 72px minmax(0,1fr); gap: 14px; align-items: center; }
.like-card { display: grid; width: 72px; height: 72px; min-height: 72px; padding: 0; overflow: visible; place-items: center; color: #dc7388; border-radius: 14px; cursor: pointer; }
.like-icon { display: grid; width: 100%; height: 100%; place-items: center; border-radius: inherit; background: color-mix(in srgb,#dc7388 8%,transparent); transition: transform 150ms var(--ease-out), background-color 150ms ease; }
.like-icon svg { width: 28px; height: 28px; }
.like-card strong { position: absolute; top: -10px; right: -14px; display: grid; min-width: 42px; height: 24px; padding: 0 7px; place-items: center; color: var(--vp-c-text-1); border: 1px solid var(--home-border); border-radius: 999px; background: var(--vp-c-bg-elv); box-shadow: 0 8px 20px rgb(15 25 32 / 10%); box-sizing: border-box; font-family: var(--font-mono); font-size: .65rem; font-variant-numeric: tabular-nums; }
.like-card small { display: none; }
.like-card.is-liked .like-icon { background: color-mix(in srgb,#dc7388 18%,transparent); transform: scale(1.04); }
.tech-card { min-width: 0; min-height: 184px; padding: 16px 0 14px; border-radius: 20px; } .tech-heading { display: flex; align-items: center; padding: 0 18px 14px; } .marquee-row { width: 100%; overflow: hidden; -webkit-mask-image: linear-gradient(to right,transparent,#000 9%,#000 91%,transparent); mask-image: linear-gradient(to right,transparent,#000 9%,#000 91%,transparent); } .marquee-row+.marquee-row { margin-top: 10px; } .marquee-track { display: flex; width: max-content; animation: tech-marquee 28s linear infinite; will-change: transform; } .marquee-reverse .marquee-track { animation-direction: reverse; animation-duration: 32s; } .tech-list { display: flex; flex: none; gap: 7px; margin: 0; padding: 0 7px 0 0; list-style: none; } .tech-chip { display: inline-flex; min-height: 30px; align-items: center; gap: 6px; padding: 0 9px; color: var(--vp-c-text-2); border: 1px solid var(--home-border); border-radius: 8px; background: var(--home-surface-soft); font-family: var(--font-mono); font-size: .68rem; white-space: nowrap; } .tech-chip svg { width: 15px; height: 15px; flex: none; } .tech-card:focus-within .marquee-track { animation-play-state: paused; }
.clock-card { min-height: 188px; padding: 18px; border-radius: 20px; } .clock-heading,.clock-footer { display: flex; align-items: center; justify-content: space-between; color: var(--vp-c-text-3); font-family: var(--font-mono); font-size: .66rem; letter-spacing: .07em; } .clock-display { display: flex; height: 94px; align-items: center; justify-content: center; margin: 12px 0 10px; padding: 0 12px; color: var(--vp-c-text-1); border: 1px solid var(--home-border); border-radius: 16px; background: color-mix(in srgb,var(--vp-c-bg-soft) 88%,var(--vp-c-bg)); box-shadow: inset 0 1px 10px rgb(15 25 32 / 6%); box-sizing: border-box; } .clock-display time { display: flex; align-items: center; gap: 6px; white-space: nowrap; } .segment-digit { position: relative; display: block; width: 32px; height: 58px; flex: none; } .clock-segment { position: absolute; display: block; border-radius: 999px; background: color-mix(in srgb,var(--vp-c-text-1) 9%,transparent); opacity: .72; } .segment-a,.segment-d,.segment-g { left: 7px; width: 19px; height: 5px; clip-path: polygon(12% 0,88% 0,100% 50%,88% 100%,12% 100%,0 50%); } .segment-a { top: 1px; } .segment-g { top: 27px; } .segment-d { bottom: 1px; } .segment-b,.segment-c,.segment-e,.segment-f { width: 5px; height: 22px; clip-path: polygon(50% 0,100% 12%,100% 88%,50% 100%,0 88%,0 12%); } .segment-b { top: 5px; right: 2px; } .segment-c { right: 2px; bottom: 5px; } .segment-e { bottom: 5px; left: 2px; } .segment-f { top: 5px; left: 2px; } .segment-digit[data-digit='0'] :is(.segment-a,.segment-b,.segment-c,.segment-d,.segment-e,.segment-f),.segment-digit[data-digit='1'] :is(.segment-b,.segment-c),.segment-digit[data-digit='2'] :is(.segment-a,.segment-b,.segment-d,.segment-e,.segment-g),.segment-digit[data-digit='3'] :is(.segment-a,.segment-b,.segment-c,.segment-d,.segment-g),.segment-digit[data-digit='4'] :is(.segment-b,.segment-c,.segment-f,.segment-g),.segment-digit[data-digit='5'] :is(.segment-a,.segment-c,.segment-d,.segment-f,.segment-g),.segment-digit[data-digit='6'] :is(.segment-a,.segment-c,.segment-d,.segment-e,.segment-f,.segment-g),.segment-digit[data-digit='7'] :is(.segment-a,.segment-b,.segment-c),.segment-digit[data-digit='8'] .clock-segment,.segment-digit[data-digit='9'] :is(.segment-a,.segment-b,.segment-c,.segment-d,.segment-f,.segment-g) { background: var(--vp-c-text-1); box-shadow: 0 0 8px color-mix(in srgb,var(--vp-c-text-1) 13%,transparent); opacity: .96; } .segment-colon { display: grid; width: 8px; height: 44px; flex: none; align-content: center; gap: 10px; margin: 0 1px; animation: colon-pulse 1s step-end infinite; } .segment-colon i { width: 6px; height: 6px; border-radius: 50%; background: var(--vp-c-brand-1); } .clock-seconds { display: flex; align-self: flex-end; gap: 3px; margin: 0 0 11px 7px; } .segment-digit-small { width: 16px; height: 29px; } .segment-digit-small :is(.segment-a,.segment-d,.segment-g) { left: 4px; width: 9px; height: 3px; } .segment-digit-small .segment-a { top: 0; } .segment-digit-small .segment-g { top: 13px; } .segment-digit-small .segment-d { bottom: 0; } .segment-digit-small :is(.segment-b,.segment-c,.segment-e,.segment-f) { width: 3px; height: 10px; } .segment-digit-small .segment-b { top: 3px; right: 1px; } .segment-digit-small .segment-c { right: 1px; bottom: 3px; } .segment-digit-small .segment-e { bottom: 3px; left: 1px; } .segment-digit-small .segment-f { top: 3px; left: 1px; }
.calendar-card { min-height: 432px; padding: 24px 22px 20px; border-radius: 20px; } .calendar-heading { display: flex; align-items: flex-start; justify-content: space-between; } .today-badge { display: grid; width: 48px; height: 48px; place-items: center; color: var(--vp-c-brand-hard); border: 1px solid var(--home-border-strong); border-radius: 15px; background: var(--vp-c-brand-soft); font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; } .calendar-grid { display: grid; grid-template-columns: repeat(7,minmax(0,1fr)); gap: 5px; } .calendar-weekdays { margin-top: 24px; color: var(--vp-c-text-3); font-size: .72rem; text-align: center; } .calendar-days { margin: 8px 0 0; padding: 0; list-style: none; } .calendar-days li { display: grid; min-height: 37px; margin: 0; place-items: center; color: var(--vp-c-text-2); border: 1px solid transparent; border-radius: 10px; font-family: var(--font-mono); font-size: .74rem; font-variant-numeric: tabular-nums; } .calendar-days li.is-empty { visibility: hidden; } .calendar-days li.is-today { color: var(--vp-c-brand-hard); border-color: var(--home-border-strong); background: var(--vp-c-brand-soft); font-weight: 700; } .calendar-footer { display: flex; align-items: center; gap: 9px; margin-top: 16px; padding-top: 14px; color: var(--vp-c-text-3); border-top: 1px solid var(--home-border); font-size: .74rem; }
.home-quote { position: relative; z-index: 1; display: flex; width: min(720px,calc(100% - 32px)); min-height: 50px; align-items: flex-start; justify-content: center; gap: 8px; margin: clamp(36px,5vw,64px) auto 0; padding: 8px 4px; color: var(--vp-c-text-2); border: 2px solid transparent; border-radius: 10px; background: transparent; font-family: 'STKaiti','KaiTi',serif; font-size: .96rem; letter-spacing: .05em; line-height: 1.65; text-align: center; cursor: pointer; transition: color 150ms ease, border-color 150ms ease, opacity 150ms ease; } .home-quote svg { width: 16px; height: 16px; flex: none; margin-top: 4px; color: var(--vp-c-brand-1); }
.navigation-link:focus-visible,.post-preview:focus-visible,.random-card:focus-visible,.social-link:focus-visible,.tech-card:focus-visible,.like-card:focus-visible,.home-quote:focus-visible { border-color: var(--vp-c-brand-1); outline: none; }
.social-link:focus-visible { outline: 2px solid var(--social-color); outline-offset: 3px; }
.navigation-link:active,.post-preview:active,.random-card:active,.social-link:active,.like-card:active { transform: scale(.97); }
@keyframes cursor-blink { 50% { opacity: 0; } } @keyframes colon-pulse { 50% { opacity: .38; } } @keyframes orbit-spin { to { transform: rotate(360deg); } } @keyframes tech-marquee { to { transform: translateX(-50%); } }
@keyframes home-card-reveal { from { opacity: 0; transform: translate3d(var(--reveal-x,0),var(--reveal-y,8px),0) scale(var(--reveal-scale,1)); } to { opacity: 1; transform: translate3d(0,0,0) scale(1); } }
@keyframes home-card-fade { from { opacity: 0; } to { opacity: 1; } }
@media (hover:hover) and (pointer:fine) {
  .home-card:hover { border-color: var(--home-border-strong); transform: translateY(-3px); }
  .navigation-link:hover,.post-preview:hover { color: var(--vp-c-brand-hard); border-color: var(--home-border-strong); background: var(--vp-c-brand-soft); transform: translateX(3px); }
  .random-card:hover { color: var(--vp-c-brand-hard); border-color: var(--home-border-strong); background: var(--vp-c-brand-soft); transform: translateY(-3px); }
  .social-link:hover { color: var(--social-color); background: var(--social-hover); box-shadow: 0 14px 28px rgb(15 25 32 / 13%); transform: translateY(-3px); }
  .profile-card:hover .profile-avatar { border-radius: 52% 48% 56% 44% / 44% 55% 45% 56%; transform: scale(1.015); }
  .like-card:hover .like-icon { transform: scale(1.06); } .tech-card:hover .marquee-track { animation-play-state: paused; } .home-quote:hover { color: var(--vp-c-text-1); }
}

@media (min-width:1260px) {
  .blog-home { padding-top: 36px; }
  .home-layout { position: relative; display: block; width: min(1160px,100%); height: 864px; }
  .home-column,
  .center-utilities { display: contents; }

  .navigation-card,
  .latest-card,
  .random-card,
  .terminal-card,
  .profile-card,
  .social-dock,
  .like-card,
  .tech-card,
  .clock-card,
  .calendar-card { position: absolute; margin: 0; }

  .terminal-card { top: 0; left: calc(50% - 228px); width: 456px; height: 158px; flex: none; }
  .terminal-header { height: 44px; }
  .terminal-body { height: 114px; grid-template-rows: 28px 56px; padding: 10px 24px; }
  .terminal-name,
  .terminal-output .terminal-cursor { font-size: clamp(2rem,3.25vw,2.85rem); }
  .terminal-chevron { font-size: 2.65rem; }

  .navigation-card { top: 104px; left: 32px; width: 272px; height: 322px; min-height: 0; padding: 16px; }
  .navigation-list { gap: 3px; margin-top: 10px; }
  .navigation-link { min-height: 48px; grid-template-columns: 36px minmax(0,1fr); gap: 9px; padding: 4px 7px; }
  .navigation-icon { width: 36px; height: 36px; border-radius: 10px; }
  .navigation-icon svg { width: 19px; height: 19px; }
  .navigation-copy small { display: none; }

  .profile-card { top: 186px; left: calc(50% - 228px); width: 456px; height: 422px; min-height: 0; padding: 18px 24px 10px; }
  .profile-avatar-wrap { width: 220px; margin: 4px auto 8px; }
  .profile-avatar { inset: 10px; width: calc(100% - 20px); height: calc(100% - 20px); border-width: 5px; }
  .profile-badge { right: 4px; bottom: 24px; width: 32px; height: 32px; }
  .profile-greeting { font-size: .69rem; }
  .profile-card h1 { margin-top: 6px; font-size: clamp(1.75rem,2.7vw,2.25rem); }
  .profile-role { min-height: 28px; margin-top: 9px; }
  .profile-signature { margin-top: 10px; font-size: .86rem; }

  .clock-card { top: 104px; left: auto; right: 32px; width: 272px; height: 154px; min-height: 0; padding: 14px 16px; }
  .clock-display { height: 72px; margin: 9px 0 7px; border-radius: 14px; }
  .clock-seconds { margin-bottom: 8px; }

  .calendar-card { top: 288px; left: auto; right: 16px; width: 304px; height: 360px; min-height: 0; padding: 18px 18px 10px; }
  .today-badge { width: 42px; height: 42px; border-radius: 13px; font-size: .95rem; }
  .calendar-weekdays { margin-top: 14px; }
  .calendar-days { margin-top: 5px; }
  .calendar-days li { min-height: 28px; }
  .calendar-footer { margin-top: 9px; padding-top: 10px; }

  .latest-card { top: 456px; left: 88px; width: 232px; height: 140px; min-height: 0; padding: 14px 16px; }
  .post-preview { min-height: 82px; grid-template-columns: 52px minmax(0,1fr); gap: 9px; margin-top: 8px; padding: 7px; }
  .post-cover { width: 52px; }
  .post-copy>span { display: none; }
  .post-copy strong { line-height: 1.3; }

  .social-dock { top: 636px; left: calc(50% - 210px); width: 420px; padding: 0; gap: 10px; }
  .social-link { width: 52px; height: 52px; border-radius: 14px; }
  .social-link.is-featured { width: 112px; min-width: 112px; }
  .social-logo { width: 26px; height: 26px; }
  .social-bilibili .social-logo,.social-mail .social-logo { width: 28px; height: 28px; }
  .social-github .social-logo { width: 24px; height: 24px; }

  .tech-card { top: 716px; left: calc(50% - 228px); width: 456px; height: 124px; min-height: 0; padding: 14px 0 10px; }
  .tech-heading { padding: 0 18px 8px; }
  .tech-chip { min-height: 28px; }
  .tech-chip { margin: 0; }
  .marquee-row+.marquee-row { margin-top: 10px; }

  .random-card { top: 624px; left: 156px; width: 176px; height: 68px; min-height: 0; grid-template-columns: 40px minmax(0,1fr); gap: 10px; padding: 10px; border-radius: 20px; }
  .random-icon { width: 40px; height: 40px; border-radius: 12px; }
  .random-icon svg { width: 22px; height: 22px; }
  .random-copy { display: flex; height: 40px; flex-direction: column; align-items: flex-start; justify-content: center; }
  .random-copy .card-kicker { line-height: 1; }
  .random-copy strong { margin: 4px 0 0; line-height: 1.2; }
  .random-copy small { display: none; }

  .like-card { top: 692px; left: calc(50% + 244px); right: auto; width: 72px; height: 72px; }
  .home-quote { margin-top: 64px; }
}

@media (max-width:1259px) {
  .home-layout { grid-template-columns: minmax(260px,.82fr) minmax(420px,1.18fr); } .left-column,.right-column { padding-top: 0; }
  .center-column { grid-column: 2; grid-row: 1 / span 2; } .right-column { display: grid; grid-column: 1 / -1; grid-template-columns: minmax(260px,.78fr) minmax(390px,1.22fr); align-items: start; }
  .clock-card { min-height: 188px; } .calendar-card { min-height: 432px; }
}
@media (max-width:760px) {
  .blog-home { min-height: auto; padding: 24px 14px 28px; } .home-layout { grid-template-columns: minmax(0,1fr); gap: 14px; max-width: 620px; }
  .center-column { grid-column: 1; grid-row: 1; } .left-column { grid-row: 2; } .right-column { display: flex; width: 100%; grid-column: 1; grid-row: 3; align-items: stretch; }
  .right-column > .home-card { width: 100%; }
  .terminal-card { height: 178px; flex-basis: 178px; } .terminal-body { height: 128px; padding-inline: 18px; } .profile-card { min-height: 430px; padding-inline: 20px; }
  .navigation-card { min-height: auto; } .clock-card { min-height: 188px; } .calendar-card { min-height: 432px; } .center-utilities { grid-template-columns: 72px minmax(0,1fr); }
}
@media (max-width:460px) {
  .terminal-prompt { max-width: 12.5ch; overflow: hidden; text-overflow: ellipsis; } .terminal-name,.terminal-output .terminal-cursor { font-size: clamp(1.35rem,6.4vw,1.55rem); }
  .profile-avatar-wrap { width: 190px; } .social-dock { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; } .social-link { width: 52px; height: 52px; } .social-link.is-featured { width: calc(50% - 4px); min-width: 0; }
  .center-utilities { grid-template-columns: minmax(0,1fr); } .like-card { width: 72px; height: 72px; min-height: 72px; justify-self: center; }
  .calendar-card { min-height: 416px; padding-inline: 16px; } .calendar-days li { min-height: 34px; }
}
@media (prefers-reduced-motion:reduce) {
  .profile-avatar-wrap::before,.orbit-inner,.marquee-track,.terminal-cursor,.segment-colon { animation: none; }
  .home-loader-leave-active,.home-loader-leave-active .home-loader-mark { transition: opacity 150ms var(--ease-out); }
  .home-loader-leave-to .home-loader-mark { transform: none; }
  .blog-home:not(.is-revealed) .reveal-item { transform: none; }
  .blog-home.is-revealed .reveal-item { animation: home-card-fade 180ms var(--ease-out) 0ms backwards; }
  .marquee-row { overflow-x: auto; -webkit-mask-image: none; mask-image: none; scrollbar-width: thin; } .tech-list[aria-hidden='true'] { display: none; }
  .home-card,.navigation-link,.post-preview,.random-card,.social-link,.marquee-control,.profile-avatar,.like-icon { transition-property: color,border-color,background-color,opacity; }
}
</style>

<style>
html[data-theme='dark'] .blog-home .terminal-card { color: #edf2f5; border-color: rgb(255 255 255 / 8%); background: #1b1d20; box-shadow: 0 20px 48px rgb(8 10 12 / 22%); }
html[data-theme='dark'] .blog-home .terminal-header { color: #879098; border-bottom-color: rgb(255 255 255 / 7%); background: #17191c; }
html[data-theme='dark'] .blog-home .terminal-command { color: #aab2b8; }
html[data-theme='dark'] .blog-home .terminal-prompt { color: #75cf95; }
html[data-theme='dark'] .blog-home .terminal-name { color: #f1f4f6; }
html[data-theme='dark'] .blog-home .social-github { --social-color: #f2f5f7; --social-bg: #181b20; --social-hover: #20242a; }
html[data-theme='dark'] .blog-home .social-bilibili { --social-color: #ff8eaf; --social-bg: #37272e; --social-hover: #432c35; }
html[data-theme='dark'] .blog-home .social-mail { --social-color: #ff9ba3; --social-bg: #38282b; --social-hover: #452d31; }
html[data-theme='dark'] .blog-home .social-qq { --social-color: #f3ba4d; --social-bg: #37342f; --social-hover: #444039; }
html[data-theme='dark'] .blog-home .social-plume { --social-color: #83c9d2; --social-bg: #29363a; --social-hover: #304249; }
html[data-theme='dark'] .blog-home .social-plume .social-logo { filter: brightness(1.28) saturate(.92); }
</style>
