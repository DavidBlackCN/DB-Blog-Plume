<template>
  <main class="about-page">
    <AboutHero />
    <AboutSiteGuide />

    <section class="about-section" aria-labelledby="about-profile-title">
      <header class="about-section__heading">
        <p class="about-eyebrow">PROFILE NOTES</p>
        <h2 id="about-profile-title">关于我，也关于日常</h2>
        <p>不算完整履历，只是一些足以认识我的切片。</p>
      </header>
      <div class="about-profile-grid">
        <AboutIdentityCard />
        <AboutSiteStats />
        <AboutTechStack />
        <AboutPersonality />
      </div>
    </section>

    <AboutFriends />
  </main>
</template>

<script setup lang="ts">
import AboutFriends from './about/AboutFriends.vue'
import AboutHero from './about/AboutHero.vue'
import AboutIdentityCard from './about/AboutIdentityCard.vue'
import AboutPersonality from './about/AboutPersonality.vue'
import AboutSiteGuide from './about/AboutSiteGuide.vue'
import AboutSiteStats from './about/AboutSiteStats.vue'
import AboutTechStack from './about/AboutTechStack.vue'
</script>

<style>
.about-page {
  --about-surface: color-mix(in srgb, var(--vp-c-bg-elv, var(--vp-c-bg)) 84%, transparent);
  --about-surface-soft: color-mix(in srgb, var(--vp-c-bg-soft) 82%, transparent);
  --about-border: color-mix(in srgb, var(--vp-c-divider) 78%, transparent);
  --about-border-strong: color-mix(in srgb, var(--vp-c-brand-1) 38%, var(--vp-c-divider));
  --about-shadow: 0 18px 52px rgb(39 60 72 / 8%);
  --about-radius: 18px;
  --about-ease: cubic-bezier(.2, .8, .2, 1);
  --about-ease-in-out: cubic-bezier(.77, 0, .175, 1);
  --about-font-ui: Inter, 'MiSans-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  position: relative;
  z-index: 1;
  width: min(1220px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(34px, 5vw, 72px) 0 72px;
  color: var(--vp-c-text-1);
  font-family: var(--about-font-ui);
  box-sizing: border-box;
}

html[data-theme='dark'] .about-page {
  --about-surface: color-mix(in srgb, #22252a 88%, transparent);
  --about-surface-soft: color-mix(in srgb, #1b1e22 88%, transparent);
  --about-border: color-mix(in srgb, var(--vp-c-divider) 84%, transparent);
  --about-shadow: 0 20px 58px rgb(0 0 0 / 18%);
}

.vp-doc .about-page :is(h1, h2, h3, p, blockquote) { margin: 0; }
.about-page :where(a, button) { font: inherit; }
.vp-doc .about-page a { text-decoration: none; }
.about-page :where(button) { color: inherit; }

.about-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--about-border);
  border-radius: var(--about-radius);
  background: var(--about-surface);
  box-shadow: var(--about-shadow);
  backdrop-filter: blur(14px) saturate(1.04);
  box-sizing: border-box;
  transition: transform 160ms var(--about-ease), border-color 160ms ease, background-color 160ms ease;
}

.about-eyebrow {
  color: var(--vp-c-text-3);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: .115em;
  line-height: 1.3;
}

.about-section { margin-top: clamp(48px, 6vw, 72px); }
.about-section__heading { max-width: 620px; margin: 0 0 18px 4px; }
.about-section__heading > .about-eyebrow { margin: 0; font-size: .83rem; }
.about-section__heading h2 {
  margin-top: 3px;
  padding-bottom: 0;
  color: var(--vp-c-text-1);
  border-bottom: 0;
  font-size: clamp(1.45rem, 2.8vw, 2rem);
  letter-spacing: -.035em;
  line-height: 1.2;
}
.vp-doc .about-page .about-section__heading h2 { margin: 3px 0 0; }
.about-section__heading > p:last-child {
  margin-top: 6px;
  color: var(--vp-c-text-2);
  font-size: .94rem;
  line-height: 1.7;
}

.about-status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--vp-c-success-1, #4fba75);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--vp-c-success-1, #4fba75) 15%, transparent);
}

.about-hero {
  display: grid;
  min-height: 390px;
  grid-template-columns: minmax(280px, .8fr) minmax(0, 1.35fr);
  align-items: center;
  column-gap: clamp(34px, 6vw, 88px);
  row-gap: 24px;
  padding: clamp(34px, 5vw, 62px);
  background:
    radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--vp-c-brand-soft) 62%, transparent), transparent 36%),
    var(--about-surface);
}

.about-hero::after {
  position: absolute;
  right: -84px;
  bottom: -120px;
  width: 340px;
  height: 340px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.about-hero__visual {
  position: relative;
  width: min(100%, 270px);
  margin: 0 auto;
  aspect-ratio: 1;
}

.about-avatar-blob {
  position: absolute;
  inset: 13px;
  z-index: 2;
}

.about-avatar-blob::before {
  position: absolute;
  inset: -2px;
  padding: 3px;
  border-radius: 48% 52% 50% 50% / 51% 47% 53% 49%;
  background: conic-gradient(
    from 0deg,
    transparent 0 9%,
    color-mix(in srgb, var(--vp-c-brand-1) 42%, transparent) 9% 18%,
    var(--vp-c-brand-1) 18% 31%,
    transparent 31% 57%,
    color-mix(in srgb, var(--vp-c-brand-1) 78%, white 22%) 57% 69%,
    transparent 69% 88%,
    color-mix(in srgb, var(--vp-c-brand-1) 48%, transparent) 88% 100%
  );
  content: '';
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  transform: rotate(0deg);
  transform-origin: center;
  animation: about-avatar-scan 8s linear infinite;
  will-change: transform;
}

.about-avatar-blob::after {
  position: absolute;
  inset: -8px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 42%, transparent);
  border-right-color: transparent;
  border-bottom-color: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  border-radius: 47% 53% 49% 51% / 52% 46% 54% 48%;
  content: '';
  opacity: .7;
  transform: rotate(-8deg) scale3d(1, 1, 1);
  transform-origin: center;
  animation: about-avatar-breathe 4.8s var(--about-ease-in-out) infinite;
  pointer-events: none;
  will-change: transform, opacity;
}

.about-hero__avatar {
  position: absolute;
  inset: 7px;
  z-index: 1;
  width: calc(100% - 14px);
  height: calc(100% - 14px);
  margin: 0;
  border: 2px solid color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  border-radius: 50%;
  box-shadow: 0 12px 30px rgb(12 17 21 / 16%);
  object-fit: cover;
  box-sizing: border-box;
  transition: transform 180ms var(--about-ease), border-radius 180ms var(--about-ease);
}

.vp-doc .about-page .about-hero__avatar {
  border-radius: 50%;
}

.about-avatar-orbit {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.about-avatar-orbit--outer {
  inset: 0;
  border: 1px solid transparent;
  border-top-color: var(--about-border-strong);
  border-left-color: color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  animation: about-orbit 14s linear infinite;
}
.about-avatar-orbit--inner {
  inset: 9px;
  border: 1px dashed color-mix(in srgb, var(--vp-c-brand-1) 24%, transparent);
  animation: about-orbit 24s linear infinite reverse;
}
.about-hero__spark {
  position: absolute;
  top: 8px;
  left: -9px;
  z-index: 3;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  color: var(--vp-c-brand-1);
  filter: drop-shadow(0 3px 10px color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent));
}
.about-hero__spark svg { width: 46px; height: 46px; }

.about-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}
.about-hero__content > .about-eyebrow {
  display: grid;
  width: max-content;
  grid-template-columns: 7px auto;
  align-items: center;
  column-gap: 8px;
  margin-left: 0;
}
.vp-doc .about-page .about-hero__content > .about-eyebrow { margin-left: 0; }
.about-hero__content > .about-eyebrow .about-status-dot {
  position: static;
  justify-self: start;
  margin: 0;
  transform: none;
}
.about-hero__content h1 { width: 100%; margin-top: 9px; line-height: .98; }
.about-hero__content h1 > span {
  display: block;
  margin-left: -.18em;
  color: var(--vp-c-text-1);
  font-size: clamp(2.65rem, 4.4vw, 3.85rem);
  letter-spacing: -.055em;
}
.about-hero__content h1 > small {
  display: block;
  margin-top: 7px;
  color: var(--vp-c-brand-1);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: clamp(1.05rem, 1.8vw, 1.3rem);
  font-weight: 600;
  letter-spacing: .015em;
}
.vp-doc .about-page .about-hero__content h1 { padding-bottom: 0; border-bottom: 0; }
.about-hero__role {
  width: 100%;
  margin-top: 16px !important;
  color: var(--vp-c-text-2);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .82rem;
  letter-spacing: .045em;
}
.about-hero__intro {
  width: 100%;
  max-width: 44em;
  margin-top: 12px !important;
  color: var(--vp-c-text-2);
  font-size: .93rem;
  line-height: 1.75;
}
.about-hero__signature {
  display: grid;
  width: 100%;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  padding: 10px 13px;
  color: var(--vp-c-text-1);
  border: 1px solid var(--about-border);
  border-radius: 11px;
  background: var(--about-surface-soft);
  box-sizing: border-box;
}
.about-hero__signature > svg { width: 27px; height: 27px; color: var(--vp-c-brand-1); }
.about-hero__signature > span { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 12px; }
.about-hero__signature strong {
  font-family: 'STKaiti', 'KaiTi', 'FangSong', serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: .04em;
  line-height: 1.5;
}
.about-hero__signature small {
  flex: none;
  color: var(--vp-c-text-3);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .7rem;
}

.about-socials { display: flex; width: 100%; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
.about-social {
  --social-color: var(--vp-c-text-1);
  --social-bg: var(--about-surface-soft);
  --social-hover: var(--vp-c-brand-soft);
  display: inline-flex;
  min-width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 12px;
  color: var(--social-color);
  border: 0;
  border-radius: 12px;
  background: var(--social-bg);
  box-shadow: 0 9px 22px rgb(24 38 47 / 9%);
  box-sizing: border-box;
  transition: transform 150ms var(--about-ease), background-color 150ms ease;
}
.vp-doc .about-page a.about-social { color: var(--social-color); text-decoration: none; }
.vp-doc .about-page a.about-social {
  transition:
    transform 160ms var(--about-ease),
    background-color 160ms ease;
}
.about-social.is-featured { min-width: 118px; }
.about-social__icon { display: grid; width: 28px; height: 28px; place-items: center; overflow: hidden; }
.about-social__icon img { display: block; width: 100%; height: 100%; margin: 0; object-fit: contain; }
.about-social__label { font-family: var(--font-mono, 'Maple Mono', monospace); font-size: .72rem; font-weight: 600; }
.about-social--github { --social-color: #f4f7f9; --social-bg: #20242a; --social-hover: #15181c; }
.about-social--github .about-social__icon { width: 25px; height: 25px; }
.about-social--bilibili { --social-color: #b43e61; --social-bg: #fff0f4; --social-hover: #ffe1ea; }
.about-social--bilibili .about-social__icon { width: 29px; height: 29px; }
.about-social--mail { --social-color: #a54752; --social-bg: #fff0f0; --social-hover: #ffe1e1; }
.about-social--mail .about-social__icon { width: 29px; height: 29px; }
html[data-theme='dark'] .about-page .about-social--github {
  --social-bg: #181b20;
  --social-hover: color-mix(in srgb, var(--vp-c-brand-1) 18%, #181b20);
}
html[data-theme='dark'] .about-page .about-social--bilibili { --social-color: #ff91b1; --social-bg: #37272e; --social-hover: #452d37; }
html[data-theme='dark'] .about-page .about-social--mail { --social-color: #ff9da6; --social-bg: #38282b; --social-hover: #472f33; }

.about-guide-grid {
  display: grid;
  grid-template-columns: 1.55fr 1fr 1fr;
  grid-template-rows: repeat(2, minmax(126px, auto));
  gap: 18px;
}
.about-guide-search {
  grid-row: 1 / 3;
  display: grid;
  min-height: 270px;
  grid-template-columns: 62px minmax(0, 1fr);
  align-content: center;
  align-items: center;
  gap: 20px;
  padding: 28px;
  text-align: left;
  cursor: pointer;
}
.about-guide-search::after {
  position: absolute;
  right: -54px;
  bottom: -64px;
  width: 190px;
  height: 190px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  border-radius: 50%;
  content: '';
}
.about-guide-search__icon,
.about-guide-link__icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  color: var(--vp-c-brand-1);
  border-radius: 14px;
  background: var(--vp-c-brand-soft);
}
.about-guide-search__icon svg { width: 28px; height: 28px; }
.about-guide-search__copy { display: flex; min-width: 0; flex-direction: column; gap: 6px; }
.about-guide-search strong { font-size: 1.25rem; }
.about-guide-search small,
.about-guide-link small { color: var(--vp-c-text-2); font-size: .77rem; line-height: 1.55; }
.about-guide-search kbd {
  position: absolute;
  right: 24px;
  bottom: 22px;
  padding: 5px 9px;
  color: var(--vp-c-text-3);
  border: 1px solid var(--about-border);
  border-radius: 7px;
  background: var(--about-surface-soft);
  box-shadow: none;
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .65rem;
}
.about-guide-link { display: block; min-width: 0; color: inherit; }
.vp-doc .about-page a.about-guide-link {
  transition:
    transform 160ms var(--about-ease),
    border-color 160ms ease,
    background-color 160ms ease;
}
.about-guide-link__inner {
  display: grid;
  height: 100%;
  grid-template-columns: 46px minmax(0, 1fr);
  align-items: center;
  gap: 13px;
  padding: 18px;
  box-sizing: border-box;
}
.about-guide-link__icon { width: 46px; height: 46px; border-radius: 12px; }
.about-guide-link__icon svg { width: 23px; height: 23px; }
.about-guide-link__copy { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
.about-guide-link strong { color: var(--vp-c-text-1); font-size: .94rem; }
.about-site-status {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 15px;
  min-height: 82px;
  padding: 15px 20px;
}
.about-site-status > svg { width: 28px; height: 28px; color: var(--vp-c-brand-1); }
.about-site-status strong { display: inline-block; margin-top: 3px; font-size: .9rem; }
.about-site-status p { margin-top: 2px; color: var(--vp-c-text-2); font-size: .76rem; line-height: 1.55; }
.about-site-status__state {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--vp-c-text-3);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .64rem;
}
.about-site-status__state i { width: 7px; height: 7px; border-radius: 50%; background: var(--vp-c-success-1, #4fba75); }

.about-profile-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 14px; }
.about-identity-card { grid-column: span 7; min-height: 196px; padding: 22px 24px; }
.about-page .about-identity-card h3 { margin-top: 7px; font-size: clamp(1.4rem, 2.7vw, 2rem); letter-spacing: -.045em; line-height: 1.2; }
.about-identity-card > p:not(.about-eyebrow) { max-width: 44em; margin-top: 10px; color: var(--vp-c-text-2); font-size: .9rem; line-height: 1.68; }
.about-identity-card ul { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 0; padding: 0; list-style: none; }
.vp-doc .about-page .about-identity-card ul { margin: 14px 0 0; padding: 0; }
.about-identity-card li {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--about-border);
  border-radius: 8px;
  background: var(--about-surface-soft);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .68rem;
}
.about-identity-card li svg { width: 15px; height: 15px; color: var(--vp-c-brand-1); }
.about-stats-card {
  grid-column: span 5;
  min-height: 196px;
  padding: 20px 22px 16px;
}
.about-stats-card > header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.about-page .about-stats-card h3 { margin-top: 5px; font-size: 1.15rem; line-height: 1.25; }
.about-stats-state {
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  gap: 6px;
  padding: 0 7px;
  color: var(--vp-c-text-3);
  border: 1px solid var(--about-border);
  border-radius: 7px;
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .55rem;
  letter-spacing: .05em;
}
.about-stats-state i { width: 6px; height: 6px; border-radius: 50%; background: var(--vp-c-warning-1, #c89b3c); }
.about-stats-state.is-ready i { background: var(--vp-c-success-1, #4fba75); }
.about-stats-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; margin-top: 13px; }
.about-stats-grid > div {
  display: grid;
  min-width: 0;
  grid-template-columns: 31px minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border: 1px solid var(--about-border);
  border-radius: 10px;
  background: var(--about-surface-soft);
}
.about-stats-grid svg { width: 24px; height: 24px; color: var(--vp-c-brand-1); }
.about-stats-grid span { display: flex; min-width: 0; flex-direction: column; }
.about-stats-grid strong {
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: 1.1rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
  text-overflow: ellipsis;
}
.about-stats-grid small { margin-top: 2px; color: var(--vp-c-text-3); font-size: .64rem; }
.about-runtime {
  display: grid;
  grid-template-columns: minmax(116px, .72fr) minmax(0, 1.28fr);
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 9px 10px;
  border: 1px solid var(--about-border);
  border-radius: 10px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--vp-c-brand-soft) 56%, transparent), transparent 48%),
    var(--about-surface-soft);
}
.about-runtime__title { display: grid; min-width: 0; grid-template-columns: 24px minmax(0, 1fr); align-items: center; gap: 8px; }
.about-runtime__title > svg { width: 22px; height: 22px; color: var(--vp-c-brand-1); }
.about-runtime__title > span { display: flex; min-width: 0; flex-direction: column; }
.about-runtime__title small {
  color: var(--vp-c-text-3);
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .5rem;
  letter-spacing: .08em;
}
.about-runtime__title strong { margin-top: 2px; color: var(--vp-c-text-2); font-size: .68rem; line-height: 1.35; white-space: nowrap; }
.about-runtime__clock {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-variant-numeric: tabular-nums;
}
.about-runtime__clock > span {
  display: flex;
  min-width: 0;
  height: 34px;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  padding: 0 2px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--vp-c-bg) 52%, transparent);
  line-height: 34px;
}
.about-runtime__clock b { color: var(--vp-c-text-1); font-size: .78rem; font-weight: 600; }
.about-runtime__clock small { color: var(--vp-c-text-3); font-size: .48rem; }
.about-stats-card > footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; color: var(--vp-c-text-3); font-size: .62rem; }
.about-stats-card > footer a { color: var(--vp-c-brand-1); font-family: var(--font-mono, 'Maple Mono', monospace); letter-spacing: .05em; }

.about-tech-card { grid-column: span 8; min-height: 206px; padding: 18px 0 16px; }
.about-tech-card__heading { display: flex; align-items: flex-end; justify-content: space-between; padding: 0 22px 13px; }
.about-page .about-tech-card__heading h3 { margin-top: 4px; font-size: 1.32rem; line-height: 1.2; }
.about-page .about-tech-card__heading h3::after {
  display: block;
  width: 64px;
  height: 2px;
  margin-top: 7px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
  content: '';
}
.about-tech-card__heading > span { color: var(--vp-c-text-3); font-family: var(--font-mono, 'Maple Mono', monospace); font-size: .62rem; letter-spacing: .08em; }
.about-tech-row {
  width: calc(100% - 28px);
  overflow: hidden;
  margin-inline: auto;
  border-radius: 10px;
  -webkit-mask-image: linear-gradient(to right, transparent 0, rgb(0 0 0 / 14%) 5%, #000 16%, #000 84%, rgb(0 0 0 / 14%) 95%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0, rgb(0 0 0 / 14%) 5%, #000 16%, #000 84%, rgb(0 0 0 / 14%) 95%, transparent 100%);
}
.about-tech-row + .about-tech-row { margin-top: 10px; }
.about-tech-track { display: flex; width: max-content; align-items: center; animation: about-marquee 30s linear infinite; will-change: transform; }
.about-tech-row.is-reverse .about-tech-track { animation-direction: reverse; animation-duration: 34s; }
.about-tech-list { display: flex; flex: none; align-items: center; gap: 8px; margin: 0; padding: 0 8px 0 0; list-style: none; }
.vp-doc .about-page .about-tech-list { margin: 0; padding: 0 8px 0 0; }
.about-tech-list li {
  display: inline-flex;
  width: 132px;
  height: 46px;
  flex: 0 0 132px;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0 13px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--about-border);
  border-radius: 9px;
  background: var(--about-surface-soft);
  box-sizing: border-box;
  font-family: var(--font-mono, 'Maple Mono', monospace);
  font-size: .72rem;
  white-space: nowrap;
}
.vp-doc .about-page .about-tech-list li,
.vp-doc .about-page .about-tech-list li + li { margin: 0; }
.about-tech-icon {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  place-items: center;
}
.about-tech-icon svg {
  width: 21px;
  height: 21px;
  transform: scale(var(--about-tech-icon-scale, 1));
  transform-origin: center;
}

.about-personality-card {
  grid-column: span 4;
  display: grid;
  min-height: 206px;
  grid-template-columns: 1fr .9fr;
  align-items: stretch;
  padding: 19px 20px 0;
}
.about-personality-card__copy { z-index: 1; padding-bottom: 16px; }
.about-personality-card__copy > span { display: block; margin-top: 17px; color: var(--vp-c-text-2); font-size: .9rem; }
.about-page .about-personality-card__copy h3 { margin-top: 4px; color: var(--vp-c-brand-1); font-family: var(--font-mono, 'Maple Mono', monospace); font-size: clamp(1.65rem, 3vw, 2.15rem); line-height: 1.1; }
.about-personality-card__copy a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  margin-top: 3px;
  color: var(--vp-c-text-2);
  font-size: .76rem;
}
.about-personality-card__visual { position: relative; min-width: 0; align-self: end; }
.about-personality-card__visual span {
  position: absolute;
  right: 2%;
  bottom: 12%;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  filter: blur(24px);
  opacity: .55;
}
.about-personality-card__visual img { position: relative; z-index: 1; display: block; width: 100%; max-height: 184px; margin: 0; object-fit: contain; object-position: center bottom; transition: transform 180ms var(--about-ease); }

.about-friends-card { margin-top: 18px; padding: 26px; }
.about-friends-card > header { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
.about-friends-card h2 { font-size: 1.35rem; }
.vp-doc .about-page .about-friends-card h2 { margin-top: 6px; padding-bottom: 0; border-bottom: 0; }
.about-friends-card > header > a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  padding: 0 13px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--about-border);
  border-radius: 9px;
  background: var(--about-surface-soft);
  font-size: .78rem;
}
.about-friends-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 20px; }
.about-friend {
  display: grid;
  min-width: 0;
  grid-template-columns: 54px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 11px;
  color: inherit;
  border: 1px solid transparent;
  border-radius: 12px;
  background: var(--about-surface-soft);
  transition: transform 150ms var(--about-ease), border-color 150ms ease;
}
.about-friend img { width: 54px; height: 54px; margin: 0; border-radius: 12px; object-fit: cover; }
.about-friend span { min-width: 0; }
.about-friend strong { display: block; color: var(--vp-c-text-1); font-size: .88rem; }
.about-friend small { display: -webkit-box; margin-top: 4px; overflow: hidden; color: var(--vp-c-text-3); font-size: .7rem; line-height: 1.45; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }

.about-epilogue {
  display: flex;
  min-height: 42px;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding: 14px 4px 0;
  color: var(--vp-c-text-2);
  border: 0;
  border-top: 1px solid var(--about-border);
  border-radius: 0;
  background: transparent;
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: .94rem;
  letter-spacing: .055em;
  line-height: 1.7;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
}
.about-epilogue svg { width: 16px; height: 16px; flex: none; color: var(--vp-c-brand-1); }
.about-epilogue small { color: var(--vp-c-text-3); font: inherit; }

.about-page :is(a, button):focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}
.about-social:focus-visible { outline-color: var(--social-color) !important; }
.about-page :is(a, button):active { transform: scale(.98); }

@media (hover: hover) and (pointer: fine) {
  .about-card:is(a, button):hover,
  .about-friends-card:hover,
  .about-profile-grid > .about-card:hover { border-color: var(--about-border-strong); transform: translateY(-2px); }
  .about-social:hover { background: var(--social-hover); transform: translateY(-2px); }
  .about-hero:hover .about-hero__avatar { border-radius: 50%; transform: scale(1.012); }
  .vp-doc .about-page .about-hero:hover .about-hero__avatar { border-radius: 50%; }
  .about-personality-card:hover img { transform: translateY(-4px) scale(1.025); }
  .about-tech-card:hover .about-tech-track,
  .about-tech-card:focus-within .about-tech-track { animation-play-state: paused; }
  .about-friend:hover { border-color: var(--about-border-strong); transform: translateY(-2px); }
  .about-friends-card > header > a:hover,
  .about-personality-card__copy a:hover { color: var(--vp-c-brand-1); }
  .about-epilogue:hover { color: var(--vp-c-text-1); }
}

@keyframes about-orbit { to { transform: rotate(360deg); } }
@keyframes about-avatar-scan { to { transform: rotate(360deg); } }
@keyframes about-avatar-breathe {
  0%, 100% { opacity: .46; transform: rotate(-8deg) scale3d(.985, 1.015, 1); }
  50% { opacity: .82; transform: rotate(7deg) scale3d(1.02, .98, 1); }
}
@keyframes about-marquee { to { transform: translateX(-50%); } }

@media (max-width: 960px) {
  .about-hero { grid-template-columns: 220px minmax(0, 1fr); column-gap: 36px; row-gap: 22px; padding: 36px; }
  .about-guide-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: auto; }
  .about-guide-search { grid-column: 1 / -1; grid-row: auto; min-height: 190px; }
  .about-site-status { grid-column: 1 / -1; }
  .about-identity-card,
  .about-stats-card { grid-column: span 6; }
  .about-tech-card { grid-column: span 7; }
  .about-personality-card { grid-column: span 5; }
}

@media (max-width: 720px) {
  .about-page { width: min(620px, calc(100% - 28px)); padding-top: 24px; }
  .about-section { margin-top: 50px; }
  .about-section__heading { margin-left: 2px; }
  .about-hero { grid-template-columns: minmax(0, 1fr); column-gap: 0; row-gap: 22px; padding: 28px 22px; text-align: center; }
  .about-hero__visual { width: 210px; }
  .about-hero__content { align-items: center; }
  .about-hero__content > .about-eyebrow,
  .vp-doc .about-page .about-hero__content > .about-eyebrow { margin-inline: auto; }
  .about-hero__content h1 > span { font-size: 2.5rem; }
  .about-hero__intro { margin-inline: auto; }
  .about-hero__signature { text-align: left; }
  .about-socials { justify-content: center; }
  .about-guide-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .about-guide-search { grid-column: auto; min-height: 176px; padding: 22px; }
  .about-guide-search kbd { right: 18px; bottom: 16px; }
  .about-site-status { grid-column: auto; grid-template-columns: 34px minmax(0, 1fr); }
  .about-site-status__state { grid-column: 2; }
  .about-profile-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .about-profile-grid > .about-card { grid-column: auto; }
  .about-personality-card { grid-template-columns: 1fr 150px; }
  .about-friends-card { margin-top: 14px; padding: 22px 18px; }
  .about-friends-card > header { align-items: flex-start; }
  .about-friends-card > header > a { white-space: nowrap; }
  .about-epilogue { flex-wrap: wrap; margin-top: 0; }
}

@media (max-width: 430px) {
  .about-hero__visual { width: 190px; }
  .about-social { min-width: 48px; }
  .about-social.is-featured { width: calc(50% - 5px); min-width: 0; }
  .about-social--mail { width: 48px; padding: 0; }
  .about-guide-search { grid-template-columns: 48px minmax(0, 1fr); gap: 14px; }
  .about-guide-search__icon { width: 48px; height: 48px; border-radius: 12px; }
  .about-guide-link__inner { padding: 16px; }
  .about-identity-card,
  .about-stats-card { padding: 20px; }
  .about-stats-grid { gap: 8px; }
  .about-stats-grid > div { grid-template-columns: 22px minmax(0, 1fr); gap: 6px; padding: 8px; }
  .about-stats-grid svg { width: 20px; height: 20px; }
  .about-stats-grid strong { font-size: .82rem; letter-spacing: -.04em; }
  .about-runtime { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .about-runtime__title { grid-template-columns: 22px minmax(0, 1fr); }
  .about-runtime__title > span { flex-direction: row; align-items: baseline; gap: 7px; }
  .about-runtime__clock > span { height: 32px; line-height: 32px; }
  .about-personality-card { grid-template-columns: minmax(0, 1fr) 118px; padding-inline: 20px 12px; }
  .about-friends-card > header { flex-direction: column; }
  .about-friends-grid { grid-template-columns: minmax(0, 1fr); }
  .about-epilogue small { flex-basis: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .about-page *,
  .about-page *::before,
  .about-page *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
  .about-avatar-orbit,
  .about-avatar-blob::before,
  .about-avatar-blob::after,
  .about-tech-track { animation: none !important; }
  .about-tech-row { overflow-x: auto; -webkit-mask-image: none; mask-image: none; scrollbar-width: thin; }
  .about-tech-list[aria-hidden='true'] { display: none; }
}
</style>
