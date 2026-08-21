---
title: Vuepress自动化部署的细节补充
createTime: 2026/08/21 23:33:34
permalink: /blog/ji-wen/vuepress-zi-dong-hua-bu-shu-de-xi-jie-bu-chong/
---

::: note
查看本文前请先阅读以下内容：
- [【Linux】云服务器自动化部署VuePress博客（Jenkins）](/article/w5w03ppj/)  
- [Vuepress自动化部署的一些优化方案](/blog/ji-wen/vuepress-zi-dong-hua-bu-shu-de-yi-xie-you-hua-fang-an/)
:::

<!-- more -->
## 前言

这两天在重新优化Blog主题的时候引入了很多新字体，带有中文字库的大体积字体，再推送到仓库后发现Jenkins拉取又有问题了。

在使用**SSH**链路时会直接爆和以前一样的超时：
``` bash
fetch-pack: unexpected disconnect while reading sideband packet
fatal: early EOF
fatal: unpack-objects failed
```

而使用**Https**链路时，受限于我的~~土豆~~服务器网络环境，大多数时候都会直接爆 `443 Connection timed out`，不对啊我记得前段时间好像给服务器上了代理来着，怎么可能还是连接超时呢？

在手动环境下 `curl` 确实能正常拉取且速度也正常，破案了，Jenkins好像没吃到代理。

::: info
Jenkins 是 systemd 启动的独立服务，它不会自动继承你登录 shell 的 `http_proxy/https_proxy`。clash 安装方案本身也依赖 shell 加载/环境注入来启用代理，所以 Jenkins 很可能完全没吃到。
:::

## 解决方向

先看当前 shell 到底用了什么代理，一般clash/mihomo 安装方案常见代理监听就是本机 127.0.0.1:7890。
``` bash
env | grep -i proxy
```

验证 Jenkins 用户手工带代理时能不能访问 GitHub
``` bash
sudo -u jenkins \
HTTPS_PROXY=http://127.0.0.1:7890 \
HTTP_PROXY=http://127.0.0.1:7890 \
curl -I https://github.com
```

如果能马上返回 `HTTP/2 200` 或重定向，就说明方向正确。

## 解决方案

``` bash
systemctl edit jenkins
```

写入以下内容：
``` bash
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="http_proxy=http://127.0.0.1:7890"
Environment="https_proxy=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1"
Environment="no_proxy=localhost,127.0.0.1"
```

保存退出后：
``` bash
systemctl daemon-reload
systemctl restart jenkins
```

确认 Jenkins 服务真的拿到了代理变量：
``` bash
systemctl show jenkins --property=Environment
```

输出类似：
``` bash
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
```

完成后再去启动一次Jenkins工作流，应该就可以正常工作了。

## 参考
本文适用于那些自有云服部署工作流，但是网络环境不好的，比如笔者所使用的京东云轻量云服务器。

所使用的代理服务：
<GitHubCard url="https://github.com/nelvko/clash-for-linux-install" />