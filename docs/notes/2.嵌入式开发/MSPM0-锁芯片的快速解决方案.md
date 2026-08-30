---
title: MSPM0-锁芯片的快速解决方案
createTime: 2026/08/30 17:50:14
permalink: /notes/qian-ru-shi-kai-fa/mspm-0-suo-xin-pian-de-kuai-su-jie-jue-fang-an/
---
::: info
本文档记录了笔者在使用自建的MSPM0-VSCode-EIDE环境下遇到锁芯片时的快速解决方案。  
由于MSPM0锁芯片的方式千奇百怪，故本方法不广泛适用！
:::

先cd到当前项目目录，或者直接在项目目录下打开cmd：
``` powershell
cd /d "你的目录"
```

使用类似以下命令：
- `D:\CodeStudy\OpenOCD-20260302-0.12.0\bin\openocd.exe` 为你的Openocd实际可执行文件路径
- `"D:\CodeStudy\OpenOCD-20260302-0.12.0\share\openocd\scripts"` 同理

``` powershell
D:\CodeStudy\OpenOCD-20260302-0.12.0\bin\openocd.exe -s "D:\CodeStudy\OpenOCD-20260302-0.12.0\share\openocd\scripts" -s "." -f interface/cmsis-dap.cfg -f mspm0l.cfg -c init -c mspm0_factory_reset -c exit
```

在按住**RST复位键**的情况下执行，当Openocd服务开始运行时松开RST，如果显示 `Examination failed` 则再按下RST，此时会开始RESET，日志如下：

``` powershell
Info : [mspm0x.cpu] starting gdb server on 3333
Info : Listening on port 3333 for gdb connections
Info : SWD DPIDR 0x6ba02477
Error: [mspm0x.cpu] Could not find MEM-AP to control the core
Info : [mspm0x.cpu] Cortex-M0+ r0p1 processor detected
Info : [mspm0x.cpu] target has 4 breakpoints, 2 watchpoints
Factory reset success! Halting processor
[mspm0x.cpu] halted due to debug-request, current mode: Thread
xPSR: 0x81000000 pc: 0x01002d54 msp: 0x20007fdc
```

看见 `Factory reset success!` 则为擦除成功，可以重新开始烧新代码了。