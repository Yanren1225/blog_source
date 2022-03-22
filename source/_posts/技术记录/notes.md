---
title: 解决方案.方案
cover: "../../media/posts_img/notes.svg"
categories:
  - 技术记录
abbrlink: notes
description: 提出了几个可以解决问题的方案.项目
date: 2020-11-14 14:07:10
tags:
---

> 日常解决问题基本靠 Google，拿来水博客跟 *Copy&Paste* 也没啥区别，但是又想把这些方法记录下来，万一以后需要用还方便查看，于是打算全部写在这一篇文章里了。
>
> 当然，为了防止未来的我忘记当时写的是什么东西，咱尽量将一些因人而异、因机而异的东西标注出来（比如每段的 Replacement），但难免有疏漏，如果有读者能够看到，并感到疑惑，请不要吝啬你的留言。[^1]
>  

{% note info %}
因为我是用的是 Windows 10 系统所以一下的东西只保证在 Windows 10 有用其他系统，诸如 Windows 7/Linux/macOS 请自行查找方案
{% endnote %}

## 目前可用的 VS Code 调试 C/C++ 配置

> 2020-11-12 19:53 GMT +8  
> 基于网上现有的稍加修改

{% note info %}
请替换 [debugger_path] 并且保证你的 gcc 是可用状态，或者使用其他的编译器/调试器
{% endnote %}

**`launch.json`**

```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "2,0.0", //配置文件的版本，以前使用是0.2.0，新版本已经弃用，改用为2.0.0
  "configurations": [
    //配置域
    {
      "name": "(gdb) Launch", //配置文件的名字，可以随便起
      "type": "cppdbg", //调试的类型，Vscode现在支持很多，我这里主要是C，所以只能是cppdbg
      "request": "launch", //配置文件的请求类型，有launch和attach两种，具体看官方文档
      "targetArchitecture": "x64", //硬件内核架构，为64bit，如图设置
      "program": "${workspaceRoot}/${fileBasenameNoExtension}.exe", //可执行文件的路径和文件名称
      //"args": ["file1", "file2"], //主函数调用时传入的参数
      "stopAtEntry": false, //设为true时程序将暂停在程序入口处
      "cwd": "${workspaceFolder}", //调试时的工作目录
      "environment": [], //不知道干嘛的
      "internalConsoleOptions": "openOnSessionStart", //
      "externalConsole": true, //调试时是否显示控制台窗口
      "MIMode": "gdb", //指定连接的调试器，可以省略不写
      "miDebuggerPath": "[debugger_path]/gdb.exe", //调试器路径,在Linux环境下需要注释掉这一行
      "preLaunchTask": "gcc", //调试会话开始前执行的任务，一般为编译程序。与tasks.json的label相对应
      "setupCommands": [
        //不知道干嘛的
        {
          "description": "Enable pretty-printing for gdb",
          "text": "-enable-pretty-printing",
          "ignoreFailures": true
        }
      ]
    }
  ]
}
```

**`tasks.json`**

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "gcc", // 任务名称，与launch.json的preLaunchTask相对应
      "command": "gcc", // 要使用的编译器
      "args": [
        "${file}",
        "-o", // 指定输出文件名，不加该参数则默认输出a.exe，Linux下默认a.out
        "${fileDirname}/${fileBasenameNoExtension}.exe",
        "-g", // 生成和调试有关的信息
        "-Wall", // 开启额外警告
        "-fexec-charset=GBK" // 防止中文乱码，按需取用
      ], // 编译命令参数
      "type": "cppbuild", // 可以为shell或process，前者相当于先打开shell再输入命令，后者是直接运行命令
      "options": {
        "cwd": "[debugger_path]/bin"
      },
      "problemMatcher": ["$gcc"],
      "group": "build",
      "detail": "compiler: gcc"
    }
  ]
}
```

## Win10 任务栏菜单小图标变黑了

> 2020-9-10 16:55 GMT+8  
> 建议创建开机任务执行

```ps
ie4uinit -show
```

## 通过 JDK 生成 JRE

> 2020-9-22 9:36 GMT+8

{% note warning %}
需要管理员权限的 CMD 运行
{% endnote %}

```ps
cd %JAVA_HOME%
bin\jlink.exe --module-path jmods --add-modules java.desktop --output jre
```

## 使用 hexo-reference 插件生成脚注编号重复

1. 找到 `\<blog_root_folder>\node_modules\hexo-reference\src\footnotes.js`

2. 删除或者注释这几行代码

```JavaScript
    // render footnotes (HTML)
    footnotes.forEach(function (footNote) {
        html += '<li id="fn:' + footNote.index + '">';
      ->// html += '<span style="display: inline-block; vertical-align: top; padding-right: 10px; margin-left: -40px">';
      ->// html += footNote.index;
      ->// html += '.</span>';
        html += '<span style="display: inline-block; vertical-align: top; margin-left: 10px;">';
        html += md.renderInline(footNote.content.trim());
        html += '<a href="#fnref:' + footNote.index + '" rev="footnote"> ↩</a></span></li>';
    });

```

## Grub 找不到 Windows 引导了

> 2021-3-19 11:12 GMT+8  
> 我是用的是 Manjaro

首先需要安装 `os-prober`，然后打开 `/etc/default/grub`，编辑或者添加以下几项

```shell
GRUB_TIMEOUT_STYLE=menu  #显示菜单
GRUB_TIMEOUT=10   #超时时间10秒
GRUB_DISABLE_OS_PROBER=false   #允许os探测
```

修改完成后运行 `sudo update-grub` 就可以找到 Windows 引导了。

[^1]: 引用自 [Buta Sticky Notes - 丁丁の店](https://blog.butanediol.me/2020/10/13/Buta-Sticky-Notes/)
