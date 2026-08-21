/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/', icon: 'solar:home-bold' },
  { text: '博客', link: '/blog/', icon: 'meteor-icons:blogger' },
  {
    text: '笔记',
    icon: 'hugeicons:note-edit',
    items: [
      { text: 'Demo示例', link: '/notes/1.Demo/README.md', icon: 'material-symbols:note-add-outline' },
      { text: '嵌入式开发', link: '/notes/2.嵌入式开发/README.md', icon: 'mdi:chip' },
    
    
    ]
  },
  {
    text: '项目',
    icon: 'ant-design:project-outlined',
    items: [
      { text: 'Github项目', link: '/ghProject/README.md', icon: 'mdi:github'},
      { text: 'Minecraft项目', link: '/mcProject/README.md', icon: 'material-symbols:other-admission-outline'}
    ]
  },
  {
    text: '导航',
    icon: 'line-md:compass-loop',
    items: [
      { text: 'Minecraft-Nav', link: '/nav/MinecraftNav', icon: 'mdi:minecraft' },
      { text: 'Demo-Nav', link: '/nav/DemoNav', icon: 'material-symbols:demography'}
    ]
  },
  {
    text: '更多',
    icon: 'mdi:read-more-outline',
    items: [
      { text: 'README', link: '/more/gh-readme', icon: 'gg:readme' },
      { text: '关于我', link: '/more/index', icon: 'mdi:account-circle' },
      { text: '主题预览', link: '/more/主题预览', icon: 'mdi:colour-lens' },
      { text: '随机跳转', link: '/more/随机跳转', icon: 'mdi:shuffle' }
    ]
  },
])
