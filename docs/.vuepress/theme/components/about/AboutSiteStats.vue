<template>
  <article class="about-card about-stats-card" :aria-busy="loading">
    <header>
      <div>
        <p class="about-eyebrow">SITE INSIGHTS</p>
        <h3>驿站来访记录</h3>
      </div>
      <span :class="['about-stats-state', { 'is-ready': !loading && !unavailable }]">
        <i /> {{ unavailable ? 'UNAVAILABLE' : loading ? 'SYNCING' : 'LIVE' }}
      </span>
    </header>

    <div class="about-stats-grid" aria-live="polite">
      <div>
        <Icon name="ph:eye" aria-hidden="true" />
        <span>
          <strong>{{ sitePv }}</strong>
          <small>累计访问</small>
        </span>
      </div>
      <div>
        <Icon name="ph:users-three" aria-hidden="true" />
        <span>
          <strong>{{ siteUv }}</strong>
          <small>独立访客</small>
        </span>
      </div>
    </div>

    <div class="about-runtime">
      <div class="about-runtime__title">
        <Icon name="ph:timer" aria-hidden="true" />
        <span>
          <small>SITE UPTIME</small>
          <strong>驿站已平稳运行</strong>
        </span>
      </div>
      <time
        class="about-runtime__clock"
        datetime="2025-08-12T00:00:00+08:00"
        :aria-label="runtimeLabel"
        title="自 2025 年 8 月 12 日起"
      >
        <span><b>{{ runtime.years }}</b><small>年</small></span>
        <span><b>{{ runtime.days }}</b><small>天</small></span>
        <span><b>{{ runtime.hours }}</b><small>时</small></span>
        <span><b>{{ runtime.minutes }}</b><small>分</small></span>
        <span><b>{{ runtime.seconds }}</b><small>秒</small></span>
      </time>
    </div>

    <footer>
      <span>数据由不蒜子实时统计</span>
      <a href="https://busuanzi.ibruce.info/" target="_blank" rel="noopener noreferrer">BUSUANZI</a>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { useSiteInsights } from '../../composables/useSiteInsights'

const {
  sitePv,
  siteUv,
  loading,
  unavailable,
  runtime,
  runtimeLabel,
} = useSiteInsights()
</script>
