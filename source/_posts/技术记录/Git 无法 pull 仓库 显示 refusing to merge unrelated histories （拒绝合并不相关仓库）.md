---
title: Git 无法 pull 仓库 显示 refusing to merge unrelated histories （拒绝合并不相关仓库）
cover: /uploads/blog_title/Git无法pull仓库.png
tags: 
  - Git
categories:
  - 技术记录
abbrlink: e5477819
date: 2019-10-19 22:54:36
---
如果在合并 pull 仓库的时候，出现的问题如何去解决（这个方法适用于合并本地很久没有提交的仓库，或者是同一个仓库 commit 信息不同的合并）
<!--more-->
![示意图](/blog_image/Git无法pull/fail.png)
如果合并了两个不同的开始提交的仓库，在新的 `git` 会发现这两个仓库可能不是同一个，为了防止开发者上传错误，于是就给下面的提示
``` Shell
fatal: refusing to merge unrelated histories
```
如我在 Github 新建一个仓库，写了 License，然后把本地一个写了很久仓库上传。这时会发现 github 的仓库和本地的没有一个共同的 `commit` 所以 `git` 不让提交，认为是写错了 `origin` ，如果开发者确定是这个 `origin` 就可以使用  `--allow-unrelated-histories`  告诉 `git` 自己确定

遇到无法提交的问题，一般先 pull 也就是使用  `git pull origin master`  这里的 `origin` 就是仓库，而 `master` 就是需要上传的分支，因为两个仓库不同，发现 `git` 输出  `refusing to merge unrelated histories`  无法 `pull` 内容

因为他们是两个不同的项目，要把两个不同的项目合并，git需要添加一句代码，在 `git pull` 之后，这句代码是在 git 2.9.2 版本发生的，最新的版本需要添加 `--allow-unrelated-histories` 告诉 `git` 允许不相关历史合并

假如我们的源是 `origin`，分支是 `master`，那么我们需要这样写 `git pull origin master --allow-unrelated-histories`  如果有设置了默认上传分支就可以用下面代码 
``` Shell
git pull --allow-unrelated-histories
```

