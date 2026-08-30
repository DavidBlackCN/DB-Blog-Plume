export interface AboutSocialLink {
  label: string
  href: string
  logo: string
  brand: 'github' | 'bilibili' | 'mail'
  featured?: boolean
  external?: boolean
}

export interface AboutGuideLink {
  eyebrow: string
  title: string
  description: string
  href: string
  icon: string
  external?: boolean
}

export interface AboutTechItem {
  name: string
  icon: string
  iconScale?: number
}

export const aboutSocialLinks: AboutSocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/DavidBlackCN',
    logo: '/logos/github-light.svg',
    brand: 'github',
    featured: true,
    external: true,
  },
  {
    label: 'BiliBili',
    href: 'https://space.bilibili.com/453841968',
    logo: '/logos/bilibili.svg',
    brand: 'bilibili',
    featured: true,
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:davidblackcn@outlook.com',
    logo: '/logos/email.svg',
    brand: 'mail',
  },
]

export const aboutGuideLinks: AboutGuideLink[] = [
  {
    eyebrow: 'READING',
    title: '博客文章',
    description: '技术、生活与那些偶尔冒出的想法。',
    href: '/blog/',
    icon: 'ph:article',
  },
  {
    eyebrow: 'NAVIGATION',
    title: '实用导航',
    description: '收藏常用工具、站点与灵感来源。',
    href: '/nav/demo-nav/',
    icon: 'ph:compass',
  },
  {
    eyebrow: 'DISCOVERY',
    title: '随机相遇',
    description: '从站内文章里，抽取一段意外相遇。',
    href: '/more/random/',
    icon: 'ph:shuffle',
  },
  {
    eyebrow: 'MIRROR',
    title: '镜像站点',
    description: '访问缓慢时，可切换至 EdgeOne 镜像。',
    href: 'https://mirror.davidblackcn.cc',
    icon: 'ph:globe-hemisphere-east',
    external: true,
  },
]

export const techRows: AboutTechItem[][] = [
  [
    { name: 'Vue 3', icon: 'logos:vue', iconScale: 1.08 },
    { name: 'TypeScript', icon: 'logos:typescript-icon' },
    { name: 'Vite', icon: 'logos:vitejs' },
    { name: 'Node.js', icon: 'logos:nodejs-icon' },
    { name: 'Python', icon: 'logos:python' },
    { name: 'Git', icon: 'logos:git-icon' },
    { name: 'Spring', icon: 'devicon:spring' },
  ],
  [
    { name: 'Docker', icon: 'logos:docker-icon', iconScale: 1.22 },
    { name: 'Linux', icon: 'logos:linux-tux' },
    { name: 'C++', icon: 'logos:c-plusplus' },
    { name: 'Java', icon: 'logos:java' },
    { name: 'MySQL', icon: 'logos:mysql' },
    { name: 'VS Code', icon: 'logos:visual-studio-code' },
    { name: 'WebStorm', icon: 'devicon:webstorm' },
  ],
]
