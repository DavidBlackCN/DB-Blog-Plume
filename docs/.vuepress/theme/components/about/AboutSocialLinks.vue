<template>
  <nav class="about-socials" aria-label="社交链接">
    <a
      v-for="link in aboutSocialLinks"
      :key="link.label"
      :class="['about-social', `about-social--${link.brand}`, { 'is-featured': link.featured }]"
      :href="link.href"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noopener noreferrer' : undefined"
      :aria-label="link.label"
    >
      <span class="about-social__icon">
        <img :src="link.logo" alt="" aria-hidden="true">
      </span>
      <span v-if="link.featured" class="about-social__label">{{ link.label }}</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
import { aboutSocialLinks } from '../../data/about-page'
</script>
