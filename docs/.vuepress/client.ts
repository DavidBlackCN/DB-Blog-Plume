import { defineClientConfig } from 'vuepress/client'
import { Layout } from 'vuepress-theme-plume/client'
import { h, render } from 'vue'
import ColorStylePicker from './theme/components/ColorStylePicker.vue'
import ThemeAppearanceSwitch from './theme/components/ThemeAppearanceSwitch.vue'
import AsideOutlineAfter from './theme/components/AsideOutlineAfter.vue'
import RepoCard from './theme/components/RepoCard.vue'
import GitHubCard from './theme/components/GitHubCard.vue'
import GiteeCard from './theme/components/GiteeCard.vue'
import NeteaseMusicCard from './theme/components/NeteaseMusicCard.vue'
import GitHubReadme from './theme/components/GitHubReadme.vue'
import GroupDirectory from './theme/components/GroupDirectory.vue'
import WordCount from './theme/components/WordCount.vue'
import LoadingBars from './theme/components/LoadingBars.vue'
import ReadingBackground from './theme/components/ReadingBackground.vue'
import './theme/styles/custom.css'
import './theme/styles/index.css'
import './theme/styles/introduce.css'

/**
 * Waline 并未暴露加载插槽；保留其受控 SVG 节点，
 * 在相邻位置挂载统一的 LoadingBars，避免直接改写第三方组件 DOM。
 */
function setupWalineLoadingBars() {
  if (typeof window === 'undefined') return

  const start = () => {
    const hosts = new Map<HTMLElement, HTMLElement>()

    const mount = (container: HTMLElement, size: number, label: string) => {
      if (hosts.has(container)) return

      const host = document.createElement('span')
      host.className = 'waline-loading-bars'
      container.append(host)
      render(h(LoadingBars, { size, duration: 960, amplitude: 3, label }), host)
      hosts.set(container, host)
    }

    const scan = (root: ParentNode) => {
      const mountCommentLoader = (loader: HTMLElement) => {
        mount(loader, 28, '正在加载评论')
      }
      const mountReactionLoader = (reaction: HTMLElement) => {
        if (reaction.querySelector('.wl-reaction-loading')) {
          mount(reaction, 20, '正在提交反应')
        }
      }

      if (root instanceof HTMLElement) {
        if (root.matches('.wl-loading')) mountCommentLoader(root)
        if (root.matches('.wl-reaction-img')) mountReactionLoader(root)
      }

      root.querySelectorAll<HTMLElement>('.wl-loading').forEach(mountCommentLoader)
      root.querySelectorAll<HTMLElement>('.wl-reaction-img').forEach(mountReactionLoader)
    }

    const cleanup = () => {
      hosts.forEach((host, container) => {
        const reactionFinished = container.classList.contains('wl-reaction-img')
          && !container.querySelector('.wl-reaction-loading')

        if (!container.isConnected || reactionFinished) {
          render(null, host)
          host.remove()
          hosts.delete(container)
        }
      })
    }

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) scan(node)
        })
      })
      cleanup()
    })

    scan(document)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('pagehide', () => {
      observer.disconnect()
      hosts.forEach((host) => render(null, host))
      hosts.clear()
    }, { once: true })
  }

  if (document.body) start()
  else document.addEventListener('DOMContentLoaded', start, { once: true })
}

// import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
// import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
// import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'

// import CustomComponent from './theme/components/Custom.vue'

// import './theme/styles/custom.css'

export default defineClientConfig({

  enhance({ app }) {
    app.component('ColorStylePicker', ColorStylePicker)
    app.component('ThemeAppearanceSwitch', ThemeAppearanceSwitch)
    app.component('AsideOutlineAfter', AsideOutlineAfter)
    app.component('RepoCard', RepoCard)
    app.component('GitHubCard', GitHubCard)
    app.component('GiteeCard', GiteeCard)
    app.component('NeteaseMusicCard', NeteaseMusicCard)
    app.component('GitHubReadme', GitHubReadme)
    app.component('GroupDirectory', GroupDirectory)
    app.component('WordCount', WordCount)
    app.component('LoadingBars', LoadingBars)
    setupWalineLoadingBars()
    // built-in components
    // app.component('RepoCard', RepoCard)
    // app.component('NpmBadge', NpmBadge)
    // app.component('NpmBadgeGroup', NpmBadgeGroup)
    // app.component('Swiper', Swiper) // you should install `swiper`

    // your custom components
    // app.component('CustomComponent', CustomComponent)
  },

    layouts: {      
    Layout: () => h(Layout, null, {
      'layout-top': () => h(ReadingBackground),
      //https://github.com/physnya/blog/blob/main/docs/.vuepress/components/AsideOutlineAfter.vue
      'aside-outline-after': () => h(AsideOutlineAfter),
      'nav-bar-content-after': () => h('div', { class: 'navbar-custom-controls' }, [
        h(ThemeAppearanceSwitch),
        h(ColorStylePicker),
      ]),
    }
  ),
  },
})
