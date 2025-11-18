# 内容折叠功能使用指南

本指南将帮助你使用 Demius 主题的内容折叠功能。

---

## 功能特性

- ✅ 折叠任何内容（文本、代码、图片、视频、表格等）
- ✅ 三种图标样式（arrow、plus、chevron）
- ✅ 可设置默认展开/折叠
- ✅ 支持嵌套使用
- ✅ 键盘操作支持
- ✅ 响应式设计
- ✅ 暗色模式支持
- ✅ 完整的 Markdown 渲染支持
- ✅ PJAX 兼容

---

## 快速开始

### 基本语法

```markdown
{{</* collapse "标题" */>}}
折叠的内容
{{</* /collapse */>}}
```

### 完整参数

```markdown
{{</* collapse "标题" "默认状态" "图标类型" */>}}
内容
{{</* /collapse */>}}
```

**参数说明**：
- 第1个：标题（必填）
- 第2个：默认状态，"open"或"close"（可选，默认close）
- 第3个：图标类型，"arrow"、"plus"或"chevron"（可选，默认arrow）

---

## 使用示例

### 示例 1：基本折叠

```markdown
{{</* collapse "点击查看详情" */>}}
这是折叠的内容。
{{</* /collapse */>}}
```

### 示例 2：默认展开

```markdown
{{</* collapse "重要提示" "open" */>}}
这个内容默认是展开的。
{{</* /collapse */>}}
```

### 示例 3：不同图标

```markdown
{{</* collapse "使用加号图标" "close" "plus" */>}}
内容
{{</* /collapse */>}}

{{</* collapse "使用V型图标" "close" "chevron" */>}}
内容
{{</* /collapse */>}}
```

### 示例 4：折叠代码块

````markdown
{{</* collapse "查看代码" */>}}
```python
def hello():
    print("Hello World")
```
{{</* /collapse */>}}
````

### 示例 5：嵌套折叠

```markdown
{{</* collapse "外层折叠" */>}}
外层内容

{{</* collapse "内层折叠" */>}}
内层内容
{{</* /collapse */>}}

{{</* /collapse */>}}
```

---

## 高级用法

### FAQ格式

```markdown
{{</* collapse "Q: 如何安装？" */>}}
A: 执行以下命令...
{{</* /collapse */>}}

{{</* collapse "Q: 如何配置？" */>}}
A: 编辑配置文件...
{{</* /collapse */>}}
```

### 更新日志

```markdown
{{</* collapse "v2.0.0 (2025-10-24)" "open" */>}}
#### 新功能
- 添加折叠功能
#### 修复
- 修复已知bug
{{</* /collapse */>}}

{{</* collapse "v1.9.0 (2025-10-20)" */>}}
历史版本内容...
{{</* /collapse */>}}
```

---

## JavaScript API

```javascript
// 展开所有折叠
window.expandAllCollapses();

// 折叠所有折叠
window.collapseAllCollapses();

// 展开特定折叠
window.expandCollapseById('collapse-id');

// 重新初始化
window.initCollapse();
```

---

## 样式定制

编辑 `themes/demius/assets/css/_collapse.css`：

```css
/* 修改激活状态颜色 */
.collapse-header.active {
  background: #your-color;
}

/* 修改动画时间 */
.collapse-content {
  transition: max-height 0.5s ease;
}
```

---

## 常见问题

### Q: 折叠块不显示？
A: 检查shortcode语法是否正确，重新构建：`hugo --cleanDestinationDir`

### Q: 点击无反应？
A: 清除浏览器缓存（Ctrl+F5），检查控制台错误

### Q: 如何设置全局默认展开？
A: 在每个collapse中指定"open"参数，或修改CSS

---

## 最佳实践

1. **标题清晰**：使用描述性标题
2. **合理组织**：相关内容放在同一折叠块
3. **嵌套适度**：最多嵌套2-3层
4. **图标选择**：
   - Arrow: 通用场景
   - Plus: FAQ文档
   - Chevron: 技术文档

---

## 技术细节

### 文件结构
- `themes/demius/layouts/shortcodes/collapse.html` - Shortcode 模板
- `themes/demius/assets/css/_collapse.css` - 样式文件
- `themes/demius/assets/js/_collapse.js` - 交互脚本

### Markdown 渲染

折叠内容使用 Hugo 的 `markdownify` 函数进行渲染，支持：
- ✅ 所有标准 Markdown 语法
- ✅ 代码块（带语法高亮）
- ✅ 表格
- ✅ 列表（有序/无序）
- ✅ 引用
- ✅ 图片和链接
- ✅ 其他 Shortcode（嵌套）

### 浏览器兼容
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- 移动端浏览器 ✅

---

## 常见问题

### 1. 折叠块包含了额外的页面内容？

**问题描述**：折叠块中的内容不仅包含预期内容，还包含了页面其他部分（如侧边栏）。

**原因**：这是由于 Shortcode 模板在早期版本中未正确渲染 Markdown 内容导致的。

**解决方案**（v2.4.0+ 已修复）：
- 确保使用最新版本的主题
- `collapse.html` shortcode 已更新为使用 `{{ .Inner | markdownify }}`
- 重新构建网站：`hugo --cleanDestinationDir`

### 2. 代码块在折叠中显示异常？

**可能原因**：
- Markdown 缩进问题
- 代码块标记不正确

**解决方法**：
```markdown
{{</* collapse "代码示例" */>}}

\`\`\`javascript
// 确保代码块前后有空行
console.log('Hello');
\`\`\`

{{</* /collapse */>}}
```

### 3. 嵌套折叠无法正常工作？

**检查项**：
- 确保每个 `collapse` 都有对应的 `/collapse`
- 检查 shortcode 语法是否正确
- 嵌套层级不建议超过 3 层

**正确的嵌套示例**：
```markdown
{{</* collapse "外层" */>}}
外层内容
{{</* collapse "内层" */>}}
内层内容
{{</* /collapse */>}}
{{</* /collapse */>}}
```

---

## 更新历史

### v2.4.0 (2025-10-28)
- 🐛 修复：折叠块包含额外页面内容的问题
- ✨ 改进：使用 `markdownify` 正确渲染 Markdown 内容
- 📝 更新：完善文档和故障排查指南

### v1.0.0 (2025-10-24)
- ✨ 初始发布
- ✅ 基础折叠功能
- ✅ 三种图标样式
- ✅ 嵌套支持

---

**更多示例请查看**：[内容折叠功能使用示例](../content/posts/内容折叠功能使用示例.md)

