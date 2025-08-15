/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/', icon: 'solar:home-bold' },
  { text: '博客', link: '/blog/', icon: 'meteor-icons:blogger' },
  { text: '归档', link: '/blog/archives/', icon: 'icon-park-outline:tag' },
  {
    text: '笔记',
    icon: 'hugeicons:note-edit',
    items: [{ text: '示例', link: '/notes/demo/foo' }]
  },
  {
    text: '项目',
    icon: 'ant-design:project-outlined',
    items: [
      { text: 'Github项目', link: '/notes/project/1.我的项目/github', icon: 'mdi:github'},
      { text: '其他项目', link: '/notes/project/1.我的项目/other', icon: 'material-symbols:other-admission-outline'}
    ]
  },
  {
    text: '导航',
    icon: 'line-md:compass-loop',
    items: [
      { text: 'Minecraft-Nav', link: '/notes/nav/MinecraftNav', icon: 'mdi:minecraft' },
      { text: 'Demo-Nav', link: '/notes/nav/DemoNav', icon: 'material-symbols:demography'}
    ]
  },
  {
    text: '更多',
    icon: 'mdi:read-more-outline',
    items: [{ text: 'README', link: '/notes/more/gh-readme' }]
  },
])
