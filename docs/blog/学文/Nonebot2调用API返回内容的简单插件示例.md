---
title: Nonebot2调用API返回内容的简单插件示例
createTime: 2025/09/03 15:18:13
permalink: /article/wg5das5g/
tags:
    - Bot
---

## 写在话前

这几天刚好在折腾NoneBot，写了一堆调用API返回内容的小插件，故在此记录插件的简单示例。

<!-- more -->

## 创建插件

一个 `.py` 文件或一个包含 `__init__.py` 的文件夹即可被识别为插件，这里我们直接使用单文件格式，创建 `CUSTOM_NAME_Plugin.py `

::: info 提醒 
请将 `CUSTOM_NAME` 替换为自己定义的插件名和函数名，下同。
:::

## 发送随机文字
定义插件及其命令，同时导入所需的库：

``` py
from nonebot import on_command
import httpx


CUSTOM_NAME = on_command(
    '命令关键词',
    block=True,
    priority=10
)
```

定义一个名为 main 的异步函数，使用 `await get_data()` 来获取随机文本，然后使用 `await CUSTOM_NAME.finish()` 发送文本。

``` py
@CUSTOM_NAME.handle()
async def main():
    msg = await get_data()
    await CUSTOM_NAME.finish(msg)
```

文字API的返回方式一般分为直接返回文字或者返回json列表，不同的返回方式需要不同的处理逻辑。

### 返回文字

用 httpx 库中的 `AsyncClient()` 来实现异步请求，发出 GET 请求，从API获取文本，并返回响应内容，最后将其发送。

``` py
async def get_data():
    url = '此处填写API URL'
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)
        data = resp.text
    return data
```

插件示例：

``` py
from nonebot import on_command
import httpx


twqh = on_command(
    '土味情话',
    block=True,
    priority=10
)


@twqh.handle()
async def main():
    msg = await get_data()
    await twqh.finish(msg)


async def get_data():
    url = 'https://api.suxun.site/api/qinghua'
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)
        data = resp.text
    return data
```

### 返回json

以调用 `https://60s.viki.moe/v2/fabing` 的API为例，其返回内容如下，而我们需要的字段为 `"data"` 里的 `"saying"` 

``` json
{"code":200,"message":"获取成功。数据来自官方/权威源头，以确保稳定与实时。开源地址 https://github.com/vikiboss/60s，反馈群 595941841","data":{"index":7,"saying":"主人，你玩游戏吗？我帮你首充好不好🤤🤤🤤"}}
```

用 httpx 库中的 `AsyncClient()` 来实现异步请求，发出 GET 请求，从API获取json，获取并返回需要的字段，最后将其发送。

``` py
async def get_data():
    url = '此处填写API URL'
        async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        get_dic1 = json.loads(resp.text)
        det_dic2 = get_dic1['data']
        data = get_dic['saying']
    return data
```

插件示例：

``` py
from nonebot import on_command
import httpx
import json # 处理json需要导入


fbwa = on_command(
    '发病文案',
    block=True,
    priority=10
)


@fbwa.handle()
async def main():
    msg = await get_data()
    await fbwa.finish(msg)


async def get_data():
    url = 'https://60s.viki.moe/v2/fabing'
        async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        get_dic1 = json.loads(resp.text)
        det_dic2 = get_dic1['data']
        data = get_dic['saying']
    return data
```

## 发送随机图片
定义插件及其命令，同时导入所需的库：

``` py
from nonebot import on_command
from nonebot.adapters.onebot.v11 import MessageSegment
import httpx


CUSTOM_NAME = on_command(
    '命令关键词',
    block=True,
    priority=10
)
```

定义一个名为 main 的异步函数，使用 `await get_data()` 来获取随机图片，然后使用 `await CUSTOM_NAME.finish()` 发送图片。

``` py
@CUSTOM_NAME.handle()
async def main():
    msg = await get_data()
    await CUSTOM_NAME.finish(MessageSegment.image(msg))
```

图片API的返回方式一般分为==直接返回URL==，==返回json列表==，==直接返回图片==，==重定向到图片链接==，不同的返回方式需要不同的处理逻辑。

### 直接返回URL

这种类型在访问API后会直接获得图片的URL。

``` py
async def get_data():
    url = 'API URL'
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.text.strip()
    return data
```

示例插件：

``` py
from nonebot import on_command
from nonebot.adapters.onebot.v11 import MessageSegment
import httpx


ecyt = on_command(
    '二次元图',
    block=True,
    priority=10
)


@ecyt.handle()
async def main():
    msg = await get_data()
    await ecyt.finish(MessageSegment.image(msg))


async def get_data():
    url = 'https://api.sevin.cn/api/ecy.php'
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.text.strip()
    return data
```

### 返回json列表

以调用 `https://www.dmoe.cc/random.php?return=json` 的API为例，其返回内容如下，而我们需要的URL位于 `"imgurl"` 内 

``` json
{"code":"200","imgurl":"https:\/\/image.baidu.com\/search\/down?url=https:\/\/tvax3.sinaimg.cn\/\/large\/0072Vf1pgy1foxk3r1oj8j31hc0u0arg.jpg","width":"1920","height":"1080"}
```

用 httpx 库中的 `AsyncClient()` 来实现异步请求，发出 GET 请求，从API获取json，获取图片URL，最后发送图片。

``` py
async def get_pic():
    url = 'https://www.dmoe.cc/random.php?return=json'
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        get_dic = json.loads(resp.text)
    data = get_dic["imgurl"]
    return data
```

示例插件：

``` py

from nonebot import on_command
from nonebot.adapters.onebot.v11 import MessageSegment
import httpx
import json
 
 
ecyt = on_command(
    '二次元图',
    block=True,
    priority=10
)
 
@ecyt.handle()
async def main():
    msg = await get_pic()
    await ecyt.finish(MessageSegment.image(msg))
 
 
async def get_pic():
    url = 'https://www.dmoe.cc/random.php?return=json'
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        get_dic = json.loads(resp.text)
    data = get_dic["imgurl"]
    return data
```

### 直接返回图片  
这次尝试复杂一点的写法，加入捕获异常机制，直接上示例。

以调用 `https://api.lolimi.cn/API/cosplay/api.php?type=image` 的API为例，其直接返回图片内容，没有重定向。

``` py
from nonebot import on_command
from nonebot.adapters import Message
from nonebot.params import CommandArg
from nonebot.plugin import PluginMetadata
from nonebot.adapters.onebot.v11 import MessageSegment
from nonebot.exception import FinishedException
import aiohttp
import base64

cosplay_cmd = on_command("cosplay", priority=10, block=True)

# 此处填写API URL
API_URL = "https://api.lolimi.cn/API/cosplay/api.php?type=image"

@cosplay_cmd.handle()
async def handle_cosplay():
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(API_URL) as response:
                if response.status == 200:
                    # 获取响应的内容类型
                    content_type = response.headers.get('Content-Type', '')
                    
                    # 检查是否是图片
                    if 'image' in content_type:
                        # 直接读取二进制图片数据
                        image_data = await response.read()
                        
                        # 将图片数据转换为 base64 编码
                        base64_data = base64.b64encode(image_data).decode('utf-8')
                        
                        # 发送 base64 编码的图片
                        await cosplay_cmd.send(MessageSegment.image(f"base64://{base64_data}"))
                    else:
                        # 尝试获取文本响应（可能是URL）
                        text_response = await response.text()
                        
                        # 发送图片
                        await cosplay_cmd.send(MessageSegment.image(text_response))
                else:
                    await cosplay_cmd.send("获取cosplay图片失败，请稍后再试")

    except FinishedException:
        pass # 这是正常的结束异常，不需要处理
    except Exception as e:
        await cosplay_cmd.send(f"获取cosplay图片时发生错误: {str(e)}")
```

### 重定向到图片链接

同样的，加入捕获异常机制，直接上示例。

以调用 `https://api.lxtu.cn/api.php?category=cat` 的API为例，其直接重定向到图片的URL中。

``` py
from nonebot import on_command
from nonebot.adapters import Message
from nonebot.params import CommandArg
from nonebot.plugin import PluginMetadata
from nonebot.adapters.onebot.v11 import MessageSegment
import httpx

mn_cmd = on_command("猫猫", priority=10, block=True)

# 此处填写API URL
API_URL = "https://api.lxtu.cn/api.php?category=cat"

@mn_cmd.handle()
async def handle_mn():
    try:
        # 获取图片URL
        async with httpx.AsyncClient() as client:
            # 发送请求并跟随重定向，但不获取响应体
            response = await client.head(API_URL, follow_redirects=True)
            
            # 检查响应状态
            if response.status_code != 200:
                await mn_cmd.finish(f"获取图片失败，状态码: {response.status_code}")
            
            # 获取最终的重定向URL
            image_url = str(response.url)
            
            # 发送图片
            await mn_cmd.send(MessageSegment.image(image_url))
            
    except httpx.RequestError as e:
        await mn_cmd.finish(f"请求图片时发生错误: {e}")
    except Exception as e:
        await mn_cmd.finish(f"发生未知错误: {e}")
```

## 拓展

在参考上述写法的情况下，仍可以继续添加新功能，如根据用户命令传入请求参数等等，可以参考我自用的Nonebot插件仓库。

<GitHubCard url="DavidBlackCN/nonebot-plugin-repository " />

## 参考&鸣谢

- [不正经的妹妹](https://bot.sevin.cn/)
- [Sevin的小窝](https://blog.sevin.cn/)
- 部分插件的写法参考了Sevin的Blog，示例也取自其Blog