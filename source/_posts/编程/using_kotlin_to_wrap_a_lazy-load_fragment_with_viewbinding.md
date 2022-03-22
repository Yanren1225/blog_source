---
title: 使用 Kotlin 编写一个懒加载与 ViewBinding 的 Fragment
tags:
  - Android
  - 踩坑
  - Fragment
  - ViewPager
  - Kotlin
categories:
  - 编程
cover: "../../media/posts_img/android_kotlin_dev.svg"
description: 用一个语法糖糅合怪去糅合一堆特性。
abbrlink: 51f7c2cb
date: 2020-04-26 23:14:44
---

有关 ViewBinding 的用法看 [这里](https://developer.android.google.cn/topic/libraries/view-binding)

最近在学习 Kotlin 的时候有遇到需要封装一个拥有懒加载功能的 Fragment，并且我还想用上新的 ViewBinding 功能。
那么第一个实现比较简单的，之前在 Java 也封装过，唯一的问题就是之前使用的是重写 `setUserVisibleHint` 方法来实现的，不过这个方法已经被标记为 `deprecated`（弃用的）了，指不定那一天就用不了了。
根据官方的提示：

> Deprecated
> Use FragmentTransaction.setMaxLifecycle(Fragment, Lifecycle.State) instead.

我们现在应该去调用 `setMaxLifecycle` 方法来实现这个功能，使用 `setMaxLifecycle` 来限制了 Fragment 的生命周期，Fragment 的 `onReseume()` 只有当 Fragment 显示在屏幕上时才会执行，这样就可以把加载数据的方法放在 `onResume()` 方法中来实现懒加载了。
在 `FragmentPagerAdapter` 适配器构造方法中有一个 `behavior` 参数，我们只需要传入一个参数就可以限制他的生命周期了。

那么剩下的就是 `ViewBinding` 了，这个只需要在继承的时候传入参数就好了，那就开始动手

## BaseFragment 部分

首先贴上代码

```kotlin
/**
 * 封装一个有懒加载的 Fragment
 * @param T 传入泛型的 ViewBinding
 * @param layoutId 传入布局用来跳过在子类中初始化传入 inflater
 */
abstract class BaseFragment<T : ViewBinding>(private val layoutId: Int) : Fragment(layoutId) {
    private var isViewOK = false //是否完成 View 初始化
    private var isFirst = true //是否为第一次加载

    private var _binding: T? = null

    val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(layoutId, container, false)
        // 完成 initView 后改变view的初始化状态为完成
        isViewOK = true
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = initBinding(view)
        initView()
    }

    /**
     * 传入对应的 ViewBinding
     */
    abstract fun initBinding(view: View): T

    /**
     * fragment 初始化 view 的方法
     */
    abstract fun initView()

    override fun onResume() {
        super.onResume()
        //在 onResume 进行数据懒加载
        initLoadData()
    }

    private fun initLoadData() {
        if (isViewOK && isFirst) {
            //加载数据时判断是否完成view的初始化，以及是不是第一次加载此数据
            loadDate()
            //加载第一次数据后改变状态，后续不再重复加载
            isFirst = false
        }
    }

    /**
     * fragment 实现懒加载的方法，即在这里加载数据
     */
    abstract fun loadDate()

    //释放数据
    override fun onDestroyView() {
        _binding = null
        super.onDestroyView()
    }
}
```

没什么好说的，主要的东西我都写在注释里了，只有两点要注意下：

- class 必须声明为 abstract 这样才能让子类去实现懒加载的方法
- 注意 `_binding` 和 `binding`，这两个一个对外一个对内，对内的注意在 onDestroyView 进行释放，以免内存泄漏

## 子类 TestFragment

那我们看看这个应该如何使用吧
（假设你的 Fragment 的布局名称是 fragment_test，里面有一个 id 为 tvMain 的 TextView）

```kotlin
class TestFragment : BaseFragment<FragmentTestBinding>(R.layout.fragment_test) {


    override fun initBinding(view: View): FragmentTestBinding {
        return FragmentTestBinding.bind(view)
    }

    override fun initView() {
        // 这里是初始化 View 的方法
        binding.tvMain.text = "HI"
    }

    override fun loadDate() {
        // 这里的初始化了数据的方法
        Toast.makeText(activity,"我初始化了数据",Toast.LENGTH_SHORT).show()
    }
}
```

跟简单吧，做到了 View 与数据的分离

## ViewAdapter 的处理

那说了这么多，「那个参数」 到底在哪里呢？来了来了，不过我们要先写一个 adapter 才可以

```kotlin
class ViewPagerAdapter constructor (
    private val fragmentManager: FragmentManager,
    // 注意看这个参数
    private val behavior: Int,
    private val fragmentList: List<BaseFragment<*>>
) :
    FragmentPagerAdapter(fragmentManager, behavior) {

    override fun getItem(position: Int): Fragment = fragmentList[position]

    override fun getCount(): Int = fragmentList.size
}
```

代码很简单，只是重写了几个方法而已，不过接下来才是重点,在调用传入的时候我们需要转入重要的参数

```kotlin
viewPager.adapter = ViewPagerAdapter(
            supportFragmentManager,
            // 看这里
            FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT,
            fragmentList
        )
// 设置预加载的数量，来测试懒加载是否成功
viewPager.offscreenPageLimit = 4
```

注意看我们传入了 `FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT`，这个参数就是作为限制 Fragment 生命周期而存在的。

这样就简单的实现了需要的功能了。
