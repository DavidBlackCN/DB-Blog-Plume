<template>
  <SpaceBackground v-if="isReadingPage" variant="reading" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { usePageFrontmatter, useRoute } from 'vuepress/client'

import SpaceBackground from './SpaceBackground.vue'

const route = useRoute()
const frontmatter = usePageFrontmatter()

const excludedPageLayouts: ReadonlySet<unknown> = new Set([false, 'home', 'custom', 'friends'])

const isReadingPage = computed(() => {
  const pageLayout = frontmatter.value.pageLayout

  if (route.path === '/' || frontmatter.value.layout === 'NotFound') return false
  if (excludedPageLayouts.has(pageLayout)) return false

  // 未显式声明 pageLayout 的 Markdown 页面由 Plume 按 doc 布局渲染。
  // 博客聚合页与文章页也属于阅读场景，继续使用低动态背景。
  return pageLayout === undefined
    || pageLayout === 'doc'
    || pageLayout === 'page'
    || pageLayout === 'posts'
    || route.path.startsWith('/blog/')
    || route.path.startsWith('/article/')
})

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
