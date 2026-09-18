<template>
  <nav class="horizon-social" aria-label="找到我">
    <div class="horizon-social__links">
      <a
        v-for="item in socialLinks"
        :key="item.label"
        :class="['horizon-social-link', `is-${item.brand}`]"
        :href="item.href"
        :aria-label="item.label"
        :title="item.label"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noopener noreferrer' : undefined"
      >
        <Icon :name="item.icon" aria-hidden="true" />
        <span class="horizon-sr-only">{{ item.label }}</span>
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/DavidBlackCN', icon: 'simple-icons:github', brand: 'github', external: true },
  { label: 'BiliBili', href: 'https://space.bilibili.com/453841968', icon: 'simple-icons:bilibili', brand: 'bilibili', external: true },
  { label: 'Email', href: 'mailto:davidblackcn@outlook.com', icon: 'ph:envelope-simple-fill', brand: 'mail' },
  { label: 'QQ', href: 'https://qm.qq.com/q/1aIBKPoWgc', icon: 'simple-icons:qq', brand: 'qq', external: true },
]
</script>
