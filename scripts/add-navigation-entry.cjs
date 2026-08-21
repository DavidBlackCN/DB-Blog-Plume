const { readFileSync, readdirSync, writeFileSync } = require('node:fs')
const { extname, resolve, relative } = require('node:path')
const { createInterface } = require('node:readline')
const { stdin: input, stdout: output } = require('node:process')

const root = resolve(__dirname, '..')
const dataDirectory = resolve(root, 'docs/.vuepress/theme/data')
const requiredFields = ['id', 'name', 'url', 'desc', 'category']
const args = Object.fromEntries(
  process.argv.slice(2).map((argument) => {
    const [key, ...value] = argument.replace(/^--/, '').split('=')
    return [key, value.join('=')]
  })
)

if (Object.hasOwn(args, 'help')) {
  console.log(`用法：
  pnpm nav:add
  pnpm nav:add -- --data=docs/.vuepress/theme/data/目标导航.json
  pnpm nav:add -- --id=resource-id --name=名称 --url=https://example.com --desc="说明" --category=分类ID --tags=标签1,标签2 [--logo=https://...] --data=docs/.vuepress/theme/data/目标导航.json`)
  process.exit(0)
}

function fail(message) {
  console.error(`❌ ${message}`)
  process.exit(1)
}

function resolveDataPath(file) {
  const dataPath = resolve(root, file)

  if (relative(dataDirectory, dataPath).startsWith('..')) {
    fail('data 参数只能指向 docs/.vuepress/theme/data 内的 JSON 文件')
  }

  return dataPath
}

function validateUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function validateData(data) {
  if (!Array.isArray(data.categories) || !Array.isArray(data.sites)) {
    fail('目标 JSON 必须包含 categories 与 sites 数组')
  }
}

function isNavigationData(data) {
  return Array.isArray(data?.categories) && Array.isArray(data?.sites)
}

function getNavigationDataFiles() {
  return readdirSync(dataDirectory, { withFileTypes: true })
    .filter((file) => file.isFile() && extname(file.name).toLowerCase() === '.json')
    .sort((left, right) => left.name.localeCompare(right.name, 'zh-CN'))
    .map((file) => {
      const dataPath = resolve(dataDirectory, file.name)

      try {
        const data = JSON.parse(readFileSync(dataPath, 'utf8'))
        return isNavigationData(data) ? { dataPath, data } : null
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

function getSuggestedId(category, url) {
  const hostname = new URL(url).hostname
    .replace(/^www\./, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return `${category}-${hostname}`
}

function parseTags(value) {
  return value.split(',').map((tag) => tag.trim()).filter(Boolean)
}

function validateEntry(entry, data) {
  for (const field of requiredFields) {
    if (!entry[field]?.trim()) fail(`缺少 ${field} 信息`)
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) {
    fail('资源 ID 只能使用小写字母、数字和连字符')
  }

  if (!validateUrl(entry.url)) fail('链接必须是 http 或 https 地址')

  if (!data.categories.some((category) => category.id === entry.category)) {
    fail(`不存在分类 ${entry.category}，请先在 JSON 的 categories 中添加它`)
  }

  if (data.sites.some((site) => site.id === entry.id)) {
    fail(`资源 ID ${entry.id} 已存在`)
  }
}

function createPromptSession() {
  const readline = createInterface({ input, output })
  const queuedAnswers = []
  let resolveNextAnswer

  readline.on('line', (line) => {
    if (resolveNextAnswer) {
      const resolve = resolveNextAnswer
      resolveNextAnswer = undefined
      resolve(line)
      return
    }

    queuedAnswers.push(line)
  })

  return {
    async question(question) {
      output.write(question)

      if (queuedAnswers.length) return queuedAnswers.shift()

      return new Promise((resolve) => {
        resolveNextAnswer = resolve
      })
    },
    close() {
      readline.close()
    }
  }
}

async function askQuestion(prompt, label, { defaultValue = '', optional = false } = {}) {
  const suffix = defaultValue ? `（直接回车使用：${defaultValue}）` : optional ? '（可留空）' : ''

  while (true) {
    const answer = String(await prompt.question(`${label}${suffix}：`)).trim()
    const value = answer || defaultValue

    if (value || optional) return value
    console.log('  此项不能为空，请重新输入。')
  }
}

async function chooseDataFile(prompt) {
  const files = getNavigationDataFiles()

  if (!files.length) fail('data 目录中没有包含 categories 与 sites 数组的导航 JSON 文件')

  console.log('\n选择数据文件：')
  files.forEach(({ dataPath, data }, index) => {
    console.log(`  ${index + 1}. ${relative(root, dataPath)}（${data.sites.length} 个资源）`)
  })

  while (true) {
    const answer = await askQuestion(prompt, '请输入编号', { defaultValue: '1' })
    const index = Number(answer) - 1

    if (Number.isInteger(index) && files[index]) return files[index]
    console.log(`  请输入 1 到 ${files.length} 之间的编号。`)
  }
}

async function chooseCategory(prompt, data, defaultValue = '') {
  console.log('\n可用分类：')
  data.categories.forEach((category, index) => {
    console.log(`  ${index + 1}. ${category.icon || '•'} ${category.id} — ${category.name}`)
  })

  while (true) {
    const answer = await askQuestion(prompt, '分类编号或 ID', { defaultValue })
    const index = Number(answer) - 1
    const category = Number.isInteger(index)
      ? data.categories[index]
      : data.categories.find((item) => item.id === answer)

    if (category) return category.id
    console.log('  不存在该分类，请输入上方的编号或分类 ID。')
  }
}

async function collectInteractiveEntry(prompt, data, defaults = {}) {
  console.log('\n开始添加导航链接，按 Ctrl+C 可随时取消。')

  const category = await chooseCategory(prompt, data, defaults.category?.trim())
  const name = await askQuestion(prompt, '链接名称', { defaultValue: defaults.name?.trim() })
  const url = await askQuestion(prompt, '链接地址', { defaultValue: defaults.url?.trim() })
  const desc = await askQuestion(prompt, '简短描述', { defaultValue: defaults.desc?.trim() })
  const tags = await askQuestion(prompt, '标签（用英文逗号分隔）', { defaultValue: defaults.tags?.trim(), optional: true })
  const logo = await askQuestion(prompt, 'Logo 地址', { defaultValue: defaults.logo?.trim(), optional: true })
  const id = await askQuestion(prompt, '资源 ID', {
    defaultValue: defaults.id?.trim() || (validateUrl(url) ? getSuggestedId(category, url) : '')
  })

  return {
    id,
    name,
    url,
    desc,
    category,
    tags: parseTags(tags),
    ...(logo ? { logo } : {})
  }
}

async function shouldContinue(prompt) {
  while (true) {
    const answer = await askQuestion(prompt, '继续录入？输入 1 继续，输入 2 退出', { defaultValue: '2' })

    if (answer === '1') return true
    if (answer === '2') return false
    console.log('  请输入 1 或 2。')
  }
}

function getArgumentEntry() {
  return {
    id: args.id?.trim(),
    name: args.name?.trim(),
    url: args.url?.trim(),
    desc: args.desc?.trim(),
    category: args.category?.trim(),
    tags: parseTags(args.tags || ''),
    ...(args.logo?.trim() ? { logo: args.logo.trim() } : {})
  }
}

async function main() {
  const shouldPrompt = !requiredFields.every((field) => args[field]?.trim())

  if (shouldPrompt && input.destroyed) {
    fail('当前输入流不可用，无法启动交互式添加向导')
  }

  const prompt = shouldPrompt ? createPromptSession() : null

  try {
    const selectedFile = shouldPrompt && !args.data
      ? await chooseDataFile(prompt)
      : null
    const dataPath = args.data
      ? resolveDataPath(args.data)
      : selectedFile?.dataPath

    if (!dataPath) {
      fail('存在多个导航数据文件时，批量模式必须指定 --data=docs/.vuepress/theme/data/目标导航.json')
    }

    const data = selectedFile?.data || JSON.parse(readFileSync(dataPath, 'utf8'))
    validateData(data)

    if (!shouldPrompt) {
      const entry = getArgumentEntry()
      validateEntry(entry, data)
      data.sites.push(entry)
      writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
      console.log(`\n✅ 已添加 ${entry.name} 到 ${relative(root, dataPath)}`)
      return
    }

    let defaults = args
    do {
      const entry = await collectInteractiveEntry(prompt, data, defaults)
      validateEntry(entry, data)
      data.sites.push(entry)
      writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
      console.log(`\n✅ 已添加 ${entry.name} 到 ${relative(root, dataPath)}`)
      defaults = {}
    } while (await shouldContinue(prompt))

    console.log('\n已退出导航链接录入。')
  } finally {
    prompt?.close()
  }
}

main().catch((error) => fail(error.message))
