---
title: 半自动化生成博客相册
tags:
  - Python
categories:
  - 技术记录
cover: "../../media/posts_img/py_generate_blog_gallery.svg"
description: 懒是进步的唯一动力！
abbrlink: 64b2bc9e
date: 2020-02-18 13:10:33
---

> 下面有完整代码，自行复制

## 环境

- Hexo [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 主题

- 本地运行脚本需要安装 Python 3

## 文件层级要求

首先你要知道 Butterfly 的相册格式，类似下面这样：

```MarkDown
{% gallery %}
markdown 图片格式
{% endgallery %}
```

当然里面可以插入网络图片或者本地图片，如果你是网络图片或者混用就不用往下看了，这里只针对使用本地图片。

然后文件层级要类似下面这样：

```MarkDown
|   // 这是 Hexo 博客的根目录
|   // 其他文件我就省略了
|
└── source // Hexo 的资源文件目录
       |
       |   // 省略其他文件夹
       |
       └── gallery //相册文件夹，名字可自定义
              ├── index.md // 相册的界面文件
              ├── images.py // 生成脚本
              └── images // 放图片的文件夹
                    |
                  ......
                    //很多图片

```

或者形如以下：

```MarkDown
|   // 这是 Hexo 博客的根目录
|   // 其他文件我就省略了
|
└── source // Hexo 的资源文件目录
       |
       |   // 省略其他文件夹
       |
       └── gallery // 可能是一个集合文件夹或者其他
              |
              |
              └── （1-n 级文件夹）// 多少层都无所谓
                        |
                        └── photo //真正的相册
                                ├── index.md // 相册的界面文件
                                ├── images.py // 生成脚本
                                └── images // 放图片的文件夹
                                        |
                                      ......
                                        //很多图片

```

然后我们打开 `index.md` 的大概结构如下：

```MarkDown
---
title: 相册
type: "picture"
---
// 剩下的最好为空，不过问题不大
```

## 脚本

首先贴上完整脚本：

```Python
import os

path = os.path.split(os.path.realpath(__file__))[0]

path2 = path[path.rfind("source")+6:]

os.chdir(path+"\images")
ls_file = []
for file in os.scandir():
    if file.is_file():
        ls_file.append(file.name)

md_text = "\n{% gallery %}\n"

for image in ls_file:
    md_path = "!["+os.path.splitext(image)[0]+"]("+str(path2)+"\\"+image+")"
    md_text += md_path.replace("\\", "/")+"\n"

md_text += "{% endgallery %}"

os.chdir(path)

with open('index.md', 'a', encoding='utf-8') as f:
    f.write(md_text)
```

- 仅适用于 Windows 系统，如果是 Linux 要做出微小修改。
- 使用前需要清除之前生成的相册格式

将此脚本保存到和 `index.md` 同级目录，然后定位到该目录执行 `python <你保存的文件名>.py` 即可使用。

## 解析

下面我来解析一下这个脚本，~~轻喷，我两天前才玩的 Python~~

### 导入模块

首先使用 `import os` 导入 os 模块

### 获取路径

```Python
path = os.path.split(os.path.realpath(__file__))[0]
path2 = path[path.rfind("source")+6:]
```

获取脚本所在位置的绝对路径保存在 `path`，使用 `rfind()` 函数从右往左找到第一个 `source` 字符~~如果你后面也有自己起这个名字的文件夹我就没办法了~~，然后使用分片截取 `source\` 后的路径保存在 `path2`。

### 遍历文件名

```Python
os.chdir(path+"\images")
ls_file = []
for file in os.scandir():
    if file.is_file():
        ls_file.append(file.name)
```

使用 `chdir()` 切换工作目录到当前目录下的 `images` 目录，也就是放图片的目录，以便获取图片，然后遍历目录下的所有文件名称保存在 `ls_file` 中。

### 处理格式

```Python
md_text = "\n{% gallery %}\n"

for image in ls_file:
    md_path = "!["+os.path.splitext(image)[0]+"]("+str(path2)+"\\"+image+")"
    md_text += md_path.replace("\\", "/")+"\n"

md_text += "{% endgallery %}"

```

现在我们已经获取好了所有文件名，并且得到了 `path2`——`从 source 到当前位置的相对路径`。

接着在第 1 行和第 7 行声明了相册的基本格式，第 3 行到第 5 行使用循环处理好了 MarkDown 图片格式。

```MarkDown
![描述](链接/路径)
```

这是 MarkDown 图片格式，所以我们要把去掉后缀的文件名放到 `描述` 中，把图片的相对路径放到 `链接/路径` 中。

用 `os.path.splitext(filename)` 就可以轻松分开文件名和后缀，由于我们只需要文件名所以使用 `os.path.splitext(image)[0]`，这里已经传入了文件名。

然后使用 `str()` 把相对路径 `path2` 转化为字符串并且加上图片的文件名。

最后整理好格式，使用 `+` 将各部分连接好，并且使用 `replace()` 替换所有的 `\` 为`/` 就成型了。

### 写入文件

```Python
os.chdir(path)

with open('index.md', 'a', encoding='utf-8') as f:
    f.write(md_text)
```

上一步已经把处理好的相册格式存放在 `md_text` 中,紧接着使用 `chdir()` 切换到脚本所在目录，这里有 `index.md` 以便我们写入。

`with open(filename) as file:` 这是固定格式，不必多讲，不过一定要注意使用 `'a'` 切换到追加模式，以免丢失原来的模板；使用 `encoding='utf-8'` 指定编码，以免写入中文时乱码。

## 懒是人类进步阶梯

这是我用 Python 写的第一个玩意儿，主要是每次都要手动加好麻烦，我就想能不能用 Python 写一个脚本处理。学了两天，写的不是很好，比如不能自动识别原来已有的格式进行替换，每次都要手动去清除，又或者得手动执行，不能在 Hexo 部署的时候进行执行。
