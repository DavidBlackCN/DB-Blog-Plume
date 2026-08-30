<template>
  <article
    class="nm-card"
    :class="{ 'is-loading': loading, 'is-error': error }"
    :aria-busy="loading"
  >
    <div v-if="loading" class="nm-skeleton" role="status">
      <span class="sr-only">正在加载网易云音乐信息</span>
      <div class="nm-skeleton-top">
        <span class="nm-skeleton-kicker"></span>
        <span class="nm-skeleton-brand"></span>
      </div>
      <div class="nm-skeleton-main">
        <span class="nm-skeleton-cover"></span>
        <div class="nm-skeleton-copy">
          <span class="nm-skeleton-title"></span>
          <span class="nm-skeleton-text"></span>
          <span class="nm-skeleton-text is-short"></span>
          <span class="nm-skeleton-lyric"></span>
        </div>
      </div>
      <div class="nm-skeleton-footer">
        <span></span><span></span><span></span>
      </div>
      <div class="nm-skeleton-comment">
        <span class="nm-skeleton-avatar"></span>
        <div>
          <span class="nm-skeleton-comment-name"></span>
          <span class="nm-skeleton-comment-text"></span>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="nm-error-message" role="alert">
      <span class="nm-error-icon" aria-hidden="true">
        <Icon icon="octicon:alert-16" />
      </span>
      <div>
        <strong>音乐卡片加载失败</strong>
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-else-if="songData" class="nm-card-content">
      <header class="nm-card-header">
        <span class="nm-kicker">NETEASE / TRACK {{ songData.id }}</span>
        <a
          class="nm-brand"
          :href="songUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在网易云音乐中打开"
        >
          <Icon icon="simple-icons:neteasecloudmusic" aria-hidden="true" />
          <span>网易云音乐</span>
        </a>
      </header>

      <div class="nm-main">
        <a
          class="nm-cover-link"
          :href="songUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`在网易云音乐中收听《${songData.name}》`"
        >
          <span class="nm-record" aria-hidden="true"></span>
          <span class="nm-cover-frame">
            <img
              :src="coverUrl"
              class="nm-cover"
              :alt="`${songData.name} 的专辑封面`"
              loading="lazy"
            >
            <span class="nm-play-indicator" aria-hidden="true">
              <Icon icon="solar:play-bold" />
            </span>
          </span>
        </a>

        <div class="nm-info">
          <div class="nm-title-row">
            <h3 class="nm-title">
              <a :href="songUrl" target="_blank" rel="noopener noreferrer">
                {{ songData.name }}
              </a>
            </h3>
            <span v-if="qualityLabel" class="nm-quality">{{ qualityLabel }}</span>
          </div>

          <p v-if="songSubtitle" class="nm-subtitle">{{ songSubtitle }}</p>

          <div class="nm-metadata">
            <span class="nm-meta-line">
              <Icon icon="solar:user-speak-rounded-linear" aria-hidden="true" />
              <span>{{ artistNames }}</span>
            </span>
            <span class="nm-meta-line">
              <Icon icon="solar:album-linear" aria-hidden="true" />
              <span>{{ albumName }}</span>
            </span>
          </div>

          <figure v-if="featuredLyric.original" class="nm-lyric">
            <Icon class="nm-lyric-icon" icon="mingcute:quote-left-fill" aria-hidden="true" />
            <figcaption>
              <p>{{ featuredLyric.original }}</p>
              <p v-if="featuredLyric.translation" class="nm-lyric-translation">
                {{ featuredLyric.translation }}
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      <footer class="nm-footer">
        <div class="nm-stats" aria-label="歌曲信息">
          <span class="nm-stat is-highlight">
            <Icon icon="solar:chat-round-dots-linear" aria-hidden="true" />
            {{ formatNumber(commentCount) }} 条评论
          </span>
          <span v-if="durationLabel" class="nm-stat">
            <Icon icon="solar:clock-circle-linear" aria-hidden="true" />
            {{ durationLabel }}
          </span>
          <time v-if="publishDate" class="nm-stat" :datetime="publishDate.iso">
            <Icon icon="solar:calendar-linear" aria-hidden="true" />
            {{ publishDate.label }} 发行
          </time>
        </div>

        <div class="nm-actions">
          <a
            v-if="mvUrl"
            class="nm-action is-secondary"
            :href="mvUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="solar:videocamera-record-linear" aria-hidden="true" />
            MV
          </a>
          <a
            class="nm-action is-primary"
            :href="songUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            去收听
            <Icon icon="solar:arrow-right-up-linear" aria-hidden="true" />
          </a>
        </div>
      </footer>

      <aside v-if="hotComment" class="nm-comment" aria-label="热门评论">
        <img
          :src="`${hotComment.user.avatarUrl}?param=72y72`"
          class="nm-comment-avatar"
          :alt="`${hotComment.user.nickname} 的头像`"
          loading="lazy"
        >
        <div class="nm-comment-body">
          <div class="nm-comment-heading">
            <span class="nm-comment-user">{{ hotComment.user.nickname }}</span>
            <span class="nm-comment-label">热门评论</span>
          </div>
          <p class="nm-comment-content">{{ hotComment.content }}</p>
        </div>
        <span v-if="hotComment.likedCount" class="nm-comment-likes">
          <Icon icon="solar:heart-angle-linear" aria-hidden="true" />
          {{ formatNumber(hotComment.likedCount) }}
        </span>
      </aside>
    </div>
  </article>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  id: { type: String, required: true },
  baseUrl: { type: String, default: 'https://api.neteasemusic.davidblackcn.online/' }
})

const songData = ref(null)
const privilegeData = ref(null)
const featuredLyric = ref({ original: '', translation: '' })
const hotComment = ref(null)
const commentCount = ref(0)
const loading = ref(true)
const error = ref('')

let activeController = null

const songUrl = computed(() => songData.value
  ? `https://music.163.com/#/song?id=${songData.value.id}`
  : 'https://music.163.com/')

const mvUrl = computed(() => songData.value?.mv
  ? `https://music.163.com/#/mv?id=${songData.value.mv}`
  : '')

const coverUrl = computed(() => {
  const url = songData.value?.al?.picUrl
  return url ? `${url}?param=240y240` : ''
})

const artistNames = computed(() => {
  const artists = songData.value?.ar
  return artists?.length ? artists.map(artist => artist.name).join(' / ') : '未知歌手'
})

const albumName = computed(() => songData.value?.al?.name || '未知专辑')

const songSubtitle = computed(() => {
  const aliases = [
    ...(songData.value?.alia || []),
    ...(songData.value?.tns || [])
  ].filter(Boolean)
  return [...new Set(aliases)].join(' · ')
})

const qualityLabel = computed(() => {
  const song = songData.value
  const privilege = privilegeData.value
  const level = privilege?.maxBrLevel || privilege?.playMaxBrLevel || ''

  if (song?.hr || level === 'hires') return 'Hi-Res'
  if (song?.sq || level === 'lossless' || privilege?.maxbr >= 900000) return 'SQ'
  if (song?.h || privilege?.maxbr >= 320000) return 'HQ'
  return ''
})

const durationLabel = computed(() => {
  const duration = Number(songData.value?.dt)
  if (!duration) return ''
  const totalSeconds = Math.floor(duration / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})

const publishDate = computed(() => {
  const timestamp = Number(songData.value?.publishTime)
  if (!timestamp) return null
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return {
    iso: `${year}-${month}-${day}`,
    label: `${year}.${month}.${day}`
  }
})

function formatNumber(value) {
  const number = Number(value) || 0
  if (number >= 100000000) return `${(number / 100000000).toFixed(1).replace(/\.0$/, '')} 亿`
  if (number >= 10000) return `${(number / 10000).toFixed(1).replace(/\.0$/, '')} 万`
  return number.toLocaleString('zh-CN')
}

function parseTimedLyrics(rawLyric = '') {
  return rawLyric
    .split('\n')
    .flatMap((line) => {
      const content = line.replace(/\[[^\]]+\]/g, '').trim()
      const timeTags = [...line.matchAll(/\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g)]
      if (!content || !timeTags.length) return []

      return timeTags.map((match) => {
        const fraction = (match[3] || '0').padEnd(3, '0').slice(0, 3)
        return {
          content,
          time: Number(match[1]) * 60000 + Number(match[2]) * 1000 + Number(fraction)
        }
      })
    })
    .filter(row => !/^(作词|作曲|编曲|制作人|混音|录音|母带|发行|出品|监制)\s*[:：]/.test(row.content))
}

function pickFeaturedLyric(lyricData) {
  const originalRows = parseTimedLyrics(lyricData?.lrc?.lyric)
    .filter(row => row.content.length >= 3)
  if (!originalRows.length) return { original: '', translation: '' }

  const translatedRows = parseTimedLyrics(lyricData?.tlyric?.lyric)
  const preferredIndex = Math.min(
    originalRows.length - 1,
    Math.max(0, Math.floor(originalRows.length * 0.42))
  )
  const selected = originalRows[preferredIndex]
  const translation = translatedRows.find(row => Math.abs(row.time - selected.time) <= 400)?.content || ''

  return {
    original: selected.content,
    translation: translation !== selected.content ? translation : ''
  }
}

async function requestJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`接口响应异常（${response.status}）`)
  const data = await response.json()
  if (Number(data?.code) >= 400) throw new Error(data.message || `接口返回错误（${data.code}）`)
  return data
}

async function requestLyrics(apiBase, songId, signal) {
  try {
    return await requestJson(`${apiBase}/lyric/new?id=${songId}`, signal)
  } catch (lyricError) {
    if (lyricError?.name === 'AbortError') throw lyricError
    return requestJson(`${apiBase}/lyric?id=${songId}`, signal)
  }
}

function resetData() {
  songData.value = null
  privilegeData.value = null
  featuredLyric.value = { original: '', translation: '' }
  hotComment.value = null
  commentCount.value = 0
}

async function fetchAllData() {
  const songId = String(props.id).match(/\d+/)?.[0]
  if (!songId) {
    resetData()
    error.value = '歌曲 ID 格式错误'
    loading.value = false
    return
  }

  activeController?.abort()
  activeController = new AbortController()
  const { signal } = activeController
  const apiBase = props.baseUrl.replace(/\/$/, '')

  resetData()
  error.value = ''
  loading.value = true

  try {
    const [detailResult, lyricResult, commentResult] = await Promise.allSettled([
      requestJson(`${apiBase}/song/detail?ids=${songId}`, signal),
      requestLyrics(apiBase, songId, signal),
      requestJson(`${apiBase}/comment/music?id=${songId}&limit=1`, signal)
    ])

    if (detailResult.status === 'rejected') throw detailResult.reason

    const detailData = detailResult.value
    const song = detailData.songs?.[0]
    if (!song) throw new Error('未找到这首歌曲')

    songData.value = song
    privilegeData.value = detailData.privileges?.[0] || null

    if (lyricResult.status === 'fulfilled') {
      featuredLyric.value = pickFeaturedLyric(lyricResult.value)
    }

    if (commentResult.status === 'fulfilled') {
      const commentData = commentResult.value
      commentCount.value = Number(commentData.total) || 0
      hotComment.value = commentData.hotComments?.[0] || commentData.comments?.[0] || null
    }
  } catch (fetchError) {
    if (fetchError?.name === 'AbortError') return
    error.value = fetchError?.message || '暂时无法获取歌曲信息'
  } finally {
    if (!signal.aborted) loading.value = false
  }
}

onMounted(fetchAllData)
watch(() => [props.id, props.baseUrl], fetchAllData)
onBeforeUnmount(() => activeController?.abort())
</script>

<style scoped>
/* Northstar 网易云音乐卡片 */
.nm-card {
  --nm-accent: #e60026;
  --nm-accent-hover: #c90021;
  --nm-accent-soft: rgba(230, 0, 38, 0.08);
  --nm-accent-soft-strong: rgba(230, 0, 38, 0.13);
  --nm-accent-border: rgba(230, 0, 38, 0.42);
  --nm-ease-out: var(--motion-ease-out, cubic-bezier(0.23, 1, 0.32, 1));
  position: relative;
  box-sizing: border-box;
  margin: 1.25rem 0;
  overflow: hidden;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-family: var(--font-ui);
  text-align: left;
  overflow-wrap: anywhere;
  transition: border-color 160ms ease,
    background-color 160ms ease,
    transform 180ms var(--nm-ease-out);
}

.nm-card::before {
  position: absolute;
  z-index: 1;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--nm-accent);
  content: '';
}

:global(html.dark .nm-card),
:global([data-theme="dark"] .nm-card) {
  --nm-accent: #ff6673;
  --nm-accent-hover: #ff8992;
  --nm-accent-soft: rgba(255, 102, 115, 0.11);
  --nm-accent-soft-strong: rgba(255, 102, 115, 0.17);
  --nm-accent-border: rgba(255, 102, 115, 0.48);
}

.nm-card-content,
.nm-skeleton,
.nm-error-message {
  padding: 16px 18px 16px 20px;
}

.nm-skeleton {
  box-sizing: border-box;
  min-height: 330px;
}

.nm-card-header,
.nm-skeleton-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 26px;
  gap: 12px;
}

.nm-kicker {
  color: var(--vp-c-text-3);
  font-family: var(--font-code);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1.3;
}

.nm-brand {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--nm-accent-soft);
  color: var(--nm-accent);
  font-family: var(--font-ui);
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  transition: color 140ms ease, background-color 140ms ease;
}

.nm-brand svg { flex: 0 0 auto; font-size: 15px; }

.nm-main {
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  margin-top: 14px;
}

.nm-cover-link {
  position: relative;
  display: block;
  width: 116px;
  height: 104px;
  color: inherit;
  text-decoration: none;
}

.nm-record {
  position: absolute;
  top: 9px;
  right: 0;
  width: 86px;
  height: 86px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background:
    radial-gradient(circle, var(--nm-accent) 0 9%, #d6d7da 10% 15%, transparent 16%),
    repeating-radial-gradient(circle, #25272c 0 3px, #17181b 4px 6px);
}

.nm-cover-frame {
  position: absolute;
  z-index: 1;
  top: 4px;
  left: 0;
  display: block;
  width: 96px;
  height: 96px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-alt);
}

.nm-cover {
  display: block;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  object-fit: cover;
  transition: transform 180ms var(--nm-ease-out), filter 160ms ease;
}

.nm-play-indicator {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(16, 17, 20, 0.4);
  color: #fff;
  opacity: 0;
  transition: opacity 160ms ease;
}

.nm-play-indicator svg {
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 50%;
  background: var(--nm-accent);
  transform: scale(0.94);
  transition: transform 180ms var(--nm-ease-out);
}

.nm-info { min-width: 0; }
.nm-title-row { display: flex; align-items: center; gap: 8px; }

.nm-title {
  min-width: 0;
  margin: 0 !important;
  font-family: var(--font-heading);
  font-size: 1.16rem !important;
  font-weight: 700;
  line-height: 1.35;
}

.nm-title a {
  display: block;
  overflow: hidden;
  color: var(--vp-c-text-1);
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  transition: color 140ms ease;
}

.nm-quality {
  flex: 0 0 auto;
  padding: 2px 5px;
  border: 1px solid var(--nm-accent-border);
  border-radius: 5px;
  background: var(--nm-accent-soft);
  color: var(--nm-accent);
  font-family: var(--font-code);
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.2;
}

.nm-subtitle {
  margin: 3px 0 0 !important;
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nm-metadata { display: grid; gap: 4px; margin-top: 8px; }

.nm-meta-line {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  line-height: 1.35;
}

.nm-meta-line svg { flex: 0 0 auto; color: var(--nm-accent); font-size: 14px; }
.nm-meta-line span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.nm-lyric {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 11px 0 0;
  padding: 8px 10px;
  border-radius: 7px;
  background: var(--nm-accent-soft);
  text-align: left;
}

.nm-lyric-icon { flex: 0 0 auto; margin-top: 2px; color: var(--nm-accent); font-size: 13px; }
.nm-lyric figcaption {
  min-width: 0;
  flex: 1;
  margin: 0;
  padding: 0;
  text-align: left;
}

.nm-lyric p {
  margin: 0 !important;
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 0.78rem;
  line-height: 1.45;
  text-align: left !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nm-lyric .nm-lyric-translation {
  margin-top: 2px !important;
  color: var(--vp-c-text-3);
  font-size: 0.7rem;
}

.nm-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.nm-stats,
.nm-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }

.nm-stat,
.nm-action {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  gap: 5px;
  border-radius: 6px;
  font-family: var(--font-ui);
  font-size: 0.68rem;
  line-height: 1.2;
}

.nm-stat { color: var(--vp-c-text-3); }
.nm-stat svg, .nm-action svg { flex: 0 0 auto; font-size: 14px; }
.nm-stat.is-highlight { color: var(--nm-accent); }

.nm-action {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-weight: 600;
  text-decoration: none;
  transition: color 140ms ease,
    border-color 140ms ease,
    background-color 140ms ease,
    transform 140ms var(--nm-ease-out);
}

.nm-action.is-primary {
  border-color: var(--nm-accent-border);
  background: var(--nm-accent-soft);
  color: var(--nm-accent);
}

.nm-comment {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 9px 10px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.nm-comment-avatar {
  display: block;
  flex: 0 0 auto;
  width: 34px !important;
  height: 34px !important;
  margin: 0 !important;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50% !important;
  background: var(--vp-c-bg-alt);
  object-fit: cover;
}

.nm-card .nm-comment-avatar:hover { transform: none; }
.nm-comment-body { min-width: 0; flex: 1; }
.nm-comment-heading { display: flex; align-items: center; gap: 7px; margin-bottom: 2px; }

.nm-comment-user {
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nm-comment-label {
  flex: 0 0 auto;
  color: var(--nm-accent);
  font-family: var(--font-ui);
  font-size: 0.6rem;
  letter-spacing: 0.04em;
}

.nm-comment-content {
  display: -webkit-box;
  margin: 0 !important;
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 0.75rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.nm-comment-likes {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 4px;
  color: var(--vp-c-text-3);
  font-family: var(--font-ui);
  font-size: 0.65rem;
}

.nm-comment-likes svg { color: var(--nm-accent); font-size: 13px; }

.nm-skeleton-main {
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  margin-top: 14px;
}

.nm-skeleton-copy { display: grid; gap: 8px; }

.nm-skeleton-kicker,
.nm-skeleton-brand,
.nm-skeleton-cover,
.nm-skeleton-title,
.nm-skeleton-text,
.nm-skeleton-lyric,
.nm-skeleton-footer span,
.nm-skeleton-avatar,
.nm-skeleton-comment-name,
.nm-skeleton-comment-text {
  display: block;
  border-radius: 6px;
  background: var(--vp-c-divider);
  animation: nm-skeleton-pulse 1.1s ease-in-out infinite alternate;
}

.nm-skeleton-kicker { width: 120px; height: 9px; }
.nm-skeleton-brand { width: 84px; height: 26px; }
.nm-skeleton-cover { width: 96px; height: 96px; border-radius: 10px; }
.nm-skeleton-title { width: min(52%, 240px); height: 18px; }
.nm-skeleton-text { width: min(82%, 380px); height: 11px; }
.nm-skeleton-text.is-short { width: min(58%, 260px); }
.nm-skeleton-lyric { width: 100%; height: 44px; margin-top: 3px; }

.nm-skeleton-footer {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.nm-skeleton-footer span { width: 74px; height: 28px; }

.nm-skeleton-comment {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 9px 10px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.nm-skeleton-comment > div {
  display: grid;
  gap: 6px;
}

.nm-skeleton-avatar { width: 34px; height: 34px; border-radius: 50%; }
.nm-skeleton-comment-name { width: min(28%, 110px); height: 9px; }
.nm-skeleton-comment-text { width: min(82%, 420px); height: 10px; }

.nm-error-message {
  display: flex;
  align-items: center;
  min-height: 112px;
  gap: 12px;
  color: var(--vp-c-danger-1);
}

.nm-error-icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--vp-c-danger-soft, rgba(230, 0, 38, 0.1));
  font-size: 17px;
}

.nm-error-message strong { color: var(--vp-c-text-1); font-size: 0.86rem; }
.nm-error-message p { margin: 3px 0 0 !important; color: var(--vp-c-text-2); font-size: 0.76rem; }

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

@media (hover: hover) and (pointer: fine) {
  .nm-card:hover {
    border-color: var(--nm-accent-border);
    background: var(--vp-c-bg-safe);
    transform: translateY(-2px);
  }

  .nm-brand:hover,
  .nm-action.is-primary:hover {
    background: var(--nm-accent-soft-strong);
    color: var(--nm-accent-hover);
  }

  .nm-title a:hover { color: var(--nm-accent-hover); }
  .nm-cover-link:hover .nm-cover { filter: saturate(1.04); transform: scale(1.025); }
  .nm-cover-link:hover .nm-play-indicator { opacity: 1; }
  .nm-cover-link:hover .nm-play-indicator svg { transform: scale(1); }

  .nm-action:hover {
    border-color: var(--nm-accent-border);
    color: var(--vp-c-text-1);
    transform: translateY(-1px);
  }
}

.nm-brand:focus-visible,
.nm-cover-link:focus-visible,
.nm-title a:focus-visible,
.nm-action:focus-visible {
  outline: 2px solid var(--nm-accent);
  outline-offset: 2px;
}

.nm-brand:active,
.nm-action:active { transform: scale(0.97); }

@media (max-width: 640px) {
  .nm-card-content,
  .nm-skeleton,
  .nm-error-message { padding: 14px 14px 14px 17px; }

  .nm-main,
  .nm-skeleton-main { grid-template-columns: 98px minmax(0, 1fr); gap: 13px; }
  .nm-cover-link { width: 98px; height: 90px; }
  .nm-cover-frame, .nm-skeleton-cover { width: 84px; height: 84px; }
  .nm-record { top: 7px; width: 76px; height: 76px; }
  .nm-title { font-size: 1.03rem !important; }
  .nm-lyric-translation, .nm-comment-label { display: none; }
  .nm-footer { align-items: flex-start; flex-direction: column; }
  .nm-actions { align-self: stretch; justify-content: flex-end; }
}

@media (max-width: 420px) {
  .nm-kicker {
    max-width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nm-brand span, .nm-comment-likes { display: none; }
  .nm-brand { width: 28px; padding: 3px; justify-content: center; }
  .nm-main, .nm-skeleton-main { grid-template-columns: 82px minmax(0, 1fr); gap: 11px; }
  .nm-cover-link { width: 82px; height: 78px; }
  .nm-cover-frame, .nm-skeleton-cover { width: 72px; height: 72px; }
  .nm-record { top: 6px; width: 66px; height: 66px; }
  .nm-lyric { padding: 7px 8px; }
  .nm-comment-avatar { width: 30px !important; height: 30px !important; }
}

@media (prefers-reduced-motion: reduce) {
  .nm-card,
  .nm-brand,
  .nm-cover,
  .nm-play-indicator,
  .nm-play-indicator svg,
  .nm-title a,
  .nm-action {
    transition: color 140ms ease,
      border-color 140ms ease,
      background-color 140ms ease,
      opacity 140ms ease;
  }

  .nm-skeleton-kicker,
  .nm-skeleton-brand,
  .nm-skeleton-cover,
  .nm-skeleton-title,
  .nm-skeleton-text,
  .nm-skeleton-lyric,
  .nm-skeleton-footer span,
  .nm-skeleton-avatar,
  .nm-skeleton-comment-name,
  .nm-skeleton-comment-text { animation: none; }
}

@keyframes nm-skeleton-pulse {
  from { opacity: 0.55; }
  to { opacity: 1; }
}
</style>
