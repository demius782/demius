---
title: "你好，Demius：从 0 到 1 的快速体验"
slug: hello-demius
date: 2025-11-01T10:00:00+08:00
lastmod: 2025-11-15T20:00:00+08:00
draft: false
description: "带你 10 分钟跑通 Demius 主题的全部基础能力，了解三栏布局、侧栏组件、卡片风格以及沉浸式交互。"
summary: "带你 10 分钟跑通 Demius 主题的全部基础能力，了解三栏布局、侧栏组件、卡片风格以及沉浸式交互。"
tags: ["主题上手", "组件基础", "发布日志"]
categories: ["产品动态"]
cover: "/img/index.png"
pinned: true
comments: true
---

Demius 是我为个人与内容创作者设计的 Hugo 主题，目标是在 **现代化设计** 与 **内容可读性** 之间取得最好平衡。整个站点默认采用三栏瀑布流 + 多模块侧边栏布局，并内置丰富的组件、数据页与交互动画。

## 核心体验一览

- ✨ **多列卡片与沉浸阅读**：首页支持 1/2/3 列切换，文章页可一键进入无干扰模式。
- 🎛️ **全量功能开关**：`hugo.toml` 中的 `[params]` 已组装常用场景，复制即用。
- 📦 **数据页面**：音乐星球、追番星球、装备清单、愿望清单等全部通过 `data/*.yaml` 驱动。
- 🪄 **短代码**：按钮、时间线、选项卡、加密区块……让 Markdown 也能拥有复杂布局。

{{< button href="/about/" color="primary" size="large" icon="fas fa-play" target="_blank" rel="noopener" >}}查看关于页面演示{{< /button >}}

{{< button href="https://example.com" color="success" icon="fas fa-bolt" >}}访问在线 Demo{{< /button >}}

## 折叠式详情

{{< collapse "主题亮点（默认展开）" "open" "chevron" >}}
- 黑暗/亮色自动适配，支持玻璃态与透明背景
- 级联菜单、动态公告栏、友链 & 网友圈等页面组件
- PJAX + 进度条的流畅页面切换体验
{{< /collapse >}}

{{< collapse "适用场景" "" "plus" >}}
1. 个人博客与周记文章
2. 作品集、活动记录、数据墙
3. 想要把「导航 / 说说 / 数据」放在同一主题的玩家
{{< /collapse >}}

## 时间线示例

{{< timeline >}}
  {{< timeline-item "2025-10-10" "v2.7.0 · 三栏瀑布流" "success" "star" >}}
  新增首页瀑布流曲线动画与卡片透明模式，文章列表更具层次感。
  {{< /timeline-item >}}

  {{< timeline-item "2025-10-24" "v2.8.0 · 数据宇宙" "info" "plus" >}}
  数据页、音乐星球、追番星球正式加入，借助 `data/*.yaml` 快速填充卡片。
  {{< /timeline-item >}}

  {{< timeline-item "2025-11-10" "v2.8.8 · 访问体验" "warning" "check" >}}
  全站 PJAX、顶部公告、浮动工具条与沉浸阅读按钮打包上线。
  {{< /timeline-item >}}
{{< /timeline >}}

## 下一步

- 复制 `exampleSite/hugo.toml` 作为你的站点配置基础。
- 将示例中的 `data/*.yaml` 与 `content/*.md` 替换为你的真实数据。
- 如果想要了解更细的组件参数，可以阅读主题内的 `README` 或者访问文档页面。

想要继续深入？另一篇文章会展示更多互动性组件与加密内容写法。

