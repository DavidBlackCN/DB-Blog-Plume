## DB-Blog-Plume

本站基于 [vuepress](https://vuepress.vuejs.org/) & [vuepress-theme-plume](https://github.com/pengzhanbo/vuepress-theme-plume) 构建.

主题作者：[https://github.com/pengzhanbo](https://github.com/pengzhanbo)


### 访问
- [默认站点-部署于私人服务器](https://www.davidblackcn.cc)
- [镜像站点-部署于腾讯云EdgeOne](https://mirror.davidblackcn.cc)

## 参考

博客主页为自定义页面，若你也在使用这个博客主题并想参考本博客主页，可查看以下说明：

### 配置

1. 自定义页面的[vue组件路径](https://github.com/DavidBlackCN/DB-Blog-Plume/tree/main/docs/.vuepress/theme/components)：docs/.vuepress/theme/components
2. 自定义页面的[css样式文件](https://github.com/DavidBlackCN/DB-Blog-Plume/tree/main/docs/.vuepress/theme/styles)：docs/.vuepress/theme/styles
3. 全局组件：在 `docs/.vuepress/client.ts` 中导入相应的组件和样式，示例如下
```
import './theme/styles/introduce.css'
import Introduce from './theme/components/ColourPicker.vue'

  export default defineClientConfig({
    enhance({ app }) {
    app.component('ColourPicker', ColourPicker) 
  },
})
```

### 组件说明

- `DockBar.vue` -> Dock栏
- `Hitokoto.vue` -> 一言
- `BlogHero.vue` -> 主页核心组件
- `Introduce.vue` -> 介绍页卡片
- `NavPage.vue` -> 导航页面
- `ColourPicker.vue` -> 导航栏颜色选择器
  

1. `Introduce.vue` 为[介绍页](/more/index)卡片组件, 以下组件的使用说明可查看原仓库的README，此处主要进行细微修改并修改手机浏览兼容性.
> `AboutMeCharacter.vue`, `AboutMeFriendLink.vue`, `AboutMeName.vue`, `AboutMeAbilities.vue`, `AboutMeText.vue` 以及 `Introduce.vue` 均修改自[该博客](https://github.com/zhenghaoyang24/hoey-blog-plume)
1. `AsideOutlineAfter.vue` 为右边侧边栏目录下方显示的额外跳转链接，可按需求修改或新增更多链接.
2. `ColourPicker.vue` 为导航栏的颜色选择器，可修改主题颜色，修改自[该博客](https://github.com/physnya/blog).
3. `NavPage.vue` 为导航页面专用组件，在此处修改引入的外部数据文件：
```
<script>
import { categories, sites } from '../data/NavData.ts';
```
并在 `docs/.vuepress/theme/data/NavData.ts` 中修改导航内容.

### 主页

- 主页布局请看 [BlogHero.vue](https://github.com/DavidBlackCN/DB-Blog-Plume/blob/main/docs/.vuepress/theme/components/BlogHero.vue)
- 参考[该博客](https://blog.jursin.top/)