<template>
  <NavigationDirectory
    :data="navigationData"
    title="Minecraft 导航"
    subtitle="从社区、百科到启动器与服务端工具，集中浏览 Minecraft 相关资源。"
  />
</template>

<script setup>
import NavigationDirectory from './NavigationDirectory.vue'
import navigationData from '../data/minecraft-navigation.json'
</script>
