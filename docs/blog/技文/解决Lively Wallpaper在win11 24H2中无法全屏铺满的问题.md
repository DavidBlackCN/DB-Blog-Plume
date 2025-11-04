---
title: 解决Lively Wallpaper在win11 24H2中无法全屏铺满的问题
createTime: 2025/08/18 14:05:44
permalink: /article/fx4aekk1/
tags:
  - 壁纸
---

- 在==Windows11 24H2==版本中，Lively Wallpaper导入的壁纸无法铺满全屏，会在屏幕上边留下黑边。

<!-- more -->

## 写在话前

- 新笔电第一次使用Lively Wallpaper便出现了该问题，故记录该问题的临时解决方案。

## 解决方案

:::: steps
1. 找到Lively Wallpaper的根目录Mpv，新建 `portable_config` 文件夹
::: info 举例
`C:\Users\YOUR_USER_NAME\AppData\Local\Lively Wallpaper\Mpv\portable_config` 
:::

2. 新建 `mpv.conf` 文件，输入以下内容：
``` conf
border=no
```

3. 重启Lively Wallpaper，切换壁纸，问题解决
::::