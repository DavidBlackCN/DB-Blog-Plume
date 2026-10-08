---
title: NoneBot-ORM迁移笔记
createTime: 2026/10/08 23:21:24
permalink: /blog/xue-wen/none-bot-orm-qian-yi-bi-ji/
---
## 写在话前

九月份的时候用Codex大人为**Liteyuki v6**分支了一个LTS版本，Bot自用，在此记录一些玩**Nonebot/LiteyukiBot**时遇到的一些问题和解决方案。

<!-- more -->

<GitHubCard url="https://github.com/DavidBlackCN/LiteyukiBot-v6-LTS" />

## 背景

在 LiteyukiBot v6-LTS 中安装以下 NoneBot2 插件后：

- `nonebot-plugin-parser`
- `nonebot-plugin-memes`
- `nonebot-plugin-wordcloud`

Bot 重启时出现 ORM 数据库迁移相关报错：

```bash
目标数据库未更新到最新迁移, 是否更新? [y/N]:
click.exceptions.UsageError:
目标数据库未更新到最新迁移. 请通过 `nb orm upgrade` 升级数据库后重试.
```

其中主要涉及：

```text
nonebot-plugin-wordcloud
└── nonebot_plugin_chatrecorder
    └── nonebot-plugin-orm
```

`wordcloud` / `chatrecorder` 会引入新的 ORM migration，因此安装后需要升级数据库。

## nb-cli 与 Liteyuki 项目配置问题

Liteyuki v6-LTS 原本的 `pyproject.toml` 仅用于 Liteyuki 框架自身，并没有标准 NoneBot CLI 所需的：

```toml
[tool.nonebot]
```

因此直接执行：

```bash
nb orm heads
nb orm current
nb orm upgrade
```

会报：

```bash
ValueError: Cannot find '[tool.nonebot]' in given toml file!
```

### 解决方式

为 `pyproject.toml` 增加 NoneBot CLI 所需的插件配置，使 `nb orm` 能正确加载 ORM 及相关插件：

```toml
[tool.nonebot]
plugins = [
    "nonebot_plugin_orm",
    "nonebot_plugin_chatrecorder",
    "nonebot_plugin_wordcloud",
    "nonebot_plugin_memes",
    "src.liteyuki_main",
]
plugin_dirs = []
```

> 注意：ORM、chatrecorder、wordcloud 必须通过 NoneBot 插件系统正常加载，否则 migration 可能无法完整发现。

## 历史迁移依赖

执行：

```bash
nb orm upgrade
```

时曾出现：

```bash
ModuleNotFoundError: No module named 'nonebot_plugin_datastore'
```

原因是 `nonebot-plugin-wordcloud` / `chatrecorder` 的历史 migration 中包含从旧 `datastore` 体系迁移数据的逻辑。

### 临时安装

```bash
python -m pip install nonebot-plugin-datastore
```

必要时临时加入：

```toml
"nonebot_plugin_datastore",
```

到 `[tool.nonebot].plugins`。

完成数据库迁移后，该插件可以卸载，不建议作为 LTS 长期依赖保留：

```bash
python -m pip uninstall nonebot-plugin-datastore
```

如果后续历史 migration 提示缺少：

```text
nonebot-session-to-uninfo
```

同样只需临时安装完成迁移：

```bash
python -m pip install nonebot-session-to-uninfo
```

## 固定 ORM 数据库路径

本次问题的核心之一是：

> `nb orm upgrade` 与 systemd 正常启动时可能使用了不同的 ORM 数据库。

手动执行 migration 时使用了：

```bash
export SQLALCHEMY_DATABASE_URL="sqlite+aiosqlite:////opt/bot/LiteyukiBot-v6-LTS/data/nonebot_orm.db"
```

因此 CLI 实际升级的是：

```bash
/opt/bot/LiteyukiBot-v6-LTS/data/nonebot_orm.db
```

但通过 MCSM → systemd 启动时，如果没有相同环境变量，`nonebot-plugin-orm` 可能通过 LocalStore 使用另一套默认数据库。

结果就是：

```text
nb orm upgrade
→ 显示迁移成功

正常启动 Bot
→ 仍然提示“目标数据库未更新到最新迁移”
```

### 最终解决方案

将 ORM 数据库路径直接固化到 `/etc/systemd/system/liteyuki-lts.service` 的 `[Service]` 中：

```ini
Environment="SQLALCHEMY_DATABASE_URL=sqlite+aiosqlite:////opt/bot/LiteyukiBot-v6-LTS/data/nonebot_orm.db"
```

修改后执行：

```bash
systemctl daemon-reload
systemctl restart liteyuki-lts.service
```

验证：

```bash
systemctl show liteyuki-lts.service -p Environment
```

应能看到：

```bash
SQLALCHEMY_DATABASE_URL=sqlite+aiosqlite:////opt/bot/LiteyukiBot-v6-LTS/data/nonebot_orm.db
```

## 推荐的 ORM migration 标准流程

以后新增包含 ORM migration 的 NoneBot 插件时，建议统一按以下流程处理。

1. 进入 venv

```bash
cd /opt/bot/LiteyukiBot-v6-LTS
source venv/bin/activate
```

2. 明确 ORM 数据库

```bash
export SQLALCHEMY_DATABASE_URL="sqlite+aiosqlite:////opt/bot/LiteyukiBot-v6-LTS/data/nonebot_orm.db"
```

即使 systemd 中已经配置，也建议 CLI 操作时显式指定，避免当前 shell 环境不一致。

3. 检查 migration

```bash
nb orm heads
nb orm current
```

4. 执行迁移

```bash
nb orm upgrade
```

5. 再次确认

```bash
nb orm current
nb orm heads
```

`current` 应已经位于最新 migration head。

6. 重启 Bot