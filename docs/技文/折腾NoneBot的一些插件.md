---
title: 折腾NoneBot的一些插件
createTime: 2025/08/29 19:47:44
permalink: /article/7oezasx3/
tags:
    - Bot
---

## 写在话前

::: tip 七夕节快乐w！
:::

这几天刚好在折腾NoneBot，由于用的是==轻雪框架==，有许多的现成插件不兼容，故自己做了一些插件，也托管在了Github仓库中，可供参考

<!-- more -->

## 仓库

<RepoCard repo="DavidBlackCN/nonebot-plugin-repository " />

<RepoCard repo="LiteyukiStudio/LiteyukiBot " />


## 简介

自用的**NoneBot**插件仓库，储存了一些修改自其他dalao的插件和自己写的一些插件。

注：包含有AI生成的代码，由于是仅自用所以并没有包含太多可配置项，部分插件的配置请直接在 `config.py` 内修改！

- [示例配置](https://github.com/DavidBlackCN/nonebot-plugin-repository/blob/main/plugins/nonebot-plugin-soutu/config.py)
  
``` py
# 此为nonebot-plugin-soutu的示例配置文件
from pydantic import BaseModel
from typing import List

class Config(BaseModel):
    # 触发命令
    img_commands: List[str] = ["搜图", "图图"]
    
    # API基础URL，插件强需求此API，如更换API需修改插件代码
    img_api_base: str = "https://api.suxun.site/api/imgv2"
    
    # 支持的图片分类 #可以再加一个r18选项
    valid_categories: List[str] = [
        "mp", "pc", "1080p", "silver", "furry", 
        "starry", "setu", "ws", "pixiv"
    ]
    
    # 需要撤回的图片分类
    recall_categories: List[str] = ["setu", "pixiv"]
    
    # 撤回时间（秒）
    recall_delay: int = 60
    
    # 是否启用撤回功能
    enable_recall: bool = True

# 创建配置实例
config = Config()
```

## 鸣谢

- [NoneBot](https://nonebot.dev/docs/)
- [轻雪机器人](https://bot.apage.dev/)
- [不正经的妹妹](https://bot.sevin.cn/)
---
- [60s API](https://docs.60s-api.viki.moe/)
- [胖大海API](https://api.suxun.site/)
- [梦泽公共API](https://zeapi.ink/)
- [SexPhoto API](https://sex.nyan.run/)
- [夏柔 - 分享的API永不收费](https://api.aa1.cn/)