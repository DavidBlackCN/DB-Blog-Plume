---
title: Liteyuki-MCSM-部署排坑记录
createTime: 2026/10/08 23:39:12
permalink: /blog/xue-wen/liteyuki-mcsm-bu-shu-pai-keng-ji-lu/
---
## 写在话前

九月份的时候用Codex大人为**Liteyuki v6**分支了一个LTS版本，Bot自用，在此记录一些玩**Nonebot/LiteyukiBot**时遇到的一些问题和解决方案。

<!-- more -->

<GitHubCard url="https://github.com/DavidBlackCN/LiteyukiBot-v6-LTS" />

## 背景

部署环境：

- 系统：Debian
- 管理面板：MCSM
- Liteyuki 内部会使用：
  - Python `multiprocessing`
  - NoneBot 子进程
  - Playwright / Chromium

最初希望直接把 Liteyuki 当作普通控制台程序挂在 MCSM 上，由 MCSM 使用 `^c` 停止实例。

实际却遇到一个问题：**Liteyuki 停止后仍有 Python / Playwright 子进程残留，导致再次启动时报端口被占用。**

## Address already in use

Liteyuki 改为：

```yaml
host: 0.0.0.0
port: 20216
```

后曾出现：

```bash
[Errno 98] error while attempting to bind on address ('0.0.0.0', 20216):
address already in use
```

检查：

```bash
ss -lntp | grep 20216
```

发现旧 Python 进程仍监听：`127.0.0.1:20216`

虽然新进程想监听 `0.0.0.0:20216`，但：

> `0.0.0.0` 表示监听所有 IPv4 地址，其中也包含 `127.0.0.1`。

因此两者不能共存，问题本质不是端口被其他软件占用，而是：

::: warning
Liteyuki 上一次退出时，子进程没有被完整回收。
:::

## 多进程程序

通过：

```bash
ps -eo pid,ppid,pgid,sid,cmd | \
grep '/opt/bot/LiteyukiBot-v6-LTS' | \
grep -v grep
```

观察到类似：

```bash
python main.py
python -c from multiprocessing.resource_tracker ...
python -c from multiprocessing.spawn ...
playwright/driver/node ...
```

并且曾出现：`PPID = 1` 的残留进程，这意味着主进程已经退出，但子进程被系统的 PID 1 接管，继续存活。

典型残留包括：

- `multiprocessing.resource_tracker`
- `multiprocessing.spawn`
- NoneBot 子进程
- Playwright Node driver
- Chromium

这正是 Liteyuki 再次启动时端口仍被占用的原因。

## 为什么`^c`不可靠

最初 MCSM 关闭命令为：

```text
^c
```

MCSM 显示：

```bash
已执行预设的关闭命令：
^c

实例已停止。
```

但实际仍有 Liteyuki 子进程残留，说明：

> “MCSM 认为实例已停止” 不等于 “Liteyuki 整个进程树已经退出”。

随后尝试过：

- shell wrapper
- `setsid`
- 独立 Process Group
- `kill -TERM -PGID`
- `SIGKILL` 兜底
- wrapper 监听 `stop`

但实践中发现 MCSM 的停止行为、PTY、stdin 传递与 wrapper 之间并不可靠。例如使用 `stop` 时，文本并没有稳定交给 wrapper，导致停止过程一直卡住。因此继续依赖 MCSM 自己管理 Liteyuki 多进程生命周期并不合适。

## 最终解决方案

::: tip
systemd 管生命周期，MCSM 只做控制台入口
:::

最终采用：

```text
MCSM
   ↓
控制 systemd service

systemd
   ↓
管理整个 Liteyuki cgroup
```

systemd Service 示例：

```ini
[Unit]
Description=LiteyukiBot v6 LTS
After=network.target

[Service]
Type=simple

User=root
WorkingDirectory=/opt/bot/LiteyukiBot-v6-LTS

ExecStart=/opt/bot/LiteyukiBot-v6-LTS/venv/bin/python main.py

KillMode=control-group
KillSignal=SIGTERM
TimeoutStopSec=10
SendSIGKILL=yes

Restart=no

[Install]
WantedBy=multi-user.target
```

其中最关键的是：

```ini
KillMode=control-group
```

它的意义是：

> 停止 service 时，不只结束主进程，而是清理该 service cgroup 下的全部进程。

因此即使：

- `main.py` 已退出；
- `multiprocessing` 子进程变成孤儿；
- Playwright 又拉起 Node；
- Chromium 仍存活；

只要它们还属于：`liteyuki-lts.service` 的 cgroup，就会一起被 systemd 回收。

## 最终架构

```text
SnowLuma Docker
172.19.0.2
      │
      │ WebSocket
      ▼
172.19.0.1:20216
      │
      ▼
Liteyuki / NoneBot
0.0.0.0:20216
      │
      ▼
systemd
liteyuki-lts.service
      │
      ├─ main.py
      ├─ multiprocessing
      ├─ NoneBot
      ├─ Playwright
      └─ Chromium

MCSM
  │
  ├─ 启动 / 停止 systemd service
  └─ 展示日志 / 提供管理界面
```