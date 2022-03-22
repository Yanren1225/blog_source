---
title: Flutter 实现图片下划线的 TabBar
categories:
  - 编程
abbrlink: 51bf3ff2
date: 2021-08-26 14:44:49
tags:
  - Flutter
cover: "../../media/posts_img/flutter_dev.svg"
---

最近在公司写项目的时候遇到了要把 TabBar 的下划线改成图片样式的，但是官方组件似乎没有提供，在网上也搜不到相关的内容，很是苦恼。后来找到了 [Flutter: Custom tab indicator for TabBar](https://medium.com/swlh/flutter-custom-tab-indicator-for-tabbar-d72bbc6c9d0c) 这篇文章，发现他自定义为圆形的方法很简洁，或许可以来~~抄袭~~借鉴一下。

## 创建必须组件

首先创建一个 `custom_tabbar.dart` 来放我们自定义的 TabBar，这样方便复用，里面的代码如下

```dart
class CustomTabBar extends StatefulWidget {

  const CustomTabBar({
    Key key,
    @required this.tabs,
    @required this.imagePath,
    @required this.controller,
  }) : assert(tabs != null),
        super(key: key);

  final List<Widget> tabs;
  final TabController controller;
  final String imagePath;

  @override
  _CustomTabBarrState createState() => _CustomTabBarState();
}

class _CustomTabBarState extends State<CustomTabBar> {
  ui.Image _image;

  @override
  Widget build(BuildContext context) {
    loadImage(widget.imagePath).then(
          (value) => setState(
            () {
          _image = value;
        },
      ),
    );

    return TabBar(
      tabs: widget.tabs,
      controller: widget.controller,
      indicator: ImageTabIndicator(image: _image),
    );
  }
}
```

使用 StatefulWidget 是因为获取到图片之后要刷新一下布局，不然里面的下划线都是空的了，`loadImage` 是一个从 Assets 获取图片转换到 Image 的方法，这是 `dart:ui` 包下面的，方法代码如下：

```dart
import 'package:flutter/services.dart';
import 'dart:ui' as ui;

Future<ui.Image> loadImage(String path) async {
  ByteData data = await rootBundle.load(path);
  ui.Codec codec = await ui.instantiateImageCodec(data.buffer.asUint8List());
  ui.FrameInfo fi = await codec.getNextFrame();
  return fi.image;
}
```

注意这是一个异步方法

## 实现图片下划线

刚才在 `custom_tabbar.dart` 看到了有一个 `ImageTabIndicator`，这就是要实现下划线的地方了，里面的代码也比较简单

```dart
class ImageTabIndicator extends Decoration {
  final BoxPainter _painter;

  ImageTabIndicator({double radius = 10, @required ui.Image image})
      : _painter = _ImagePainter(radius, image);

  @override
  BoxPainter createBoxPainter([onChanged]) => _painter;
}

class _ImagePainter extends BoxPainter {
  final Paint _paint;
  final double radius;
  final ui.Image image;

  _ImagePainter(this.radius, this.image)
      : _paint = Paint()
          ..isAntiAlias = true
          ..strokeCap = StrokeCap.round;

  @override
  void paint(Canvas canvas, Offset offset, ImageConfiguration cfg) {
    if (image != null) {
      final Offset imageOffset = offset +
          Offset(cfg.size.width / 2, cfg.size.height / 2 + image.height + 2);
      paintImage(
          canvas: canvas,
          rect: Rect.fromCircle(center: imageOffset, radius: radius),
          image: image,
          fit: BoxFit.fitWidth);
    }
  }
}
```

这里没什么好说的，就是去画传进来的图片，不过这里的位置需要去自己调整。另外不能用 `Paint` 画，一定要用 [`paintImage`](https://api.flutter.dev/flutter/painting/paintImage.html) 来画,他有一个转换方法，使用 `Paint` 会变成背景。

17 行这个 `Paint` 的初始化说实话应该不存在了，但是我试着删除他之后绘制就没了，很奇怪我就留着了。
