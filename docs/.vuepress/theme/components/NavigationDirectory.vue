<template>
  <main ref="directoryRoot" class="navigation-directory">
    <div class="directory-shell">
      <aside class="category-sidebar" aria-label="资源分类目录">
        <div class="sidebar-brand">
          <span class="sidebar-brand-icon" aria-hidden="true"><Icon icon="lucide:compass" /></span>
          <span class="sidebar-brand-copy">
            <strong>导航目录</strong>
            <small>{{ visibleSiteCount }} resources</small>
          </span>
        </div>

        <div class="sidebar-meta" aria-hidden="true">
          <span>DIRECTORY</span>
          <span>{{ String(filteredGroupedSites.length).padStart(2, '0') }}</span>
        </div>

        <nav class="sidebar-nav">
          <button
            v-for="category in filteredGroupedSites"
            :key="category.id"
            class="category-item"
            :class="{ 'is-active': activeCategory === category.id }"
            type="button"
            :aria-current="activeCategory === category.id ? 'location' : undefined"
            :aria-controls="`directory-category-${category.id}`"
            @click="scrollToCategory(category.id)"
          >
            <span class="category-item-icon" aria-hidden="true">{{ category.icon }}</span>
            <span class="category-item-name">{{ category.name }}</span>
          </button>
        </nav>
        <p v-if="!filteredGroupedSites.length" class="sidebar-empty">没有可显示的分类</p>
      </aside>

      <div class="directory-main">
        <header class="directory-header">
          <div class="directory-intro">
            <p class="directory-kicker">RESOURCE DIRECTORY</p>
            <h1>{{ title }}</h1>
            <p class="directory-subtitle">{{ subtitle }}</p>
          </div>

          <div class="directory-controls">
            <div class="search-box">
              <Icon class="search-icon" icon="lucide:search" aria-hidden="true" />
              <label class="sr-only" :for="searchId">搜索资源</label>
              <input
                :id="searchId"
                v-model="searchQuery"
                class="search-input"
                type="search"
                placeholder="按名称、描述或标签搜索…"
                autocomplete="off"
              >
              <button
                v-if="searchQuery"
                class="search-clear"
                type="button"
                aria-label="清除搜索内容"
                @click="searchQuery = ''"
              >
                <Icon icon="lucide:x" aria-hidden="true" />
              </button>
              <button
                class="filter-toggle"
                type="button"
                :aria-expanded="isTagsExpanded"
                aria-controls="directory-tags"
                @click="isTagsExpanded = !isTagsExpanded"
              >
                <Icon icon="lucide:sliders-horizontal" aria-hidden="true" />
                <span>筛选</span>
                <Icon class="filter-chevron" :class="{ 'is-expanded': isTagsExpanded }" icon="lucide:chevron-down" aria-hidden="true" />
              </button>
            </div>

            <p class="result-summary" aria-live="polite">
              当前导航共收录 <strong>{{ sites.length }}</strong> 个资源
              <span v-if="visibleSiteCount !== sites.length"> · 当前显示 {{ visibleSiteCount }} 个</span>
              <span v-if="selectedTag"> · 标签：{{ selectedTag }}</span>
            </p>

            <Transition
              name="tag-drawer"
              @before-enter="prepareTagDrawerEnter"
              @enter="enterTagDrawer"
              @after-enter="finishTagDrawerEnter"
              @before-leave="prepareTagDrawerLeave"
              @leave="leaveTagDrawer"
              @after-leave="finishTagDrawerLeave"
            >
              <div v-if="isTagsExpanded" id="directory-tags" class="tags-drawer" :class="{ 'is-expanded': isTagsExpanded }">
                <div class="tags-drawer-surface">
                  <p class="tags-label">按标签筛选</p>
                  <div class="tags-filter" aria-label="资源标签">
                    <button
                      class="filter-tag"
                      :class="{ 'is-selected': selectedTag === '' }"
                      type="button"
                      :aria-pressed="selectedTag === ''"
                      @click="selectTag('')"
                    >全部</button>
                    <button
                      v-for="tag in allTags"
                      :key="tag"
                      class="filter-tag"
                      :class="{ 'is-selected': selectedTag === tag }"
                      type="button"
                      :aria-pressed="selectedTag === tag"
                      @click="selectTag(tag)"
                    >{{ tag }}</button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

        </header>

        <div id="directory-results" class="site-container">
          <section
            v-for="category in filteredGroupedSites"
            :id="`directory-category-${category.id}`"
            :key="category.id"
            class="category-section"
            :data-category="category.id"
          >
            <header class="category-heading">
              <span class="category-icon" aria-hidden="true">{{ category.icon }}</span>
              <div class="category-heading-copy">
                <h2>{{ category.name }}</h2>
                <p>{{ category.sites.length }} 个资源</p>
              </div>
            </header>

            <div class="site-grid">
              <a
                v-for="site in category.sites"
                :key="site.id"
                class="site-card"
                :href="site.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`在新标签页打开 ${site.name}`"
                :aria-describedby="isDescriptionOverflowing(site.id) ? siteDescriptionId(site) : undefined"
              >
                <div class="site-header">
                  <div class="logo-container" aria-hidden="true">
                    <img
                      v-if="hasLogo(site)"
                      class="site-logo"
                      :src="site.logo"
                      :alt="''"
                      loading="lazy"
                      @error="markLogoFailed(site.id)"
                    >
                    <span v-else class="site-initial">{{ getInitial(site.name) }}</span>
                  </div>
                  <div class="site-title-wrap">
                    <h3 class="site-name">{{ site.name }}</h3>
                    <Icon class="site-external-icon" icon="lucide:arrow-up-right" aria-hidden="true" />
                  </div>
                </div>

                <p class="site-desc">
                  <span :ref="element => setDescriptionElement(site.id, element)" class="site-desc-text">{{ site.desc }}</span>
                  <span
                    v-if="isDescriptionOverflowing(site.id)"
                    :id="siteDescriptionId(site)"
                    class="site-desc-tooltip"
                    role="tooltip"
                  >{{ site.desc }}</span>
                </p>

                <div v-if="site.tags.length" class="site-tags" aria-label="资源标签">
                  <span v-for="tag in site.tags.slice(0, 2)" :key="tag" class="site-tag">{{ tag }}</span>
                  <span v-if="site.tags.length > 2" class="site-tag site-tag-more">+{{ site.tags.length - 2 }}</span>
                </div>
              </a>
            </div>
          </section>

          <section v-if="!filteredGroupedSites.length" class="empty-state" aria-live="polite">
            <Icon icon="lucide:search-x" aria-hidden="true" />
            <h2>没有匹配的资源</h2>
            <p>尝试更换关键词或清除标签筛选。</p>
            <button type="button" @click="resetFilters">清除筛选</button>
          </section>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  data: { type: Object, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true }
})

const directoryRoot = ref(null)
const searchQuery = ref('')
const selectedTag = ref('')
const isTagsExpanded = ref(false)
const activeCategory = ref('')
const failedLogos = ref(new Set())
const overflowingDescriptions = ref(new Set())
const componentId = useId().replace(/:/g, '')
const searchId = `directory-search-${componentId}`
const descriptionElements = new Map()
let categoryObserver
let descriptionResizeObserver
let categoryScrollFrame
let categoryScrollTarget = ''
const scrollIntentKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])

const categories = computed(() => Array.isArray(props.data?.categories) ? props.data.categories : [])
const sites = computed(() => Array.isArray(props.data?.sites) ? props.data.sites : [])

const allTags = computed(() => {
  const tags = new Set()
  sites.value.forEach((site) => site.tags?.forEach((tag) => tags.add(tag)))
  return Array.from(tags).sort((left, right) => left.localeCompare(right, 'zh-CN'))
})

const filteredSites = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()
  return sites.value.filter((site) => {
    const searchableText = [site.name, site.desc, ...(site.tags || [])].join(' ').toLocaleLowerCase()
    return (!query || searchableText.includes(query)) && (!selectedTag.value || site.tags?.includes(selectedTag.value))
  })
})

const filteredGroupedSites = computed(() => categories.value
  .map((category) => ({
    ...category,
    sites: filteredSites.value.filter((site) => site.category === category.id)
  }))
  .filter((category) => category.sites.length > 0))

const visibleSiteCount = computed(() => filteredSites.value.length)

function getInitial(name) {
  return String(name || '?').trim().charAt(0).toUpperCase()
}

function hasLogo(site) {
  return Boolean(site.logo) && !failedLogos.value.has(site.id)
}

function markLogoFailed(id) {
  failedLogos.value = new Set([...failedLogos.value, id])
}

function siteDescriptionId(site) {
  return `site-description-${componentId}-${site.id}`
}

function setDescriptionElement(id, element) {
  if (element) descriptionElements.set(id, element)
  else descriptionElements.delete(id)
}

function measureDescriptions() {
  const overflowing = new Set()
  descriptionElements.forEach((element, id) => {
    if (element.scrollWidth > element.clientWidth + 1) overflowing.add(id)
  })
  overflowingDescriptions.value = overflowing
}

function isDescriptionOverflowing(id) {
  return overflowingDescriptions.value.has(id)
}

function selectTag(tag) {
  selectedTag.value = tag
}

function resetFilters() {
  searchQuery.value = ''
  selectedTag.value = ''
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function waitForHeightTransition(element, done) {
  const finish = () => {
    element.removeEventListener('transitionend', onTransitionEnd)
    window.clearTimeout(timeout)
    done()
  }
  const onTransitionEnd = (event) => {
    if (event.target === element && event.propertyName === 'height') finish()
  }
  const timeout = window.setTimeout(finish, 320)
  element.addEventListener('transitionend', onTransitionEnd)
}

function prepareTagDrawerEnter(element) {
  element.style.height = '0px'
  element.style.opacity = '0'
}

function enterTagDrawer(element, done) {
  if (prefersReducedMotion()) {
    element.style.height = 'auto'
    element.style.opacity = '1'
    done()
    return
  }
  const height = element.scrollHeight
  window.requestAnimationFrame(() => {
    element.style.height = `${height}px`
    element.style.opacity = '1'
    waitForHeightTransition(element, done)
  })
}

function finishTagDrawerEnter(element) {
  element.style.height = ''
  element.style.opacity = ''
}

function prepareTagDrawerLeave(element) {
  element.style.height = `${element.offsetHeight}px`
  element.style.opacity = '1'
}

function leaveTagDrawer(element, done) {
  if (prefersReducedMotion()) {
    done()
    return
  }
  window.requestAnimationFrame(() => {
    element.style.height = '0px'
    element.style.opacity = '0'
    waitForHeightTransition(element, done)
  })
}

function finishTagDrawerLeave(element) {
  element.style.height = ''
  element.style.opacity = ''
}

function hasCategoryScrollLock() {
  return Boolean(categoryScrollTarget)
}

function lockCategoryDuringScroll(categoryId) {
  categoryScrollTarget = categoryId
}

function releaseCategoryScrollLock() {
  categoryScrollTarget = ''
}

function releaseCategoryScrollLockFromKeyboard(event) {
  if (scrollIntentKeys.has(event.key)) releaseCategoryScrollLock()
}

function syncActiveCategoryFromViewport() {
  if (hasCategoryScrollLock()) {
    activeCategory.value = categoryScrollTarget
    return
  }
  if (categoryScrollFrame) return
  categoryScrollFrame = window.requestAnimationFrame(() => {
    categoryScrollFrame = undefined
    const sectionList = Array.from(directoryRoot.value?.querySelectorAll('.category-section') || [])
    if (!sectionList.length) return
    const isAtPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8
    const currentSection = isAtPageEnd
      ? sectionList.at(-1)
      : sectionList.filter((section) => section.getBoundingClientRect().top <= 112).at(-1)
        || sectionList.find((section) => section.getBoundingClientRect().bottom > 112)

    if (currentSection?.dataset.category) activeCategory.value = currentSection.dataset.category
  })
}

function observeCategories() {
  categoryObserver?.disconnect()
  const sections = directoryRoot.value?.querySelectorAll('.category-section') || []
  if (!sections.length || !('IntersectionObserver' in window)) return

  categoryObserver = new IntersectionObserver(() => {
    syncActiveCategoryFromViewport()
  }, {
    rootMargin: '-88px 0px -18% 0px',
    threshold: [0, 0.05]
  })
  sections.forEach((section) => categoryObserver.observe(section))
}

function scrollToCategory(categoryId) {
  const element = Array.from(directoryRoot.value?.querySelectorAll('.category-section') || [])
    .find((section) => section.dataset.category === categoryId)
  if (!element) return
  lockCategoryDuringScroll(categoryId)
  activeCategory.value = categoryId
  element.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start'
  })
}

watch(filteredGroupedSites, async (groups) => {
  if (categoryScrollTarget && !groups.some((group) => group.id === categoryScrollTarget)) {
    releaseCategoryScrollLock()
  }
  if (!groups.some((group) => group.id === activeCategory.value)) activeCategory.value = groups[0]?.id || ''
  await nextTick()
  observeCategories()
  measureDescriptions()
}, { flush: 'post' })

onMounted(async () => {
  activeCategory.value = filteredGroupedSites.value[0]?.id || ''
  await nextTick()
  observeCategories()
  window.addEventListener('scroll', syncActiveCategoryFromViewport, { passive: true })
  window.addEventListener('wheel', releaseCategoryScrollLock, { passive: true })
  window.addEventListener('touchstart', releaseCategoryScrollLock, { passive: true })
  window.addEventListener('pointerdown', releaseCategoryScrollLock, { passive: true })
  window.addEventListener('keydown', releaseCategoryScrollLockFromKeyboard)
  measureDescriptions()
  if ('ResizeObserver' in window && directoryRoot.value) {
    descriptionResizeObserver = new ResizeObserver(measureDescriptions)
    descriptionResizeObserver.observe(directoryRoot.value)
  }
})

onBeforeUnmount(() => {
  categoryObserver?.disconnect()
  descriptionResizeObserver?.disconnect()
  window.removeEventListener('scroll', syncActiveCategoryFromViewport)
  window.removeEventListener('wheel', releaseCategoryScrollLock)
  window.removeEventListener('touchstart', releaseCategoryScrollLock)
  window.removeEventListener('pointerdown', releaseCategoryScrollLock)
  window.removeEventListener('keydown', releaseCategoryScrollLockFromKeyboard)
  if (categoryScrollFrame) window.cancelAnimationFrame(categoryScrollFrame)
})
</script>

<style scoped>
.navigation-directory {
  width: 100%;
  min-height: calc(100dvh - 64px);
  margin: 0;
  padding: 0;
  color: var(--vp-c-text-1);
  font-family: var(--font-ui);
}

.directory-shell {
  display: grid;
  grid-template-columns: 244px minmax(0, 1fr);
  align-items: start;
  min-height: inherit;
  gap: 0;
}

.directory-main {
  width: 100%;
  min-width: 0;
  padding: clamp(28px, 3vw, 44px) clamp(24px, 3.5vw, 56px) 56px;
}

.category-sidebar {
  position: sticky;
  top: 64px;
  display: flex;
  height: calc(100dvh - 64px);
  max-height: none;
  flex-direction: column;
  gap: 12px;
  padding: 18px 14px;
  overflow-y: auto;
  border: 0;
  border-right: 1px solid var(--vp-c-divider);
  border-radius: 0;
  background: color-mix(in srgb, var(--vp-c-bg-elv) 92%, transparent);
  backdrop-filter: blur(14px) saturate(1.08);
  z-index: 2;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 4px;
}

.sidebar-brand-icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 18px;
}

.sidebar-brand-copy { min-width: 0; }

.sidebar-brand-copy strong,
.sidebar-brand-copy small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-brand-copy strong {
  color: var(--vp-c-text-1);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 600;
}

.sidebar-brand-copy small {
  margin-top: 1px;
  color: var(--vp-c-text-3);
  font-family: var(--font-code);
  font-size: 0.67rem;
}

.sidebar-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 5px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-family: var(--font-code);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
}

.sidebar-nav { display: grid; gap: 4px; }

.category-item {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: center;
  min-height: 40px;
  gap: 10px;
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.82rem;
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  transition: color 150ms ease, background-color 150ms ease, transform 150ms var(--motion-ease-out);
}

.category-item.is-active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-hard);
  font-weight: 600;
}

.category-item-icon {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  font-size: 0.92rem;
  line-height: 1;
}

.category-item-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-empty { margin: 0; padding: 8px; color: var(--vp-c-text-3); font-size: 0.75rem; }

.directory-header {
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
}

.directory-intro { text-align: center; }

.directory-kicker {
  margin: 0 0 6px;
  color: var(--vp-c-brand-1);
  font-family: var(--font-code);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
}

.directory-intro h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: var(--font-heading-primary);
  font-size: clamp(1.65rem, 3vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
  text-wrap: balance;
}

.directory-subtitle {
  max-width: 62ch;
  margin: 8px auto 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.65;
}

.directory-controls {
  display: grid;
  width: min(760px, 100%);
  margin: 0 auto;
  gap: 8px;
}

.search-box {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 7px 0 12px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-elv);
  transition: border-color 150ms ease, background-color 150ms ease;
}

.search-box:focus-within { border-color: var(--vp-c-brand-1); }
.search-icon { color: var(--vp-c-text-3); font-size: 17px; }

.search-input {
  min-width: 0;
  padding: 9px 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.9rem;
}

.search-input::placeholder { color: var(--vp-c-text-3); }

.search-clear,
.filter-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  touch-action: manipulation;
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease, transform 150ms var(--motion-ease-out);
}

.search-clear { width: 34px; padding: 0; background: transparent; }

.filter-toggle {
  gap: 6px;
  padding: 0 9px;
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.filter-chevron { transition: transform 150ms var(--motion-ease-out); }
.filter-chevron.is-expanded { transform: rotate(180deg); }

.tags-drawer {
  overflow: hidden;
  transition: height var(--motion-duration-normal) var(--motion-ease-in-out), opacity 150ms ease;
}

.tags-drawer-surface {
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 150ms ease, transform var(--motion-duration-normal) var(--motion-ease-out);
}

.tags-drawer.is-expanded .tags-drawer-surface { opacity: 1; transform: translateY(0); }
.tags-label { margin: 0 0 8px; color: var(--vp-c-text-2); font-size: 0.75rem; }
.tags-filter { display: flex; flex-wrap: wrap; gap: 6px; }

.filter-tag {
  min-height: 30px;
  padding: 3px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  touch-action: manipulation;
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease, transform 150ms var(--motion-ease-out);
}

.filter-tag.is-selected {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-hard);
}

.result-summary {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  text-align: center;
}
.result-summary strong { color: var(--vp-c-brand-hard); font-family: var(--font-code); font-weight: 600; }
.site-container { display: grid; gap: 30px; }
.category-section { min-width: 0; scroll-margin-top: 88px; }

.category-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 10px;
}

.category-icon {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 7px;
  background: var(--vp-c-bg-soft);
  font-size: 1.15rem;
  line-height: 1;
}

.category-heading-copy { display: flex; min-width: 0; align-items: baseline; gap: 8px; }
.category-heading h2 { margin: 0; color: var(--vp-c-text-1); font-family: var(--font-heading); font-size: 1.08rem; font-weight: 600; line-height: 1.35; }
.category-heading p { margin: 0; color: var(--vp-c-text-3); font-family: var(--font-code); font-size: 0.68rem; }

.site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 10px;
}

.site-card {
  position: relative;
  z-index: 0;
  display: flex;
  min-width: 0;
  min-height: 126px;
  flex-direction: column;
  padding: 12px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-elv);
  color: inherit;
  text-decoration: none;
  transition: border-color 150ms ease, background-color 150ms ease, transform 170ms var(--motion-ease-out);
}

.site-header { display: flex; align-items: center; gap: 9px; }

.logo-container {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.site-logo { width: 32px; height: 32px; object-fit: contain; }
.site-initial { color: var(--vp-c-brand-1); font-family: var(--font-code); font-size: 0.98rem; }
.site-title-wrap { display: flex; min-width: 0; flex: 1; align-items: center; gap: 5px; }

.site-name {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-external-icon {
  flex: 0 0 auto;
  color: var(--vp-c-text-3);
  font-size: 14px;
  transition: transform 150ms var(--motion-ease-out), color 150ms ease;
}

.site-desc { min-width: 0; margin: 8px 0 9px; color: var(--vp-c-text-2); font-size: 0.76rem; line-height: 1.45; }

.site-desc-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-desc-tooltip {
  position: absolute;
  top: calc(100% - 7px);
  right: 10px;
  left: 10px;
  z-index: 30;
  padding: 9px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--vp-c-text-1) 16%, transparent);
  color: var(--vp-c-text-1);
  font-family: var(--font-ui);
  font-size: 0.78rem;
  line-height: 1.55;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px) scale(0.985);
  transform-origin: top center;
  pointer-events: none;
  transition: opacity 150ms ease, transform 170ms var(--motion-ease-out), visibility 150ms;
}

.site-tags {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 5px;
  margin-top: auto;
  overflow: hidden;
  white-space: nowrap;
}

.site-tag {
  max-width: 92px;
  padding: 2px 6px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 0.62rem;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-tag-more { flex: 0 0 auto; color: var(--vp-c-brand-hard); }

.empty-state {
  display: grid;
  justify-items: start;
  gap: 8px;
  padding: clamp(24px, 5vw, 42px);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.empty-state > svg { color: var(--vp-c-brand-1); font-size: 24px; }
.empty-state h2, .empty-state p { margin: 0; }
.empty-state h2 { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 600; }
.empty-state p { color: var(--vp-c-text-2); font-size: 0.82rem; }

.empty-state button {
  min-height: 34px;
  margin-top: 4px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-brand-3);
  border-radius: 7px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-hard);
  font: inherit;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .search-clear:hover,
  .filter-toggle:hover {
    border-color: var(--vp-c-brand-3);
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-hard);
  }

  .category-item:not(.is-active):hover {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    transform: translateX(2px);
  }
  .filter-tag:hover { border-color: var(--vp-c-brand-3); color: var(--vp-c-brand-hard); }

  .site-card:hover {
    z-index: 10;
    border-color: var(--vp-c-brand-2);
    background: var(--vp-c-bg-safe);
    transform: translateY(-2px);
  }

  .site-card:hover .site-external-icon { color: var(--vp-c-brand-1); transform: translate(1px, -1px); }
  .site-card:hover .site-desc-tooltip { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
}

.site-card:focus-visible { z-index: 10; }
.site-card:focus-visible .site-desc-tooltip { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }

.search-clear:active,
.filter-toggle:active,
.filter-tag:active,
.site-card:active,
.category-item:active { transform: scale(0.98); }

.category-item:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.search-clear:focus-visible,
.filter-toggle:focus-visible,
.filter-tag:focus-visible,
.site-card:focus-visible,
.empty-state button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1100px) {
  .directory-shell { grid-template-columns: 216px minmax(0, 1fr); }
  .directory-main { padding-inline: 28px; }
  .site-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
}

@media (max-width: 820px) {
  .directory-shell { grid-template-columns: 1fr; }
  .directory-main { padding: 24px 16px 48px; }
  .category-sidebar {
    position: static;
    height: auto;
    max-height: none;
    margin: 16px 16px 0;
    padding: 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
  }
  .sidebar-meta { padding-top: 8px; }
  .sidebar-nav { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .navigation-directory { padding: 0; }
  .category-sidebar { margin: 14px 14px 0; }
  .directory-main { padding: 20px 14px 48px; }
  .directory-shell { gap: 18px; }
  .sidebar-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .category-item { grid-template-columns: 22px minmax(0, 1fr); padding-inline: 6px; }
  .directory-header { gap: 14px; margin-bottom: 24px; }
  .search-box { grid-template-columns: auto minmax(0, 1fr) auto auto; min-height: 44px; padding-left: 10px; }
  .filter-toggle { width: 34px; padding: 0; }
  .filter-toggle > span, .filter-chevron { display: none; }
  .site-grid { grid-template-columns: 1fr; }
  .site-card { min-height: 118px; }
  .site-desc-tooltip { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .filter-chevron,
  .site-external-icon,
  .tags-drawer-surface,
  .site-desc-tooltip,
  .site-card,
  .category-item { transition-duration: 0.01ms; }

  .tags-drawer-surface,
  .site-desc-tooltip { transform: none; }
}
</style>
