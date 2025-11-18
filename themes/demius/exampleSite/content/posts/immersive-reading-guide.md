---
title: "沉浸模式与互动组件实战"
slug: immersive-reading
date: 2025-11-05T09:30:00+08:00
lastmod: 2025-11-15T21:00:00+08:00
draft: false
description: "演示 Demius 主题的沉浸阅读、PJAX、短代码、音乐/视频嵌入和局部加密写作方式。"
summary: "进一步展示 Demius 主题的沉浸阅读按钮、浮动工具条、短代码组件、视频与音乐播放，以及局部加密内容。"
tags: ["沉浸模式", "短代码", "多媒体"]
categories: ["功能演示"]
cover: "/img/bj.jpg"
comments: true
---

在上一篇《你好，Demius》中，我们了解了主题的整体布局。这篇文章把重点放在交互体验：沉浸阅读按钮、浮动工具条、短代码组件以及多媒体内容。

## 开启沉浸阅读与浮动工具条

`hugo.toml` 中已经包含了相关配置，只需确保以下开关为 `true`：

```toml
[params.floatToolbar]
  enable = true
  showImmersiveMode = true
  showDarkMode = true
  showScrollTop = true
```

这样文章页会自动出现浮动按钮，读者可以一键切换沉浸模式、返回顶部或者开启暗色模式。

## 常用交互一览

{{< tabs tabs="沉浸阅读,浮动工具,快捷操作" default="1" >}}
  {{< tab index="1" >}}
  - 文章页右下角会显示「沉浸阅读」按钮  
  - 点击后会隐藏侧栏与页眉，仅保留正文
  - 再次点击或按 `Esc` 可退出
  {{< /tab >}}

  {{< tab index="2" >}}
  浮动工具条支持：  
  1. 回到顶部/底部  
  2. 打开暗色/亮色切换  
  3. 展开全站音乐播放器  
  {{< /tab >}}

  {{< tab index="3" >}}
  - `pjax = true`：无刷新跳转  
  - `tocOpen = true`：目录默认展开  
  - `stickyHeader = true`：滚动时导航栏保持可见  
  {{< /tab >}}
{{< /tabs >}}

## 视频与音乐

{{< bilibili bvid="BV1hE411c7mD" autoplay="false" danmaku="false" >}}

{{< music server="netease" type="song" id="27583305" theme="#ff7f50" >}}

如果你更偏好本地文件，也可以把音频放到 `static/audio` 中，然后：

```markdown
{{</* music name="Demo BGM" artist="Demius" url="/audio/demo.mp3" mini="true" */>}}
```

## 局部内容加密

有些发布日志或内测计划只想对指定读者开放，可以用 `encrypt` 短代码：

{{< encrypt password="demo" hint="输入 demo 解锁演示内容" >}}
### 内测更新
- v2.9.1 将引入新的访客信息组件
- 访客卡片支持 IP 归属地与文章访问深度
- 预计在 11 月底发布 RC 版本
{{< /encrypt >}}

## 分步指引

{{< timeline >}}
  {{< timeline-item "1️⃣ 导入配置" "复制 exampleSite/hugo.toml，替换基础信息" "success" "check" >}}
  {{< /timeline-item >}}
  {{< timeline-item "2️⃣ 添加数据" "编辑 data/*.yaml，让数据页立即生效" "info" "plus" >}}
  {{< /timeline-item >}}
  {{< timeline-item "3️⃣ 加入多媒体" "在文章里插入 music / video / encrypt 等短代码" "warning" "star" >}}
  {{< /timeline-item >}}
{{< /timeline >}}

通过这些组件，你可以把 Demius 打造成兼具美观与可玩性的博客。接下来尝试修改示例数据或撰写自己的文章，看看还能组合出哪些有趣的页面吧！

