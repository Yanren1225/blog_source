---
title: 在 Windows 系统上给 ssh 设置代理
tags:
  - ssh
  - Windows
  - 代理
categories:
  - 技术记录
cover: "../../media/posts_img/ssh.svg"
description: 没有代理可怎么愉快的<del>抄</del>借鉴代码
abbrlink: 4d70a82d
date: 2020-06-01 23:28:25
---

{% note info %}
看清，使用的系统是 Windows 不是 Linux 或者 MacOS
{% endnote %}

百度搜到的很多给 git 设置代理的办法，都是给 http 设置代理，而不是给 SSH 设置代理。那个 `git config --global http.proxy http://127.0.0.1:1080` 设置起来，只针对 http 的 git 有效果。
然后就是 `ProxyCommand nc -v -x 127.0.0.1:1080 %h %p`，那个分明是给 Linux 才能用的， Windows 上哪里来的 nc 程序？

以下操作是给 Windows 用的，我的操作：

在自己的用户文件夹找到 .ssh 文件夹，比如我的是 `C:\Users\nihao\.ssh` ，在里面新建一个空白文件，取名 config，如果已经有了就不用创建了。

注意不是 config.txt ！

我强烈建议把 Windows 的后缀显示给打开，不然你根本不知道自己到底在编辑什么文件。

都用 Git 了不至于还害怕自己把文件后缀名给改错了吧？

在 config 文件里写上一行就行：

```powershell
ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p
```

这里 git 的安装路径和后面的代理自己看着填，不要试着用相对路径，保证要吃亏。因为 `Program Files` 文件夹中间带一个空格，所以这里需要把整个路径给引号引起来。 后面的代理的话，`-S` 指是 socks 代理，默认是 socks5，`127.0.0.1:1080` 就是你本地的代理地址，后面的 `%h %p` 意思是 Host 和 Port，必须得写上，我也不知道为什么要这么设计。 如果要使用 HTTP 代理，就写 `-H`，更多代理类型（比如 socks4）请参 [这个](https://bitbucket.org/gotoh/connect/wiki/Home#!more-detail)。

上这个写法是针对全局的，如果想只针对某个网站的话，就这么写：

```powershell
Host github.com
  ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p
```

现在就可以愉快的使用代理了，不过要记住一定使用 ssh 协议。
