#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');
const { stdin, stdout } = require('process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(
  ROOT_DIR,
  'docs',
  '.vuepress',
  'public',
  'assets'
);

const CURRENT_YEAR = String(
  new Date().getFullYear()
);

const TYPE_OPTIONS = [
  { label: 'Blog', base: ['blog'], needsYear: true },
  { label: 'Project', base: ['projects'] },
  { label: 'Site', base: ['site'] },
  { label: 'Common', base: ['common'] }
];

function printHelp() {
  console.log('用法: pnpm assets:add');
  console.log('交互式创建 Blog、Project、Site 或 Common 素材目录。');
}

function isSafeKebabCase(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function assertSafeDirectory(targetPath) {
  const relative = path.relative(ASSETS_DIR, targetPath);

  if (
    !relative ||
    relative.startsWith('..') ||
    path.isAbsolute(relative)
  ) {
    throw new Error('目录必须位于 docs/.vuepress/public/assets 内。');
  }
}

async function askRequired(rl, question, validator) {
  while (true) {
    const answer = (await rl.question(question)).trim();

    if (validator(answer)) {
      return answer;
    }

    console.log('请输入英文 kebab-case，例如 mc-server-rsync。');
  }
}

async function askOptionalDirectoryName(rl) {
  while (true) {
    const answer = (await rl.question(
      '子目录名（可留空，直接使用该分类目录）：'
    )).trim();

    if (!answer || isSafeKebabCase(answer)) {
      return answer;
    }

    console.log('请输入英文 kebab-case，或直接回车。');
  }
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printHelp();
    return;
  }

  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error('assets:add 需要在交互式终端中运行。');
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    console.log('请选择素材分类：');

    TYPE_OPTIONS.forEach((option, index) => {
      console.log(`  ${index + 1}. ${option.label}`);
    });

    let choice;

    while (!choice) {
      const answer = (await rl.question('分类 [1-4]：')).trim();
      const index = Number(answer) - 1;

      if (Number.isInteger(index) && TYPE_OPTIONS[index]) {
        choice = TYPE_OPTIONS[index];
      } else {
        console.log('请输入 1 到 4。');
      }
    }

    const parts = [...choice.base];

    if (choice.needsYear) {
      let year;

      while (!year) {
        const answer = (await rl.question(
          `年份 [${CURRENT_YEAR}]：`
        )).trim() || CURRENT_YEAR;

        if (/^\d{4}$/.test(answer)) {
          year = answer;
        } else {
          console.log('请输入四位年份，例如 2026。');
        }
      }

      const slug = await askRequired(
        rl,
        '文章 slug：',
        isSafeKebabCase
      );

      parts.push(year, slug);
    } else {
      const name = await askOptionalDirectoryName(rl);

      if (name) {
        parts.push(name);
      }
    }

    const targetPath = path.resolve(
      ASSETS_DIR,
      ...parts
    );

    assertSafeDirectory(targetPath);

    const existed = fs.existsSync(targetPath);
    fs.mkdirSync(targetPath, { recursive: true });

    const publicPath = `/assets/${parts.join('/')}/`;

    console.log(
      `${existed ? '已存在' : '已创建'}：${targetPath}`
    );
    console.log(`引用目录：${publicPath}`);
  } finally {
    rl.close();
  }
}

main().catch(error => {
  console.error(`❌ assets:add 失败：${error.message}`);
  process.exit(1);
});
