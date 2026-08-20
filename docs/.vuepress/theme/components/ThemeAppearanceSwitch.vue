<template>
  <button
    class="theme-appearance-switch"
    :class="{ 'is-dark': switchIsDark }"
    type="button"
    role="switch"
    :aria-checked="switchIsDark"
    :aria-label="switchTitle"
    @click="toggleAppearance"
  >
    <span class="theme-switch__decor theme-switch__stars" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="theme-switch__decor theme-switch__clouds" aria-hidden="true"><i></i><i></i><i></i></span>
    <svg class="theme-switch__icon theme-switch__sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
    <svg class="theme-switch__icon theme-switch__moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 15.4A8.5 8.5 0 0 1 8.6 3.6A8.5 8.5 0 1 0 20.4 15.4Z" />
    </svg>
    <span class="theme-switch__thumb" aria-hidden="true"></span>
  </button>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useData } from 'vuepress-theme-plume/client'

const { theme, isDark } = useData()
const switchIsDark = ref(false)

const switchTitle = computed(() => switchIsDark.value
  ? theme.value.lightModeSwitchTitle || '切换为浅色主题'
  : theme.value.darkModeSwitchTitle || '切换为深色主题')

onMounted(() => {
  switchIsDark.value = isDark.value || document.documentElement.dataset.theme === 'dark'
})

watch(isDark, (value) => {
  switchIsDark.value = value
})

function toggleAppearance() {
  const nextIsDark = !switchIsDark.value

  switchIsDark.value = nextIsDark
  isDark.value = nextIsDark
  document.documentElement.dataset.theme = nextIsDark ? 'dark' : 'light'
  document.documentElement.classList.toggle('dark', nextIsDark)
  window.localStorage.setItem('vuepress-theme-appearance', nextIsDark ? 'dark' : 'light')
}
</script>

<style scoped>
.theme-appearance-switch {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 86px;
  height: 36px;
  padding: 3px;
  overflow: hidden;
  border: 2px solid var(--vp-c-border);
  border-radius: 99px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease;
}

.theme-appearance-switch:hover {
  border-color: var(--vp-c-brand-1);
}

.theme-appearance-switch:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.theme-switch__icon {
  position: absolute;
  top: 8px;
  z-index: 4;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 220ms cubic-bezier(.23, 1, .32, 1), opacity 180ms ease, color 180ms ease;
}

.theme-switch__sun {
  left: 8px;
  color: var(--vp-c-warning-1);
  transform: translateX(0) rotate(0) scale(1);
}

.theme-switch__moon {
  right: 12px;
  color: var(--vp-c-text-3);
  opacity: .18;
  transform: translateX(0) rotate(-12deg) scale(.84);
}

.theme-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 3;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vp-c-bg-elv);
  box-shadow: 0 1px 3px rgba(20, 25, 28, .16);
  transition: transform 220ms cubic-bezier(.23, 1, .32, 1), background-color 180ms ease;
}

.theme-appearance-switch.is-dark .theme-switch__thumb {
  transform: translateX(50px);
}

.theme-appearance-switch.is-dark .theme-switch__sun {
  z-index: 1;
  opacity: .18;
  transform: rotate(-36deg) scale(.82);
}

.theme-appearance-switch.is-dark .theme-switch__moon {
  z-index: 4;
  color: var(--vp-c-brand-hard);
  opacity: 1;
  transform: rotate(12deg) scale(1.05);
}

.theme-appearance-switch:not(.is-dark) .theme-switch__sun {
  z-index: 4;
  opacity: 1;
  transform: translateX(0) rotate(0) scale(1);
}

.theme-appearance-switch:not(.is-dark) .theme-switch__moon {
  z-index: 1;
  opacity: .18;
  transform: translateX(0) rotate(-12deg) scale(.84);
}

.theme-switch__decor {
  position: absolute;
  inset: 2px;
  z-index: 2;
  pointer-events: none;
}

.theme-switch__stars,
.theme-switch__clouds {
  opacity: 0;
}

.theme-switch__stars i {
  position: absolute;
  width: 7px;
  height: 7px;
  background: var(--vp-c-brand-hard);
  clip-path: polygon(50% 0, 62% 37%, 100% 50%, 62% 63%, 50% 100%, 38% 63%, 0 50%, 38% 37%);
}

.theme-switch__stars i:nth-child(1) {
  top: 6px;
  left: 11px;
}

.theme-switch__stars i:nth-child(2) {
  top: 21px;
  left: 29px;
  width: 6px;
  height: 6px;
}

.theme-switch__stars i:nth-child(3) {
  top: 8px;
  left: 43px;
  width: 5px;
  height: 5px;
}

.theme-switch__clouds i {
  position: absolute;
  width: 19px;
  height: 7px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-text-3));
  opacity: .58;
}

.theme-switch__clouds i::before,
.theme-switch__clouds i::after {
  position: absolute;
  bottom: 0;
  border-radius: 50%;
  background: inherit;
  content: "";
}

.theme-switch__clouds i::before {
  left: 3px;
  width: 9px;
  height: 9px;
}

.theme-switch__clouds i::after {
  right: 2px;
  width: 11px;
  height: 11px;
}

.theme-switch__clouds i:nth-child(1) {
  top: 19px;
  left: 43px;
}

.theme-switch__clouds i:nth-child(2) {
  top: 7px;
  left: 61px;
  width: 15px;
  transform: scale(.75);
}

.theme-switch__clouds i:nth-child(3) {
  top: 22px;
  left: 72px;
  width: 12px;
  transform: scale(.62);
}

.theme-appearance-switch.is-dark .theme-switch__stars,
.theme-appearance-switch:not(.is-dark) .theme-switch__clouds {
  opacity: 1;
}

@keyframes star-in-a {
  0% { opacity: 0; transform: translate(-13px, 9px) rotate(-24deg) scale(.72); }
  60% { opacity: 1; transform: translate(1px, -1px) rotate(8deg) scale(1.08); }
  100% { opacity: 1; transform: none; }
}

@keyframes star-in-b {
  0% { opacity: 0; transform: translate(8px, 12px) rotate(24deg) scale(.7); }
  60% { opacity: 1; transform: translate(-1px, -1px) rotate(-6deg) scale(1.06); }
  100% { opacity: 1; transform: none; }
}

@keyframes star-in-c {
  0% { opacity: 0; transform: translate(12px, -8px) rotate(20deg) scale(.7); }
  60% { opacity: 1; transform: translate(-1px, 1px) rotate(-5deg) scale(1.05); }
  100% { opacity: 1; transform: none; }
}

@keyframes star-float-a {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(1px, -2px) rotate(10deg); }
}

@keyframes star-float-b {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(-1px, 1px) rotate(-12deg); }
}

@keyframes star-float-c {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(1px, 1px) rotate(8deg); }
}

@keyframes cloud-in-a {
  0% { opacity: 0; transform: translate(12px, -7px) scale(.75); }
  65% { opacity: .64; transform: translate(-1px, 1px) scale(1.04); }
  100% { opacity: .58; transform: none; }
}

@keyframes cloud-in-b {
  0% { opacity: 0; transform: translate(9px, 8px) scale(.62); }
  65% { opacity: .62; transform: translate(1px, -1px) scale(.78); }
  100% { opacity: .58; transform: scale(.75); }
}

@keyframes cloud-in-c {
  0% { opacity: 0; transform: translate(-8px, 7px) scale(.5); }
  65% { opacity: .62; transform: translate(1px, -1px) scale(.66); }
  100% { opacity: .58; transform: scale(.62); }
}

@keyframes cloud-float {
  0%, 100% { translate: 0 0; }
  50% { translate: -1px -1px; }
}

.theme-appearance-switch.is-dark .theme-switch__stars i:nth-child(1) {
  animation: star-in-a 620ms cubic-bezier(.23, 1, .32, 1) both, star-float-a 3.1s ease-in-out 700ms infinite;
}

.theme-appearance-switch.is-dark .theme-switch__stars i:nth-child(2) {
  animation: star-in-b 620ms cubic-bezier(.23, 1, .32, 1) 80ms both, star-float-b 3.7s ease-in-out 780ms infinite;
}

.theme-appearance-switch.is-dark .theme-switch__stars i:nth-child(3) {
  animation: star-in-c 620ms cubic-bezier(.23, 1, .32, 1) 160ms both, star-float-c 4.2s ease-in-out 860ms infinite;
}

.theme-appearance-switch:not(.is-dark) .theme-switch__clouds i:nth-child(1) {
  animation: cloud-in-a 560ms cubic-bezier(.23, 1, .32, 1) both, cloud-float 3.8s ease-in-out 640ms infinite;
}

.theme-appearance-switch:not(.is-dark) .theme-switch__clouds i:nth-child(2) {
  animation: cloud-in-b 560ms cubic-bezier(.23, 1, .32, 1) 80ms both, cloud-float 4.3s ease-in-out 720ms infinite;
}

.theme-appearance-switch:not(.is-dark) .theme-switch__clouds i:nth-child(3) {
  animation: cloud-in-c 560ms cubic-bezier(.23, 1, .32, 1) 150ms both, cloud-float 3.4s ease-in-out 790ms infinite;
}

@media (prefers-reduced-motion: reduce) {
  .theme-appearance-switch,
  .theme-switch__icon,
  .theme-switch__thumb,
  .theme-switch__decor i {
    transition: none;
    animation: none;
  }
}
</style>
