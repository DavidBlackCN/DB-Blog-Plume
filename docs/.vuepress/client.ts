import { defineClientConfig } from 'vuepress/client'
import { Layout } from 'vuepress-theme-plume/client'
import { h } from 'vue'
import DockBar from './theme/components/DockBar.vue'
import Introduce from './theme/components/Introduce.vue'
import EmptyDiv from './theme/components/EmptyDiv.vue'
import Hitokoto from './theme/components/Hitokoto.vue'
import ColourPicker from './theme/components/ColourPicker.vue'
import NavPage from './theme/components/NavPage.vue'
import NavPageMinecraft from './theme/components/NavPage-Minecraft.vue'
import AsideOutlineAfter from './theme/components/AsideOutlineAfter.vue'
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
    app.component('DockBar', DockBar)
    app.component('Introduce', Introduce)
    app.component('EmptyDiv', EmptyDiv)
    app.component('Hitokoto', Hitokoto)
    app.component('ColourPicker', ColourPicker)
    app.component('NavPage', NavPage)
    app.component('AsideOutlineAfter', AsideOutlineAfter)
    app.component('NavPageMinecraft', NavPageMinecraft)
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
      'nav-bar-content-after': () => h(ColourPicker),      
    }
  ),
  },
})

