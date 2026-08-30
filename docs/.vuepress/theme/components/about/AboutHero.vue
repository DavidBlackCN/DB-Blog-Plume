<template>
  <section class="about-card about-hero" aria-labelledby="about-page-title">
    <div class="about-hero__visual" aria-hidden="true">
      <div class="about-avatar-orbit about-avatar-orbit--outer" />
      <div class="about-avatar-orbit about-avatar-orbit--inner" />
      <div class="about-avatar-blob">
        <img
          class="about-hero__avatar"
          src="/avatar/davidblack-round.png"
          alt=""
        >
      </div>
      <span class="about-hero__spark">
        <Icon name="ph:sparkle-fill" />
      </span>
    </div>

    <div class="about-hero__content">
      <p class="about-eyebrow">
        <span class="about-status-dot" />
        <span>PROFILE / 01</span>
      </p>
      <h1 id="about-page-title">
        <span>黑姐姐</span>
        <small>DavidBlackCN</small>
      </h1>
      <p class="about-hero__role">Minecraft Developer · Blogger</p>
      <p class="about-hero__intro">
        欢迎来到黑姐姐の驿站。这里记录代码、文字、折腾过程，
        也收藏那些值得慢下来观察的事物。
      </p>
      <div class="about-hero__signature">
        <Icon name="ph:signature" aria-hidden="true" />
        <span>
          <strong>有些事你不要太当真。</strong>
          <small>——《售梦者》</small>
        </span>
      </div>
      <AboutSocialLinks />
    </div>

    <AboutEpilogue />
  </section>
</template>

<script setup lang="ts">
import AboutEpilogue from './AboutEpilogue.vue'
import AboutSocialLinks from './AboutSocialLinks.vue'
</script>
