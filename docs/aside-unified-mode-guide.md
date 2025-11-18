# 侧栏一体化模式使用指南

本指南介绍如何使用侧栏一体化模式，实现侧栏组件的统一外观。

---

## 📋 目录

- [功能概述](#功能概述)
- [配置方法](#配置方法)
- [效果对比](#效果对比)
- [自定义样式](#自定义样式)
- [常见问题](#常见问题)

---

## 功能概述

### 什么是侧栏一体化模式？

侧栏一体化模式是一种全新的侧栏显示方式，它将原本独立的各个侧栏组件（作者卡片、标签云、目录等）整合到一个统一的容器中，实现视觉上的一体化效果。

### 模式对比

**分割卡片模式（默认）**：
- ✅ 每个组件独立显示
- ✅ 各自有背景色和圆角
- ✅ 组件之间有明显间距
- ✅ 视觉上更独立、更分散

**一体化模式（新增）**：
- ✅ 所有组件在同一个容器中
- ✅ 统一的背景和圆角
- ✅ 组件之间用分割线分隔
- ✅ 视觉上更统一、更整洁

---

## 配置方法

### 在 hugo.toml 中配置

找到 `[params.aside]` 部分，设置 `unifiedMode` 参数：

```toml
# ===== 侧边栏显示控制 =====
[params.aside]
  # 侧栏一体化模式
  unifiedMode = true                     # true=一体化模式，false=分割卡片模式
  
  # 左右栏模块顺序配置
  left  = ["author","announcement","social-Media","recent-Comments","popular-Posts","advertisement"]
  right = ["search","toc","series-posts","related-Posts","tags", "recent-Posts","categories", "archive"]
  
  # ... 其他配置 ...
```

### 配置说明

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| `unifiedMode` | Boolean | `false` | 启用侧栏一体化模式 |

---

## 效果对比

### 分割卡片模式（unifiedMode = false）

```
┌─────────────────┐
│   作者卡片      │  ← 独立背景
└─────────────────┘
       ↓ 间距
┌─────────────────┐
│   标签云        │  ← 独立背景
└─────────────────┘
       ↓ 间距
┌─────────────────┐
│   目录          │  ← 独立背景
└─────────────────┘
```

### 一体化模式（unifiedMode = true）

```
┌─────────────────┐
│   作者卡片      │
├─────────────────┤  ← 分割线
│   标签云        │
├─────────────────┤  ← 分割线
│   目录          │
└─────────────────┘
 ← 统一的容器背景
```

---

## 视觉特性

### 一体化模式的设计亮点

1. **统一容器**
   - 所有组件共享同一个圆角容器
   - 统一的背景色和阴影效果
   - 鼠标悬停时整体阴影加深

2. **优雅分割**
   - 组件之间用细线分割
   - 第一个组件无上边距
   - 最后一个组件无底部边框

3. **交互优化**
   - 列表项悬停有背景高亮
   - 标签云悬停有颜色变化和位移
   - 社交图标悬停有上浮效果

4. **响应式适配**
   - 平板和手机端自动调整间距
   - 保持良好的阅读体验

5. **暗色模式**
   - 自动适配暗色主题
   - 边框和背景色自动调整

---

## 自定义样式

### CSS 变量

一体化模式使用了以下 CSS 变量，可以在自定义 CSS 中覆盖：

```css
/* 在你的自定义CSS文件中 */

/* 容器背景色 */
.aside-unified {
  --bg: #ffffff;                       /* 亮色模式背景 */
  --bg-dark: #1a1a1a;                 /* 暗色模式背景 */
}

/* 边框颜色 */
.aside-unified .aside-card {
  --border-color: rgba(0, 0, 0, 0.08);
}

/* 悬停背景 */
.aside-unified .aside-list li {
  --hover-bg: rgba(0, 0, 0, 0.03);
}

/* 标签样式 */
.aside-unified .tag-link {
  --tag-bg: rgba(79, 195, 247, 0.1);
  --tag-border: rgba(79, 195, 247, 0.3);
}

/* 滚动条颜色 */
.aside-unified {
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.3);
}
```

### 调整容器间距

```css
/* 增加组件之间的间距 */
.aside-unified .aside-card {
  padding: 1.5rem 0 !important;
}

/* 调整容器内边距 */
.aside-unified {
  padding: 2rem !important;
}
```

### 修改分割线样式

```css
/* 修改分割线颜色和粗细 */
.aside-unified .aside-card {
  border-bottom: 2px dashed rgba(79, 195, 247, 0.3) !important;
}

/* 使用渐变分割线 */
.aside-unified .aside-card {
  border-bottom: 1px solid;
  border-image: linear-gradient(90deg, transparent, var(--primary-color), transparent) 1 !important;
}
```

---

## 常见问题

### Q1: 如何切换回分割卡片模式？

**A**: 在 `hugo.toml` 中设置 `unifiedMode = false` 或直接注释掉该行：

```toml
[params.aside]
  # unifiedMode = true    # 注释掉或设为false
  unifiedMode = false
```

### Q2: 一体化模式会影响其他页面布局吗？

**A**: 不会。一体化模式只影响侧栏的视觉样式，不会改变：
- ✅ 主内容区域的布局
- ✅ 文章卡片的显示
- ✅ 导航栏和页脚
- ✅ 响应式断点

### Q3: 能否只对左侧或右侧栏启用一体化？

**A**: 当前版本是全局配置，左右侧栏会同时启用。如果需要单独控制，可以自定义CSS：

```css
/* 只对右侧栏启用 */
.site-aside-right.aside-unified {
  /* 一体化样式 */
}

/* 取消左侧栏的一体化 */
.site-aside-left.aside-unified {
  background: transparent !important;
  padding: 0 !important;
}

.site-aside-left.aside-unified .aside-card {
  background: var(--bg) !important;
  border-radius: 8px !important;
  border-bottom: none !important;
  margin-bottom: 1.5rem !important;
  padding: 1rem !important;
}
```

### Q4: 一体化模式下如何调整某个特定组件的样式？

**A**: 可以使用更具体的选择器：

```css
/* 只调整作者卡片 */
.aside-unified .author-widget {
  /* 自定义样式 */
}

/* 只调整标签云 */
.aside-unified .tags-widget {
  /* 自定义样式 */
}

/* 只调整目录 */
.aside-unified .toc-widget {
  /* 自定义样式 */
}
```

### Q5: 一体化模式是否支持移动端？

**A**: 完全支持！一体化模式包含了响应式设计：
- 平板（< 1200px）：自动调整间距和字体
- 手机（< 768px）：优化触控体验，减少内边距

### Q6: 暗色模式下一体化效果如何？

**A**: 一体化模式完美支持暗色模式：
- 自动调整背景色（深色）
- 自动调整边框颜色（半透明白色）
- 自动调整悬停效果
- 保持良好的对比度和可读性

---

## 技术细节

### CSS 实现原理

1. **容器层**：为侧栏添加 `.aside-unified` 类
2. **组件层**：移除各组件的独立背景和圆角
3. **分割层**：在组件之间添加边框作为分割线
4. **交互层**：为各元素添加悬停效果

### HTML 结构

```html
<aside class="site-aside-left aside-unified">
  <div class="aside-card author-widget">...</div>
  <div class="aside-card tags-widget">...</div>
  <div class="aside-card toc-widget">...</div>
</aside>
```

### 兼容性

- ✅ 所有现代浏览器（Chrome, Firefox, Safari, Edge）
- ✅ 移动端浏览器
- ✅ 暗色模式
- ✅ 响应式布局
- ✅ PJAX 无刷新切换

---

## 更新日志

### v1.0.0 - 2025-10-26
- ✨ 新增侧栏一体化模式
- ✨ 支持配置文件开关控制
- ✨ 完整的暗色模式适配
- ✨ 响应式设计支持
- ✨ 平滑过渡动画

---

## 反馈与建议

如果您在使用侧栏一体化模式时遇到任何问题，或有改进建议，欢迎反馈！

---

**享受全新的侧栏一体化体验！** ✨

