<!-- DeepSeek生成后人工精修 -->
<!-- 凑合着用（（（ -->
<template>
  <div class="nav-page">
    <!-- 原有页面内容 -->
    <div class="header">
      <div class="header-content">
        <p class="subtitle">探索优质资源，提升开发效率@</p>
      </div>
      
      <div class="search-container">
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
        </div>
      </div>
    </div>

    <!-- 按分类分组显示资源 -->
    <div class="site-container">
      <template v-for="(category, index) in groupedSites" :key="category.id">
        <div class="category-section" :data-category="category.id">
          <!-- 分类标题 -->
          <h2 class="category-title">
            <span class="category-icon">{{ category.icon }}</span>
            {{ category.name }}
          </h2>
          
          <!-- 该分类下的资源网格 -->
          <div class="site-grid">
            <a
              v-for="site in category.sites"
              :key="site.id"
              :href="site.url"
              target="_blank"
              rel="noopener noreferrer"
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
                <span v-for="tag in site.tags" :key="tag" class="site-tag">
                  {{ tag }}
                </span>
              </div>
            </a>
          </div>
        </div>
      </template>

      <!-- 无结果提示 -->
      <div v-if="groupedSites.length === 0" class="no-results">
        <svg class="no-results-icon" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <h3>未找到匹配的资源</h3>
        <p>请尝试其他搜索关键词</p>
      </div>
    </div>

    <div class="footer">
      <p>© 2023 开发者导航 | 共收录 {{ sites.length }} 个资源</p>
    </div>
    
    <!-- 右侧分类侧边栏 -->
    <div 
      class="category-sidebar"
      :class="{ active: sidebarActive }"
      @mouseenter="sidebarActive = true"
      @mouseleave="sidebarActive = false"
    >
      <div class="sidebar-trigger" @click="sidebarActive = !sidebarActive">
        <svg class="trigger-icon" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
      
      <div class="sidebar-content">
        <h3 class="sidebar-title">目录</h3>
        <ul class="category-list">
          <li 
            v-for="category in categories" 
            :key="category.id"
            @click="scrollToCategory(category.id)"
            class="category-item"
          >
            <span class="category-icon">{{ category.icon }}</span>
            {{ category.name }}
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
      sidebarActive: false
    };
  },
  computed: {
    groupedSites() {
      const filteredSites = this.searchQuery 
        ? this.sites.filter(site => {
            const query = this.searchQuery.toLowerCase();
            return (
              site.name.toLowerCase().includes(query) || 
              site.desc.toLowerCase().includes(query) ||
              site.tags.some(tag => tag.toLowerCase().includes(query))
            );
          })
        : this.sites;
      
      const groups = this.categories.map(category => {
        const categorySites = filteredSites.filter(site => site.category === category.id);
        return {
          ...category,
          sites: categorySites
        };
      });
      
      return groups.filter(group => group.sites.length > 0);
    }
  },
  methods: {
    getInitial(name) {
      return name.charAt(0);
    },
    scrollToCategory(categoryId) {
      const element = document.querySelector(`[data-category="${categoryId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.classList.add('highlighted');
        setTimeout(() => {
          element.classList.remove('highlighted');
        }, 2000);
      }
      this.sidebarActive = false;
    }
  }
};
</script>

<style scoped>
/* 原有样式 */
.nav-page {
  max-width: 1880px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: background-color 0.5s ease, color 0.5s ease;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  position: relative;
  padding: 0rem 0;
}

.header-content {
  text-align: center;
  position: relative;
  top: -10px;
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.search-container {
  max-width: 600px;
  width: 100%;
}

.search-box {
  position: relative;
  top: -15px;
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-alt);
  border-radius: 50px;
  padding: 0.8rem 1.5rem;
  box-shadow: 0 4px 12px var(--vp-c-shadow);
  transition: all 0.3s ease;
  border: 2px solid var(--vp-c-divider);
}

.search-box:hover {
  box-shadow: 0 6px 16px var(--vp-c-shadow-hover);
  border-color: var(--vp-c-brand);
}

.search-icon {
  width: 25px;
  height: 25px;
  fill: var(--vp-c-text-2);
  margin-right: 10px;
  flex-shrink: 0;
  transition: fill 0.3s ease;
}

.search-input {
  width: 100%;
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  outline: none;
  transition: color 0.3s ease;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.site-container {
  margin-bottom: 2rem;
}

.category-section {
  margin-bottom: 2.5rem;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
}

.category-icon {
  margin-right: 0.8rem;
  font-size: 1.3rem;
}

.site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.8rem;
}

.site-card {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px var(--vp-c-shadow);
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
  border: 1.5px solid var(--vp-c-divider);
  padding: 0.5rem 0.7rem 0.7rem; /* 顶部内边距减少 */
  min-height: 120px;
}

.site-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px var(--vp-c-shadow-hover);
  border-color: var(--vp-c-brand);
}

.site-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
  margin-top: 0;
}

.logo-container {
  background: rgba(0,0,0,0.15);
  border-radius: 10px;
  padding: 6px;
  margin-right: 12px;
  margin-bottom: 2rem;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  align-items: center; /* 确保图标在容器中居中 */
  justify-content: center; /* 确保图标在容器中居中 */
}

.site-logo {
  width: 36px;
  height: 36px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.site-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.site-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  background: var(--vp-c-brand-light);
  color: var(--vp-c-brand-dark);
  transition: all 0.3s ease;
}

.site-name {
  font-size: 1.0rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
  line-height: 1.2;
  position: relative;
  top: -1.35rem; /* 偏移量 */
}

.site-desc {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-bottom: 0.5rem;
  flex-grow: 1;
  transition: color 0.3s ease;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: -1.7rem; /* 偏移量 */
}

.site-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: auto; /* 确保标签在底部 */
}

.site-tag {
  background: var(--vp-c-bg-soft-up);
  color: var(--vp-c-text-2);
  font-size: 0.52rem;
  padding: 0.05rem 0.15rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 1.5px solid var(--vp-c-divider);
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  border: 1px dashed var(--vp-c-divider);
}

.no-results-icon {
  width: 60px;
  height: 60px;
  fill: var(--vp-c-text-3);
  margin-bottom: 1.5rem;
  transition: fill 0.3s ease;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.footer {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  position: relative;
  border-top: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  background: transparent;
  margin-top: 1rem;
}

@media (max-width: 900px) {
  .site-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }
  
  .header {
    padding: 0.5rem 0;
  }
  
  .search-box {
    padding: 0.7rem 1.3rem;
  }
  
  .category-title {
    font-size: 1.4rem;
  }
}

/* 响应式调整 - 修复移动端布局 */
@media (max-width: 768px) {
  /* 调整搜索框 */
  .search-container {
    max-width: 100%;
    padding: 0 1rem;
  }
  
  .search-box {
    top: -10px;
    padding: 0.7rem 1.2rem;
  }
  
  /* 调整分类标题 */
  .category-title {
    margin: 1rem 0;
    font-size: 1.3rem;
  }
  
  /* 修复资源卡片布局 */
  .site-header {
    margin-bottom: 0.5rem;
  }

  .logo-container {
    padding: 4px;
    margin-right: 8px;
  }

  .site-logo {
    width: 26px;
    height: 26px;
  }

  .site-name {
    font-size: 1.05rem;
    top: -1.35rem; /* 偏移量 */
  }
  
  .site-desc {
    font-size: 0.78rem;
    min-height: auto;
    margin-bottom: 0.5rem;
    -webkit-line-clamp: 2;
    margin-top: -1.7rem; /* 偏移量 */
  }
  
  .site-tags {
    gap: 0.3rem;
    margin-top: auto;
  }
  
  /* 调整资源卡片高度 */
  .site-card {
    padding: 0.5rem;
    min-height: 130px;
    padding: 1.2rem;
  }
  
  /* 调整页脚 */
  .footer p {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
  
  /* 调整侧边栏位置 */
  .category-sidebar {
    top: 40%;
  }
}

@media (max-width: 480px) {
  .nav-page {
    padding: 1.5rem 1rem;
  }
  
  /* 进一步缩小标题 */
  .category-title {
    font-size: 1.2rem;
    margin: 0.8rem 0;
  }
  
  /* 调整副标题 */
  .subtitle {
    font-size: 0.95rem;
    padding: 0 1rem;
  }
  
  /* 资源网格单列显示 */
  .site-grid {
    grid-template-columns: 1fr;
  }
  
  /* 调整卡片内部间距 */
  .site-header {
    margin-bottom: 0.5rem;
  }
  
  .site-desc {
    margin-bottom: 0.5rem;
  }
  
  .site-tags {
    margin-top: 0.5rem;
  }
  
  /* 调整无结果提示 */
  .no-results {
    padding: 2rem 1rem;
  }
  
  .no-results h3 {
    font-size: 1.3rem;
  }
  
  /* 调整侧边栏 */
  .category-sidebar {
    top: 35%;
    right: -150px;
  }
  
  .sidebar-content {
    width: 150px;
    padding: 1rem;
  }
  
  .sidebar-trigger {
    left: -30px;
    width: 30px;
    height: 60px;
  }
  
  .trigger-icon {
    width: 18px;
    height: 18px;
  }
  
  /* 页脚文本换行 */
  .footer p {
    white-space: normal;
    line-height: 1.4;
  }
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 添加侧边栏样式 - 确保不影响原有内容 */
.category-sidebar {
  position: fixed;
  right: -220px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  transition: right 0.3s ease;
}

.category-sidebar.active {
  right: 0;
}

.sidebar-trigger {
  position: absolute;
  left: -40px;
  width: 40px;
  height: 80px;
  background: var(--vp-c-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.sidebar-trigger:hover {
  background: var(--vp-c-brand-light);
}

.trigger-icon {
  width: 24px;
  height: 24px;
  fill: white;
}

.sidebar-content {
  width: 220px;
  background: var(--vp-c-bg-soft);
  border-radius: 10px 0 0 10px;
  box-shadow: -4px 0 15px var(--vp-c-shadow);
  padding: 1.2rem;
  border: 2px solid var(--vp-c-divider);
  border-right: none;
  max-height: 70vh;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  padding: 0.7rem 0.8rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft-up);
  border: 2px solid transparent;
}

.category-item:hover {
  background: var(--vp-c-bg-soft-down);
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand-light);
  transform: translateX(-5px);
}

.category-icon {
  margin-right: 0.8rem;
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.highlighted {
  animation: highlight 2s ease;
}

@keyframes highlight {
  0% { background-color: transparent; }
  20% { background-color: rgba(var(--vp-c-brand-rgb), 0.15); }
  100% { background-color: transparent; }
}

@media (max-width: 768px) {
  .category-sidebar {
    right: -180px;
  }
  
  .sidebar-content {
    width: 180px;
  }
  
  .sidebar-trigger {
    left: -35px;
    width: 35px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .category-sidebar {
    right: -160px;
  }
  
  .sidebar-content {
    width: 160px;
  }
  
  .sidebar-trigger {
    left: -30px;
    width: 30px;
    height: 60px;
  }
  
  .trigger-icon {
    width: 20px;
    height: 20px;
  }
}
</style>