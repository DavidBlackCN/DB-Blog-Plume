<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, useRoutes } from 'vuepress/client'

import LoadingBars from './LoadingBars.vue'
import SpaceBackground from './SpaceBackground.vue'

const RANDOM_PAGE_PATHS = new Set([
  '/more/random/',
  '/more/随机跳转/',
])
const MIN_LOADING_TIME = 1000

const router = useRouter()
const route = useRoute()
const routes = useRoutes()

const loading = ref(true)
const failed = ref(false)
const errorMessage = ref('')

function getRandomItem<T>(list: T[]): T | undefined {
  if (!list.length) return undefined
  return list[Math.floor(Math.random() * list.length)]
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const candidates = computed(() => {
  return Object.keys(routes.value).filter((path) => {
    return (
      path !== route.path &&
      !RANDOM_PAGE_PATHS.has(path) &&
      !path.startsWith('/404')
    )
  })
})

async function jumpToRandomPage() {
  loading.value = true
  failed.value = false
  errorMessage.value = ''

  const target = getRandomItem(candidates.value)

  if (!target) {
    loading.value = false
    failed.value = true
    errorMessage.value = '没有可用的随机页面可跳转。'
    return
  }

  try {
    await sleep(MIN_LOADING_TIME)
    await router.replace(target)
  } catch (error) {
    loading.value = false
    failed.value = true
    errorMessage.value =
      error instanceof Error ? error.message : '跳转失败，请稍后重试。'
  }
}

onMounted(() => {
  jumpToRandomPage()
})
</script>

<template>
  <div class="random-jump" :aria-busy="loading && !failed">
    <SpaceBackground />

    <section class="random-jump__panel" aria-labelledby="random-jump-title">
      <p class="random-jump__eyebrow">DISCOVERY ROUTE</p>
      <h2 id="random-jump-title" class="random-jump__title">随机跳转</h2>
      <p class="random-jump__intro">
        从站内 {{ candidates.length }} 个页面中，为你抽取下一站。
      </p>

      <div v-if="loading && !failed" class="random-jump__state">
        <div class="random-jump__loader">
          <LoadingBars
            :size="56"
            label="正在抽取随机页面"
          />
        </div>
        <p class="random-jump__status" aria-live="polite">正在抽取下一站…</p>
        <p class="random-jump__hint">很快就好</p>
      </div>

      <div v-else-if="failed" class="random-jump__state">
        <p class="random-jump__error" role="alert">
          {{ errorMessage }}
        </p>
        <button class="random-jump__retry" type="button" @click="jumpToRandomPage">
          再试一次
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.random-jump {
  position: relative;
  display: grid;
  min-height: calc(100dvh - var(--vp-nav-height, 64px) - var(--vp-footer-height, 0px));
  padding: clamp(2.5rem, 8vw, 5.5rem) 1rem;
  overflow: hidden;
  place-items: center;
  background: var(--vp-c-bg);
  box-sizing: border-box;
  isolation: isolate;
}

.random-jump__panel {
  position: relative;
  z-index: 1;
  width: min(100%, 36rem);
  padding: clamp(2rem, 5vw, 3.5rem);
  border: 1px solid var(--vp-c-border);
  border-radius: 1.25rem;
  background:
    linear-gradient(135deg, var(--vp-c-brand-soft), transparent 46%),
    var(--vp-c-bg-elv);
  box-shadow: 0 1.25rem 3.5rem color-mix(in srgb, var(--vp-c-text-1) 7%, transparent);
  text-align: center;
}

.random-jump__eyebrow {
  margin: 0 0 0.7rem;
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.random-jump__title {
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: var(--font-heading);
  font-size: clamp(1.55rem, 4vw, 2.05rem);
  line-height: 1.25;
}

.random-jump__intro {
  margin: 0.85rem auto 2.2rem;
  color: var(--vp-c-text-2);
  font-size: 0.96rem;
  line-height: 1.8;
}

.random-jump__state {
  min-height: 7.5rem;
}

.random-jump__loader {
  display: grid;
  min-height: 4.25rem;
  place-items: center;
}

.random-jump__status,
.random-jump__hint,
.random-jump__error {
  margin: 0;
}

.random-jump__status {
  margin-top: 1.3rem;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.random-jump__hint {
  margin-top: 0.45rem;
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
}

.random-jump__error {
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-danger-3);
  border-radius: 0.75rem;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  line-height: 1.7;
}

.random-jump__retry {
  min-height: 2.75rem;
  margin-top: 1.2rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 0.65rem;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  transition:
    background-color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.random-jump__retry:hover {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.random-jump__retry:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

@media (max-width: 480px) {
  .random-jump {
    padding-inline: 0;
  }

  .random-jump__panel {
    border-right: 0;
    border-left: 0;
    border-radius: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .random-jump__retry {
    transition: none;
  }

  .random-jump__retry:hover {
    transform: none;
  }
}
</style>
