---
title: VSCode开发51单片机
createTime: 2026/03/11 23:17:04
permalink: /notes/qian-ru-shi-kai-fa/vs-code-kai-fa-51-dan-pian-ji/
---
> 这套配置其实也可以进行STM32开发，但需要额外的插件和配置，这里仅介绍51单片机开发

## 环境准备
### VSCode插件
<LinkCard icon="meteor-icons:link" title="C/C++" href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools" />
<LinkCard icon="meteor-icons:link" title="Embedded IDE" href="https://marketplace.visualstudio.com/items?itemName=CL.eide" />

### Keil C51
- EIDE依赖**Keil C51**的编译器（C51.EXE）和链接器（LX51.EXE），因此需先安装  
- 如需使用Keil5同时开发==51单片机==和==STM32==，可同时安装**Keil C51**和**Keil MDK**至同一路径，第二次安装时显示重复文件，全部选择 `skip`
<LinkCard icon="meteor-icons:link" title="Keil C51" href="https://www.keil.com/demo/eval/c51.htm" />

### Python烧录工具
<LinkCard icon="meteor-icons:link" title="Python" href="https://www.python.org/" />

::: tip 一些优化
`stcflash.py` 是旧版开源烧录脚本，稳定性较差；`stcgal` 是STC官方推荐的跨平台烧录工具，支持更多芯片型号且报错信息更清晰，所以使用 `stcgal` 进行烧录
:::
安装：
``` bash
pip install stcgal -i https://pypi.tuna.tsinghua.edu.cn/simple
```
验证安装：
``` bash
stcgal --version
```

### STC-ISP工具

::: steps
1. 下载**STC-ISP**工具
<LinkCard icon="meteor-icons:link" title="STC官网" href="https://www.stcmcu.com" />

2. 确保 `Keil C51` 或 `Keil MDK` 已完全关闭后，打开 `STC-ISP`
3. 点击顶部的 `Keil仿真设置`，点击 `添加型号和头文件到Keil中`，精准定位**Keil C51**的安装目录，参考：`C:\Keil_v5\C51`
4. 验证结果，出现 `C:\Keil_v5\C51\INC\STC` 路径，包含STC专属头文件
:::

## EIDE配置
在VSCode中点击左侧**EIDE图标**，打开操作面板
- **构建配置** -> 选择 `Keil C51 Compiler`
- **烧录配置** -> 选择 `stcgal`
- **C/C++属性** -> **包含目录** -> 添加Keil的STC头文件路径 `c:/Keil_v5/C51/INC/STC`

## 开始
### 新建项目
::: steps
1. 点击EIDE面板的 `新建项目`，选择 `空项目` → `8Bit MCU Project` → `8051 Empty Project (With Keil C51 Compiler)`
2. 输入项目名称（如LED_Blink），选择保存路径（避免中文路径），点击 `创建`
3. 右下角弹出 `是否打开工作区` 提示，点击 `Yes`
:::
### 导入Keil项目
::: steps
1. 点击EIDE面板的 `导入项目`，选择 `Keil C51`
2. 浏览并选择Keil项目的 `.uvproj` 文件，点击 `Import`
3. 选择 `与原Keil项目共存`（建议），点击 `确定`
:::

## 使用
- 在EIDE的项目资源管理器中，右键点击 `Source Group 1`（或自定义分组），选择 `添加文件`
- 新建 `main.c` 文件或其他c文件，并添加示例代码：
``` c
/**
 * 简单的流水灯示例
*/

#include <STC89C5xRC.H>  // 引入头文件

void delay_ms(unsigned int ms) {
    unsigned int i, j;
    for(i = ms; i > 0; i--)
        for(j = 110; j > 0; j--);
}

void main() {
    while(1) {
        P2 = 0xFE;  // P2.0 亮 (11111110)
        delay_ms(500);
        P2 = 0xFD;  // P2.1 亮 (11111101)
        delay_ms(500);
    }
}
```

- 在右上角或者**F7**选择 `构建`，**Ctrl+Alt+D**进行 `烧录`