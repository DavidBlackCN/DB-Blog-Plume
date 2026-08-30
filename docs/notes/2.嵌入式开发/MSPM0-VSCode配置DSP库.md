---
title: MSPM0-VSCode配置DSP库
createTime: 2026/08/30 17:36:05
permalink: /notes/qian-ru-shi-kai-fa/mspm-0-vs-code-pei-zhi-dsp-ku/
---
::: info
本指南使用EIDE项目工程模板进行搭建，仅使用VSCode，调用官方支持的 DSP 库。  
查看本教程之前请先阅读[MSPM0-VSCode环境配置](/notes/qian-ru-shi-kai-fa/mspm-0-vs-code-huan-jing-pei-zhi/)
:::

> 用 VSCode + EIDE 模板工程也能接入 MSPM0 SDK 自带的 CMSIS-DSP。你这个场景本质上是：EIDE 工程已经帮你搭好了 MSPM0G3507 的启动文件、链接脚本、DriverLib、OpenOCD 烧录流；你只需要把 CMSIS-DSP 的头文件路径和静态库加进 EIDE 的构建配置。

## 准备工具
### VSCode插件
- **C/C++**
- **Cortex-Debug**
- **Embedded IDE**

### 工具链
**MSPM0 SDK 里的 CMSIS-DSP**
- SDK可单独在此处下载安装：[MSPM0-SDK](https://www.ti.com.cn/tool/cn/MSPM0-SDK)
- 如已有CCS，在新建项目时会自动下载SDK依赖，如已下载则无需单独安装，直接找到路径即可

## EIDE项目配置
在原EIDE工程模板配置的基础上继续修改：

1. 确认已有 MSPM0 SDK，默认安装路径通常类似于 `C:\ti\mspm0_sdk_2_10_00_04`
2. 添加Include路径，在 `C/C++属性` -> `包含目录` 中添加类似以下路径：
``` bash
c:/ti/mspm0_sdk_2_10_00_04/source/third_party/CMSIS/DSP/Include
c:/ti/mspm0_sdk_2_10_00_04/source/third_party/CMSIS/Core/Include
```

![](/assets/docs/mspm-0-vs-code-pei-zhi-dsp-ku/mspm0-image1.png)

3. 添加库搜索目录，在 `C/C++属性` -> `库搜索目录` 中添加类似以下路径：
``` bash
c:/ti/mspm0_sdk_2_10_00_04/source/third_party/CMSIS/DSP/lib/gcc/m0p
```

![](/assets/docs/mspm-0-vs-code-pei-zhi-dsp-ku/mspm0-image2.png)

4. 建议添加宏定义，在 `C/C++属性` -> `预处理器定义` 中添加 `ARM_MATH_CM0PLUS`，有些 CMSIS-DSP 版本不强制要求你手动加，但建议加上，语义明确：告诉 CMSIS-DSP 当前目标是 Cortex-M0+。

![](/assets/docs/mspm-0-vs-code-pei-zhi-dsp-ku/mspm0-image3.png)

5. 添加链接器参数，打开 `构建配置：GCC` -> `构建器选项` -> `链接器` -> `链接库选项`，原有的参数应该是 `-ls`，现在改成如下内容，改完记得点上面的 `全部保存`
``` bash
-lm -l:arm_cortexM0l_math.a
```

6. 完整配置截图参考：

![](/assets/docs/mspm-0-vs-code-pei-zhi-dsp-ku/mspm0-image4.png)

## DSP库接入测试
用以下代码烧录测试，如编译通过无报错则为接入成功：
``` c
#include "ti_msp_dl_config.h"
#include "arm_math.h"

q15_t src[8] = {1000, -2000, 3000, -4000, 5000, -6000, 7000, -8000};
q15_t abs_out[8];

int main(void)
{
    SYSCFG_DL_init();

    arm_abs_q15(src, abs_out, 8);

    while (1) {
    }
}
```