---
title: VSCode开发STM32
createTime: 2026/03/10 16:12:42
permalink: /notes/qian-ru-shi-kai-fa/vs-code-kai-fa-stm-32/
---

## 参考视频
@[bilibili](BV1QfbpzGENy)

## 相关链接
<LinkCard icon="meteor-icons:link" title="CMake官网" href="https://cmake.org/" />
<LinkCard icon="meteor-icons:link" title="CMake教程" href="https://www.runoob.com/cmake/cmake-tutorial.html" />
<LinkCard icon="meteor-icons:link" title="STM32CubeIDE for Visual Studio Code" href="https://marketplace.visualstudio.com/items?itemName=stmicroelectronics.stm32-vscode-extension" />

## 摘要
1. 在STM32CubeMX中配置工程时，`Toolchain / IDE` 选择 `CMake`，最后 `GENERATE CODE`
2. 使用最新版本的STM32 VSCode插件（名称：**STM32CubeIDE for Visual Studio Code**不需要再额外安装**STM32CubeCLT**，插件会自动安装其他依赖
3. 可选自己额外安装CMake，同时依赖可以在插件里的**STM32Cube Bundles Manager**窗口中进行管理
4. 在VSCode导入新项目时，提示文件错误，可能是导入顺序的问题，应先进入 `debug` 模式，再选择==导入为STM32项目==
5. 关于 `CMakeLists.txt`：编译前应补全 `target_sources` 和 `target_include_directories`，添加自己新增的.c文件

``` txt
# Add sources to executable
target_sources(${CMAKE_PROJECT_NAME} PRIVATE
    Core/Src/font.c
    Core/Src/oled.c
)

# Add include paths
target_include_directories(${CMAKE_PROJECT_NAME} PRIVATE
    Core/Inc
)
```
