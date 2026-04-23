---
title: 记一次MC整合包服务端Debug
createTime: 2026/04/06 01:06:05
permalink: /blog/ji-wen/ji-yi-ci-mc-zheng-he-bao-fu-wu-duan-debug/
tags:
  - Debug
  - Minecraft
---
于2026年4月5日部署我新的整合包服务端架构，发现服务端无法正常进入，用了快一天排查问题（也是排查单个问题最久的一次），故记录此坐牢过程。

<!-- more -->

## 环境
基于我的一个整合包项目，正在进行服务端架构的测试  
使用**Velocity + Fabric Server(FabricProxy-Lite)**作为总架构：
- **Minecraft 1.21.11**
- **Fabric 0.18.6**
- **velocity-3.5.0-SNAPSHOT-585**

## 问题

1. Velocity和Fabric侧均能正常启动并连接，但是客户端无法进入服务端，显示"There is a problem with your connection to [server xxx]"
2. Velocity和Fabric服务端侧均没有错误日志，尝试为Velocity添加 `-Dvelocity.packet-decode-logging=true` 参数后再次尝试，得到以下错误日志：
``` log
[15:51:19] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Booting up Velocity 3.5.0-SNAPSHOT (git-ab99bde9-b585)...
[15:51:19] [main/INFO] [com.velocitypowered.proxy.network.ConnectionManager]: Connections will use NIO channels, Java compression, Java ciphers
[15:51:19] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loading localizations...
[15:51:19] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loading plugins...
[15:51:19] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loaded 1 plugins
[15:51:19] [Netty NIO Boss #0/INFO] [com.velocitypowered.proxy.network.ConnectionManager]: Listening on /[0:0:0:0:0:0:0:0]:25550
[15:51:19] [main/INFO] [com.velocitypowered.proxy.Velocity]: Done (0.55s)!
[15:51:24] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.client.AuthSessionHandler]: [connected player] David_Black_ (/xxx.xxx.x.xx:16326) has connected
[15:51:24] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.MinecraftConnection]: [server connection] David_Black_ -> lobby has connected
[15:51:24] [Netty NIO Worker #1/ERROR] [com.velocitypowered.proxy.connection.MinecraftConnection]: [server connection] David_Black_ -> lobby: exception encountered in com.velocitypowered.proxy.connection.backend.ConfigSessionHandler@3c7c37a0
io.netty.handler.codec.CorruptedFrameException: Packet sent for class com.velocitypowered.proxy.protocol.packet.PluginMessagePacket was too big (expected 229378 bytes, got 273205 bytes)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.handleOverflow(MinecraftDecoder.java:115)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.doLengthSanityChecks(MinecraftDecoder.java:106)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.tryDecode(MinecraftDecoder.java:84)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.channelRead(MinecraftDecoder.java:60)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.handler.codec.MessageToMessageDecoder.channelRead(MessageToMessageDecoder.java:107)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.handler.timeout.IdleStateHandler.channelRead(IdleStateHandler.java:288)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:355)
	at io.netty.handler.codec.ByteToMessageDecoder.fireChannelRead(ByteToMessageDecoder.java:361)
	at io.netty.handler.codec.ByteToMessageDecoder.channelRead(ByteToMessageDecoder.java:325)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.channel.DefaultChannelPipeline$HeadContext.channelRead(DefaultChannelPipeline.java:1429)
	at io.netty.channel.DefaultChannelPipeline.fireChannelRead(DefaultChannelPipeline.java:918)
	at io.netty.channel.nio.AbstractNioByteChannel$NioByteUnsafe.read(AbstractNioByteChannel.java:176)
	at io.netty.channel.nio.AbstractNioChannel$AbstractNioUnsafe.handle(AbstractNioChannel.java:445)
	at io.netty.channel.nio.NioIoHandler$DefaultNioRegistration.handle(NioIoHandler.java:388)
	at io.netty.channel.nio.NioIoHandler.processSelectedKey(NioIoHandler.java:596)
	at io.netty.channel.nio.NioIoHandler.processSelectedKeysOptimized(NioIoHandler.java:571)
	at io.netty.channel.nio.NioIoHandler.processSelectedKeys(NioIoHandler.java:512)
	at io.netty.channel.nio.NioIoHandler.run(NioIoHandler.java:484)
	at io.netty.channel.SingleThreadIoEventLoop.runIo(SingleThreadIoEventLoop.java:225)
	at io.netty.channel.SingleThreadIoEventLoop.run(SingleThreadIoEventLoop.java:196)
	at io.netty.util.concurrent.SingleThreadEventExecutor$5.run(SingleThreadEventExecutor.java:1195)
	at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
	at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)
	at java.base/java.lang.Thread.run(Thread.java:1583)
[15:51:24] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.MinecraftConnection]: [server connection] David_Black_ -> lobby has disconnected
[15:51:24] [Netty NIO Worker #1/ERROR] [com.velocitypowered.proxy.connection.client.ConnectedPlayer]: [connected player] David_Black_ (/119.145.6.54:16326): unable to connect to server lobby
java.io.IOException: Unexpectedly disconnected from remote server
	at com.velocitypowered.proxy.connection.backend.ConfigSessionHandler.disconnected(ConfigSessionHandler.java:380)
	at com.velocitypowered.proxy.connection.MinecraftConnection.channelInactive(MinecraftConnection.java:128)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelInactive(AbstractChannelHandlerContext.java:251)
	at io.netty.channel.ChannelInboundHandlerAdapter.channelInactive(ChannelInboundHandlerAdapter.java:81)
	at com.velocitypowered.proxy.protocol.netty.PlayPacketQueueOutboundHandler.channelInactive(PlayPacketQueueOutboundHandler.java:79)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelInactive(AbstractChannelHandlerContext.java:251)
	at io.netty.channel.ChannelInboundHandlerAdapter.channelInactive(ChannelInboundHandlerAdapter.java:81)
	at com.velocitypowered.proxy.protocol.netty.PlayPacketQueueInboundHandler.channelInactive(PlayPacketQueueInboundHandler.java:97)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelInactive(AbstractChannelHandlerContext.java:251)
	at io.netty.channel.ChannelInboundHandlerAdapter.channelInactive(ChannelInboundHandlerAdapter.java:81)
	at io.netty.handler.timeout.IdleStateHandler.channelInactive(IdleStateHandler.java:279)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelInactive(AbstractChannelHandlerContext.java:251)
	at io.netty.handler.codec.ByteToMessageDecoder.channelInputClosed(ByteToMessageDecoder.java:427)
	at io.netty.handler.codec.ByteToMessageDecoder.channelInactive(ByteToMessageDecoder.java:392)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelInactive(AbstractChannelHandlerContext.java:251)
	at io.netty.channel.DefaultChannelPipeline$HeadContext.channelInactive(DefaultChannelPipeline.java:1424)
	at io.netty.channel.DefaultChannelPipeline.fireChannelInactive(DefaultChannelPipeline.java:876)
	at io.netty.channel.AbstractChannel$AbstractUnsafe$6.run(AbstractChannel.java:676)
	at io.netty.util.concurrent.AbstractEventExecutor.runTask(AbstractEventExecutor.java:148)
	at io.netty.util.concurrent.AbstractEventExecutor.safeExecute(AbstractEventExecutor.java:141)
	at io.netty.util.concurrent.SingleThreadEventExecutor.runAllTasks(SingleThreadEventExecutor.java:535)
	at io.netty.channel.SingleThreadIoEventLoop.run(SingleThreadIoEventLoop.java:201)
	at io.netty.util.concurrent.SingleThreadEventExecutor$5.run(SingleThreadEventExecutor.java:1195)
	at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
	at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)
	at java.base/java.lang.Thread.run(Thread.java:1583)
[15:51:24] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.client.ConnectedPlayer]: [connected player] David_Black_ (/xxx.xxx.x.xx:16326) has disconnected: 无法将您连接至 lobby，请稍后再试。
```

3. 查询Velocity的Github仓库，找到[issue](https://github.com/PaperMC/Velocity/issues/1515)中也有类似的问题和解决方案，即添加类似 `-Dvelocity.max-plugin-message-payload-size=1048576` 参数可解决此问题，但是尝试后问题依旧，不过报错发生了改变：
``` log
[15:43:02] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Booting up Velocity 3.5.0-SNAPSHOT (git-ab99bde9-b585)...
[15:43:02] [main/INFO] [com.velocitypowered.proxy.network.ConnectionManager]: Connections will use NIO channels, Java compression, Java ciphers
[15:43:02] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loading localizations...
[15:43:02] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loading plugins...
[15:43:02] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loaded 1 plugins
[15:43:02] [Netty NIO Boss #0/INFO] [com.velocitypowered.proxy.network.ConnectionManager]: Listening on /[0:0:0:0:0:0:0:0]:25550
[15:43:02] [main/INFO] [com.velocitypowered.proxy.Velocity]: Done (0.5s)!
[15:44:59] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.client.AuthSessionHandler]: [connected player] David_Black_ (/xxx.xxx.x.xx:14179) has connected
[15:44:59] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.MinecraftConnection]: [server connection] David_Black_ -> lobby has connected
[15:45:00] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.client.ConnectedPlayer]: [connected player] David_Black_ (/xxx.xxx.x.xx:14179) has disconnected: 您的连接发生内部错误。
[15:45:00] [Netty NIO Worker #1/ERROR] [com.velocitypowered.proxy.connection.MinecraftConnection]: [connected player] David_Black_ (/xxx.xxx.x.xx:14179): exception encountered in com.velocitypowered.proxy.connection.client.ClientConfigSessionHandler@7fe5b88e
io.netty.handler.codec.CorruptedFrameException: Error decoding class com.velocitypowered.proxy.protocol.packet.config.KnownPacksPacket Direction SERVERBOUND Protocol 1.21.11 State CONFIG ID 0x7
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.handleDecodeFailure(MinecraftDecoder.java:134)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.tryDecode(MinecraftDecoder.java:89)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.channelRead(MinecraftDecoder.java:60)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.handler.codec.MessageToMessageDecoder.channelRead(MessageToMessageDecoder.java:107)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.handler.timeout.IdleStateHandler.channelRead(IdleStateHandler.java:288)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:355)
	at io.netty.handler.codec.ByteToMessageDecoder.fireChannelRead(ByteToMessageDecoder.java:361)
	at io.netty.handler.codec.ByteToMessageDecoder.channelRead(ByteToMessageDecoder.java:325)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.handler.codec.MessageToMessageDecoder.channelRead(MessageToMessageDecoder.java:107)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.channel.DefaultChannelPipeline$HeadContext.channelRead(DefaultChannelPipeline.java:1429)
	at io.netty.channel.DefaultChannelPipeline.fireChannelRead(DefaultChannelPipeline.java:918)
	at io.netty.channel.nio.AbstractNioByteChannel$NioByteUnsafe.read(AbstractNioByteChannel.java:176)
	at io.netty.channel.nio.AbstractNioChannel$AbstractNioUnsafe.handle(AbstractNioChannel.java:445)
	at io.netty.channel.nio.NioIoHandler$DefaultNioRegistration.handle(NioIoHandler.java:388)
	at io.netty.channel.nio.NioIoHandler.processSelectedKey(NioIoHandler.java:596)
	at io.netty.channel.nio.NioIoHandler.processSelectedKeysOptimized(NioIoHandler.java:571)
	at io.netty.channel.nio.NioIoHandler.processSelectedKeys(NioIoHandler.java:512)
	at io.netty.channel.nio.NioIoHandler.run(NioIoHandler.java:484)
	at io.netty.channel.SingleThreadIoEventLoop.runIo(SingleThreadIoEventLoop.java:225)
	at io.netty.channel.SingleThreadIoEventLoop.run(SingleThreadIoEventLoop.java:196)
	at io.netty.util.concurrent.SingleThreadEventExecutor$5.run(SingleThreadEventExecutor.java:1195)
	at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
	at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)
	at java.base/java.lang.Thread.run(Thread.java:1583)
Caused by: com.velocitypowered.proxy.util.except.QuietDecoderException: too many known packs
[15:45:00] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.MinecraftConnection]: [server connection] David_Black_ -> lobby has disconnected
```

## 来自Claude的分析（仅供参考）
- **错误一：插件消息包过大**
```
CorruptedFrameException: Packet sent for PluginMessagePacket was too big
(expected 229378 bytes, got 273205 bytes)
```
原因：Fabric 服务端通过 FabricProxy-Lite 发送的插件消息包超过了 Velocity 默认限制。

- **错误二：KnownPacks 数量过多**
```
Caused by: QuietDecoderException: too many known packs
Error decoding KnownPacksPacket Direction SERVERBOUND Protocol 1.21.11 State CONFIG ID 0x7
```
新问题暴露：客户端发送的 KnownPacks 数量超过了 Velocity 的硬编码上限。  
这是因为你安装了大量数据包/资源包相关的 Fabric Mod（如 Polymer、数据驱动内容等），导致 Known Packs 列表膨胀。

## 再次尝试
依照Claude给出的方案，在启动参数中添加 `-Dvelocity.max-known-packs=1024`，然而问题依旧：
``` log
[15:55:45] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Booting up Velocity 3.5.0-SNAPSHOT (git-99bd0309-b583)...
[15:55:45] [main/INFO] [com.velocitypowered.proxy.network.ConnectionManager]: Connections will use NIO channels, Java compression, Java ciphers
[15:55:45] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loading localizations...
[15:55:45] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loading plugins...
[15:55:45] [main/INFO] [com.velocitypowered.proxy.VelocityServer]: Loaded 1 plugins
[15:55:45] [Netty NIO Boss #0/INFO] [com.velocitypowered.proxy.network.ConnectionManager]: Listening on /[0:0:0:0:0:0:0:0]:25550
[15:55:45] [main/INFO] [com.velocitypowered.proxy.Velocity]: Done (0.49s)!
[15:55:58] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.client.AuthSessionHandler]: [connected player] David_Black_ (/119.145.6.54:14615) has connected
[15:55:58] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.MinecraftConnection]: [server connection] David_Black_ -> lobby has connected
[15:55:59] [Netty NIO Worker #1/ERROR] [com.velocitypowered.proxy.connection.MinecraftConnection]: [server connection] David_Black_ -> lobby: exception encountered in com.velocitypowered.proxy.connection.backend.BackendPlaySessionHandler@33f8fa3f
io.netty.handler.codec.CorruptedFrameException: Error decoding class com.velocitypowered.proxy.protocol.packet.AvailableCommandsPacket Direction CLIENTBOUND Protocol 1.21.11 State PLAY ID 0x10
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.handleDecodeFailure(MinecraftDecoder.java:134)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.tryDecode(MinecraftDecoder.java:89)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.channelRead(MinecraftDecoder.java:60)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.handler.codec.MessageToMessageDecoder.channelRead(MessageToMessageDecoder.java:107)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.handler.timeout.IdleStateHandler.channelRead(IdleStateHandler.java:288)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:355)
	at io.netty.handler.codec.ByteToMessageDecoder.fireChannelRead(ByteToMessageDecoder.java:361)
	at io.netty.handler.codec.ByteToMessageDecoder.fireChannelRead(ByteToMessageDecoder.java:348)
	at io.netty.handler.codec.ByteToMessageDecoder.callDecode(ByteToMessageDecoder.java:470)
	at io.netty.handler.codec.ByteToMessageDecoder.channelRead(ByteToMessageDecoder.java:296)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.channel.DefaultChannelPipeline$HeadContext.channelRead(DefaultChannelPipeline.java:1429)
	at io.netty.channel.DefaultChannelPipeline.fireChannelRead(DefaultChannelPipeline.java:918)
	at io.netty.channel.nio.AbstractNioByteChannel$NioByteUnsafe.read(AbstractNioByteChannel.java:176)
	at io.netty.channel.nio.AbstractNioChannel$AbstractNioUnsafe.handle(AbstractNioChannel.java:445)
	at io.netty.channel.nio.NioIoHandler$DefaultNioRegistration.handle(NioIoHandler.java:388)
	at io.netty.channel.nio.NioIoHandler.processSelectedKey(NioIoHandler.java:596)
	at io.netty.channel.nio.NioIoHandler.processSelectedKeysOptimized(NioIoHandler.java:571)
	at io.netty.channel.nio.NioIoHandler.processSelectedKeys(NioIoHandler.java:512)
	at io.netty.channel.nio.NioIoHandler.run(NioIoHandler.java:484)
	at io.netty.channel.SingleThreadIoEventLoop.runIo(SingleThreadIoEventLoop.java:225)
	at io.netty.channel.SingleThreadIoEventLoop.run(SingleThreadIoEventLoop.java:196)
	at io.netty.util.concurrent.SingleThreadEventExecutor$5.run(SingleThreadEventExecutor.java:1195)
	at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
	at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)
	at java.base/java.lang.Thread.run(Thread.java:1583)
Caused by: java.lang.IllegalArgumentException: Argument type identifier 57 unknown.
	at com.velocitypowered.proxy.protocol.packet.brigadier.ArgumentPropertyRegistry.readIdentifier(ArgumentPropertyRegistry.java:167)
	at com.velocitypowered.proxy.protocol.packet.brigadier.ArgumentPropertyRegistry.deserialize(ArgumentPropertyRegistry.java:89)
	at com.velocitypowered.proxy.protocol.packet.AvailableCommandsPacket.deserializeNode(AvailableCommandsPacket.java:215)
	at com.velocitypowered.proxy.protocol.packet.AvailableCommandsPacket.decode(AvailableCommandsPacket.java:90)
	at com.velocitypowered.proxy.protocol.netty.MinecraftDecoder.tryDecode(MinecraftDecoder.java:87)
	... 26 more
[15:55:59] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.client.ConnectedPlayer]: [connected player] David_Black_ (/119.145.6.54:14615) has disconnected: 您与 lobby 的连接出现问题。
[15:55:59] [Netty NIO Worker #1/INFO] [com.velocitypowered.proxy.connection.MinecraftConnection]: [server connection] David_Black_ -> lobby has disconnected
```

::: tip Claude的分析
- **新错误分析：AvailableCommandsPacket 解码失败**
``` log
Caused by: java.lang.IllegalArgumentException: Argument type identifier 57 unknown.
    at ArgumentPropertyRegistry.readIdentifier(ArgumentPropertyRegistry.java:167)
```
这是一个 Velocity 与 Minecraft 1.21.x 的协议兼容性 Bug。

你的 Fabric 服务端上某个 Mod 注册了自定义 Brigadier 参数类型（Argument Type ID = 57），而当前版本的 Velocity 在解析 AvailableCommandsPacket 时遇到未知的参数类型 ID 就直接抛出异常，导致连接中断。

- **问题根源**  
Velocity 作为代理，需要解析并转发服务端发来的命令树数据包。当 Fabric Mod 通过 Brigadier 注册了自定义参数类型时：
``` txt
Fabric Mod 注册自定义 ArgumentType
        ↓
服务端发送 AvailableCommandsPacket（含 ID=57 的未知参数类型）
        ↓
Velocity 尝试解析 → 找不到 ID=57 → 抛出异常 → 断开连接
```
:::

## 排查Mod
鉴于没有其他有效的信息，Claude建议我尝试寻找并优先禁用注册**自定义 Brigadier 参数类型**的 Mod，但当我尝试禁用了部分可能的Mod后，问题依然存在，最后开始尝试二分法排查。

后续发现二分法仍然无法准确定位错误Mod，怀疑出现问题的Mod可能不止一个，我需要一个能快速直接定位注册了**自定义 Brigadier 参数类型**的Mod方案，询问Claude后得到一个用**powershell**扫描所有jar的方法：
``` powershell
$tempBase = "$env:TEMP\brigadier_scan"
New-Item -ItemType Directory -Force -Path $tempBase | Out-Null

Get-ChildItem -Filter "*.jar" | ForEach-Object {
    $modName = $_.Name
    $extractPath = "$tempBase\$($_.BaseName)"
    
    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($_.FullName, $extractPath)
        
        # 搜索包含 ArgumentType 注册的 class 文件（通过字符串匹配）
        $hits = Get-ChildItem -Path $extractPath -Recurse -Filter "*.class" | ForEach-Object {
            $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
            $text = [System.Text.Encoding]::UTF8.GetString($bytes)
            if ($text -match "ArgumentType|brigadier.*argument|LiteralArgumentBuilder") {
                $_.Name
            }
        }
        
        if ($hits) {
            Write-Host "=== $modName ===" -ForegroundColor Red
            $hits | Select-Object -Unique | ForEach-Object { Write-Host "  $_" }
        }
    } catch {}
    
    Remove-Item -Path $extractPath -Recurse -Force -ErrorAction SilentlyContinue
}
```

## 重大突破

运行上述脚本后，可疑的Mod列表从上百个缩减至十几个，对剩下的十几个Mod进行二分法排查后，最终锁定两个Mod为元凶。
- [Glitchfiend/SereneSeasons](https://github.com/Glitchfiend/SereneSeasons)
- [PneumonoIsNotAvailable/Gravestones](https://github.com/PneumonoIsNotAvailable/Gravestones)

~~我已经在最小环境下分别复现了两个Mod带来的问题，并提交了issue：~~

## 解决方案

由于是Mod使用了自定义参数类型导致的问题，故可在服务端安装 [CrossStitch](https://github.com/PaperMC/CrossStitch) 以允许使用自定义参数类型。

> Previously, this would have not been possible, or we would have had to write an argument serializer to cover every mod ever, which is not sustainable. CrossStitch implements a generic approach that will work with every mod and in theory every proxy as well.

不过截至本文更新时，该Mod最高仅支持**MC 1.21.8**版本，但好在移植更高版本并未涉及过多修改，故已将其Fork到我使用的**MC 1.21.11**版本，当在服务端安装**CrossStitch**后，玩家即可正常进入子服。
<GitHubCard url="https://github.com/PaperMC/CrossStitch" />
<GitHubCard url="https://github.com/DavidBlackCN/CrossStitch" />
