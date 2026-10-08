---
title: Liteyuki-SnowLuma-部署排坑记录
createTime: 2026/10/08 23:48:49
permalink: /blog/xue-wen/liteyuki-snow-luma-bu-shu-pai-keng-ji-lu/
---
## 写在话前

九月份的时候用Codex大人为**Liteyuki v6**分支了一个LTS版本，Bot自用，在此记录一些玩**Nonebot/LiteyukiBot**时遇到的一些问题和解决方案。

<!-- more -->

<GitHubCard url="https://github.com/DavidBlackCN/LiteyukiBot-v6-LTS" />

## 背景

部署环境：

- 系统：Debian
- QQ 客户端：SnowLuma（Docker）

**问题：SnowLuma 无法连接 Liteyuki。**

## Docker容器

SnowLuma 运行在 Docker 容器中，最初配置：

```text
ws://127.0.0.1:20216/onebot/v11/ws
```

报错：

```bash
ECONNREFUSED 127.0.0.1:20216
```

原因很简单：

> Docker 容器中的 `127.0.0.1` 指向容器自身，而不是宿主机。

通过：

```bash
ip route
```

发现 SnowLuma 使用的 Docker Bridge：

```text
172.19.0.0/16
```

宿主机在该网络中的地址：

```text
172.19.0.1
```

再通过：

```bash
docker inspect snowluma \
  --format '{{range .NetworkSettings.Networks}}{{.IPAddress}} {{.Gateway}}{{end}}'
```

确认：

```bash
SnowLuma: 172.19.0.2
Gateway:  172.19.0.1
```

因此 SnowLuma 应改为：

```text
ws://172.19.0.1:20216/onebot/v11/ws
```

## Liteyuki配置

Liteyuki 原本配置：

```yaml
host: 127.0.0.1
port: 20216
```

这种情况下只有宿主机本机可以访问，Docker 容器访问宿主机 Bridge 地址时无法连接，因此改为：

```yaml
host: 0.0.0.0
port: 20216
```

确认：

```bash
ss -lntp | grep 20216
```

正常应看到：`0.0.0.0:20216`，而不是：`127.0.0.1:20216`。

## 1Panel iptables

SnowLuma 改成：`ws://172.19.0.1:20216/onebot/v11/ws` 后错误变为：

```bash
ETIMEDOUT 172.19.0.1:20216
```

在容器内测试：

```bash
curl -v --connect-timeout 3 http://172.19.0.1:20216/
```

同样超时。宿主机却已经确认 Liteyuki 正在：`0.0.0.0:20216` 监听。

进一步检查：

```bash
iptables -L INPUT -n -v --line-numbers
```

发现 1Panel 启用了 iptables 防火墙，并通过自定义链处理 INPUT 流量。

临时放行测试：

```bash
iptables -I INPUT 1 \
  -i br-33a940851703 \
  -s 172.19.0.0/16 \
  -p tcp --dport 20216 \
  -j ACCEPT
```

加入后立即恢复访问，说明问题确认是防火墙。故最终在 1Panel 中正式添加规则：

```text
IPv4
ALLOW
TCP
Source: 172.19.0.0/16
Destination Port: 20216
```

这样只允许 SnowLuma 所在 Docker 网段访问 Liteyuki，不需要将 `20216` 暴露到公网。