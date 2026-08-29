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
![](/assets/blog/2026/claude-code-vscode/claude-code-editor-view.webp)

第一次打开插件，会提示登录以使用官方服务，如果开通了官方服务可以直接去登录，或者你也可以参照以下方法使用**第三方中转站**的API

## 自定义API配置
此处我们使用**CC-Switch**进行多API的切换，比如说同时存在==DeepSeek API==和==自有第三方API==的情况下。

**CC-Switch**：Claude Code / Codex / Gemini CLI 全方位辅助工具，支持==统一管理供应商配置、MCP服务器、Skills 扩展和系统提示词==。

✅ 一键切换 API 配置 - 在多个 API 提供商之间快速切换  
✅ 可视化配置管理 - 通过图形界面轻松管理所有配置  
✅ 内置 PackyAPI 模板 - 预设了 PackyAPI 的配置模板  
✅ MCP 服务器管理 - 管理 Model Context Protocol 服务器  
✅ 系统托盘快捷操作 - 通过托盘菜单快速切换  

<GitHubCard url=https://github.com/farion1231/cc-switch />

### 配置指南
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

3. 打开**CC-Switch**，在最上方选择 `Claude`，然后点击右上角加号 `添加新供应商`

    ![](/assets/blog/2026/claude-code-vscode/cc-switch-add-provider.webp)

4. 填写 `供应商名称`，`API Key`，`请求地址`，`模型预设`等内容，以下为接入**DeepSeek V4**的填写示例：

    - **供应商名称**：`DeepSeek`
    - **官网链接**：`https://platform.deepseek.com`
    - **API Key**：`your-api-key`
    - **请求地址**：`https://api.deepseek.com/anthropic`
    - **API格式**：`Anthropic Messages (原生)`
    - **认证字段**：`默认`
    - **模型预设**：Haiku默认模型可以填 `deepseek-v4-flash`，其余均填 `deepseek-v4-pro[1m]`
    - **最大强度思考**：可选是否开启

5. 保存配置后启用，回到**VSCode**中打开**Claude Code终端**即可正常使用

    ![](/assets/blog/2026/claude-code-vscode/cc-switch-provider-settings.webp)

### 参考
<LinkCard icon="meteor-icons:link" title="CC-Switch 使用教程" href="https://deeprouter.apifox.cn/8174851m0" />

## 自定义API配置(旧)
:::: details 点此展开

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
    ![](/assets/blog/2026/claude-code-vscode/claude-code-settings-json.webp)

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

### 其他配置
此外**Claude Code**插件设置中还支持切换其他第三方模型，启用绕过权限模式，这样**Claude Code**的自动执行操作就不会再弹窗让你确认

- `Claude Code: Allow Dangerously Skip Permissions` -> `true`
- `Claude Code: Selected Model` -> `your-model-name`

### 参考
<LinkCard icon="meteor-icons:link" title="Claude Code for VS Code 插件配置" href="https://deeprouter.apifox.cn/7493888m0" />

:::