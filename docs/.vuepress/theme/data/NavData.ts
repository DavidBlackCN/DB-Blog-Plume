// data.ts - 导航数据存储文件
export interface Site {
  id: string;
  name: string;
  url: string;
  desc: string;
  logo?: string;
  category: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'frontend', name: '前端开发', icon: '💻' },
  { id: 'backend', name: '后端开发', icon: '🖥️' },
  { id: 'design', name: '设计资源', icon: '🎨' },
  { id: 'tool', name: '效率工具', icon: '🔧' },
  { id: 'learning', name: '学习资源', icon: '📚' },
  { id: 'community', name: '技术社区', icon: '👥' },
];

export const tags = [
  'JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js',
  'CSS', 'UI/UX', '数据库', 'API', 'Git', '安全', 
  '性能优化', '算法', '云服务', '移动开发', '测试'
];

export const sites: Site[] = [
  {
    id: 'vuejs',
    name: 'Vue.js',
    url: 'https://vuejs.org',
    desc: '渐进式JavaScript框架',
    logo: 'https://vuejs.org/logo.svg',
    category: 'frontend',
    tags: ['JavaScript', 'Vue', '前端框架']
  },
    {
    id: 'vuejs',
    name: 'Vue.js',
    url: 'https://vuejs.org',
    desc: '渐进式JavaScript框架',
    logo: 'https://vuejs.org/logo.svg',
    category: 'frontend',
    tags: ['JavaScript', 'Vue', '前端框架']
  },
    {
    id: 'vuejs',
    name: 'Vue.js',
    url: 'https://vuejs.org',
    desc: '渐进式JavaScript框架',
    logo: 'https://vuejs.org/logo.svg',
    category: 'frontend',
    tags: ['JavaScript', 'Vue', '前端框架']
  },
  {
    id: 'vuejs',
    name: 'Vue.js',
    url: 'https://vuejs.org',
    desc: '渐进式JavaScript框架',
    logo: 'https://vuejs.org/logo.svg',
    category: 'frontend',
    tags: ['JavaScript', 'Vue', '前端框架']
  },
  {
    id: 'react',
    name: 'React',
    url: 'https://reactjs.org',
    desc: '用于构建用户界面的JavaScript库',
    logo: 'https://reactjs.org/logo-og.png',
    category: 'frontend',
    tags: ['JavaScript', 'React', '前端框架']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    url: 'https://nodejs.org',
    desc: '基于Chrome V8引擎的JavaScript运行环境',
    logo: 'https://nodejs.org/static/images/logo.svg',
    category: 'backend',
    tags: ['JavaScript', 'Node.js', '后端开发']
  },
  {
    id: 'mdn',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    desc: 'Web开发技术文档',
    category: 'learning',
    tags: ['文档', '学习资源', '参考']
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    desc: '代码托管平台',
    logo: 'https://github.githubassets.com/favicons/favicon.svg',
    category: 'tool',
    tags: ['Git', '代码托管', '协作']
  },
  {
    id: 'figma',
    name: 'Figma',
    url: 'https://figma.com',
    desc: '协作式UI设计工具',
    category: 'design',
    tags: ['设计', 'UI/UX', '工具']
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    desc: '程序员问答社区',
    category: 'community',
    tags: ['问答', '社区', '问题解决']
  },
  {
    id: 'css-tricks',
    name: 'CSS-Tricks',
    url: 'https://css-tricks.com',
    desc: '前端开发技巧和教程',
    category: 'frontend',
    tags: ['CSS', '前端', '教程']
  },
  {
    id: 'devto',
    name: 'DEV Community',
    url: 'https://dev.to',
    desc: '开发者分享平台',
    category: 'community',
    tags: ['社区', '博客', '分享']
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    url: 'https://leetcode.com',
    desc: '编程面试准备平台',
    category: 'learning',
    tags: ['算法', '面试', '练习']
  },
  {
    id: 'npm',
    name: 'npm',
    url: 'https://www.npmjs.com',
    desc: 'JavaScript包管理器',
    category: 'tool',
    tags: ['包管理', 'JavaScript', '工具']
  },
  {
    id: 'webpack',
    name: 'Webpack',
    url: 'https://webpack.js.org',
    desc: 'JavaScript模块打包工具',
    category: 'tool',
    tags: ['构建工具', '打包', 'JavaScript']
  }
];