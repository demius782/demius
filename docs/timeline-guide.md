# 时间线功能使用指南

本指南将帮助你使用 Demius 主题的时间线功能。

---

## 功能特性

- ✅ 可视化时间轴展示
- ✅ 五种类型样式（default/success/warning/danger/info）
- ✅ 六种图标选择（default/check/star/warning/info/plus）
- ✅ 支持任何Markdown内容
- ✅ 进入视口动画效果
- ✅ 响应式设计
- ✅ 暗色模式支持

---

## 快速开始

### 基本语法

```markdown
{{</* timeline */>}}

{{</* timeline-item "日期" "标题" */>}}
内容描述
{{</* /timeline-item */>}}

{{</* /timeline */>}}
```

### 完整参数

```markdown
{{</* timeline-item "日期" "标题" "类型" "图标" */>}}
内容
{{</* /timeline-item */>}}
```

**参数说明**：
- 第1个：日期（必填）
- 第2个：标题（必填）
- 第3个：类型，default/success/warning/danger/info（可选，默认default）
- 第4个：图标，default/check/star/warning/info/plus（可选，默认default）

---

## 类型说明

### Default（默认）
```markdown
{{</* timeline-item "2025-10-24" "普通事件" "default" "default" */>}}
内容
{{</* /timeline-item */>}}
```
- 颜色：蓝色
- 用途：一般事件、常规更新

### Success（成功）
```markdown
{{</* timeline-item "2025-10-24" "完成项目" "success" "check" */>}}
内容
{{</* /timeline-item */>}}
```
- 颜色：绿色
- 用途：完成的任务、成功的里程碑

### Warning（警告）
```markdown
{{</* timeline-item "2025-10-24" "注意事项" "warning" "warning" */>}}
内容
{{</* /timeline-item */>}}
```
- 颜色：橙色
- 用途：需要注意的事项、待处理问题

### Danger（重要）
```markdown
{{</* timeline-item "2025-10-24" "重要节点" "danger" "star" */>}}
内容
{{</* /timeline-item */>}}
```
- 颜色：红色
- 用途：重要里程碑、关键决策点

### Info（信息）
```markdown
{{</* timeline-item "2025-10-24" "信息说明" "info" "info" */>}}
内容
{{</* /timeline-item */>}}
```
- 颜色：蓝色
- 用途：一般信息、进行中的事项

---

## 图标说明

| 图标 | 说明 | 适用场景 |
|------|------|----------|
| default | 圆点 | 普通事件 |
| check | 对勾 | 完成、确认 |
| star | 星标 | 重要、精选 |
| warning | 感叹号 | 警告、注意 |
| info | 信息 | 说明、提示 |
| plus | 加号 | 新增、添加 |

---

## 使用示例

### 示例 1：项目进度

```markdown
{{</* timeline */>}}

{{</* timeline-item "2025-10-24" "项目完成" "success" "check" */>}}
项目已成功交付，所有功能测试通过。
{{</* /timeline-item */>}}

{{</* timeline-item "2025-10-20" "开发阶段" "info" "info" */>}}
核心功能开发中，预计本周完成。
{{</* /timeline-item */>}}

{{</* timeline-item "2025-10-15" "项目启动" "default" "plus" */>}}
项目正式启动，团队成员到位。
{{</* /timeline-item */>}}

{{</* /timeline */>}}
```

### 示例 2：学习路线

```markdown
{{</* timeline */>}}

{{</* timeline-item "第三阶段" "高级进阶" "info" "star" */>}}
深入学习框架源码和架构设计
{{</* /timeline-item */>}}

{{</* timeline-item "第二阶段" "框架学习" "success" "check" */>}}
已完成 React 和 Vue 的学习
{{</* /timeline-item */>}}

{{</* timeline-item "第一阶段" "基础入门" "success" "check" */>}}
已完成 HTML/CSS/JavaScript 基础
{{</* /timeline-item */>}}

{{</* /timeline */>}}
```

### 示例 3：更新日志

```markdown
{{</* timeline */>}}

{{</* timeline-item "v2.0.0" "重大更新" "success" "star" */>}}
#### 新增功能
- 时间线组件
- 折叠功能
- 相册功能
{{</* /timeline-item */>}}

{{</* timeline-item "v1.9.0" "功能更新" "info" "plus" */>}}
添加选项卡和视频嵌入功能
{{</* /timeline-item */>}}

{{</* /timeline */>}}
```

---

## JavaScript API

```javascript
// 初始化时间线
window.initTimeline();

// 清理时间线
window.cleanupTimeline();

// 获取所有时间线项
window.getAllTimelineItems();

// 按类型筛选
window.filterTimelineByType('success');

// 重置筛选
window.resetTimelineFilter();
```

---

## 样式定制

编辑 `themes/demius/assets/css/_timeline.css`：

```css
/* 修改时间线主线颜色 */
.timeline-container::before {
  background: linear-gradient(to bottom, 
    #your-color 0%,
    #your-color 50%,
    rgba(your-rgb, 0.3) 100%);
}

/* 修改图标大小 */
.timeline-icon {
  width: 40px;
  height: 40px;
}

/* 修改项目间距 */
.timeline-item {
  margin-bottom: 3rem;
}
```

---

## 常见问题

### Q: 时间线不显示？
A: 检查shortcode语法、标签闭合、CSS加载。重新构建：`hugo --cleanDestinationDir`

### Q: 如何禁用动画？
A: 在CSS中添加：
```css
@media (prefers-reduced-motion: reduce) {
  .timeline-item {
    animation: none;
  }
}
```

### Q: 支持嵌套吗？
A: 时间线本身不支持嵌套，但时间线项目内可以使用其他shortcode（如collapse）

---

## 最佳实践

1. **保持一致性**：同一时间线中使用统一的日期格式
2. **合理分类**：根据事件性质选择合适的类型
3. **图标搭配**：类型和图标要相互匹配
4. **内容精简**：标题简洁，内容详略得当
5. **突出重点**：重要节点使用特殊类型和图标

---

## 技术细节

### 文件结构
- `themes/demius/layouts/shortcodes/timeline.html`
- `themes/demius/layouts/shortcodes/timeline-item.html`
- `themes/demius/assets/css/_timeline.css`
- `themes/demius/assets/js/_timeline.js`

### 浏览器兼容
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- 移动端浏览器 ✅

---

**更多示例请查看**：[时间线功能使用示例](../content/posts/时间线功能使用示例.md)

