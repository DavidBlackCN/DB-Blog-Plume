#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(
  __dirname,
  '..'
);

const DOCS_DIR = path.join(
  ROOT_DIR,
  'docs'
);

const ASSETS_DIR = path.join(
  DOCS_DIR,
  '.vuepress',
  'public',
  'assets'
);

const config = {
  // 超过 1 MB 提醒
  largeFileSize:
    1024 * 1024,

  // JPG / PNG 超过 300 KB，
  // 提醒考虑 WebP
  legacyImageWarningSize:
    300 * 1024,

  imageExtensions: new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.avif',
    '.gif',
    '.svg'
  ]),

  textExtensions: new Set([
    '.md',
    '.vue',
    '.ts',
    '.js',
    '.cjs',
    '.mjs',
    '.json',
    '.css',
    '.scss',
    '.sass',
    '.less',
    '.styl',
    '.html',
    '.yaml',
    '.yml'
  ]),

  ignoredDirs: new Set([
    'node_modules',
    '.git',
    'dist',
    '.cache',
    '.temp'
  ])
};

const STRICT =
  process.argv.includes('--strict');

function normalizeSlash(value) {
  return value.replace(/\\/g, '/');
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(2)} MB`;
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function collectImages(dirPath) {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    return files;
  }

  for (const entry of fs.readdirSync(
    dirPath,
    {
      withFileTypes: true
    }
  )) {
    const fullPath = path.join(
      dirPath,
      entry.name
    );

    if (entry.isDirectory()) {
      if (
        !config.ignoredDirs.has(
          entry.name
        )
      ) {
        files.push(
          ...collectImages(fullPath)
        );
      }

      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path
      .extname(entry.name)
      .toLowerCase();

    if (
      config.imageExtensions.has(
        ext
      )
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectTextFiles(dirPath) {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    return files;
  }

  for (const entry of fs.readdirSync(
    dirPath,
    {
      withFileTypes: true
    }
  )) {
    const fullPath = path.join(
      dirPath,
      entry.name
    );

    if (entry.isDirectory()) {
      if (
        config.ignoredDirs.has(
          entry.name
        )
      ) {
        continue;
      }

      // 不读取 assets 二进制目录
      if (
        path.resolve(fullPath) ===
        path.resolve(ASSETS_DIR)
      ) {
        continue;
      }

      files.push(
        ...collectTextFiles(fullPath)
      );

      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path
      .extname(entry.name)
      .toLowerCase();

    if (
      config.textExtensions.has(ext)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function getAssetUrl(filePath) {
  const relative = getAssetRelative(filePath);

  return `/assets/${relative}`;
}

function getAssetRelative(filePath) {
  return normalizeSlash(
    path.relative(
      ASSETS_DIR,
      filePath
    )
  );
}

function collectFiles(dirPath) {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    return files;
  }

  for (const entry of fs.readdirSync(
    dirPath,
    { withFileTypes: true }
  )) {
    const fullPath = path.join(
      dirPath,
      entry.name
    );

    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function isValidBlogAssetPath(relativePath) {
  return /^blog\/\d{4}\/[a-z0-9]+(?:-[a-z0-9]+)*\/[^/]+$/
    .test(relativePath);
}

function isUnsemanticFileStem(stem) {
  /*
   * 仅拦截明显的旧编号形式，例如 1、9-1、16-10。
   * 不把 2026-04-18 这类日期或正常语义化文件名误判为问题。
   */
  return /^\d+$/.test(stem) ||
    /^\d{1,2}-\d{1,2}$/.test(stem);
}

function stripMarkdownCode(content) {
  return content
    .replace(
      /(^|\r?\n)[ \t]{0,3}(`{3,}|~{3,})[^\r\n]*(?:\r?\n)[\s\S]*?(?:\r?\n)[ \t]{0,3}\2(?=\r?\n|$)/g,
      '$1'
    )
    .replace(/`[^`\r\n]*`/g, '');
}

function extractAssetReferences(
  filePath
) {
  let content = fs.readFileSync(
    filePath,
    'utf8'
  );

  // 文档中的命令和路径示例不应作为真实资源引用。
  if (path.extname(filePath).toLowerCase() === '.md') {
    content = stripMarkdownCode(content);
  }

  /*
   * 支持：
   *
   * ![](/assets/foo.webp)
   * src="/assets/foo.webp"
   * url('/assets/foo.webp')
   * cover: /assets/foo.webp
   *
   * query / hash 会自动忽略
   * Markdown fenced / inline code 会忽略，避免示例造成 Missing。
   */
  const regexp =
    /(?:^|[\s"'`(=:\[])(\/assets\/[^"'`\s)<>\]}]+?\.(?:jpe?g|png|webp|avif|gif|svg)(?:[?#][^"'`\s)<>\]}]*)?)/gim;

  const references = [];

  for (
    const match of content.matchAll(
      regexp
    )
  ) {
    let url = match[1];

    url = url
      .split('?')[0]
      .split('#')[0];

    url =
      safeDecodeURIComponent(url);

    references.push(url);
  }

  return references;
}

function calculateHash(filePath) {
  const hash =
    crypto.createHash('sha256');

  hash.update(
    fs.readFileSync(filePath)
  );

  return hash.digest('hex');
}

function relativeToRoot(filePath) {
  return normalizeSlash(
    path.relative(
      ROOT_DIR,
      filePath
    )
  );
}

function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(
      `❌ Assets 目录不存在: ${ASSETS_DIR}`
    );

    process.exit(1);
  }

  const images =
    collectImages(ASSETS_DIR)
      .sort();

  const textFiles =
    collectTextFiles(DOCS_DIR)
      .sort();

  const assetMap = new Map();

  for (const image of images) {
    assetMap.set(
      getAssetUrl(image),
      image
    );
  }

  /*
   * URL -> Set<source file>
   */
  const references =
    new Map();

  for (const file of textFiles) {
    const urls =
      extractAssetReferences(file);

    for (const url of urls) {
      if (!references.has(url)) {
        references.set(
          url,
          new Set()
        );
      }

      references
        .get(url)
        .add(file);
    }
  }

  /*
   * 1. Missing
   */
  const missing = [];

  for (
    const [url, sourceFiles]
    of references
  ) {
    if (!assetMap.has(url)) {
      missing.push({
        url,
        sources: [
          ...sourceFiles
        ]
      });
    }
  }

  /*
   * 2. Unused
   */
  const unused = [];

  for (
    const [url, filePath]
    of assetMap
  ) {
    if (!references.has(url)) {
      unused.push({
        url,
        filePath
      });
    }
  }

  /*
   * 3. 大文件
   */
  const large = [];

  /*
   * 4. JPG / PNG 大图
   */
  const legacy = [];

  /*
   * 5. 文件名问题
   */
  const naming = [];

  /*
   * 6. 重复文件
   */
  const hashMap = new Map();

  for (const image of images) {
    const stat =
      fs.statSync(image);

    const ext = path
      .extname(image)
      .toLowerCase();

    const url =
      getAssetUrl(image);

    if (
      stat.size >
      config.largeFileSize
    ) {
      large.push({
        url,
        size: stat.size
      });
    }

    if (
      (
        ext === '.jpg' ||
        ext === '.jpeg' ||
        ext === '.png'
      ) &&
      stat.size >
        config.legacyImageWarningSize
    ) {
      legacy.push({
        url,
        size: stat.size
      });
    }

    /*
     * 允许：
     *
     * abc.webp
     * foo-bar.webp
     * foo_bar.webp
     * 19-1.webp
     *
     * 中文文件名不报错，
     * 这里只检查真正容易炸 URL 的字符。
     */
    const name =
      path.basename(image);

    const stem = path.basename(
      image,
      ext
    );

    if (
      /[\s#?%]/.test(name) ||
      isUnsemanticFileStem(stem)
    ) {
      naming.push({
        url,
        name
      });
    }

    const hash =
      calculateHash(image);

    if (!hashMap.has(hash)) {
      hashMap.set(hash, []);
    }

    hashMap
      .get(hash)
      .push(url);
  }

  const duplicates = [
    ...hashMap.values()
  ].filter(
    files => files.length > 1
  );

  /*
   * 7. 目录结构
   */
  const rootImages = [];
  const invalidBlogPaths = [];

  for (const image of images) {
    const relative = getAssetRelative(image);

    if (!relative.includes('/')) {
      rootImages.push(getAssetUrl(image));
    }

    if (
      relative.split('/')[0] === 'blog' &&
      !isValidBlogAssetPath(relative)
    ) {
      invalidBlogPaths.push(getAssetUrl(image));
    }
  }

  const miscFiles = collectFiles(
    path.join(ASSETS_DIR, 'misc')
  ).map(filePath =>
    `/assets/${getAssetRelative(filePath)}`
  );

  /*
   * 输出
   */

  console.log('');
  console.log(
    '🔎 Assets 健康检查'
  );

  console.log('');
  console.log(
    `图片: ${images.length}`
  );

  console.log(
    `扫描文本文件: ${textFiles.length}`
  );

  console.log(
    `资源引用: ${references.size}`
  );

  if (missing.length) {
    console.log('');
    console.log(
      `❌ 不存在的资源 (${missing.length})`
    );

    for (const item of missing) {
      console.log(
        `  ${item.url}`
      );

      for (
        const source
        of item.sources
      ) {
        console.log(
          `    ↳ ${relativeToRoot(source)}`
        );
      }
    }
  }

  if (unused.length) {
    console.log('');
    console.log(
      `⚠️ 未使用资源 (${unused.length})`
    );

    for (const item of unused) {
      console.log(
        `  ${item.url}`
      );
    }
  }

  if (large.length) {
    console.log('');
    console.log(
      `⚠️ 超过 1 MB (${large.length})`
    );

    for (
      const item
      of large.sort(
        (a, b) =>
          b.size - a.size
      )
    ) {
      console.log(
        `  ${formatBytes(item.size).padStart(9)}  ${item.url}`
      );
    }
  }

  if (legacy.length) {
    console.log('');
    console.log(
      `⚠️ 建议 WebP 化 (${legacy.length})`
    );

    for (
      const item
      of legacy.sort(
        (a, b) =>
          b.size - a.size
      )
    ) {
      console.log(
        `  ${formatBytes(item.size).padStart(9)}  ${item.url}`
      );
    }
  }

  if (naming.length) {
    console.log('');
    console.log(
      `⚠️ 文件名问题 (${naming.length})`
    );

    for (const item of naming) {
      console.log(
        `  ${item.url}`
      );
    }
  }

  if (rootImages.length) {
    console.log('');
    console.log(
      `⚠️ assets 根目录直放图片 (${rootImages.length})`
    );

    for (const url of rootImages) {
      console.log(`  ${url}`);
    }
  }

  if (invalidBlogPaths.length) {
    console.log('');
    console.log(
      `⚠️ blog 目录结构不规范 (${invalidBlogPaths.length})`
    );
    console.log(
      '  应使用 /assets/blog/YYYY/article-slug/filename'
    );

    for (const url of invalidBlogPaths) {
      console.log(`  ${url}`);
    }
  }

  if (miscFiles.length) {
    console.log('');
    console.log(
      `⚠️ misc 中待整理文件 (${miscFiles.length})`
    );

    for (const url of miscFiles) {
      console.log(`  ${url}`);
    }
  }

  if (duplicates.length) {
    console.log('');
    console.log(
      `⚠️ 重复图片 (${duplicates.length} 组)`
    );

    for (
      const group
      of duplicates
    ) {
      console.log('');

      for (
        const file
        of group
      ) {
        console.log(
          `  ${file}`
        );
      }
    }
  }

  const warningCount =
    unused.length +
    large.length +
    legacy.length +
    naming.length +
    duplicates.length +
    rootImages.length +
    invalidBlogPaths.length +
    miscFiles.length;

  console.log('');
  console.log(
    '──────────────'
  );

  if (
    missing.length === 0 &&
    warningCount === 0
  ) {
    console.log(
      '✅ Assets 状态良好'
    );
  } else {
    console.log(
      `❌ Missing: ${missing.length}`
    );

    console.log(
      `⚠️ Warnings: ${warningCount}`
    );
  }

  console.log('');

  /*
   * 默认：
   *
   * 只有死链才阻止 build。
   *
   * --strict：
   * warning 也阻止 build。
   *
   * 这样你现有仓库第一次接入时，
   * 不会因为旧 JPG 很大导致所有部署失败。
   */
  if (missing.length > 0) {
    process.exit(1);
  }

  if (
    STRICT &&
    warningCount > 0
  ) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  console.error('');
  console.error(
    '❌ Assets 检查失败'
  );

  console.error(error);

  process.exit(1);
}
