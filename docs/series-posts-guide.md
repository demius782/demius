# 系列文章组件使用指南

本指南详细介绍如何在 Demius 主题中使用系列文章侧栏组件。

---

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [智能检测](#智能检测)
- [样式说明](#样式说明)
- [常见问题](#常见问题)

---

## ✨ 功能特性

- ✅ **系列管理**：支持多个系列文章集合
- ✅ **轮播功能**：多系列时自动轮播切换
- ✅ **智能检测**：文章详情页自动显示当前系列
- ✅ **手动控制**：左右箭头切换系列
- ✅ **悬停显示**：箭头仅悬停时显示
- ✅ **样式统一**：与相关文章组件风格一致
- ✅ **响应式设计**：自动适配各种屏幕
- ✅ **PJAX兼容**：页面切换时自动更新

---

## 🚀 快速开始

### 1. 启用系列文章组件

在 `hugo.toml` 中配置：

```toml
[params.aside]
  right = ["author", "toc", "recent-posts", "series-posts", "tags"]
  # 确保 series-posts 在列表中

[params.aside.seriesPosts]
  enable = true                # 启用系列文章组件
  enableCarousel = true        # 启用轮播功能
  carouselInterval = 8000      # 轮播间隔（毫秒）
```

### 2. 添加系列

```toml
[[params.aside.seriesPosts.series]]
  name = "Hugo 博客搭建系列"
  description = "从零开始搭建 Hugo 博客"
  slugs = ["article-1", "article-2", "article-3"]
```

### 3. 重新构建

```bash
hugo server
```

---

## ⚙️ 配置说明

### 基础配置

```toml
[params.aside.seriesPosts]
  enable = true                # 是否启用（必需）
  enableCarousel = true        # 是否启用轮播
  carouselInterval = 8000      # 轮播间隔（毫秒）
```

### 参数详解

#### **enable** (布尔值)
- **作用：** 总开关
- **默认值：** `false`
- **建议：** 有系列文章时设置为 `true`

#### **enableCarousel** (布尔值)
- **作用：** 是否启用系列轮播
- **默认值：** `false`
- **适用场景：**
  - `true`：有多个系列时自动切换
  - `false`：始终显示第一个系列

#### **carouselInterval** (数字)
- **作用：** 自动轮播间隔（毫秒）
- **默认值：** `8000`（8秒）
- **建议：** 5000-10000ms

---

## 📝 添加系列

### 单个系列

```toml
[[params.aside.seriesPosts.series]]
  name = "Hugo 博客搭建系列"
  description = "从零开始搭建 Hugo 博客"
  slugs = ["hugo-install", "hugo-theme", "hugo-deploy"]
```

### 多个系列

```toml
# 系列1
[[params.aside.seriesPosts.series]]
  name = "Hugo 博客搭建系列"
  description = "从零开始搭建 Hugo 博客"
  slugs = ["hugo-install", "hugo-theme", "hugo-deploy"]

# 系列2
[[params.aside.seriesPosts.series]]
  name = "Demius 主题使用"
  description = "Demius 主题功能详解"
  slugs = ["theme-config", "theme-customize", "theme-advanced"]

# 系列3
[[params.aside.seriesPosts.series]]
  name = "Web 开发实战"
  description = "前端开发技巧分享"
  slugs = ["html-basics", "css-tricks", "js-advanced"]
```

### 字段说明

- **name**：系列名称（必需）
- **description**：系列描述（可选）
- **slugs**：文章 slug 数组（必需）

---

## 🎯 完整示例

```toml
[params.aside]
  right = ["author", "toc", "recent-posts", "series-posts", "tags"]

[params.aside.seriesPosts]
  enable = true
  enableCarousel = true
  carouselInterval = 8000
  
  # 系列1：Hugo教程
  [[params.aside.seriesPosts.series]]
    name = "Hugo 博客搭建系列"
    description = "从零开始搭建 Hugo 博客"
    slugs = ["zt23fdu1", "mne507if", "dzowjlg5"]
  
  # 系列2：主题使用
  [[params.aside.seriesPosts.series]]
    name = "Demius 主题使用"
    description = "Demius 主题功能详解"
    slugs = ["lyb5xlt2", "7hsd4t0x", "pkdvxhfn"]
  
  # 系列3：前端开发
  [[params.aside.seriesPosts.series]]
    name = "前端开发实战"
    description = "HTML/CSS/JavaScript 技巧"
    slugs = ["html-01", "css-01", "js-01", "js-02"]
```

---

## 🧠 智能检测功能

### 自动识别当前系列

当用户访问某篇文章时，系列文章组件会：

1. **检测文章所属系列**
   - 自动匹配当前文章的 slug
   - 找到包含该文章的系列

2. **固定显示该系列**
   - 不再轮播到其他系列
   - 隐藏左右切换箭头
   - 高亮当前文章

3. **返回首页恢复轮播**
   - 离开文章页后恢复正常轮播
   - 重新显示切换箭头

### 工作流程

```
首页：
  └─ 系列1 → 系列2 → 系列3 → 系列1 ...
     （每8秒自动切换）
     （鼠标悬停显示箭头）

点击系列2的文章进入详情页：
  └─ 系列2（固定显示）
     （不再轮播）
     （隐藏切换箭头）
     （当前文章高亮）

返回首页：
  └─ 系列1 → 系列2 → 系列3 → 系列1 ...
     （恢复轮播）
```

---

## 🎨 样式说明

### 组件结构

```
┌────────────────────────────────┐
│ 📚 系列文章                     │ ← 组件标题
├────────────────────────────────┤
│ Hugo 博客搭建系列               │ ← 系列名称
│ 从零开始搭建 Hugo 博客          │ ← 系列描述
│ ────────────────────────────  │
│ 1⃣️ [缩略图] Hugo 安装教程      │ ← 文章列表
│              2025-10-01        │
│ 2⃣️ [缩略图] 主题安装配置        │
│              2025-10-02        │
│ 3⃣️ [缩略图] 部署到服务器        │
│              2025-10-03        │
│                                │
│        ◀           ▶           │ ← 切换箭头（悬停显示）
└────────────────────────────────┘
```

### 切换箭头

- **默认状态：** 隐藏（`opacity: 0`）
- **悬停状态：** 显示（`opacity: 1`）
- **位置：** 左右两侧，垂直居中
- **样式：** 圆形半透明背景，白色箭头

### 文章列表

- **序号：** 圆形彩色序号
- **缩略图：** 64×36px（与相关文章一致）
- **标题：** 两行截断
- **日期：** 灰色小字

---

## 🎬 轮播控制

### 启用轮播

```toml
[params.aside.seriesPosts]
  enableCarousel = true
  carouselInterval = 8000  # 8秒切换一次
```

**行为：**
- 首页/列表页：自动轮播
- 文章详情页：停止轮播，固定显示当前系列
- 鼠标悬停：暂停轮播
- 鼠标移开：恢复轮播

### 禁用轮播

```toml
[params.aside.seriesPosts]
  enableCarousel = false
```

**行为：**
- 始终显示第一个系列
- 不显示切换箭头
- 不自动切换

### 手动切换

- **方式：** 鼠标悬停显示箭头，点击切换
- **位置：** 左右两侧
- **效果：** 淡入淡出切换动画

---

## 📱 响应式适配

### 桌面端（>768px）

```css
.series-name {
  font-size: 1rem;
}

.series-post-item {
  padding: 0.6rem 0;
}

.series-post-thumb {
  width: 64px;
  height: 36px;
}
```

### 移动端（≤768px）

```css
.series-name {
  font-size: 0.95rem;
}

.series-post-item {
  padding: 0.5rem 0;
}

.series-post-thumb {
  width: 56px;
  height: 32px;
}
```

---

## 🌙 暗色模式

自动适配暗色模式：

**亮色模式：**
- 背景：白色
- 文字：深色
- 箭头：白色半透明背景

**暗色模式：**
- 背景：深色
- 文字：浅色
- 箭头：黑色半透明背景

---

## 🔍 常见问题

### Q1: 系列文章不显示？

**检查清单：**
1. ✅ `enable = true`
2. ✅ `series-posts` 在 `params.aside.right` 中
3. ✅ 至少添加了一个系列
4. ✅ slugs 中至少有一个有效文章

### Q2: 文章不显示在系列中？

**原因：** slug 不匹配

**解决：**
```toml
# 错误
slugs = ["文章标题"]  # ❌ 应该用 slug，不是标题

# 正确
slugs = ["article-slug"]  # ✅ 使用文章的 slug
```

### Q3: 箭头一直显示？

**原因：** 应该仅在悬停时显示

**检查：**
- CSS 是否正确加载
- 浏览器是否支持 `:hover` 伪类

### Q4: 轮播不工作？

**检查清单：**
1. ✅ `enableCarousel = true`
2. ✅ 有多个系列（≥2个）
3. ✅ JavaScript 正确加载
4. ✅ 浏览器控制台无错误

### Q5: 文章详情页仍在轮播？

**检查：**
- Hugo 版本是否支持（≥0.100）
- PJAX 是否正确重新初始化
- 浏览器控制台是否有错误

### Q6: 如何修改轮播间隔？

```toml
[params.aside.seriesPosts]
  carouselInterval = 5000  # 改为5秒
```

### Q7: 可以禁用箭头吗？

```css
.series-control {
  display: none !important;
}
```

### Q8: 如何修改系列名称样式？

```css
.series-name {
  font-size: 1.2rem;
  color: var(--accent-primary);
  font-weight: bold;
}
```

---

## 🎯 最佳实践

### 1. 系列数量

- ✅ 建议：2-4个系列
- ⚠️ 谨慎：5-6个系列
- ❌ 避免：>6个系列

### 2. 文章数量

- ✅ 每个系列：3-10篇文章
- ⚠️ 单篇：显得单薄
- ❌ 过多：影响加载

### 3. 命名规范

**系列名称：**
- ✅ 简洁明了
- ✅ 突出主题
- ❌ 避免过长

**系列描述：**
- ✅ 一句话概括
- ✅ 突出特点
- ❌ 避免冗长

### 4. 轮播间隔

- ✅ 推荐：6-10秒
- ❌ 避免：<5秒（太快）
- ❌ 避免：>15秒（太慢）

### 5. 内容组织

**适合创建系列：**
- ✅ 教程类文章
- ✅ 连载内容
- ✅ 专题文章

**不适合系列：**
- ❌ 独立文章
- ❌ 无关联内容
- ❌ 临时文章

---

## 🔧 高级定制

### 修改箭头位置

```css
.series-prev {
  left: 1rem;  /* 默认 0.5rem */
}

.series-next {
  right: 1rem;
}
```

### 修改箭头样式

```css
.series-control {
  width: 3rem;
  height: 3rem;
  background: rgba(255, 0, 0, 0.9);
}
```

### 始终显示箭头

```css
.series-control {
  opacity: 1 !important;
  pointer-events: auto !important;
}
```

### 修改切换动画

```css
.series-item {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
```

---

## 📊 性能优化

### 1. 控制数量

- ✅ 系列数量：≤6个
- ✅ 每个系列文章：≤10篇

### 2. 图片优化

- ✅ 缩略图尺寸：64×36px
- ✅ 使用压缩图片
- ✅ 启用懒加载（已默认）

### 3. 轮播优化

- ✅ 合理间隔：≥6秒
- ✅ 文章详情页自动停止

---

## 🔄 更新日志

### v1.0.0 (2025-10-24)
- ✨ 初始版本发布
- ✅ 支持多系列管理
- ✅ 自动轮播功能
- ✅ 智能检测当前系列
- ✅ 悬停显示箭头
- ✅ 样式统一
- ✅ PJAX兼容

---

## 📝 许可证

本功能遵循 Demius 主题的许可证协议。

---

**祝使用愉快！** 🎉

