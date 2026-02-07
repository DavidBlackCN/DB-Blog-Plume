<template>
  <div class="nav-page">
    <div class="header">
      <div class="header-content">
        <p class="subtitle">本页面为NavPage.vue组件的预览页面！</p>
      </div>
      
      <div class="search-container">
        <!-- 搜索框区域 -->
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索资源..."
            class="search-input"
          />
          
          <!-- 新增：标签筛选折叠开关 -->
          <button 
            class="filter-toggle-btn" 
            :class="{ active: isTagsExpanded }"
            @click="isTagsExpanded = !isTagsExpanded"
          >
            <svg class="filter-icon" viewBox="0 0 24 24">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
            <span>筛选</span>
            <svg class="arrow-icon" :class="{ rotated: isTagsExpanded }" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
        </div>

        <!-- 折叠标签栏 -->
        <transition name="expand">
          <div v-if="isTagsExpanded" class="tags-drawer">
            <div class="tags-filter">
              <span 
                class="filter-tag" 
                :class="{ active: selectedTag === '' }"
                @click="selectedTag = ''"
              >全部</span>
              <span 
                v-for="tag in allTags" 
                :key="tag" 
                class="filter-tag"
                :class="{ active: selectedTag === tag }"
                @click="selectedTag = tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 资源列表部分 (保持不变) -->
    <div class="site-container">
      <template v-for="category in filteredGroupedSites" :key="category.id">
        <div class="category-section" :data-category="category.id">
          <h2 class="category-title">
            <span class="category-icon">{{ category.icon }}</span>
            {{ category.name }}
          </h2>
          <div class="site-grid">
            <a
              v-for="site in category.sites"
              :key="site.id"
              :href="site.url"
              target="_blank"
              class="site-card"
            >
              <div class="site-header">
                <div class="logo-container">
                  <div class="site-logo">
                    <img v-if="site.logo" :src="site.logo" :alt="site.name" />
                    <div v-else class="site-initial">{{ getInitial(site.name) }}</div>
                  </div>
                </div>
                <h3 class="site-name">{{ site.name }}</h3>
              </div>
              <p class="site-desc">{{ site.desc }}</p>
              <div class="site-tags">
                <span v-for="tag in site.tags" :key="tag" class="site-tag">{{ tag }}</span>
              </div>
            </a>
          </div>
        </div>
      </template>
    </div>

    <div class="footer">
      <p>该页面共收录 {{ sites.length }} 个资源</p>
    </div>

    <!-- 原有目录侧边栏 (保持不变) -->
    <div class="category-sidebar" :class="{ active: sidebarActive }" @mouseenter="sidebarActive = true" @mouseleave="sidebarActive = false">
      <div class="sidebar-trigger" @click="sidebarActive = !sidebarActive">
        <svg class="trigger-icon" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      </div>
      <div class="sidebar-content">
        <h3 class="sidebar-title">目录</h3>
        <ul class="category-list">
          <li v-for="category in categories" :key="category.id" @click="scrollToCategory(category.id)" class="category-item">
            <span class="category-icon">{{ category.icon }}</span>{{ category.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { categories, sites } from '../data/NavData.ts';

export default {
  name: 'NavPage',
  data() {
    return {
      categories: categories.filter(cat => cat.id !== 'all'),
      sites,
      searchQuery: '',
      selectedTag: '',
      isTagsExpanded: false, // 控制标签栏展开
      sidebarActive: false
    };
  },
  computed: {
    allTags() {
      const tags = new Set();
      this.sites.forEach(site => site.tags && site.tags.forEach(t => tags.add(t)));
      return Array.from(tags).sort();
    },
    filteredGroupedSites() {
      const query = this.searchQuery.toLowerCase();
      const filtered = this.sites.filter(site => {
        const matchesSearch = !query || site.name.toLowerCase().includes(query) || site.desc.toLowerCase().includes(query);
        const matchesTag = !this.selectedTag || site.tags.includes(this.selectedTag);
        return matchesSearch && matchesTag;
      });
      return this.categories.map(category => ({
        ...category,
        sites: filtered.filter(site => site.category === category.id)
      })).filter(group => group.sites.length > 0);
    }
  },
  methods: {
    getInitial(name) { return name.charAt(0); },
    scrollToCategory(categoryId) {
      const element = document.querySelector(`[data-category="${categoryId}"]`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.sidebarActive = false;
    }
  }
};
</script>

<style scoped>
.nav-page {
  max-width: 1880px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
}

/* 搜索容器 */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
}

.search-container {
  width: 100%;
  max-width: 900px; /* 保持长搜索框 */
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-alt);
  border-radius: 12px;
  padding: 0.5rem 1.2rem;
  border: 1.5px solid var(--vp-c-divider);
  box-shadow: 0 4px 10px var(--vp-c-shadow);
}

/* 搜索图标尺寸固定 */
.search-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: var(--vp-c-text-2);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
  outline: none;
  padding: 0.5rem 10px;
}

/* 筛选切换按钮 */
.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
  font-size: 0.9rem;
}

.filter-toggle-btn:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-brand);
}

.filter-toggle-btn.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.filter-icon { width: 16px; height: 16px; fill: currentColor; }
.arrow-icon { width: 18px; height: 18px; fill: currentColor; transition: transform 0.3s; }
.arrow-icon.rotated { transform: rotate(180deg); }

/* 标签抽屉动画 */
.tags-drawer {
  margin-top: 1rem;
  overflow: hidden;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 10px;
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
}

.filter-tag {
  padding: 4px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.filter-tag.active {
  background: var(--vp-c-brand);
  color: white;
}

/* 展开动画 */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 200px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}

/* Logo 容器：保持方形圆角 */
.logo-container {
  width: 52px;
  height: 52px;
  background: var(--vp-c-bg-alt);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.site-logo { 
  width: 40px;
  height: 40px;
  display: flex;           
  align-items: center;     
  justify-content: center; 
  overflow: hidden;        
}
.site-logo img { 
  width: 100%; 
  height: 100%; 
  object-fit: contain;
  display: block;          
}
.site-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--vp-c-brand);
  line-height: 1;          
}

/* 描述文字截断 */
.site-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0.8rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3em;
}

/* 其它样式 (网格、侧边栏等) 与之前一致 */
.site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.site-card {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.2rem;
  border: 1.5px solid var(--vp-c-divider);
  text-decoration: none;
}
.site-card:hover { transform: translateY(-3px); border-color: var(--vp-c-brand); }
.site-header { display: flex; align-items: center; }
.site-name { font-size: 1.05rem; font-weight: 600; color: var(--vp-c-text-1); margin: 0; }
.site-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: auto; }
.site-tag { background: var(--vp-c-bg-alt); font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; }

/* 侧边栏样式 */
.category-sidebar {
  position: fixed;
  right: -220px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  transition: right 0.3s;
}
.category-sidebar.active { right: 0; }
.trigger-icon {
  width: 24px;
  height: 24px;
  fill: white;
}
.sidebar-trigger {
  width: 40px; height: 80px; background: var(--vp-c-brand);
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px 0 0 10px; cursor: pointer; color: white;
}
.sidebar-content {
  width: 220px; background: var(--vp-c-bg-soft); padding: 1rem;
  border: 2px solid var(--vp-c-divider); border-right: none;
  border-radius: 10px 0 0 10px; max-height: 70vh; overflow-y: auto;
}
.category-item {
  padding: 8px; margin: 4px 0; cursor: pointer; border-radius: 6px;
  display: flex; align-items: center; gap: 8px;
}
.category-item:hover { background: var(--vp-c-bg-mute); color: var(--vp-c-brand); }

/* 分组之间的分割线 */
.category-section:not(:first-child) {
  margin-top: 3rem;       /* 增加顶部间距 */
  border-top: 1px solid var(--vp-c-divider); /* 使用 VuePress 标准分割线颜色 */
}
/* 调整标题间距，使其更贴合分割线后的布局 */
.category-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 768px) {
  .search-box { padding: 0.4rem 0.8rem; }
  .filter-toggle-btn span { display: none; } /* 移动端隐藏“筛选”文字只留图标 */
}

.footer {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  position: relative;
  border-top: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  background: transparent;
  margin-top: 1rem;
}

</style>
