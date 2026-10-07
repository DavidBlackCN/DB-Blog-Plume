<template>
  <ReadingGridBackground v-if="isReadingPage" :key="route.path" :variant="variant" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { usePageFrontmatter, useRoute } from 'vuepress/client'

import ReadingGridBackground from './ReadingGridBackground.vue'

const route = useRoute()
const frontmatter = usePageFrontmatter()

const excludedPageLayouts: ReadonlySet<unknown> = new Set([false, 'home', 'custom', 'friends'])

const isReadingPage = computed(() => {
  const pageLayout = frontmatter.value.pageLayout

  if (route.path === '/' || frontmatter.value.layout === 'NotFound') return false
  if (excludedPageLayouts.has(pageLayout)) return false

  // 未显式声明 pageLayout 的 Markdown 页面由 Plume 按 doc 布局渲染。
  // 博客聚合页与文章页也属于阅读场景，使用独立的柔和技术网格。
  return pageLayout === undefined
    || pageLayout === 'doc'
    || pageLayout === 'page'
    || pageLayout === 'posts'
    || route.path.startsWith('/blog/')
    || route.path.startsWith('/article/')
})

const variant = computed(() => frontmatter.value.pageLayout === 'posts'
  || route.path.startsWith('/blog/') || route.path.startsWith('/article/') ? 'blog' : 'docs')

function syncRootClass(active: boolean) {
  document.documentElement.classList.toggle('has-reading-background', active)
}

let stopWatching: (() => void) | undefined

onMounted(() => {
  stopWatching = watch(isReadingPage, syncRootClass, { immediate: true })
})

onUnmounted(() => {
  stopWatching?.()
  document.documentElement.classList.remove('has-reading-background')
})
</script>
