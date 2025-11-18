# 轮播图功能使用指南

本指南详细介绍如何在 Demius 主题中使用轮播图功能。

---

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [显示控制](#显示控制)
- [样式定制](#样式定制)
- [常见问题](#常见问题)

---

## ✨ 功能特性

- ✅ **支持两种内容类型**：文章轮播、纯图片轮播
- ✅ **双向滚动**：水平（左右）、垂直（上下）
- ✅ **自动播放**：可配置间隔时间
- ✅ **手动控制**：导航按钮、指示器
- ✅ **触摸支持**：移动端拖拽切换
- ✅ **页面控制**：可指定在哪些页面显示
- ✅ **响应式设计**：自动适配各种屏幕
- ✅ **懒加载**：优化性能

---

## 🚀 快速开始

### 1. 启用轮播图

在 `hugo.toml` 中启用并配置：

```toml
[params.carousel]
  enable = true              # 启用轮播图
  height = 200               # 高度（px）
  autoplay = true            # 自动播放
  interval = 5000            # 播放间隔（毫秒）
  direction = "horizontal"   # 方向：horizontal（水平）或 vertical（垂直）
  showOnPages = ["home"]     # 显示页面
```

### 2. 添加轮播内容

#### **方式一：文章轮播**

```toml
[[params.carousel.items]]
  type = "post"
  slug = "article-slug-name"  # 文章的 slug
```

#### **方式二：图片轮播**

```toml
[[params.carousel.items]]
  type = "image"
  image = "/img/banner1.jpg"
  title = "图片标题"
  summary = "图片描述"
  link = "/posts/some-article/"  # 可选
```

### 3. 重新构建

```bash
hugo server
```

---

## ⚙️ 配置说明

### 基础配置

```toml
[params.carousel]
  enable = true              # 是否启用轮播图（必需）
  height = 200               # 轮播图高度（px）
  autoplay = true            # 是否自动播放
  interval = 5000            # 自动播放间隔（毫秒）
  direction = "horizontal"   # 滚动方向
  showOnPages = ["home"]     # 显示页面控制
```

### 参数详解

#### **enable** (布尔值)
- **作用：** 总开关，控制是否启用轮播图功能
- **默认值：** `false`
- **建议：** 设置为 `true` 启用

#### **height** (数字)
- **作用：** 轮播图容器高度（像素）
- **默认值：** `200`
- **建议：** 
  - 桌面端：200-300px
  - 移动端：150-200px（自动适配）

#### **autoplay** (布尔值)
- **作用：** 是否自动播放
- **默认值：** `true`
- **建议：** 
  - 内容多时启用（≥3项）
  - 内容少时可关闭

#### **interval** (数字)
- **作用：** 自动播放间隔（毫秒）
- **默认值：** `5000`（5秒）
- **建议：** 
  - 图片轮播：3000-5000ms
  - 文章轮播：5000-8000ms

#### **direction** (字符串)
- **作用：** 滚动方向
- **可选值：** 
  - `"horizontal"`：水平（左右滚动）
  - `"vertical"`：垂直（上下滚动）
- **默认值：** `"horizontal"`
- **建议：** 
  - 文章轮播：水平
  - 图片展示：垂直更有创意

#### **showOnPages** (字符串或数组)
- **作用：** 控制在哪些页面显示
- **可选值：**
  - `"home"`：仅首页
  - `"posts"`：仅文章详情页
  - `"all"`：所有页面
  - `["home", "posts"]`：首页和文章页
- **默认值：** `["home"]`

---

## 📝 添加轮播项

### 文章轮播

#### **通过 slug 引用文章**

```toml
[[params.carousel.items]]
  type = "post"
  slug = "my-article-slug"
```

**说明：**
- 自动获取文章的标题、摘要、封面、日期
- 点击可跳转到文章详情页
- 需要确保文章存在且 slug 正确

#### **文章 slug 获取方法**

在文章 Front Matter 中查看：

```markdown
---
title: "文章标题"
slug: "my-article-slug"  # ← 这就是 slug
---
```

### 图片轮播

#### **完整配置**

```toml
[[params.carousel.items]]
  type = "image"
  image = "/img/banner1.jpg"        # 图片路径（必需）
  title = "图片标题"                 # 标题（可选）
  summary = "图片描述文字"           # 描述（可选）
  link = "/posts/some-article/"     # 点击跳转链接（可选）
```

#### **纯展示（无链接）**

```toml
[[params.carousel.items]]
  type = "image"
  image = "/img/banner1.jpg"
  title = "美丽的风景"
  summary = "这是一张美丽的风景图片"
```

### 混合使用

可以同时添加文章和图片：

```toml
# 第一项：文章
[[params.carousel.items]]
  type = "post"
  slug = "article-1"

# 第二项：图片
[[params.carousel.items]]
  type = "image"
  image = "/img/banner1.jpg"
  title = "活动海报"

# 第三项：文章
[[params.carousel.items]]
  type = "post"
  slug = "article-2"
```

---

## 🎨 显示控制

### 首页显示

```toml
showOnPages = ["home"]
# 或
showOnPages = "home"
```

**效果：** 仅在网站首页显示轮播图

### 文章详情页显示

```toml
showOnPages = ["posts"]
# 或
showOnPages = "posts"
```

**效果：** 仅在文章详情页显示轮播图

### 所有页面显示

```toml
showOnPages = "all"
```

**效果：** 在网站所有页面显示轮播图

### 多页面显示

```toml
showOnPages = ["home", "posts"]
```

**效果：** 在首页和文章详情页显示轮播图

---

## 🎯 完整示例

### 示例一：首页文章轮播（水平）

```toml
[params.carousel]
  enable = true
  height = 200
  autoplay = true
  interval = 5000
  direction = "horizontal"
  showOnPages = ["home"]
  
  [[params.carousel.items]]
    type = "post"
    slug = "demius-theme-guide"
  
  [[params.carousel.items]]
    type = "post"
    slug = "hugo-tutorial"
  
  [[params.carousel.items]]
    type = "post"
    slug = "web-development"
```

### 示例二：首页图片轮播（垂直）

```toml
[params.carousel]
  enable = true
  height = 250
  autoplay = true
  interval = 4000
  direction = "vertical"
  showOnPages = ["home"]
  
  [[params.carousel.items]]
    type = "image"
    image = "/img/banner1.jpg"
    title = "2024年终总结"
    summary = "回顾这一年的成长与收获"
    link = "/posts/year-end-summary/"
  
  [[params.carousel.items]]
    type = "image"
    image = "/img/banner2.jpg"
    title = "新功能上线"
    summary = "Demius主题全新升级"
    link = "/posts/new-features/"
  
  [[params.carousel.items]]
    type = "image"
    image = "/img/banner3.jpg"
    title = "精选推荐"
    summary = "本周热门文章推荐"
```

### 示例三：混合轮播

```toml
[params.carousel]
  enable = true
  height = 220
  autoplay = true
  interval = 6000
  direction = "horizontal"
  showOnPages = "all"
  
  [[params.carousel.items]]
    type = "image"
    image = "/img/welcome-banner.jpg"
    title = "欢迎访问"
    summary = "感谢您的到来"
  
  [[params.carousel.items]]
    type = "post"
    slug = "featured-article-1"
  
  [[params.carousel.items]]
    type = "post"
    slug = "featured-article-2"
  
  [[params.carousel.items]]
    type = "image"
    image = "/img/sponsor-banner.jpg"
    title = "赞助支持"
    summary = "如果您觉得内容有帮助，欢迎赞助"
    link = "/about/"
```

---

## 🎨 样式定制

### 修改轮播图高度

```toml
[params.carousel]
  height = 300  # 增加高度到300px
```

### 修改边框圆角

在自定义CSS中添加：

```css
.carousel-container {
  border-radius: 20px;  /* 默认12px */
}
```

### 修改导航按钮样式

```css
.carousel-nav {
  width: 3rem;
  height: 3rem;
  background: rgba(0, 0, 0, 0.7);
}
```

### 修改指示器样式

```css
.carousel-indicator {
  width: 12px;
  height: 12px;
  background: var(--accent-primary);
}

.carousel-indicator.active {
  width: 30px;
}
```

---

## 🔧 高级配置

### 禁用自动播放

```toml
[params.carousel]
  autoplay = false
```

**效果：** 只能手动切换，不会自动播放

### 加快切换速度

```toml
[params.carousel]
  interval = 3000  # 3秒切换一次
```

### 垂直滚动

```toml
[params.carousel]
  direction = "vertical"
```

**效果：** 
- 导航按钮在右侧
- 指示器在右侧垂直排列
- 上下滚动切换

---

## 📱 响应式适配

### 自动适配

轮播图会自动适配不同屏幕尺寸：

| 屏幕尺寸 | 导航按钮 | 指示器 | 图片 |
|----------|----------|--------|------|
| 桌面端（>768px） | 2.5rem | 8px | 完整显示 |
| 移动端（≤768px） | 2rem | 6px | 自动缩放 |

### 移动端优化建议

```toml
[params.carousel]
  height = 180  # 移动端建议较小高度
  interval = 4000  # 移动端建议较短间隔
```

---

## 🌙 暗色模式

轮播图自动适配暗色模式：

**亮色模式：**
- 导航按钮：白色背景
- 指示器：浅色边框
- 文字：深色

**暗色模式：**
- 导航按钮：黑色半透明背景
- 指示器：深色边框
- 文字：浅色

**无需额外配置**，跟随网站主题自动切换。

---

## 🔍 常见问题

### Q1: 轮播图不显示？

**检查清单：**
1. ✅ `enable = true` 已设置
2. ✅ 至少添加了一个轮播项
3. ✅ `showOnPages` 配置正确
4. ✅ 文章 slug 正确（文章轮播）
5. ✅ 图片路径正确（图片轮播）

### Q2: 文章轮播显示为空白？

**原因：** 文章 slug 错误或文章不存在

**解决：**
1. 检查文章 Front Matter 中的 slug
2. 确保文章已发布（`draft: false`）
3. 确保文章类型为 `posts`

### Q3: 图片不显示？

**原因：** 图片路径错误

**解决：**
1. 图片放在 `static/img/` 目录
2. 路径使用 `/img/filename.jpg`
3. 检查文件名大小写

### Q4: 如何在Mode2大图模式下隐藏轮播图？

**自动处理：** 
- Mode2激活时，轮播图自动隐藏
- 三栏布局显示后，轮播图淡入

**无需额外配置**

### Q5: 垂直滚动时导航按钮重叠？

**已修复：** 
- 垂直模式下，导航按钮和指示器都在右侧
- 使用固定位置，不会重叠

### Q6: 如何修改轮播图宽度？

**默认行为：** 轮播图宽度自动匹配三栏布局

**自定义宽度：**
```css
.carousel-container {
  max-width: 1200px;
  margin: 0 auto;
}
```

### Q7: 可以禁用某些控制元素吗？

**隐藏导航按钮：**
```css
.carousel-nav {
  display: none;
}
```

**隐藏指示器：**
```css
.carousel-indicators {
  display: none;
}
```

### Q8: 轮播图和大图冲突？

**已处理：**
- Mode1/Mode2激活时，轮播图自动隐藏
- 使用 `opacity: 0` + `height: 0` 完全隐藏
- 无性能影响

---

## 🎯 最佳实践

### 1. 内容数量

- ✅ 建议：3-5项
- ❌ 避免：1-2项（显得单调）
- ❌ 避免：>8项（用户疲劳）

### 2. 切换间隔

- ✅ 文章轮播：5-8秒
- ✅ 图片轮播：3-5秒
- ❌ 避免：<3秒（太快）
- ❌ 避免：>10秒（太慢）

### 3. 内容类型

**适合轮播：**
- ✅ 重点推荐文章
- ✅ 最新文章
- ✅ 活动公告
- ✅ 精美图片

**不适合轮播：**
- ❌ 普通列表
- ❌ 过时内容
- ❌ 重复内容

### 4. 显示位置

- ✅ 首页：最佳选择
- ⚠️ 文章页：谨慎使用（可能分散注意力）
- ❌ 所有页面：不推荐（影响性能）

---

## 📊 性能优化

### 1. 图片优化

- ✅ 使用压缩的图片（WebP格式）
- ✅ 设置合适的分辨率（1920x500足够）
- ✅ 启用懒加载（已默认启用）

### 2. 数量控制

- ✅ 控制在5项以内
- ✅ 避免大图片（每张<500KB）

### 3. 自动播放

- ✅ 合理设置间隔（≥3秒）
- ✅ 移动端可考虑禁用自动播放

---

## 🔄 更新日志

### v1.0.0 (2025-10-24)
- ✨ 初始版本发布
- ✅ 支持文章和图片两种类型
- ✅ 水平和垂直双向滚动
- ✅ 自动播放和手动控制
- ✅ 页面显示控制
- ✅ Mode2大图兼容
- ✅ 响应式设计
- ✅ 暗色模式适配

---

## 📝 许可证

本功能遵循 Demius 主题的许可证协议。

---

**祝使用愉快！** 🎉

