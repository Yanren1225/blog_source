# -*- coding: UTF-8 -*-
import os
import time

start = time.perf_counter_ns()

print("========== 开始清除缓存 ==========\n")

os.system("hexo clean")

print("\n========== 清除缓存完成 ==========\n")
print("\n\n")

print("========== 开始获取 steam 游戏数据 ==========\n")

# os.system("hexo steam -U")

print("\n========== 获取 steam 游戏数据完成 ==========\n")
print("\n\n")

print("========== 开始生成页面 ==========\n")

os.system("hexo g")

print("\n========== 生成页面完成 ==========\n")
print("\n\n")

print("========== 开始压缩页面 ==========\n")

os.system("gulp")

print("\n========== 压缩页面完成 ==========\n")
print("\n\n")

print("========== 开始推送页面 ==========\n")

os.system("hexo d")

print("\n========== 推送页面完成 ==========\n")
end = time.perf_counter_ns()
print("本次运行时间：%s 秒" % (end - start))
