# 相册功能使用指南

本指南将帮助你配置和使用 Demius 主题的相册功能。相册功能支持分组管理照片，以封面形式展示相册列表，点击后查看该相册的所有照片。

---

## 目录

1. [功能特性](#功能特性)
2. [快速开始](#快速开始)
3. [配置说明](#配置说明)
4. [使用示例](#使用示例)
5. [高级功能](#高级功能)
6. [样式定制](#样式定制)
7. [常见问题](#常见问题)

---

## 功能特性

### 核心功能

- ✅ **分组管理**：支持创建多个相册分组
- ✅ **封面展示**：每个相册以封面图形式展示
- ✅ **点击查看**：点击相册封面查看该相册的所有照片
- ✅ **图片预览**：内置 Lightbox 查看器，支持大图预览
- ✅ **键盘导航**：支持键盘方向键切换照片
- ✅ **精选置顶**：支持设置精选相册并置顶显示
- ✅ **响应式设计**：完美适配各种设备屏幕
- ✅ **暗色模式**：自动适配主题的明暗模式
- ✅ **PJAX 兼容**：支持无刷新页面切换

### 交互特性

- 🎨 精美的悬停动画效果
- 🖼️ 图片懒加载优化性能
- ⌨️ 键盘快捷键支持
- 📱 移动端触摸优化
- 🔄 平滑的过渡动画

---

## 快速开始

### 1. 创建相册页面

在 `content/` 目录下创建 `gallery.md` 文件：

```markdown
---
title: "相册"
date: 2025-10-21T00:00:00Z
type: "gallery"
layout: "gallery"
comments: false
---
```

### 2. 配置相册数据

在 `data/` 目录下创建或编辑 `gallery.yaml` 文件：

```yaml
groups:
  - name: "旅行足迹"
    description: "记录旅行中的美好瞬间"
    featured: true
    cover: "https://example.com/travel-cover.jpg"
    photos:
      - url: "https://example.com/photo1.jpg"
        title: "美丽风景"
        description: "旅行中遇到的美景"
        date: "2024-01-01"
```

### 3. 访问相册页面

构建网站后，访问 `/gallery` 即可查看相册。

---

## 配置说明

### 相册组配置

每个相册组包含以下字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 相册名称 |
| `description` | string | ✅ | 相册描述 |
| `featured` | boolean | ❌ | 是否为精选相册（默认 false） |
| `cover` | string | ✅ | 相册封面图片 URL |
| `photos` | array | ✅ | 照片列表 |

### 照片配置

每张照片包含以下字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | string | ✅ | 图片 URL |
| `title` | string | ✅ | 图片标题 |
| `description` | string | ✅ | 图片描述 |
| `date` | string | ✅ | 拍摄日期 |

---

## 使用示例

### 示例 1：创建基础相册

```yaml
groups:
  - name: "日常生活"
    description: "记录生活中的点点滴滴"
    featured: false
    cover: "https://example.com/daily-cover.jpg"
    photos:
      - url: "https://example.com/daily1.jpg"
        title: "美食时刻"
        description: "享受美食的快乐"
        date: "2024-02-01"
      
      - url: "https://example.com/daily2.jpg"
        title: "咖啡时光"
        description: "悠闲的下午茶时光"
        date: "2024-02-02"
```

### 示例 2：创建精选相册

```yaml
groups:
  - name: "特别时刻"
    description: "值得纪念的特殊时刻"
    featured: true  # 标记为精选相册
    cover: "https://example.com/special-cover.jpg"
    photos:
      - url: "https://example.com/special1.jpg"
        title: "重要时刻"
        description: "值得永远铭记的瞬间"
        date: "2024-03-01"
```

### 示例 3：多个相册组

```yaml
groups:
  # 精选相册
  - name: "2024 旅行精选"
    description: "2024年最美好的旅行回忆"
    featured: true
    cover: "https://example.com/2024-travel.jpg"
    photos:
      - url: "https://example.com/t1.jpg"
        title: "海边日落"
        description: "最美的日落时刻"
        date: "2024-05-15"
  
  # 普通相册
  - name: "家庭聚会"
    description: "温馨的家庭时光"
    featured: false
    cover: "https://example.com/family-cover.jpg"
    photos:
      - url: "https://example.com/f1.jpg"
        title: "团聚时刻"
        description: "全家福"
        date: "2024-06-01"
  
  - name: "宠物相册"
    description: "我的可爱宠物"
    featured: false
    cover: "https://example.com/pet-cover.jpg"
    photos:
      - url: "https://example.com/p1.jpg"
        title: "毛孩子"
        description: "我的小伙伴"
        date: "2024-07-01"
```

---

## 高级功能

### 1. 精选相册置顶

通过设置 `featured: true` 可以将相册标记为精选，精选相册会显示在页面顶部，并带有"精选"徽章：

```yaml
- name: "精选相册"
  featured: true  # 精选相册会置顶显示
  # ...
```

### 2. 相册分区显示

相册页面会自动将相册分为两个区域：
- **精选相册**：带星标图标，显示在顶部
- **我的相册**：普通相册，显示在精选相册下方

### 3. Lightbox 键盘快捷键

在 Lightbox 查看器中，支持以下键盘快捷键：

| 按键 | 功能 |
|------|------|
| `←` | 上一张照片 |
| `→` | 下一张照片 |
| `Esc` | 关闭查看器 |

### 4. 图片错误处理

如果图片加载失败，会自动显示 404 占位图：

```html
onerror="this.src='/img/404.jpg'"
```

确保在 `static/img/` 目录下有 `404.jpg` 文件。

---

## 样式定制

### 1. 修改相册网格列数

编辑 `themes/demius/assets/css/_gallery.css`：

```css
/* 默认：每行最多 3 个相册封面 */
.gallery-albums-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

/* 修改为每行最多 4 个 */
.gallery-albums-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* 修改为每行最多 2 个 */
.gallery-albums-grid {
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}
```

### 2. 修改照片网格列数

```css
/* 默认：照片网格 */
.gallery-photos-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* 修改为更密集的网格 */
.gallery-photos-grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

### 3. 调整封面宽高比

```css
/* 默认 4:3 比例 */
.gallery-album-cover {
  aspect-ratio: 4/3;
}

/* 改为 16:9 */
.gallery-album-cover {
  aspect-ratio: 16/9;
}

/* 改为正方形 */
.gallery-album-cover {
  aspect-ratio: 1;
}
```

### 4. 自定义主题色

相册功能会自动使用主题的 `--accent` 颜色变量，你可以在 `hugo.toml` 中修改：

```toml
[params]
  accentColor = "#0066cc"  # 修改为你喜欢的颜色
```

---

## 常见问题

### Q1: 相册页面显示"暂无相册数据"？

**A:** 请检查以下几点：

1. 确认 `data/gallery.yaml` 文件存在
2. 确认 YAML 格式正确（注意缩进）
3. 确认至少有一个相册组配置
4. 重新构建网站：`hugo --cleanDestinationDir`

### Q2: 图片无法显示？

**A:** 可能的原因：

1. 图片 URL 不正确或无法访问
2. 图片跨域问题（建议使用图床或本地图片）
3. 网络问题

解决方案：
- 检查图片 URL 是否可以直接在浏览器中打开
- 使用可靠的图床服务
- 或将图片放在 `static/img/gallery/` 目录下

### Q3: 如何使用本地图片？

**A:** 将图片放在 `static/img/gallery/` 目录下，然后使用相对路径：

```yaml
photos:
  - url: "/img/gallery/photo1.jpg"
    title: "我的照片"
    # ...
```

### Q4: 相册在移动端显示不正常？

**A:** 相册功能已经做了响应式优化，如果遇到问题：

1. 清除浏览器缓存
2. 重新构建网站
3. 检查是否有自定义 CSS 冲突

### Q5: Lightbox 不工作？

**A:** 检查以下几点：

1. 确认 JavaScript 已正确加载
2. 检查浏览器控制台是否有错误
3. 确认 PJAX 功能正常（如果启用）

### Q6: 如何隐藏某个相册？

**A:** 两种方法：

1. 直接从 `gallery.yaml` 中删除或注释该相册组
2. 或者暂时将该相册组移动到文件末尾并注释掉

```yaml
groups:
  - name: "显示的相册"
    # ...

# 暂时隐藏的相册
# - name: "隐藏的相册"
#   description: "..."
#   # ...
```

### Q7: 如何调整相册排序？

**A:** 相册显示顺序：

1. 精选相册（`featured: true`）显示在前
2. 在各自区域内，按照 YAML 文件中的配置顺序显示

调整方法：直接在 `gallery.yaml` 中调整相册组的顺序即可。

### Q8: 可以嵌套分类吗？

**A:** 当前版本不支持嵌套分类。如果需要更细的分类，建议：

1. 使用更多的相册组
2. 在相册名称或描述中体现层级关系
3. 例如："旅行 - 2024夏天"、"旅行 - 2024冬天"

---

## 技术细节

### 文件结构

```
themes/demius/
├── layouts/
│   └── gallery.html              # 相册页面模板
├── assets/
│   ├── css/
│   │   └── _gallery.css          # 相册样式
│   └── js/
│       └── _gallery.js           # 相册交互逻辑
data/
└── gallery.yaml                   # 相册数据配置
content/
└── gallery.md                     # 相册页面内容
```

### 浏览器兼容性

- ✅ Chrome/Edge (最新版本)
- ✅ Firefox (最新版本)
- ✅ Safari (最新版本)
- ✅ 移动端浏览器

### 性能优化

1. **图片懒加载**：使用 `loading="lazy"` 属性
2. **按需加载**：只显示当前相册的照片
3. **CSS 动画**：使用 GPU 加速的 transform 属性
4. **缓存优化**：Hugo 自动为资源文件添加指纹缓存

---

## 更新日志

### v1.0.0 (2025-10-24)

- ✨ 初始版本发布
- ✅ 支持分组相册管理
- ✅ 封面列表和详情页切换
- ✅ 内置 Lightbox 查看器
- ✅ 精选相册置顶功能
- ✅ 响应式设计
- ✅ 暗色模式支持
- ✅ PJAX 兼容

---

## 相关资源

- [Demius 主题文档](./README.md)
- [Hugo 官方文档](https://gohugo.io/documentation/)
- [YAML 语法教程](https://yaml.org/)

---

## 需要帮助？

如果遇到问题或有建议，欢迎：

1. 查看 [常见问题](#常见问题) 部分
2. 参考其他文档中的示例
3. 检查浏览器控制台的错误信息

---

**享受使用相册功能！** 📸✨

