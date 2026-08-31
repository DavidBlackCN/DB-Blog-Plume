---
title: 导航页说明
createTime: 2026/08/31 16:43:08
permalink: /nav/nav-intro/
sidebar: false
---

## 组件
导航页使用了自定义 Vue 组件，`NavigationDirectory.vue` 作为布局样式基础，再新建 Vue 组件并导入 **基础组件** 和 **数据文件** 以实现多导航页复用。

以 `NavPageExample.vue` 作为示例：

``` vue
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
```

在页面中使用：
``` markdown
<NavPage />

<script setup>
import NavPage from '/.vuepress/theme/components/NavPageExample.vue'
</script>
```

## 目录

<GroupDirectory />