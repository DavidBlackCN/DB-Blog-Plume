---
title: MSPM0-VSCode环境配置
createTime: 2026/08/30 17:13:07
permalink: /notes/qian-ru-shi-kai-fa/mspm-0-vs-code-huan-jing-pei-zhi/
---

::: info
本指南使用EIDE项目工程模板进行搭建，仅使用VSCode，无需CCS即可完成项目创建到调试到编译到烧录一条龙服务。
:::

## 准备工具
### VSCode插件
- **C/C++**
- **Cortex-Debug**
- **Embedded IDE**

### 工具链
- [GNU Arm Embedded Toolchain](https://developer.arm.com/downloads/-/gnu-rm)
- [【如果使用Jlink】驱动](https://www.segger.com/downloads/jlink/)
- [【如果使用Daplink】OpenOCD](https://gnutoolchains.com/arm-eabi/openocd/)

### 工程模板
- [EIDE项目工程模板](https://templates.em-ide.com/?category=MCU%2FTI%2FMSPM0)

## 创建教程
1. EIDE选择 `新建项目`，选择 `本地项目模板`

![](/assets/docs/mspm-0-vs-code-huan-jing-pei-zhi/mspm0-image1.png)

2. 项目模板选择刚才下好的EIDE项目工程模板

3. 命名项目，选择目录后完成创建

## EIDE插件配置

1. `EIDE.ARM.GCC: Install Directory` 指向GNU Arm Embedded Toolchain的安装路径（指到bin的前一个目录），示例：`C:\Program Files (x86)\GNU Arm Embedded Toolchain\10 2021.10`

![](/assets/docs/mspm-0-vs-code-huan-jing-pei-zhi/mspm0-image2.png)

2. 【如果使用Jlink】`EIDE.J Link: Install Directory` 指向Jlink的安装路径，示例：`C:\Program Files\SEGGER\JLink_V956`

![](/assets/docs/mspm-0-vs-code-huan-jing-pei-zhi/mspm0-image3.png)

3. 【如果使用DapLink】`EIDE.Open OCD: Exe Path` 指向OpenOCD的可执行文件路径，示例：`D:/CodeStudy/OpenOCD-20260302-0.12.0/bin/openocd.exe`

![](/assets/docs/mspm-0-vs-code-huan-jing-pei-zhi/mspm0-image4.png)


## EIDE项目配置
此处以 DapLink 作为烧录器为例。
- 烧录配置选择 `OpenOCD`
- 芯片配置使用默认根目录下的 `mspm0l.cfg`
- 接口配置选择 `cmsis-dap.cfg`

![](/assets/docs/mspm-0-vs-code-huan-jing-pei-zhi/mspm0-image5.png)

使用
- `F7 / Build` - 编译/构建代码
- `Ctrl+Alt+D / Flash` - 烧录代码