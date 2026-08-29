---
title: Vuepress自动化部署的一些优化方案
createTime: 2026/04/20 16:47:05
permalink: /blog/ji-wen/vuepress-zi-dong-hua-bu-shu-de-yi-xie-you-hua-fang-an/
tags:
  - linux
  - vuepress
  - jenkins
---

::: note
查看本文前推荐先阅读[【Linux】云服务器自动化部署VuePress博客（Jenkins）](/article/w5w03ppj/)  
查看本文后推荐再阅读[Vuepress自动化部署的细节补充](/blog/ji-wen/vuepress-zi-dong-hua-bu-shu-de-xi-jie-bu-chong/)
:::

<!-- more -->

在**Jenkins**上部署Vuepress时，受限于云服务器网络环境，经常出现在拉取GitHub仓库时超时的问题：
``` bash
fetch-pack: unexpected disconnect while reading sideband packet
fatal: early EOF
fatal: unpack-objects failed
```

问题核心在于**Jenkins**默认的**Git 拉取操作超时时间为 10 分钟**，超时后导致连接中断，可针对性地调整相关配置来解决。

## 调整超时时间

为**Git**操作设置一个更长的超时时间，例如 30 分钟或 60 分钟。

在`源码管理` -> `Additional Behaviours` -> 点击`新增` -> `高级的克隆行为` -> `克隆和拉取操作的超时时间（分钟）` -> 填写时长 -> `保存配置并重新构建`

![](/assets/blog/2026/vuepress-deployment-optimizations/jenkins-git-timeout.webp)

## 浅克隆

如果仓库历史记录很大，可以启用**浅克隆（Shallow Clone）**，它只拉取最近的提交历史，能极大减少下载量和时间

在`源码管理` -> `Additional Behaviours` -> 点击`新增` -> `高级的克隆行为` -> 勾选`浅克隆`

![](/assets/blog/2026/vuepress-deployment-optimizations/jenkins-git-timeout.webp)

## 扩大Git缓冲区

登录**Jenkins**服务器，执行以下命令增大 Git 的 HTTP 缓冲区，以提升大文件传输的稳定性：
``` bash
git config --global http.postBuffer 524288000  # 设置为500MB
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
```

## 获取完整Git提交历史

当**Git**拉取使用浅克隆，会出现部署后的Vuepress**无法获取完整的 Git 提交历史**，解决此问题需要在部署任务中修改配置信息。

### 使用Jenkins

::: steps

1. 在你的 `package.json` 文件中，添加一个 `prebuild` 脚本，并将脚本的内容设置为 `git fetch --unshallow || true`，示例脚本内容：
``` json
  "scripts": {
    "docs:dev": "pnpm run wordcount && vuepress dev docs",
    "docs:dev-clean": "vuepress dev docs --clean-cache --clean-temp",
    "docs:build": "pnpm run wordcount && vuepress build docs --clean-cache --clean-temp",
    "docs:preview": "http-server docs/.vuepress/dist",
    "vp-update": "pnpm dlx vp-update",
    "prebuild": "git fetch --unshallow || true",
  },
```

2. 修改Jenkins `Build Steps` -> `执行Shell` 中的脚本，在build之前添加 `prebuild` 脚本，示例：
``` bash
export PATH="/usr/local/bin:$PATH"

pnpm install
pnpm prebuild
pnpm docs:build

TARGET_DIR="/opt/1panel/www/sites/davidblackcn.cc/index"

# 直接操作，无需 sudo
rm -rf "$TARGET_DIR"/*
cp -R docs/.vuepress/dist/* "$TARGET_DIR"/
```
:::

### 使用第三方开发部署平台

::: info
举例：**腾讯云EdgeOne**，其他平台类似  
**EdgeOne Pages**在构建时默认使用 `git clone --depth=1`，所以很需要此优化
:::

在 `构建部署配置` 中修改 `编译命令`，示例：
``` bash
git config core.quotepath false && git fetch --unshallow && pnpm docs:build
```
> `git config core.quotepath false` 用于解决可能的中文路径乱码问题

![](/assets/blog/2026/vuepress-deployment-optimizations/edgeone-build-settings.webp)
## 参考链接

[腾讯云 EdgeOne Pages 默认浅克隆无法获取全部项目 Git 记录](https://www.cyfor.cn/%E8%85%BE%E8%AE%AF%E4%BA%91edgeone-pages%E9%BB%98%E8%AE%A4%E6%B5%85%E5%85%8B%E9%9A%86%E6%97%A0%E6%B3%95%E8%8E%B7%E5%8F%96%E5%85%A8%E9%83%A8%E9%A1%B9%E7%9B%AEgit%E8%AE%B0%E5%BD%95/#page)