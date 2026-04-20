---
title: Claude Code for VS Code 插件配置
createTime: 2026/03/13 16:37:29
permalink: /blog/xue-wen/claude-code-for-vs-code-cha-jian-pei-zhi/
---
>Claude Code 在 2.0 的更新后，也推出了VS Code扩展版本。相比较于 CLI 的体验，扩展版本提供了可视化的 GUI 面板，对不喜欢使用终端的同学会更友好。

<!-- more -->

## VSCode插件
<LinkCard icon="meteor-icons:link" title="Claude Code for VS Code" href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code" />

## 首次使用
安装后在编辑器即可打开**Claude Code**对话面板  
相比较于例如 **Cursor/Codex/Copilot** 等 AI 工具选择用侧边栏作为聊天区域，**Claude Code VSC**采用的是编辑区视图，这点相比较于其他常见的 AI 面板，可视区域会更大，内容也会更多。
![](/assets/202603/13-1.png)

第一次打开插件，会提示登录以使用官方服务，如果开通了官方服务可以直接去登录，或者你也可以参照以下方法使用**第三方中转站**的API

## 自定义API配置
::: steps
1. 创建 `config.json` 文件，具体路径参考：
    - Mac：`~/.claude/config.json`
    - Windows：`C:\Users\%USERPROFILE%\.claude\config.json`  

2. 文件创建后，写入以下内容直接保存即可：
    ```json
    {
        "primaryApiKey":"self"
    }
    ```

3. 回到**VS Code**并打开**Claude Code**插件设置，然后==跳转到 JSON 配置文件的编辑页面==
    ![](/assets/202603/13-2.png)

    - `Claude Code: Disable Login Prompt` -> `true`
    - `Claude Code: Environment Variables` -> `在 settings.json 中编辑`

4. 将**API配置信息**添加到环境变量配置文件中，其中 `ANTHROPIC_BASE_URL` 的值填写为你使用的中转站BaseURL，  `ANTHROPIC_AUTH_TOKEN` 的值填写为你的API令牌
    ```json
    "claude-code.environmentVariables": [
        {
            "name": "ANTHROPIC_AUTH_TOKEN",
            "value": "在这里填入 SK 密钥"
        },
        {
            "name": "ANTHROPIC_BASE_URL",
            "value": "在这里填入你的 BaseURL"
        }
    ],
    ```

5. 修改完成后，再次打开**Claude Code**插件，就可以正常开始使用了
:::

## 其他配置
此外**Claude Code**插件设置中还支持切换其他第三方模型，启用绕过权限模式，这样**Claude Code**的自动执行操作就不会再弹窗让你确认

- `Claude Code: Allow Dangerously Skip Permissions` -> `true`
- `Claude Code: Selected Model` -> `your-model-name`

## 参考
<LinkCard icon="meteor-icons:link" title="Claude Code for VS Code 插件配置" href="https://deeprouter.apifox.cn/7493888m0" />