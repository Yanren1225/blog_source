---
title: 动态替换 ViewPager 里面的 Fragment
tags:
  - Android
  - 踩坑
  - ViewPager
  - Fragment
categories:
  - 编程
cover: "../../media/posts_img/android_dev.svg"
description: 暴力替换不可取哦~
abbrlink: 6b0c894
date: 2019-08-17 13:40:28
---

最近在重写 Kirby Assistant 过程中又遇到了需要动态替换 ViewPager 的某个 Fragment 的需求，因为之前的是直接在同一个布局里暴力替换的，但是这次因为是用其他方法实现的，当然不能用以前的方法了，摸索了一段时间后终于搞定了，现在把可以用的方法放在下面

### 准备过程

首先需要在布局中添加 ViewPager

```xml
<androidx.viewpager.widget.ViewPager
        android:id="@+id/main_fragment_viewpager"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
```

然后给 ViewPager 写一个 ViewPagerAdapter 并且继承自 FragmentPagerAdapter

```java
public class ViewPagerAdapter extends FragmentPagerAdapter {
//其他东西
}
```

### 重写 ViewPagerAdapter

具体看代码的注释，有注释的都是需要注意的

```java
public class ViewPagerAdapter extends FragmentPagerAdapter {

    private FragmentManager fm;
    private List<Fragment> fragments;
    private List<String> page_title;//这个是对应碎片的标题，可以不需要

    public ViewPagerAdapter(FragmentManager fm, List<Fragment> fragments,List<String> page_title){
        super(fm);
        this.fm=fm;
        this.fragments=fragments;
        this.page_title=page_title;
    }


    //注意这个方法，这个是配置你在哪个碎片上进行替换
    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, int position) {
        //这里的判断说明的是在三个和第四个碎片上替换
        if (position == 2||position == 3)
            removeFragment(container,position);
        return super.instantiateItem(container, position);
    }

    //这个方法就是通过 Tag 来判断碎片是不是原来的，如果不是就进行替换
    private void removeFragment(ViewGroup container,int index) {
        String tag = getFragmentTag(container.getId(), index);
        Fragment fragment = fm.findFragmentByTag(tag);
        if (fragment == null)
            return;
        FragmentTransaction ft = fm.beginTransaction();
        ft.remove(fragment);
        ft.commit();
        ft = null;
        fm.executePendingTransactions();
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        return fragments.get(position);
    }

    @Override
    public int getCount() {
        return fragments.size();
    }

    //注意写成这样才可以进行刷新
    @Override
    public int getItemPosition(@NonNull Object object) {
        return PagerAdapter.POSITION_NONE;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        return page_title.get(position);
    }

    //禁止销毁view达到复用
    @Override
    public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {}
    //获取碎片的tag
    private String getFragmentTag(int viewId, int index) {
        try {
            Class<FragmentPagerAdapter> cls = FragmentPagerAdapter.class;
            Class<?>[] parameterTypes = { int.class, long.class };
            Method method = cls.getDeclaredMethod("makeFragmentName",
                    parameterTypes);
            method.setAccessible(true);
            String tag = (String) method.invoke(this, viewId, index);
            return tag;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
```

### 注意问题

如果出现替换后出现某个碎片的布局空白了，那就设置一个 ViewPager 的缓存属性

```java
main_fragment_viewpager.setOffscreenPageLimit(4);//4代表缓存4页，根据实际情况调整
```

### 结尾

如果有代码什么问题可以向我提出
