---
title: 如何优雅的使用 Material Design 2
tags:
  - Android
  - Material Design 2
  - 踩坑
categories:
  - 编程
cover: "../../media/posts_img/how2_use_material_design2.svg"
description: 为什么安卓开发者文档没有迁移指南？
abbrlink: 9cb48aa5
date: 2019-07-31 00:38:57
---
### 简介

Material Design 2 （下面简称 MD2）已经发布了一段时间了，可是还有一些小伙伴不知道怎么迁移到 MD2 来，我也是查了不少资料才摸索出来的  

### AndroidX

首先，需要迁移到 AndroidX 来，这个网上有很多教程了，AndroidStudio 和 IDEA 也有相关的功能，这里就不赘述了  

### 修改主题

然后，需要修改 `styles.xml` 中的内容了，修改你之前的主题为

``` java
<style name="AppTheme" parent="Theme.MaterialComponents.Light.NoActionBar">"
```

当然还有其他可选的

``` java
Theme.MaterialComponents
Theme.MaterialComponents.Light
Theme.MaterialComponents.NoActionBar
Theme.MaterialComponents.Light.NoActionBar
Theme.MaterialComponents.Light.DarkActionBar
```

如果只想对 Material 组件生效那就用

``` java
Theme.MaterialComponents.Bridge
Theme.MaterialComponents.Light.Bridge
Theme.MaterialComponents.NoActionBar.Bridge
Theme.MaterialComponents.Light.NoActionBar.Bridge
Theme.MaterialComponents.Light.DarkActionBar.Bridge
```

仅仅是这一个操作就完成了大部分任务了，现在编译就可以看到一些新特性了
不过肯定没有这么简单，所以这里来讲解一些坑

### 开始踩坑

#### FloatingActionButton 颜色问题

对，你没看错，MD2 默认的 FAB 颜色有一点问题  
默认情况下背景色不是主题的强调色，图标的颜色也是黑的，很丑，那么怎么解决呢？
很简单，添加

``` java
        app:backgroundTint="?attr/colorAccent"
        app:tint="@android:color/white"
```

这两行到 FAB 的属性，即

``` java
<com.google.android.material.floatingactionbutton.FloatingActionButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:id="@+id/fab_chat_edit"
        app:backgroundTint="?attr/colorAccent"
        app:tint="@android:color/white"/>
```

这样就完成啦，背景色是主题的强调色，图标是白色，就和以前的一样了，当然也可以修改为其他的颜色

#### 布局的 Design 界面不能预览

这个就比较麻烦了，好像只有第一次启动 IDE 的时候能正常看到布局，过一会就无法预览了，提示异常，感觉是个 Bug，临时的解决办法就是修改主题，xml布局界面上边修改主题为旧版本的即可，这样改以后布局可以看，只是 material 的效果都没了，很难受

还有一种办法，参考 [StackOverflow](https://stackoverflow.com/questions/55791884/cannot-render-materialbutton-with-android-material1-1-x) 比较简单的办法,添加一个预览的style

最后还有一种说是 Android Studio 3.5 修复了，不过我是 IDEA 就不太清楚了

### 待续

暂时遇到这些，后面还有的话也记录上来
