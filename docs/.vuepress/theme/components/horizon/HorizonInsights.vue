<template>
  <section class="horizon-panel horizon-insights" aria-labelledby="horizon-insights-title">
    <header class="horizon-section-heading">
      <div>
        <p class="horizon-eyebrow">PULSE</p>
        <h2 id="horizon-insights-title">此刻，站内正在发生</h2>
      </div>
      <span :class="['horizon-insights__state', `is-${status}`]">
        <i />{{ statusLabel }}
      </span>
    </header>

    <div class="horizon-insights__grid">
      <article class="horizon-latest">
        <p class="horizon-insights__label"><Icon name="ph:clock-counter-clockwise" /> 最新文章</p>
        <RouterLink v-if="latestPost" :to="latestPost.path">
          <strong>{{ latestPost.title }}</strong>
          <p>{{ latestExcerpt }}</p>
          <time :datetime="latestPost.createTime">{{ latestDate }}</time>
        </RouterLink>
        <div v-else class="horizon-latest__empty">
          <strong>新文章正在路上</strong>
          <p>暂时没有可展示的公开文章。</p>
        </div>
      </article>

      <article class="horizon-site-stats" :aria-busy="loading">
        <p class="horizon-insights__label"><Icon name="ph:chart-line-up" /> 站点洞察</p>
        <div class="horizon-site-stats__counts" aria-live="polite">
          <span><strong>{{ sitePv }}</strong><small>累计访问</small></span>
          <span><strong>{{ siteUv }}</strong><small>独立访客</small></span>
        </div>
        <time
          class="horizon-runtime"
          datetime="2025-08-12T00:00:00+08:00"
          :aria-label="runtimeLabel"
          title="自 2025 年 8 月 12 日起"
        >
          <span><b>{{ runtime.years }}</b><small>年</small></span>
          <span><b>{{ runtime.days }}</b><small>天</small></span>
          <span><b>{{ runtime.hours }}</b><small>时</small></span>
          <span><b>{{ runtime.minutes }}</b><small>分</small></span>
          <span class="is-seconds"><b>{{ runtime.seconds }}</b><small>秒</small></span>
        </time>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePageLang } from 'vuepress/client'
import { useLocalePostList, usePostsData } from 'vuepress-theme-plume/client'
import { useSiteInsights } from '../../composables/useSiteInsights'

const localePosts = useLocalePostList()
const allPosts = usePostsData()
const pageLang = usePageLang()
const { sitePv, siteUv, loading, status, runtime, runtimeLabel } = useSiteInsights()

const latestPost = computed(() => {
  const posts = localePosts.value.length
    ? localePosts.value
    : Object.values(allPosts.value).flat().filter(post => post.lang === pageLang.value)

  return [...posts]
    .filter(post => !post.draft)
    .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())[0]
})

const latestExcerpt = computed(() => {
  const text = latestPost.value?.excerpt
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  return text || '打开文章，看看最近记录了什么。'
})

const latestDate = computed(() => {
  if (!latestPost.value?.createTime) return ''
  const date = new Date(latestPost.value.createTime)
  return Number.isNaN(date.getTime())
    ? latestPost.value.createTime
    : new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
})

const statusLabel = computed(() => ({
  syncing: 'SYNCING',
  live: 'LIVE',
  unavailable: 'UNAVAILABLE',
})[status.value])
</script>
