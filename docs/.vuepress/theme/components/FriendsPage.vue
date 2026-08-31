<template>
  <main class="friends-page">
    <section class="friends-hero" aria-labelledby="friends-page-title">
      <div class="friends-hero__copy">
        <p class="friends-eyebrow">
          <span class="friends-status-dot" aria-hidden="true"></span>
          FRIEND DIRECTORY / {{ paddedFriendCount }}
        </p>
        <h1 id="friends-page-title">同行者们</h1>
        <p class="friends-hero__description">
          在各自的角落持续记录，也偶尔沿着链接互相拜访。
        </p>
      </div>

      <div class="friends-hero__count" aria-label="友链总数">
        <strong>{{ paddedFriendCount }}</strong>
        <span>FRIENDS ONLINE</span>
      </div>
    </section>

    <section class="friends-directory" aria-labelledby="friends-directory-title">
      <header class="friends-directory__heading">
        <div>
          <p class="friends-eyebrow">ALL FRIENDS</p>
          <h2 id="friends-directory-title">友链一览</h2>
        </div>
        <p>点击卡片前往朋友的站点</p>
      </header>

      <div v-if="friends.length" class="friends-grid">
        <a
          v-for="(friend, index) in friends"
          :key="friend.link"
          :href="friend.link"
          class="friend-card"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`访问 ${friend.name} 的站点（新窗口打开）`"
        >
          <span class="friend-card__avatar">
            <img
              :src="friend.avatar"
              :alt="`${friend.name} 的头像`"
              loading="lazy"
              @error="useFallbackAvatar"
            >
          </span>

          <span class="friend-card__content">
            <span class="friend-card__meta">
              FRIEND / {{ String(index + 1).padStart(2, '0') }}
            </span>
            <strong>{{ friend.name }}</strong>
            <small>{{ friend.desc }}</small>
            <span class="friend-card__host">{{ getHost(friend.link) }}</span>
          </span>

          <span class="friend-card__action" aria-hidden="true">
            <Icon icon="lucide:arrow-up-right" />
          </span>
        </a>
      </div>

      <div v-else class="friends-empty" role="status">
        <Icon icon="lucide:users-round" />
        <strong>友链正在赶来的路上</strong>
        <span>稍后再来看看吧。</span>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

import friends from '../data/friends.json'

const paddedFriendCount = computed(() => String(friends.length).padStart(2, '0'))

function getHost(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, '')
  }
  catch {
    return link
  }
}

function useFallbackAvatar(event: Event) {
  const image = event.currentTarget as HTMLImageElement

  if (image.dataset.fallbackApplied === 'true') return

  image.dataset.fallbackApplied = 'true'
  image.src = '/avatar/davidblack-round.png'
}
</script>

<style>
.friends-page {
  --friends-surface: color-mix(in srgb, var(--vp-c-bg-elv, var(--vp-c-bg)) 86%, transparent);
  --friends-surface-soft: color-mix(in srgb, var(--vp-c-bg-soft) 84%, transparent);
  --friends-border: color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  --friends-border-active: color-mix(in srgb, var(--vp-c-brand-1) 44%, var(--vp-c-divider));
  --friends-radius: 18px;
  --friends-ease: cubic-bezier(.2, .8, .2, 1);
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(36px, 6vw, 76px) 0 80px;
  color: var(--vp-c-text-1);
  box-sizing: border-box;
}

html[data-theme='dark'] .friends-page {
  --friends-surface: color-mix(in srgb, #22252a 90%, transparent);
  --friends-surface-soft: color-mix(in srgb, #1b1e22 90%, transparent);
  --friends-border: color-mix(in srgb, var(--vp-c-divider) 86%, transparent);
}

.vp-doc .friends-page :is(h1, h2, p) { margin: 0; }
.vp-doc .friends-page :is(h1, h2) { padding: 0; border: 0; }
.vp-doc .friends-page a { color: inherit; text-decoration: none; }

.friends-hero,
.friends-directory {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--friends-border);
  border-radius: var(--friends-radius);
  background: var(--friends-surface);
  box-shadow: 0 18px 52px rgb(32 51 63 / 8%);
  backdrop-filter: blur(15px) saturate(1.04);
  box-sizing: border-box;
}

html[data-theme='dark'] .friends-page :is(.friends-hero, .friends-directory) {
  box-shadow: 0 20px 58px rgb(0 0 0 / 18%);
}

.friends-hero {
  display: grid;
  min-height: 250px;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 40px;
  padding: clamp(32px, 5vw, 58px);
  background:
    radial-gradient(circle at 92% 14%, color-mix(in srgb, var(--vp-c-brand-soft) 74%, transparent), transparent 38%),
    var(--friends-surface);
}

.friends-hero::after {
  position: absolute;
  right: -92px;
  bottom: -154px;
  width: 330px;
  height: 330px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.friends-hero__copy { position: relative; z-index: 1; min-width: 0; }
.friends-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--vp-c-text-3);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .76rem;
  font-weight: 600;
  letter-spacing: .12em;
  line-height: 1.3;
}

.friends-status-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--vp-c-success-1, #4fba75);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--vp-c-success-1, #4fba75) 15%, transparent);
}

.friends-hero h1 {
  margin-top: 10px !important;
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  letter-spacing: -.055em;
  line-height: 1.05;
}

.friends-hero__description {
  max-width: 38em;
  margin-top: 14px !important;
  color: var(--vp-c-text-2);
  font-size: clamp(.92rem, 1.7vw, 1.05rem);
  line-height: 1.75;
}

.friends-hero__count {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 150px;
  justify-items: end;
  padding-left: 28px;
  border-left: 1px solid var(--friends-border);
}

.friends-hero__count strong {
  color: var(--vp-c-brand-1);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: clamp(2.7rem, 6vw, 4.8rem);
  font-variant-numeric: tabular-nums;
  letter-spacing: -.08em;
  line-height: 1;
}

.friends-hero__count span {
  margin-top: 8px;
  color: var(--vp-c-text-3);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .66rem;
  letter-spacing: .1em;
}

.friends-directory { margin-top: 18px; padding: clamp(24px, 4vw, 36px); }
.friends-directory__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--friends-border);
}

.friends-directory__heading h2 {
  position: relative;
  margin-top: 4px !important;
  font-size: clamp(1.45rem, 3vw, 2rem);
  letter-spacing: -.035em;
  line-height: 1.2;
}

.friends-directory__heading h2::after {
  display: block;
  width: 64px;
  height: 2px;
  margin-top: 8px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
  content: '';
}

.friends-directory__heading > p {
  color: var(--vp-c-text-3);
  font-size: .78rem;
  line-height: 1.5;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 14px;
  margin-top: 20px;
}

.friend-card {
  display: grid;
  min-width: 0;
  min-height: 132px;
  grid-template-columns: 68px minmax(0, 1fr) 34px;
  align-items: center;
  gap: 15px;
  padding: 16px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: var(--friends-surface-soft);
  box-sizing: border-box;
  transition:
    transform 160ms var(--friends-ease),
    border-color 160ms ease,
    background-color 160ms ease;
}

.friend-card__avatar {
  display: grid;
  width: 68px;
  height: 68px;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--friends-border);
  border-radius: 15px;
  background: var(--vp-c-bg-elv, var(--vp-c-bg));
}

.friend-card__avatar img {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: inherit;
  object-fit: cover;
}

.friend-card__content { display: flex; min-width: 0; flex-direction: column; }
.friend-card__meta,
.friend-card__host {
  color: var(--vp-c-text-3);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .58rem;
  letter-spacing: .08em;
  line-height: 1.4;
}

.friend-card__content strong {
  margin-top: 3px;
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-card__content small {
  display: -webkit-box;
  min-height: 2.8em;
  margin-top: 4px;
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: .72rem;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.friend-card__host { margin-top: 7px; color: var(--vp-c-brand-1); letter-spacing: .015em; }
.friend-card__action {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  color: var(--vp-c-text-3);
  border-radius: 9px;
  background: color-mix(in srgb, var(--vp-c-bg) 54%, transparent);
  transition: color 160ms ease, transform 160ms var(--friends-ease), background-color 160ms ease;
}
.friend-card__action svg { width: 17px; height: 17px; }

.friends-empty {
  display: flex;
  min-height: 220px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20px;
  color: var(--vp-c-text-3);
  border: 1px dashed var(--friends-border);
  border-radius: 14px;
  background: var(--friends-surface-soft);
}
.friends-empty svg { width: 34px; height: 34px; color: var(--vp-c-brand-1); }
.friends-empty strong { margin-top: 12px; color: var(--vp-c-text-2); font-size: .92rem; }
.friends-empty span { margin-top: 4px; font-size: .72rem; }

.friend-card:focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}
.friend-card:active { transform: scale(.985); }

@media (hover: hover) and (pointer: fine) {
  .friend-card:hover {
    border-color: var(--friends-border-active);
    background: color-mix(in srgb, var(--vp-c-brand-soft) 34%, var(--friends-surface-soft));
    transform: translateY(-3px);
  }
  .friend-card:hover .friend-card__action {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    transform: translate(2px, -2px);
  }
}

@media (max-width: 720px) {
  .friends-page { width: min(620px, calc(100% - 28px)); padding-top: 24px; }
  .friends-hero { min-height: 0; grid-template-columns: minmax(0, 1fr); gap: 28px; padding: 30px 24px; }
  .friends-hero__count { width: 100%; min-width: 0; grid-template-columns: auto 1fr; align-items: end; justify-items: start; gap: 12px; padding: 18px 0 0; border-top: 1px solid var(--friends-border); border-left: 0; }
  .friends-hero__count strong { font-size: 2.7rem; }
  .friends-hero__count span { margin-bottom: 4px; }
  .friends-directory { margin-top: 14px; padding: 22px 18px; }
  .friends-directory__heading { align-items: flex-start; flex-direction: column; gap: 8px; }
  .friends-grid { grid-template-columns: minmax(0, 1fr); }
}

@media (max-width: 420px) {
  .friend-card { min-height: 122px; grid-template-columns: 58px minmax(0, 1fr) 30px; gap: 12px; padding: 14px 12px; }
  .friend-card__avatar { width: 58px; height: 58px; border-radius: 13px; }
  .friend-card__action { width: 30px; height: 30px; }
}

@media (prefers-reduced-motion: reduce) {
  .friends-page *,
  .friends-page *::before,
  .friends-page *::after { transition-duration: .01ms !important; }
}
</style>
