---
title: updateConfiguration 弃用之后更换语言应该何去何从
tags:
  - Android
  - 踩坑
  - Kotlin
  - 弃用
categories:
  - 编程
cover: "../../media/posts_img/android_dev.svg"
description: 为什么 Google 总是会弃用好用的 API？
abbrlink: 9e078f24
date: 2020-05-09 23:03:24
---

{% note info %}
注意本文使用的语言的是 Kotlin，如需 Java 请自行转换或在网络自行搜索，本文的 minSDK 为 21
{% endnote %}

## 弃用

通常提起 Android 程序更换语言可能会想到 `Context` 的 `getResources().updateConfiguration(configuration, displayMetrics)`,传入设置好 `Locale` 的 `configuration` 以及 `Context` 的 `getResources().getDisplayMetrics()`。

然而这个方法在现在已经被标记为 deprecated，这意味着以后的版本可能用不了这个了。

> 这是官方的信息：
> 'updateConfiguration(android.content.res.Configuration, android.util.DisplayMetrics)' is deprecated
> Deprecated
> See android.content.Context.createConfigurationContext(Configuration).

那简单了，我们只需要看看 `Context.createConfigurationContext(Configuration)` 怎么使用就可以了，分析一下，这个方法是返回一个 `Context`，那我们只需要重写一下 `ContextWrapper` 就好了,这样获取到的就是用一个 `Context`，保证更换语言成功。

## 重写 ContextWrapper

这是我写好的 `ContextWrapper`，比较简单，需要说明的东西我都写在注释了：

```kotlin
open class ContextWrapper(base: Context?) : ContextWrapper(base) {
    companion object {
        //这里使用注解保证编译通过
        @RequiresApi(Build.VERSION_CODES.N)
        fun wrap(context: Context, newLocale: Locale?): ContextWrapper {
            var mContext = context
            val res: Resources = mContext.resources
            val configuration: Configuration = res.configuration
            //注意 Android 7.0 前后的不同处理方法
            mContext = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                configuration.setLocale(newLocale)
                val localeList = LocaleList(newLocale)
                LocaleList.setDefault(localeList)
                configuration.setLocales(localeList)
                mContext.createConfigurationContext(configuration)
            } else {
                configuration.setLocale(newLocale)
                mContext.createConfigurationContext(configuration)
            }
            return ContextWrapper(mContext)
        }
    }
}
```

## 准备好切换工具

我这里准备了一个语言的工具类可以参考一下：

```kotlin
object LanguageUtil {

    /**
     * 设置语言的值
     * @param context 上下文
     * @param lan 需要设置的语言
     */
    fun setLanguage(context: Context, lan: String) {
        context.getSharedPreferences("settings", 0).edit {
            putString("language", lan)
            this.commit()
        }
    }

    /**
     * 获取应用于选择语言对话框的 checkedItem
     */
    fun getCheckedItem(context: Context): Int =
        when (context.getSharedPreferences("settings", 0).getString("language", "cn")) {
            "auto" -> 0
            "zh-rCN" -> 1
            "zh-rTW" -> 2
            "en" -> 3
            else -> 0
        }

    /**
     * 获取当前设置的 Locale
     */
    fun getLocale(context: Context): Locale =
        when (context.getSharedPreferences("settings", 0).getString("language", "cn")) {
            "auto" -> getSysLocale()
            "zh-rCN" -> Locale("zh", "CN")
            "zh-rTW" -> Locale("zh", "TW")
            "en" -> Locale("en")
            else -> getSysLocale()
        }

    /**
     * 获取当前系统的 Locale
     */
    private fun getSysLocale(): Locale = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        LocaleList.getDefault()[0]
    } else {
        Locale.getDefault()
    }
}
```

这里使用了 `object` 关键字让他变成一个单例类，而且我选择的是把设置的语言信息通过 `SharedPreferences` 进行存储，这里根据你的实际情况来调整就 OK。

## 使用

在**每一个** `Activity` 或者你封装好的 `BaseActivity` 里重写这样的方法即可：

```kotlin
@RequiresApi(Build.VERSION_CODES.N)
override fun attachBaseContext(newBase: Context?) {
    //如果不使用工具类也可以在这里处理好 Locale 传入
    val context = newBase?.let {
        ContextWrapper.wrap(newBase,LanguageUtil.getLocale(newBase))
        }
    super.attachBaseContext(context)
}
```

这样就可以正常的切换语言了
