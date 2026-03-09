#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const matter = require('gray-matter');

const config = {
  contentDir: path.join(__dirname, '../docs'),
  outputFile: path.join(__dirname, '../docs/.vuepress/public/wordcount.json'),
  excludePatterns: [
    '**/node_modules/**',
    '**/.vuepress/**'
  ]
};

/**
 * 规范化路由路径
 */
function normalizeRoutePath(input) {
  if (!input) return '/';

  let route = String(input).trim();

  route = route.split('#')[0].split('?')[0];
  route = route.replace(/\\/g, '/');
  route = route.replace(/\.html$/i, '');

  if (!route.startsWith('/')) route = `/${route}`;
  route = route.replace(/\/+/g, '/');
  route = route.replace(/\/index\/?$/i, '/');

  if (route !== '/' && !route.endsWith('/')) {
    route += '/';
  }

  return route;
}

/**
 * 从 frontmatter / 文件路径提取 VuePress 路由
 */
function extractRoutePath(filePath, frontmatter = {}) {
  if (frontmatter.permalink) {
    return normalizeRoutePath(frontmatter.permalink);
  }

  const relativePath = path.relative(config.contentDir, filePath).replace(/\\/g, '/');
  const noExt = relativePath.replace(/\.md$/i, '');

  // README.md / index.md 视为目录首页
  if (/(^|\/)(README|index)$/i.test(noExt)) {
    const dir = noExt.replace(/(^|\/)(README|index)$/i, '');
    return normalizeRoutePath(`/${dir}`);
  }

  return normalizeRoutePath(`/${noExt}`);
}

/**
 * 清洗 markdown，只保留用于字数统计的正文文本
 */
function cleanMarkdownContent(markdown) {
  return markdown
    // 代码块
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')

    // 行内代码
    .replace(/`[^`\n]+`/g, ' ')

    // 数学公式
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/\\\[[\s\S]*?\\\]/g, ' ')
    .replace(/\\\([\s\S]*?\\\)/g, ' ')

    // HTML 注释与标签
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')

    // VuePress 容器
    .replace(/:::([\s\S]*?):::/g, ' ')

    // 图片
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')

    // 链接：保留文字
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    // blockquote
    .replace(/^>\s?/gm, ' ')

    // 标题符号
    .replace(/^#{1,6}\s+/gm, '')

    // 表格分隔符
    .replace(/\|/g, ' ')

    // markdown 装饰符
    .replace(/[*_~]+/g, ' ')

    // 合并空白
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 字数统计
 * - 中文：按字
 * - 英文/数字：按词
 */
function countWords(markdownContent) {
  const text = cleanMarkdownContent(markdownContent);

  const chineseChars = text.match(/\p{sc=Han}/gu) || [];
  const latinWords = text.match(/[A-Za-z0-9]+(?:[._'-][A-Za-z0-9]+)*/g) || [];

  return chineseChars.length + latinWords.length;
}

/**
 * 获取某页面对应的所有祖先分组
 * 例如：
 * /guide/install/start/ =>
 * ["/", "/guide/", "/guide/install/", "/guide/install/start/"]
 */
function getAncestorGroups(routePath) {
  const normalized = normalizeRoutePath(routePath);
  if (normalized === '/') return ['/'];

  const segments = normalized.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  const result = ['/'];

  let current = '';
  for (const segment of segments) {
    current += `/${segment}`;
    result.push(`${current}/`);
  }

  return result;
}

function buildWordCount() {
  const files = globSync(`${config.contentDir}/**/*.md`, {
    ignore: config.excludePatterns,
    nodir: true
  });

  const groups = { '/': 0 };
  let fileCount = 0;

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf-8');
      const { data: frontmatter, content } = matter(raw);

      // 可选：在 frontmatter 中设置 wordCount: false 跳过统计
      if (frontmatter.wordCount === false) {
        continue;
      }

      const routePath = extractRoutePath(file, frontmatter);
      const words = countWords(content);
      const ancestors = getAncestorGroups(routePath);

      for (const groupPath of ancestors) {
        groups[groupPath] = (groups[groupPath] || 0) + words;
      }

      fileCount++;
    } catch (error) {
      console.error(`处理文件失败: ${file}`);
      console.error(error);
    }
  }

  return {
    total: groups['/'] || 0,
    fileCount,
    lastUpdated: new Date().toISOString(),
    groups
  };
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

try {
  const result = buildWordCount();

  ensureDir(config.outputFile);
  fs.writeFileSync(config.outputFile, JSON.stringify(result, null, 2), 'utf-8');

  console.log('\n✅ 字数统计完成');
  console.log(`总字数: ${result.total.toLocaleString()} 字`);
  console.log(`文件数: ${result.fileCount}`);
  console.log(`输出文件: ${config.outputFile}\n`);
} catch (error) {
  console.error('❌ 字数统计失败');
  console.error(error);
  process.exit(1);
}