/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改不会重启 vuepress 服务，而是通过热更新的方式生效
 * 但同时部分配置项不支持热更新，请查看文档说明
 * 对于不支持热更新的配置项，请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会覆盖 `.vuepress/config.ts` 文件中的配置
 */

import { defineThemeConfig } from 'vuepress-theme-plume'
import  navbar  from './navbar'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: './avatar/davidblack-round.png',

  appearance: true,  // 配置 深色模式

  //social: [
  //  { icon: 'github', link: '/' },
  //],
  // navbarSocialInclude: ['github'], // 允许显示在导航栏的 social 社交链接
  // aside: true, // 页内侧边栏， 默认显示在右侧
  // outline: [2, 3], // 页内大纲， 默认显示 h2, h3

  /**
   * 文章版权信息
   * @see https://theme-plume.vuejs.press/guide/features/copyright/
   */
  /**copyright: true,

  // prevPage: true,   // 是否启用上一页链接
  // nextPage: true,   // 是否启用下一页链接
  // createTime: true, // 是否显示文章创建时间

  /* 站点页脚 */
  footer: {
    message: 'Copyright © 2025 - present by David_Black_ <br> 🥼Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
    copyright: "<a href='https://beian.miit.gov.cn/'>粤ICP备2025435487号-2</a>",
  },

  /**
   * @see https://theme-plume.vuejs.press/config/basic/#profile
   */
    profile: {
      name: 'David_Black_',
      description: '有些事你不要太当真。——《售梦者》',
      avatar: './avatar/davidblack-round.png',
      location: 'HuiZhou & ShenZhen',
      //organization: 'MDS Union',
      circle: false,
      layout: 'right'
    },

    // 社交链接
    social: [
      { icon: 'github', link: 'https://github.com/DavidBlackCN/DB-Blog-Plume'},
      { icon: {svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><defs><mask id="SVGAM6pX7oM"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#fff" stroke="#fff" d="M18.284 43.171a20 20 0 0 1-8.696-5.304a6 6 0 0 0-5.182-9.838A20 20 0 0 1 4 24c0-2.09.32-4.106.916-6H5a6 6 0 0 0 5.385-8.65a20 20 0 0 1 8.267-4.627A6 6 0 0 0 24 8a6 6 0 0 0 5.348-3.277a20 20 0 0 1 8.267 4.627A6 6 0 0 0 43.084 18A20 20 0 0 1 44 24c0 1.38-.14 2.728-.406 4.03a6 6 0 0 0-5.182 9.838a20 20 0 0 1-8.696 5.303a6.003 6.003 0 0 0-11.432 0Z"/><path fill="#000" stroke="#000" d="M24 31a7 7 0 1 0 0-14a7 7 0 0 0 0 14Z"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGAM6pX7oM)"/></svg>'}, link: 'https://theme-plume.vuejs.press/'},
      { icon: {svg: '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="currentColor" d="M475 64H37C16.58 64 0 81.38 0 102.77v306.42C0 430.59 16.58 448 37 448h438c20.38 0 37-17.41 37-38.81V102.77C512 81.38 495.42 64 475 64M288 368h-64V256l-48 64l-48-64v112H64V144h64l48 80l48-80h64Zm96 0l-80-112h48.05L352 144h64v112h48Z"/></svg>'}, link: 'https://theme-plume.vuejs.press/guide/markdown/basic/'},
      { icon: {svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2.857 19.429V9.642q.35-.089.67-.295l1.616-1.045v9.984h4.571v2.285H4c-.63 0-1.143-.512-1.143-1.142m7.429-8.572a1.715 1.715 0 1 1 3.43.001a1.715 1.715 0 0 1-3.43 0m-5.143-8V1.143a1.143 1.143 0 0 1 2.286 0v.235zm9.143 15.429h4.571V8.302l1.616 1.045q.32.206.67.295v9.787c0 .63-.512 1.143-1.143 1.143h-5.714Zm-.004-17.028l8.053 5.211a1.144 1.144 0 0 1-1.242 1.919l-8.041-5.203l.19-.123a2.28 2.28 0 0 0 1.04-1.804M11.38.183a1.144 1.144 0 0 1 1.242 1.92L2.907 8.387a1.144 1.144 0 0 1-1.242-1.919Zm2.6 22.103H22c.473 0 .857.384.857.857A.86.86 0 0 1 22 24H2a.86.86 0 0 1-.857-.857c0-.473.384-.857.857-.857h8.02a2.286 2.286 0 0 0 3.96 0m-.836-8.81v7.667a1.143 1.143 0 0 1-2.286 0v-7.667a2.85 2.85 0 0 0 1.143.238c.406 0 .793-.085 1.143-.238"/></svg>'}, link: 'https://icon-sets.iconify.design/'},
      { icon: {svg: '<svg xmlns="<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M16 8a8 8 0 1 0-2.697 5.99c-.972-.665-1.632-1.356-1.99-2.062c-.388-.766-.419-1.561-.075-2.23c.496-.97 1.73-1.466 2.762-1.05c.65-.262 1.38-.162 1.957.19Q16 8.425 16 8M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m1.512 3.647c-.347.08-.737.198-1.107.319a.5.5 0 1 1-.31-.95c.38-.125.802-.254 1.192-.343c.37-.086.78-.153 1.103-.108c.16.022.394.085.561.286c.188.226.187.497.131.705a1.9 1.9 0 0 1-.31.593q-.115.16-.275.343q.16.186.276.347c.142.197.256.397.31.595c.055.208.056.479-.132.706c-.168.2-.404.262-.563.284c-.323.043-.733-.027-1.102-.113a15 15 0 0 1-1.191-.345a.5.5 0 1 1 .31-.95c.371.12.761.24 1.109.321q.264.062.446.084a6 6 0 0 0-.502-.584a.5.5 0 0 1 .002-.695a5.5 5.5 0 0 0 .5-.577a5 5 0 0 0-.448.082m.766-.086l-.006-.002zm.002 1.867l-.005.001l.006-.002Zm.157-4.685a.5.5 0 0 1-.874-.486A1.93 1.93 0 0 1 10.25 5.75c.73 0 1.356.412 1.687 1.007a.5.5 0 1 1-.874.486a.93.93 0 0 0-.813-.493a.93.93 0 0 0-.813.493M14 9.828c1.11-1.14 3.884.856 0 3.422c-3.884-2.566-1.11-4.562 0-3.421Z"/></svg>'}, link: 'https://getemoji.com/'},
      { icon: {svg: '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="currentColor" d="m51.34 23.63l-6.68 16.72l80.04 32.01l6.6-16.72zm409.36.01l-80 32l6.6 16.72l80-32zM256 25c-29 0-50 14.08-64.7 34.29C176.6 79.51 169 106 169 128c0 13 7 27.8 14.5 39s14.9 18.6 14.9 18.6l1.5 1.5l9.3 27.9H228L194.7 98.07L256 118.5l61.3-20.43L284 215h18.8l9.3-27.9l1.5-1.5s7.4-7.4 14.9-18.6s14.5-26 14.5-39c0-22-7.6-48.49-22.3-68.71C306 39.08 285 25 256 25m128 94v18h96v-18zm-352 .1v18h96v-18zm189.3 6.8l25.5 89.1h18.4l25.5-89.1l-34.7 11.6zm166 57.7l-6.6 16.8l80 32l6.6-16.8zm-262.6.1l-80.04 32l6.68 16.8l79.96-32zM217 233v14h78v-14zm0 32v14h78v-14zm-46.9 2.6c-27.1.5-52.6 5-66.9 11.1L29.8 484.1c71.1-14.1 143.9-26 217.2-.9V297h-48v-28.3c-7.9-.7-16-1.1-23.9-1.1zm166.8 0c-7.9 0-16 .4-23.9 1.1V297h-48v186.2c73.3-25.1 146.1-13.2 217.2.9l-73.4-205.4c-14.3-6.1-39.8-10.6-66.9-11.1z"/></svg>'}, link: 'https://inspira-ui.com/components'},
    ],

  navbar,

  /**
   * 公告板
   * @see https://theme-plume.vuejs.press/guide/features/bulletin/
   */
  // bulletin: {
  //   layout: 'top-right',
  //   contentType: 'markdown',
  //   title: '公告板标题',
  //   content: '公告板内容',
  // },

  /* 过渡动画 @see https://theme-plume.vuejs.press/config/basic/#transition */
  transition: {
    page: true,        // 启用 页面间跳转过渡动画
    postList: true,    // 启用 博客文章列表过渡动画
    appearance: 'fade',  // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  },

})
