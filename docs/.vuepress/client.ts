import { defineClientConfig } from 'vuepress/client'
import { Layout } from 'vuepress-theme-plume/client'
import { h } from 'vue'
import ColorStylePicker from './theme/components/ColorStylePicker.vue'
import ThemeAppearanceSwitch from './theme/components/ThemeAppearanceSwitch.vue'
import AsideOutlineAfter from './theme/components/AsideOutlineAfter.vue'
import RepoCard from './theme/components/RepoCard.vue'
import GitHubCard from './theme/components/GitHubCard.vue'
import GiteeCard from './theme/components/GiteeCard.vue'
import NeteaseMusicCard from './theme/components/NeteaseMusicCard.vue'
import WordCount from './theme/components/WordCount.vue'
import './theme/styles/custom.css'
import './theme/styles/index.css'
import './theme/styles/introduce.css'

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
    app.component('WordCount', WordCount)
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
