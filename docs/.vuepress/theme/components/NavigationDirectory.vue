<template>
  <main class="navigation-directory" @keydown.esc="isSidebarOpen = false">
    <!-- 页面头部与筛选 -->
    <header class="directory-header">
      <div class="directory-intro">
        <p class="directory-kicker">资源导航</p>
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

        <Transition
          name="tag-drawer"
          @before-enter="prepareTagDrawerEnter"
          @enter="enterTagDrawer"
          @after-enter="finishTagDrawerEnter"
          @before-leave="prepareTagDrawerLeave"
          @leave="leaveTagDrawer"
          @after-leave="finishTagDrawerLeave"
        >
          <div
            v-if="isTagsExpanded"
            id="directory-tags"
            class="tags-drawer"
            :class="{ 'is-expanded': isTagsExpanded }"
          >
            <div class="tags-drawer-surface">
              <p class="tags-label">按标签筛选</p>
              <div class="tags-filter" aria-label="资源标签">
                <button
                  class="filter-tag"
                  :class="{ 'is-selected': selectedTag === '' }"
                  type="button"
                  :aria-pressed="selectedTag === ''"
                  @click="selectTag('')"
                >
                  全部
                </button>
                <button
                  v-for="tag in allTags"
                  :key="tag"
                  class="filter-tag"
                  :class="{ 'is-selected': selectedTag === tag }"
                  type="button"
                  :aria-pressed="selectedTag === tag"
                  @click="selectTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <p class="result-summary" aria-live="polite">
        显示 <strong>{{ visibleSiteCount }}</strong> / {{ sites.length }} 个资源
        <span v-if="selectedTag"> · 标签：{{ selectedTag }}</span>
      </p>
    </header>

    <!-- 资源列表 -->
    <div id="directory-results" class="site-container">
      <section
        v-for="category in filteredGroupedSites"
        :key="category.id"
        class="category-section"
        :data-category="category.id"
      >
        <header class="category-heading">
          <span class="category-icon" aria-hidden="true">{{ category.icon }}</span>
          <div>
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
                <Icon class="site-external-icon" icon="mdi:arrow-top-right" aria-hidden="true" />
              </div>
            </div>
            <p class="site-desc">{{ site.desc }}</p>
            <div v-if="site.tags.length" class="site-tags" aria-label="资源标签">
              <span v-for="tag in site.tags" :key="tag" class="site-tag">{{ tag }}</span>
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

    <footer class="directory-footer">
      <Icon icon="lucide:compass" aria-hidden="true" />
      当前导航共收录 {{ sites.length }} 个资源
    </footer>

    <!-- 页面内目录 -->
    <aside
      class="category-sidebar"
      :class="{ 'is-open': isSidebarOpen }"
      @mouseenter="openSidebarOnPointer"
      @mouseleave="closeSidebarOnPointer"
    >
      <button
        class="sidebar-toggle"
        type="button"
        :aria-expanded="isSidebarOpen"
        aria-controls="directory-categories"
        aria-label="切换资源分类目录"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <Icon icon="lucide:list-tree" aria-hidden="true" />
      </button>
      <nav id="directory-categories" class="sidebar-content" aria-label="资源分类目录">
        <p class="sidebar-title">分类目录</p>
        <button
          v-for="category in filteredGroupedSites"
          :key="category.id"
          class="category-item"
          type="button"
          @click="scrollToCategory(category.id)"
        >
          <span class="category-item-icon" aria-hidden="true">{{ category.icon }}</span>
          <span>{{ category.name }}</span>
          <span class="category-count">{{ category.sites.length }}</span>
        </button>
      </nav>
    </aside>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})

const searchQuery = ref('')
const selectedTag = ref('')
const isTagsExpanded = ref(false)
const isSidebarOpen = ref(false)
const failedLogos = ref(new Set())
const searchId = `directory-search-${Math.random().toString(36).slice(2, 8)}`

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
    const matchesSearch = !query || searchableText.includes(query)
    const matchesTag = !selectedTag.value || site.tags?.includes(selectedTag.value)
    return matchesSearch && matchesTag
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

function hasFineHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function openSidebarOnPointer() {
  if (hasFineHover()) isSidebarOpen.value = true
}

function closeSidebarOnPointer() {
  if (hasFineHover()) isSidebarOpen.value = false
}

function scrollToCategory(categoryId) {
  const element = document.querySelector(`[data-category="${categoryId}"]`)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  element?.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start'
  })
  isSidebarOpen.value = false
}
</script>

<style scoped>
/* ===========================================================================
   资源导航页
   ========================================================================== */

.navigation-directory {
  max-width: 1800px;
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 3.5rem) clamp(1rem, 3vw, 2rem);
  color: var(--vp-c-text-1);
  font-family: var(--font-ui);
}

.directory-header {
  display: grid;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto clamp(2rem, 5vw, 3.5rem);
}

.directory-kicker {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-family: var(--font-code);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.directory-intro h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: var(--font-heading-primary);
  font-size: clamp(1.8rem, 4vw, 2.7rem);
  font-weight: 700;
  line-height: 1.2;
  text-wrap: balance;
}

.directory-subtitle {
  max-width: 58ch;
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.7;
}

.directory-controls {
  display: grid;
  gap: 10px;
}

.search-box {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 8px;
  min-height: 52px;
  padding: 0 8px 0 14px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  transition: border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease;
}

.search-box:focus-within {
  border-color: var(--vp-c-brand-1);
}

.search-icon {
  color: var(--vp-c-text-3);
  font-size: 18px;
}

.search-input {
  min-width: 0;
  padding: 10px 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 1rem;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-clear,
.filter-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  touch-action: manipulation;
  transition: color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.search-clear {
  width: 36px;
  padding: 0;
  background: transparent;
}

.filter-toggle {
  gap: 6px;
  padding: 0 10px;
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.filter-chevron {
  transition: transform var(--motion-duration-fast) var(--motion-ease-out);
}

.filter-chevron.is-expanded {
  transform: rotate(180deg);
}

.tags-drawer {
  overflow: hidden;
  transition: height var(--motion-duration-normal) var(--motion-ease-in-out),
    opacity var(--motion-duration-fast) ease;
}

.tags-drawer-surface {
  padding: 14px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity var(--motion-duration-fast) ease,
    transform var(--motion-duration-normal) var(--motion-ease-out);
}

.tags-drawer.is-expanded .tags-drawer-surface {
  opacity: 1;
  transform: translateY(0);
}

.tags-label {
  margin: 0 0 10px;
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  min-height: 32px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
  touch-action: manipulation;
  transition: color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.filter-tag.is-selected {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-hard);
}

.result-summary {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.result-summary strong {
  color: var(--vp-c-brand-hard);
  font-family: var(--font-code);
  font-weight: 400;
}

.site-container {
  display: grid;
  gap: clamp(2.5rem, 6vw, 4.5rem);
}

.category-section {
  scroll-margin-top: 96px;
}

.category-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.category-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 1.6rem;
  line-height: 1;
}

.category-heading h2 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: var(--font-heading);
  font-size: clamp(1.2rem, 2vw, 1.45rem);
  font-weight: 600;
  line-height: 1.35;
}

.category-heading p {
  margin: 2px 0 0;
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
}

.site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

@media (min-width: 1380px) {
  .site-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.site-card {
  display: flex;
  flex-direction: column;
  min-height: 178px;
  padding: 16px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  color: inherit;
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: border-color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-normal) var(--motion-ease-out);
}

.site-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-container {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 42px;
  height: 42px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider); 
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.site-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.site-initial {
  color: var(--vp-c-brand-1);
  font-family: var(--font-code);
  font-size: 1rem;
}

.site-title-wrap {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: baseline;
  gap: 6px;
}

.site-name {
  min-width: 0;
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

.site-external-icon {
  flex: 0 0 auto;
  color: var(--vp-c-text-3);
  font-size: 15px;
  transition: transform var(--motion-duration-fast) var(--motion-ease-out),
    color var(--motion-duration-fast) ease;
}

.site-desc {
  display: -webkit-box;
  min-height: 3.1em;
  margin: 14px 0;
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.site-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.site-tag {
  padding: 3px 7px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 0.6875rem;
  line-height: 1.25;
}

.empty-state {
  display: grid;
  justify-items: start;
  gap: 8px;
  padding: clamp(1.5rem, 5vw, 3rem);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.empty-state > svg {
  color: var(--vp-c-brand-1);
  font-size: 24px;
}

.empty-state h2,
.empty-state p {
  margin: 0;
}

.empty-state h2 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.empty-state p {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.empty-state button {
  min-height: 36px;
  margin-top: 4px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-brand-3);
  border-radius: 7px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-hard);
  font: inherit;
  cursor: pointer;
}

.directory-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding-top: 18px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.directory-footer > svg {
  color: var(--vp-c-brand-1);
}

/* 页面内目录 */
.category-sidebar {
  position: fixed;
  right: 0;
  top: 50%;
  z-index: 30;
  display: flex;
  align-items: center;
  transform: translateX(calc(100% - 44px)) translateY(-50%);
  transition: transform var(--motion-duration-normal) var(--motion-ease-out);
}

.category-sidebar.is-open {
  transform: translateX(0) translateY(-50%);
}

.sidebar-toggle {
  display: grid;
  place-items: center;
  width: 44px;
  height: 56px;
  padding: 0;
  border: 1px solid var(--vp-c-brand-2);
  border-right: 0;
  border-radius: 10px 0 0 10px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg-safe);
  cursor: pointer;
  touch-action: manipulation;
}

.sidebar-content {
  display: grid;
  width: min(160px, calc(100vw - 44px));
  max-height: min(70dvh, 640px);
  gap: 4px;
  padding: 12px;
  overflow-y: auto;
  border: 2px solid var(--vp-c-divider);
  border-right: 0;
  border-radius: 10px 0 0 10px;
  background: var(--vp-c-bg-elv);
}

.sidebar-title {
  margin: 0 0 4px;
  padding: 4px 6px;
  color: var(--vp-c-text-3);
  font-family: var(--font-code);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.category-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  min-height: 36px;
  gap: 8px;
  padding: 6px;
  border: 2px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.8125rem;
  text-align: left;
  cursor: pointer;
  transition: color var(--motion-duration-fast) ease,
    background-color var(--motion-duration-fast) ease,
    border-color var(--motion-duration-fast) ease,
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.category-count {
  color: var(--vp-c-text-3);
  font-family: var(--font-code);
  font-size: 0.6875rem;
}

.category-item-icon {
  display: grid;
  place-items: center;
  width: 1.25rem;
  font-size: 1rem;
  line-height: 1;
}

@media (hover: hover) and (pointer: fine) {
  .search-clear:hover,
  .filter-toggle:hover {
    border-color: var(--vp-c-brand-3);
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-hard);
  }

  .filter-tag:hover {
    border-color: var(--vp-c-brand-3);
    color: var(--vp-c-brand-hard);
    transform: translateY(-1px);
  }

  .site-card:hover {
    border-color: var(--vp-c-brand-2);
    background: var(--vp-c-bg-safe);
    transform: translateY(-2px);
  }

  .site-card:hover .site-external-icon {
    color: var(--vp-c-brand-1);
    transform: translate(2px, -2px);
  }

  .category-item:hover {
    border-color: var(--vp-c-brand-3);
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-hard);
    transform: translateX(-2px);
  }
}

.search-clear:active,
.filter-toggle:active,
.filter-tag:active,
.site-card:active,
.category-item:active {
  transform: scale(0.98);
}

.search-clear:focus-visible,
.filter-toggle:focus-visible,
.filter-tag:focus-visible,
.site-card:focus-visible,
.empty-state button:focus-visible,
.sidebar-toggle:focus-visible,
.category-item:focus-visible {
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

@media (max-width: 680px) {
  .navigation-directory {
    padding-bottom: 5rem;
  }

  .directory-header {
    gap: 16px;
  }

  .search-box {
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    min-height: 48px;
    padding-left: 12px;
  }

  .filter-toggle {
    width: 36px;
    padding: 0;
  }

  .filter-toggle > span,
  .filter-chevron {
    display: none;
  }

  .site-grid {
    grid-template-columns: 1fr;
  }

  .site-card {
    min-height: 0;
  }

  .category-sidebar {
    top: auto;
    bottom: 16px;
    transform: translateX(calc(100% - 44px));
  }

  .category-sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-toggle {
    height: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .filter-chevron,
  .site-external-icon,
  .category-sidebar,
  .tags-drawer-surface {
    transition: opacity var(--motion-duration-fast) ease,
      color var(--motion-duration-fast) ease,
      background-color var(--motion-duration-fast) ease,
      border-color var(--motion-duration-fast) ease;
  }

  .tags-drawer-surface {
    transform: none;
  }
}
</style>
