#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const ASSETS_DIR = path.join(
  DOCS_DIR,
  '.vuepress',
  'public',
  'assets'
);

const config = {
  maxWidth: 1920,

  // WebP 质量
  quality: 82,

  // WebP alpha 通道质量
  alphaQuality: 90,

  // 至少节省 5% 才认为转换值得
  minSavingRatio: 0.05,

  sourceExtensions: new Set([
    '.jpg',
    '.jpeg',
    '.png'
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

const args = process.argv.slice(2);

const flags = new Set(
  args.filter(arg => arg.startsWith('--'))
);

const inputPaths = args.filter(
  arg => !arg.startsWith('--')
);

const APPLY = flags.has('--apply');
const KEEP_SOURCE = flags.has('--keep-source');
const FORCE = flags.has('--force');
const NO_INTERACTIVE = flags.has('--no-interactive');
const INTERACTIVE =
  !APPLY &&
  !NO_INTERACTIVE &&
  process.stdin.isTTY &&
  process.stdout.isTTY;

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function normalizeSlash(value) {
  return value.replace(/\\/g, '/');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectImages(targetPath) {
  const result = [];

  if (!fs.existsSync(targetPath)) {
    return result;
  }

  const stat = fs.statSync(targetPath);

  if (stat.isFile()) {
    const ext = path.extname(targetPath).toLowerCase();

    if (config.sourceExtensions.has(ext)) {
      result.push(targetPath);
    }

    return result;
  }

  for (const entry of fs.readdirSync(targetPath, {
    withFileTypes: true
  })) {
    if (
      entry.isDirectory() &&
      config.ignoredDirs.has(entry.name)
    ) {
      continue;
    }

    const fullPath = path.join(
      targetPath,
      entry.name
    );

    if (entry.isDirectory()) {
      result.push(...collectImages(fullPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path
      .extname(entry.name)
      .toLowerCase();

    if (config.sourceExtensions.has(ext)) {
      result.push(fullPath);
    }
  }

  return result;
}

function collectTextFiles(dirPath) {
  const result = [];

  if (!fs.existsSync(dirPath)) {
    return result;
  }

  for (const entry of fs.readdirSync(dirPath, {
    withFileTypes: true
  })) {
    if (
      entry.isDirectory() &&
      config.ignoredDirs.has(entry.name)
    ) {
      continue;
    }

    // public/assets 本身不用搜索
    if (
      entry.isDirectory() &&
      path.resolve(dirPath, entry.name) ===
        path.resolve(ASSETS_DIR)
    ) {
      continue;
    }

    const fullPath = path.join(
      dirPath,
      entry.name
    );

    if (entry.isDirectory()) {
      result.push(...collectTextFiles(fullPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path
      .extname(entry.name)
      .toLowerCase();

    if (config.textExtensions.has(ext)) {
      result.push(fullPath);
    }
  }

  return result;
}

function getPublicUrl(filePath) {
  const relative = normalizeSlash(
    path.relative(ASSETS_DIR, filePath)
  );

  return `/assets/${relative}`;
}

function countReferences(files, publicUrl) {
  let count = 0;

  for (const file of files) {
    const content = fs.readFileSync(
      file,
      'utf8'
    );

    const regexp = new RegExp(
      escapeRegExp(publicUrl),
      'g'
    );

    count += (
      content.match(regexp) || []
    ).length;
  }

  return count;
}

function replaceReferences(
  files,
  oldUrl,
  newUrl
) {
  let replacementCount = 0;
  let changedFileCount = 0;

  const regexp = new RegExp(
    escapeRegExp(oldUrl),
    'g'
  );

  for (const file of files) {
    const original = fs.readFileSync(
      file,
      'utf8'
    );

    const matches =
      original.match(regexp);

    if (!matches) {
      continue;
    }

    const updated = original.replace(
      regexp,
      newUrl
    );

    fs.writeFileSync(
      file,
      updated,
      'utf8'
    );

    replacementCount += matches.length;
    changedFileCount++;
  }

  return {
    replacementCount,
    changedFileCount
  };
}

async function convertImage(
  sourcePath,
  textFiles
) {
  const ext = path
    .extname(sourcePath)
    .toLowerCase();

  const outputPath = sourcePath.slice(
    0,
    -ext.length
  ) + '.webp';

  // 防止 foo.jpg 与已有 foo.webp 冲突
  if (
    fs.existsSync(outputPath) &&
    !FORCE
  ) {
    console.log(
      `⏭️  已存在 WebP: ${getPublicUrl(outputPath)}`
    );

    return {
      skipped: true
    };
  }

  const sourceStat =
    fs.statSync(sourcePath);

  const buffer = await sharp(sourcePath)
    // 根据 EXIF 自动旋转照片
    .rotate()

    // 只缩小，不放大
    .resize({
      width: config.maxWidth,
      withoutEnlargement: true
    })

    .webp({
      quality: config.quality,
      alphaQuality: config.alphaQuality,
      effort: 4,
      smartSubsample: true
    })

    .toBuffer();

  const outputSize = buffer.length;

  const saving =
    sourceStat.size - outputSize;

  const savingRatio =
    saving / sourceStat.size;

  const oldUrl =
    getPublicUrl(sourcePath);

  const newUrl =
    getPublicUrl(outputPath);

  const referenceCount =
    countReferences(
      textFiles,
      oldUrl
    );

  console.log('');
  console.log(`🖼️  ${oldUrl}`);
  console.log(
    `   ${formatBytes(sourceStat.size)} → ${formatBytes(outputSize)}`
  );

  console.log(
    `   节省 ${(savingRatio * 100).toFixed(1)}%`
  );

  console.log(
    `   引用 ${referenceCount} 处`
  );

  if (
    savingRatio <
      config.minSavingRatio &&
    !FORCE
  ) {
    console.log(
      '   ⏭️  收益低于 5%，跳过'
    );

    return {
      skipped: true
    };
  }

  if (!APPLY) {
    console.log(
      `   🔍 dry-run → ${newUrl}`
    );

    return {
      skipped: false,
      dryRun: true
    };
  }

  fs.writeFileSync(
    outputPath,
    buffer
  );

  const replaced =
    replaceReferences(
      textFiles,
      oldUrl,
      newUrl
    );

  console.log(
    `   ✅ 已生成 ${newUrl}`
  );

  console.log(
    `   🔗 更新 ${replaced.replacementCount} 处引用`
  );

  /*
   * 安全策略：
   *
   * 只有找到并修改了引用时，
   * 默认才删除旧文件。
   *
   * 避免某些动态引用、CSS 拼接路径等
   * 没被脚本识别时误删资源。
   */
  if (
    !KEEP_SOURCE &&
    replaced.replacementCount > 0
  ) {
    fs.unlinkSync(sourcePath);

    console.log(
      '   🗑️  已删除源文件'
    );
  } else if (KEEP_SOURCE) {
    console.log(
      '   📦 保留源文件 (--keep-source)'
    );
  } else {
    console.log(
      '   ⚠️  未找到引用，因此保留源文件'
    );
  }

  return {
    skipped: false,
    inputSize: sourceStat.size,
    outputSize,
    saving,
    replacements:
      replaced.replacementCount
  };
}

function resolveTargets() {
  if (inputPaths.length === 0) {
    return collectImages(
      ASSETS_DIR
    );
  }

  const images = [];

  for (const input of inputPaths) {
    const absolute = path.resolve(
      ROOT_DIR,
      input
    );

    images.push(
      ...collectImages(absolute)
    );
  }

  return [...new Set(images)]
    .sort();
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    throw new Error(
      `Assets 目录不存在: ${ASSETS_DIR}`
    );
  }

  const images =
    resolveTargets();

  const textFiles =
    collectTextFiles(DOCS_DIR);

  console.log('');
  console.log(
    '🖼️  Blog 图片优化'
  );

  console.log(
    `模式: ${
      APPLY
        ? '写入'
        : INTERACTIVE
          ? '预览（可确认写入）'
          : 'dry-run'
    }`
  );

  console.log(
    `图片数: ${images.length}`
  );

  if (!APPLY && !INTERACTIVE) {
    console.log('');
    console.log(
      '提示：当前不会修改文件。'
    );

    console.log(
      '确认结果后执行：'
    );

    console.log(
      'pnpm images:optimize -- --apply'
    );
  }

  let converted = 0;
  let skipped = 0;
  let inputBytes = 0;
  let outputBytes = 0;
  let replacements = 0;

  for (const image of images) {
    try {
      const result =
        await convertImage(
          image,
          textFiles
        );

      if (result.skipped) {
        skipped++;
        continue;
      }

      converted++;

      inputBytes +=
        result.inputSize || 0;

      outputBytes +=
        result.outputSize || 0;

      replacements +=
        result.replacements || 0;
    } catch (error) {
      console.error('');
      console.error(
        `❌ 处理失败: ${image}`
      );

      console.error(
        error.message
      );
    }
  }

  console.log('');
  console.log('──────────────');
  console.log('📊 图片处理完成');
  console.log(
    `转换: ${converted}`
  );
  console.log(
    `跳过: ${skipped}`
  );

  if (APPLY) {
    console.log(
      `更新引用: ${replacements}`
    );

    if (inputBytes > 0) {
      const saving =
        inputBytes - outputBytes;

      console.log(
        `本次节省: ${formatBytes(saving)}`
      );
    }
  }

  console.log('');

  if (!INTERACTIVE || converted === 0) {
    return;
  }

  const readline = require('readline/promises');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let confirmed = false;

  try {
    const answer = (await rl.question(
      '确认转换以上图片、更新引用并按安全规则删除源文件？[y/N] '
    )).trim().toLowerCase();

    confirmed = ['y', 'yes', '是'].includes(answer);
  } finally {
    rl.close();
  }

  if (!confirmed) {
    console.log('已取消，未修改任何文件。');
    return;
  }

  console.log('');
  console.log('开始写入优化结果…');

  const applied = spawnSync(
    process.execPath,
    [__filename, '--apply', ...args],
    {
      cwd: ROOT_DIR,
      stdio: 'inherit'
    }
  );

  if (applied.error) {
    throw applied.error;
  }

  if (applied.status !== 0) {
    process.exitCode = applied.status || 1;
  }
}

main().catch(error => {
  console.error('');
  console.error(
    '❌ 图片优化失败'
  );

  console.error(error);
  process.exit(1);
});
