<template>
  <section class="about-section" aria-labelledby="about-guide-title">
    <header class="about-section__heading">
      <p class="about-eyebrow">START HERE</p>
      <h2 id="about-guide-title">从这里开始探索</h2>
      <p>搜索内容、阅读文章，或干脆随机走进一个页面。</p>
    </header>

    <div class="about-guide-grid">
      <button class="about-card about-guide-search" type="button" @click="openSearch">
        <span class="about-guide-search__icon">
          <Icon name="ph:magnifying-glass" />
        </span>
        <span class="about-guide-search__copy">
          <span class="about-eyebrow">SEARCH</span>
          <strong>查找站内内容</strong>
          <small>点击唤起搜索，或随时使用快捷键。</small>
        </span>
        <kbd>Ctrl K</kbd>
      </button>

      <template v-for="item in aboutGuideLinks" :key="item.title">
        <a
          v-if="item.external"
          class="about-card about-guide-link"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AboutGuideContent :item="item" />
        </a>
        <RouterLink v-else class="about-card about-guide-link" :to="item.href">
          <AboutGuideContent :item="item" />
        </RouterLink>
      </template>

      <div class="about-card about-site-status" role="status">
        <Icon name="ph:chat-circle-dots" />
        <div>
          <span class="about-eyebrow">DISCUSS</span>
          <strong>评论区开放中</strong>
          <p>文章页已接入 Waline，回复会通过邮件通知。</p>
        </div>
        <span class="about-site-status__state">
          <i /> ONLINE
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, h, resolveComponent } from 'vue'
import { aboutGuideLinks, type AboutGuideLink } from '../../data/about-page'

const AboutGuideContent = defineComponent({
  props: {
    item: {
      type: Object as () => AboutGuideLink,
      required: true,
    },
  },
  setup(props) {
    const Icon = resolveComponent('Icon')

    return () => h('div', { class: 'about-guide-link__inner' }, [
      h('span', { class: 'about-guide-link__icon' }, [h(Icon, { name: props.item.icon })]),
      h('span', { class: 'about-guide-link__copy' }, [
        h('span', { class: 'about-eyebrow' }, props.item.eyebrow),
        h('strong', props.item.title),
        h('small', props.item.description),
      ]),
    ])
  },
})

function openSearch() {
  window.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'k',
    code: 'KeyK',
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  }))
}
</script>
