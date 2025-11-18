# 侧栏组件配置指南

本指南详细介绍如何在 Demius 主题中配置和自定义侧边栏组件。

---

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [可用组件列表](#可用组件列表)
- [组件配置](#组件配置)
- [自定义排序](#自定义排序)
- [常见问题](#常见问题)

---

## ✨ 功能特性

- ✅ **丰富组件**：12+ 种侧栏组件
- ✅ **灵活布局**：左右侧栏独立配置
- ✅ **自由排序**：拖拽式组件排序
- ✅ **显示控制**：单独开关每个组件
- ✅ **数量控制**：自定义显示数量
- ✅ **响应式**：移动端自动隐藏/折叠
- ✅ **PJAX兼容**：页面切换无刷新

---

## 🚀 快速开始

### 1. 基础配置

在 `hugo.toml` 中配置：

```toml
[params.aside]
  # 左侧栏组件（从上到下排列）
  left  = ["author", "announcement", "social-Media"]
  
  # 右侧栏组件（从上到下排列）
  right = ["search", "toc", "related-Posts", "tags"]
  
  # 组件开关
  showAuthor = true
  showToc = true
  showTags = true
```

### 2. 重新构建

```bash
hugo server
```

### 3. 查看效果

访问网站查看侧栏布局

---

## 📦 可用组件列表

### 信息展示类

#### **author** - 作者信息卡片
- 显示头像、昵称、简介
- 支持社交链接
- 固定在侧栏顶部

#### **announcement** - 公告栏
- 站点公告信息
- 支持重要公告样式
- 带链接跳转

#### **advertisement** - 广告位
- 推广内容展示
- 图片 + 标题 + 描述
- 点击跳转链接

---

### 导航类

#### **search** - 搜索组件
- 本地搜索功能
- 实时搜索结果
- 支持中文分词

#### **toc** - 文章目录
- 自动生成文章目录
- 高亮当前章节
- 点击平滑滚动
- 仅文章页显示

#### **archive** - 归档组件
- 按年月归档文章
- 折叠/展开功能
- 显示文章数量统计

---

### 内容推荐类

#### **recent-Posts** - 最新文章
- 显示最新发布的文章
- 可自定义显示数量
- 带封面图和日期

#### **popular-Posts** - 热门文章
- 显示浏览量最高的文章
- 可自定义显示数量
- 按热度排序

#### **related-Posts** - 相关文章
- 根据标签/分类推荐
- 自动计算相关性
- 仅文章页显示

#### **series-posts** - 系列文章
- 系列内容组织
- 支持多系列轮播
- 智能检测当前系列

---

### 分类聚合类

#### **tags** - 标签云
- 显示热门标签（按文章数量排序）
- 可自定义显示数量
- 显示每个标签的文章数量
- 点击查看相关文章

#### **categories** - 分类组件
- 显示所有分类
- 显示文章数量
- 列表或网格布局

---

### 互动类

#### **recent-Comments** - 最新评论
- 显示最新评论
- 评论者头像 + 内容
- 点击跳转到评论

#### **social-Media** - 社交媒体
- 社交平台链接
- 图标 + 颜色自定义
- 支持自定义内容

---

## 🎨 组件配置

### 左右侧栏配置

```toml
[params.aside]
  # 左侧栏组件顺序
  left  = [
    "author",
    "announcement",
    "social-Media",
    "recent-Comments",
    "popular-Posts",
    "advertisement"
  ]
  
  # 右侧栏组件顺序
  right = [
    "search",
    "toc",
    "series-posts",
    "related-Posts",
    "tags",
    "recent-Posts",
    "categories",
    "archive"
  ]
```

**说明：**
- 数组顺序 = 组件显示顺序（从上到下）
- 移除组件：从数组中删除
- 添加组件：添加到数组中

---

### 组件开关控制

```toml
[params.aside]
  showAuthor = true           # 作者信息卡片
  showToc = true              # 目录组件
  showTags = true             # 标签云
  showRecent = true           # 最新文章
  showSearch = false          # 搜索组件
  showCategories = true       # 分类组件
  showArchive = true          # 归档组件
  showPopularPosts = true     # 热门文章
  showRelatedPosts = true     # 相关文章
  showSocialMedia = false     # 社交媒体
  showAdvertisement = false   # 广告位
  showAnnouncement = true     # 公告栏
```

**说明：**
- `true`：显示组件
- `false`：隐藏组件
- 隐藏后不占空间

---

### 组件数量控制

```toml
[params.aside]
  popularCount = 5    # 热门文章显示数量
  recentCount = 5     # 最新文章显示数量
  relatedCount = 5    # 相关文章显示数量
  tagsCount = 20      # 标签云显示数量（0表示显示全部）
```

**说明：**
- `popularCount`、`recentCount`、`relatedCount`：文章列表显示数量
- `tagsCount`：标签云显示数量，按文章数量降序排列，设置为 0 表示显示全部标签

**建议：**
- 文章列表：移动端 3-5 篇，桌面端 5-10 篇
- 标签云：移动端 10-15 个，桌面端 20-30 个

---

### 最新评论配置

```toml
[params.aside.recentComments]
  enable = true
  count = 5
```

**参数：**
- `enable`：是否启用
- `count`：显示数量

---

### 归档组件配置

```toml
[params.aside.archive]
  defaultOpenCurrentYear = true   # 默认展开当前年份
  defaultOpenCurrentMonth = false # 默认展开当前月份
  showStats = true                # 显示统计信息
  groupBy = "month"               # 分组方式：year, month, day
```

**分组方式：**
- `year`：按年份分组
- `month`：按月份分组
- `day`：按天分组

---

### 系列文章配置

```toml
[params.aside.seriesPosts]
  enable = true
  enableCarousel = true
  carouselInterval = 8000
  
  [[params.aside.seriesPosts.series]]
    name = "Hugo 博客搭建系列"
    description = "从零开始搭建 Hugo 博客"
    slugs = ["post-1-slug", "post-2-slug", "post-3-slug"]
  
  [[params.aside.seriesPosts.series]]
    name = "Demius 主题使用"
    description = "Demius 主题功能详解"
    slugs = ["guide-1-slug", "guide-2-slug"]
```

详见：[系列文章组件指南](series-posts-guide.md)

---

## 🎯 配置示例

### 示例一：极简配置

```toml
[params.aside]
  left  = ["author"]
  right = ["toc", "tags"]
  
  showAuthor = true
  showToc = true
  showTags = true
```

**效果：** 只显示作者、目录、标签

---

### 示例二：完整配置

```toml
[params.aside]
  left  = [
    "author",
    "announcement",
    "social-Media",
    "recent-Comments",
    "popular-Posts"
  ]
  
  right = [
    "search",
    "toc",
    "series-posts",
    "related-Posts",
    "tags",
    "recent-Posts",
    "categories",
    "archive"
  ]
  
  showAuthor = true
  showToc = true
  showTags = true
  showRecent = true
  showSearch = true
  showCategories = true
  showArchive = true
  showPopularPosts = true
  showRelatedPosts = true
  showSocialMedia = true
  showAdvertisement = false
  showAnnouncement = true
  
  popularCount = 5
  recentCount = 5
  relatedCount = 5
  tagsCount = 20
```

**效果：** 所有组件启用（除广告）

---

### 示例三：博客推荐

```toml
[params.aside]
  left  = ["author", "announcement"]
  
  right = [
    "toc",
    "series-posts",
    "related-Posts",
    "recent-Posts",
    "tags",
    "archive"
  ]
  
  showAuthor = true
  showToc = true
  showTags = true
  showRecent = true
  showArchive = true
  showRelatedPosts = true
  showAnnouncement = true
  
  recentCount = 8
  relatedCount = 6
  tagsCount = 30
```

**效果：** 内容推荐为主

---

## 🎨 自定义排序

### 左侧栏排序

```toml
# 顺序1：作者优先
left  = ["author", "announcement", "social-Media"]

# 顺序2：公告优先
left  = ["announcement", "author", "social-Media"]

# 顺序3：社交媒体优先
left  = ["social-Media", "author", "announcement"]
```

### 右侧栏排序

```toml
# 顺序1：目录优先（推荐）
right = ["toc", "series-posts", "related-Posts", "tags"]

# 顺序2：搜索优先
right = ["search", "toc", "tags", "archive"]

# 顺序3：推荐内容优先
right = ["series-posts", "related-Posts", "popular-Posts", "toc"]
```

---

## 📱 响应式行为

### 桌面端 (> 1024px)

- 左右侧栏同时显示
- 所有组件正常显示
- 完整功能可用

### 平板端 (768-1023px)

- 侧栏宽度自动调整
- 组件内容缩略显示
- 部分组件可能隐藏

### 移动端 (< 768px)

- 侧栏默认隐藏
- 点击按钮展开
- 仅显示重要组件

---

## 🔧 高级定制

### 修改组件顺序（代码层）

在模板文件中修改：

```html
<!-- themes/demius/layouts/partials/aside/aside-left.html -->
{{ range .Site.Params.aside.left }}
  {{ partial (printf "aside/widgets/%s.html" .) $ }}
{{ end }}
```

### 添加自定义组件

1. 创建组件文件：`themes/demius/layouts/partials/aside/widgets/my-widget.html`

2. 添加HTML：
```html
<section class="aside-card my-widget">
  <h3 class="aside-title">我的组件</h3>
  <div class="widget-content">
    <!-- 自定义内容 -->
  </div>
</section>
```

3. 在配置中启用：
```toml
[params.aside]
  right = ["my-widget", "toc", "tags"]
```

### 修改组件样式

```css
/* 自定义组件样式 */
.my-widget {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.my-widget .aside-title {
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}
```

---

## 🎯 最佳实践

### 1. 组件选择

**必备组件：**
- ✅ author（作者信息）
- ✅ toc（文章目录）
- ✅ tags（标签云）
- ✅ recent-Posts（最新文章）

**推荐组件：**
- ⭕ series-posts（系列文章）
- ⭕ related-Posts（相关文章）
- ⭕ archive（归档）

**可选组件：**
- ⭕ search（搜索）
- ⭕ popular-Posts（热门文章）
- ⭕ recent-Comments（最新评论）

### 2. 性能优化

- 限制组件数量：左侧 3-5 个，右侧 5-8 个
- 控制显示数量：5-10 篇文章
- 禁用不需要的组件

### 3. 用户体验

- 重要组件放上方
- 相关组件分组
- 保持视觉一致性

---

## 🔍 常见问题

### Q1: 组件不显示？

**检查：**
1. ✅ 配置中有该组件
2. ✅ 开关为 `true`
3. ✅ 模板文件存在
4. ✅ 清除缓存

### Q2: 组件顺序不对？

**修改：**
```toml
# 调整数组顺序
right = ["toc", "tags", "archive"]  # toc 在最上
```

### Q3: 移动端侧栏显示问题？

**说明：** 移动端侧栏默认隐藏，点击按钮展开

**如需始终显示：**
```css
@media (max-width: 768px) {
  .site-aside-right {
    display: block !important;
  }
}
```

### Q4: 如何隐藏特定页面的侧栏？

在页面 Front Matter 中：
```yaml
---
title: "全宽页面"
layout: "fullwidth"  # 使用无侧栏布局
---
```

### Q5: 目录组件不生效？

**原因：** 文章没有标题或标题层级不对

**解决：** 确保文章有 `##` 或更高级标题

### Q6: 相关文章为空？

**原因：** 相关性阈值太高或文章没有标签

**调整：**
```toml
[related]
  threshold = 60  # 降低阈值（默认80）
```

### Q7: 标签云显示太多标签？

**解决：** 限制标签显示数量

```toml
[params.aside]
  tagsCount = 15  # 只显示前15个最热门标签
```

**说明：** 标签按文章数量降序排列，设置为 0 显示全部标签

### Q8: 标签云顺序如何调整？

**说明：** 标签云自动按文章数量降序排列（文章数多的在前）

**如需其他排序：** 修改模板文件 `themes/demius/layouts/partials/aside/widgets/tags.html`

---

## 📊 组件对比

| 组件 | 位置 | 适用页面 | 性能影响 | 推荐度 |
|------|------|----------|----------|--------|
| author | 左 | 所有 | 低 | ⭐⭐⭐⭐⭐ |
| toc | 右 | 文章 | 低 | ⭐⭐⭐⭐⭐ |
| tags | 右 | 所有 | 低 | ⭐⭐⭐⭐⭐ |
| recent-Posts | 右 | 所有 | 中 | ⭐⭐⭐⭐ |
| series-posts | 右 | 文章 | 中 | ⭐⭐⭐⭐ |
| related-Posts | 右 | 文章 | 中 | ⭐⭐⭐⭐ |
| archive | 右 | 所有 | 中 | ⭐⭐⭐ |
| search | 右 | 所有 | 高 | ⭐⭐⭐ |
| popular-Posts | 左 | 所有 | 中 | ⭐⭐⭐ |
| recent-Comments | 左 | 所有 | 高 | ⭐⭐ |
| social-Media | 左 | 所有 | 低 | ⭐⭐⭐ |
| announcement | 左 | 所有 | 低 | ⭐⭐⭐ |

---

## 🔄 更新日志

### v1.1.0 (2025-10-25)
- ✨ 新增标签云数量控制 (`tagsCount`)
- ✅ 标签按文章数量自动排序
- 📖 完善文档和使用示例

### v1.0.0 (2025-10-24)
- ✨ 12+ 种侧栏组件
- ✅ 左右侧栏独立配置
- ✅ 灵活排序和开关
- ✅ 响应式设计
- ✅ PJAX 兼容

---

**祝使用愉快！** 🎉

