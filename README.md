# 2048
## 简述
登陆界面，2048界面，排行榜界面
## 语言
wxml，wxss，js
## 界面一：登陆界面
1. 建立两个输入框，将输入的值变为全局变量
2. 登陆按钮添加<a>超链接
3. 对输入进行判断，未存入数据库则存入并保存，若存入则计算该用户的最高分
## 界面二：2048
1. 游戏结束之后显示按钮，该按钮用于提交最高分
## 界面三：排行榜
（懒的写了，有时间再补充吧。。。）
## 最高分的判断
读取缓存，判断历史最高分与当前分数，当返回界面一时，清空缓存
