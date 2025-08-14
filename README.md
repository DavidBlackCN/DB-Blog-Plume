## DB-Blog-Plume

本站基于 [vuepress](https://vuepress.vuejs.org/) & [vuepress-theme-plume](https://github.com/pengzhanbo/vuepress-theme-plume) 构建.

主题作者：https://github.com/pengzhanbo


#### 访问
- [默认站点-部署于私人服务器](https://davidblackcn.cc)
- [镜像站点-部署于腾讯云EdgeOne](https://mirror.davidblackcn.cc)

## 参考

博客主页为自定义页面，若你也在使用这个博客主题并想参考本博客主页，可查看以下说明：

### 配置

1. 自定义页面的[vue组件路径](https://github.com/DavidBlackCN/DB-Blog-Plume/tree/main/docs/.vuepress/theme/components)：docs/.vuepress/theme/components
2. 自定义页面的[css样式文件](https://github.com/DavidBlackCN/DB-Blog-Plume/tree/main/docs/.vuepress/theme/styles)：docs/.vuepress/theme/styles/introduce.css
3. 在 `docs/.vuepress/client.ts` 中导入相应的组件和样式，示例：
```
import './theme/styles/introduce.css'
import Introduce from './theme/components/Introduce.vue'

  export default defineClientConfig({
    enhance({ app }) {
    app.component('Introduce', Introduce) 
  },
})
```

### 组件说明

1. components中 `Introduce.vue` 为主页核心卡片组件, `AboutMeCharacter.vue`, `AboutMeFriendLink.vue`, `AboutMeName.vue`, `AboutMeProject.vue`, `AboutMeSkill.vue`, `AboutMeText.vue` 以及 `Introduce.vue` 均修改自[该博客](https://github.com/zhenghaoyang24/hoey-blog-plume)，以上组件的使用说明可查看原仓库的README，此处主要进行细微修改并修改手机浏览兼容性.
2. components中 `AsideOutlineAfter.vue` 为右边侧边栏目录下方显示的额外跳转链接，可按需求修改或新增更多链接.
3. components中 `ColourPicker.vue` 为导航栏的颜色选择器，可修改主题颜色，来自[该博客](https://github.com/physnya/blog).
4. components中 `DockBar.vue` 为主页的Dock栏，可在其中对应位置修改Dock内容，icon请使用[iconify](https://icon-sets.iconify.design/)图标，并于下方 `.dock-container` 字段修改Dock栏位置.
5. components中 `Hitokoto.vue` 为主页上方一言，开箱即用.
6. components中 `NavPage.vue` 为导航页面专用组件，在此处修改引入的外部数据文件：
```
<script>
import { categories, sites } from '../data/NavData.ts';
```
并在 `docs/.vuepress/theme/data/NavData.ts` 中修改导航内容.

### 主页

主页布局请参考 [docs/README.md](https://github.com/DavidBlackCN/DB-Blog-Plume/blob/main/docs/README.md)
```
---
pageLayout: home //定义首页
externalLinkIcon: false
photoSwipe: false
config:
  -
    type: 'Hitokoto' //注册的vue组件可直接在type中使用
  -
    type: image-text //主题自带布局
    description: //这是第一行描述
    image: //此处输入头像路径
    list:
      -
        title: //此处输入小标题
        description: //此处输入描述 
      -
        title: //此处输入小标题
        description: //此处输入描述 
  -
    type: custom //使用custom布局以自定义markdown内容
---

<Introduce/> //注册的vue组件也可使用此方式加载

<DockBar/>
```
