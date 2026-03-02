---
title: 通过NeteaseCloudMusicAPI Enhanced获取网易云音乐信息
createTime: 2026/03/02 14:20:53
permalink: >-
  /blog/ji-wen/tong-guo-netease-cloud-music-api-enhanced-huo-qu-wang-yi-yun-yin-yue-xin-xi/
excerpt: 记录NeteaseCloudMusicAPI Enhanced的部署及使用方法
tags:
    - 网易云音乐
    - API
---

## 写在话前
用Gemini做了个网易云音乐分享歌曲的卡片，获取相关信息则需要相关API实现，一开始找到了**NeteaseCloudMusicAPI**，发现其GitHub仓库~~已被制裁~~，后找到了该增强版项目，故记录其部署和使用方法。

::: important 注意
- 本项目是一个高度去中心化的第三方 API，其维护都由社区志愿者使用`Pull Request`完成。 
- 使用本项目时请务必遵守相关法律法规，遵守`MIT`协议, 尊重网易云音乐的服务条款。
- 原作者项目 [Binaryify/NeteaseCloudMusicApi](https://github.com/binaryify/NeteaseCloudMusicApi) 并非完全停止维护, 你可以在 [NeteaseCloudMusicApi 的 NPMJS 页面](https://www.npmjs.com/package/NeteaseCloudMusicApi) 查看最新版本信息。
- 感谢尊重和理解!
:::

<GitHubCard url="https://github.com/binaryify/NeteaseCloudMusicApi" />
<GitHubCard url="https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced" />

## 快速开发

### 环境要求
- Node.js 18 及以上
- 推荐使用 pnpm 进行依赖管理

### 安装
```bash
git clone https://github.com/neteasecloudmusicapienhanced/api-enhanced.git
cd api
pnpm i
```

### 启动服务
```bash
# 默认端口 3000
node app.js

# 指定端口（如 4000）
PORT=4000 node app.js  # Mac/Linux
set PORT=4000 && node app.js  # Windows
```

### 重要提示
- 调用前请务必阅读文档的 [调用前须知](https://neteasecloudmusicapienhanced.js.org/#/?id=%e8%b0%83%e7%94%a8%e5%89%8d%e9%a1%bb%e7%9f%a5) 部分。
- 推荐将**敏感信息（如 cookie）**通过部署平台的环境变量进行配置。

## Vercel部署
:::: steps
1. 在Github上**fork**本项目
2. 在Vercel上**新建项目**
   ::: info 流程
   `Project` -> `Add New Project` -> `Import Git Repository` -> `Application Preset` 选择 `Other` -> `Deploy`
   :::
3. 等待**部署完成**，出现此页面则代表部署成功
    ![](/assets/202603/2-1.png)
4. (可选)`Add Domain`添加自定义域名
5. **访问项目地址**查看效果
    ![](/assets/202603/2-2.png)
::::

## 腾讯云serverless部署<Badge type="tip" text="未尝试" />

> 因**Vercel**在国内访问太慢(不绑定自己的域名的情况下)，在此提供**腾讯云serverless**部署方法

:::: steps
1. 在Github上**fork**本项目
2. 在 [腾讯云 serverless 应用管理页面](https://console.cloud.tencent.com/sls)，点击`新建应用`
3. 顶部 `创建方式` 选择 `Web 应用`
4. 选择 `Express框架`，点击底部下一步按钮
5. 输入应用名，上传方式选择代码仓库，进行**GitHub 授权**(如已授权可跳过这一步)，代码仓库选择刚刚**fork**的项目
6. 启动文件填入:
    ```bash
    #!/bin/bash
    export PORT=9000
    /var/lang/node16/bin/node app.js
    ```
7. 点击 `完成`，等待**部署完成**
8. 点击 `资源列表` 的 `API网关` 里的 `URL`，访问项目地址查看效果
    ![](/assets/202603/2-2.png)
::::

## API使用
- 可参考 [官方文档](https://neteasecloudmusicapienhanced.js.org/#/)
### 常用接口
- 搜索音乐：`GET /search`
- 获取音乐详情：`GET /song/detail`
- 获取音乐评论：`GET /comment/music`
- 获取音乐播放链接：`GET /song/url/v1`

## 示例
- 我的API：[https://api.neteasemusic.davidblackcn.online/](https://api.neteasemusic.davidblackcn.online/)
- 我的网易云音乐卡片示例 `NeteaseMusicCard.vue`

<NeteaseMusicCard id="439911153" />

## 其他
### 致谢
原作者 [Binaryify/NeteaseCloudMusicApi](https://github.com/binaryify/NeteaseCloudMusicApi) 项目为本项目基础 (该项目在`npmjs`网站上仍持续维护, 但 github 仓库已不再更新)  
感谢大佬们为逆向eapi, weapi等加密算法所做的贡献  

项目参考:  
[trazyn/ieaseMusic](https://github.com/trazyn/ieaseMusic)  
[listen1/listen1_chrome_extension](https://github.com/listen1/listen1_chrome_extension)  
[chaunsin/netease-cloud-music](https://github.com/chaunsin/netease-cloud-music)  

### SDK 生态
| 语言     | 作者                                          | 地址                                                                                       | 类型  |
|--------|---------------------------------------------|------------------------------------------------------------------------------------------|-----|
| Java   | [JackuXL](https://github.com/JackuXL)       | [NeteaseCloudMusicApi-SDK](https://github.com/JackuXL/NeteaseCloudMusicApi-SDK)          | 第三方 |
| Java   | [1015770492](https://github.com/1015770492) | [https://github.com/1015770492/yumbo-music-utils](https://github.com/1015770492/yumbo-music-utils)                                          | 第三方 |
| Python | [盧瞳](https://github.com/2061360308)         | [NeteaseCloudMusic_PythonSDK](https://github.com/2061360308/NeteaseCloudMusic_PythonSDK) | 第三方 |
| Swift  | [Lincb522](https://github.com/Lincb522)  | [NeteaseCloudMusicApi-Swift](https://github.com/Lincb522/NeteaseCloudMusicAPI-Swift)     | 第三方 |

### 依赖此项目的优秀开源项目
- [imsyy/splayer](https://github.com/imsyy/splayer)
- [qier2222/YesPlayMusic](https://github.com/qier222/YesPlayMusic)
- [MaigoLabs/amaoke.app](https://github.com/MaigoLabs/amaoke.app)
- [Yueby/music-together](https://github.com/Yueby/music-together)



