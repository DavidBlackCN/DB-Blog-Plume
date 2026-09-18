<template>
  <section class="horizon-panel horizon-navigation" aria-labelledby="horizon-navigation-title">
    <header class="horizon-section-heading">
      <div>
        <p class="horizon-eyebrow">START HERE</p>
        <h2 id="horizon-navigation-title">从一条路径出发</h2>
      </div>
      <span>04 ROUTES</span>
    </header>

    <nav class="horizon-navigation__grid" aria-label="首页快捷导航">
      <RouterLink v-for="item in navigation" :key="item.href" :to="item.href">
        <Icon :name="item.icon" aria-hidden="true" />
        <span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.description }}</small>
        </span>
        <Icon class="horizon-navigation__direction" name="ph:arrow-up-right" aria-hidden="true" />
      </RouterLink>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const navigation = [
  { title: '博客文章', description: '读最近写下的内容', href: '/blog/', icon: 'ph:article' },
  { title: '开源项目', description: '查看作品与实验记录', href: '/ghProject/', icon: 'ph:code' },
  { title: '实用导航', description: '抵达常用工具与站点', href: '/nav/nav-minecraft/', icon: 'ph:compass' },
  { title: '随机漫步', description: '和一篇旧文章相遇', href: '/more/random/', icon: 'ph:shuffle' },
]
</script>
