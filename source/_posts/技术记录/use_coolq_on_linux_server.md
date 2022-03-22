---
title: 在 Linux 服务器上使用 酷Q
tags:
  - 酷Q
  - linux
categories:
  - 技术记录
cover: "../../media/posts_img/use_coolq_on_linux_server_index.jpg"
description: 一个简简单单的 docker 网上居然有这么多不同的用法？
abbrlink: 2bdd4eaf
date: 2019-11-17 20:08:29
---
众所周知 酷Q 是 Windows 平台下的， Linux 下要使用还是有难度的，好在官方做出了了 docker 镜像，这样就可以在 docker 直接运行了

## 准备

* 一台 Linux 服务器 (这里用来演示的系统是 CentOS 7.6 当然其他系统也ok)
* docker
* 酷Q 容器

## 安装及运行 docker

在 CentOS 下直接使用 yum 安装即可

``` bash
sudo yum install docker
```

安装之后如果提示

``` bash
Cannot connect to the Docker daemon. Is the docker daemon running on this host?
```

这是因为 docker 还没有在运行

sudo 运行一下 docker 就正常了

``` bash
sudo systemctl start docker
```

### 3. 下载 酷Q 镜像，后台运行容器

使用下面的命令获取镜像

``` bash
sudo docker pull coolq/wine-coolq
```

这个速度取决于你的服务器带宽

创建一个用于存放（映射）coolq 数据的目录（可以理解为数据卷？），用于持久化存放 coolq（酷Q应用）的数据

``` bash
sudo mkdir /coolq-data
```

这一步很重要，因为数据是最重要的，而且后面你的酷Q应用都要上传到此目录才能应用上的

后台运行 coolq 容器

``` bash
sudo docker run --name=coolq -d -p 8080:9000 -v /coolq-data:/home/user/coolq -e VNC_PASSWD=12345678 -e COOLQ_ACCOUNT=1000000000 coolq/wine-coolq
```

其中部分参数根据自己的需求替换：

远程监听端口
`8080(9000映射成8080)`
数据存放位置
`/coolq-data（/home/user/coolq 映射到/coolq-data）`
远程访问密码
`12345678（只能设8位）`
机器人 QQ 帐号
`1000000000`

实际上我当然运行的参数不是上面那些示例参数，根据自己的服务器实际来

这里要注意的是，首先你远程监听的端口，也就是自定义的web端口需要在服务器防火墙和云安全组都放行

其次，-d 指的是后台运行容器，-v后面接的就是将服务器的自己定义的酷Q数据目录映射到容器内的/home/user/coolq目录，-e是设置容器的系统环境

因为我们后面要通过vnc连接，所以要指定VNC_PASSWD

而酷Q要登录的qq小号（充当机器人）也可以通过-e COOLQ_ACCOUNT 去指定

### 4. 通过浏览器登录 vnc 进行使用

现在用浏览器打开 <http://你的ip:8080> 就可以看到 vnc 界面了，点击`链接`然后输入密码就可以看到桌面了，里面已经运行了 coolq air

可以看到使用 docker 还是很方便的，之前只用 wine 总是出现字体丢失的问题
