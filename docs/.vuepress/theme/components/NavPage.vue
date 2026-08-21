<template>
  <NavigationDirectory
    :data="navigationData"
    title="开发资源导航"
    subtitle="整理常用的开发、设计、学习与协作资源，支持按关键词和标签快速筛选。"
  />
</template>

<script setup>
import NavigationDirectory from './NavigationDirectory.vue'
import navigationData from '../data/navigation.json'
</script>
