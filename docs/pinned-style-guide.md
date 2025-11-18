# 置顶文章图标和文字颜色配置指南

本指南介绍如何自定义置顶文章徽章的**图标和文字颜色**，解决封面图颜色与徽章颜色重合导致看不清的问题。

---

## 📋 目录

- [功能概述](#功能概述)
- [配置方法](#配置方法)
- [配置示例](#配置示例)
- [颜色建议](#颜色建议)
- [常见问题](#常见问题)

---

## 功能概述

### 什么是置顶文章？

在文章的 Front Matter 中设置 `pinned: true`，该文章会被标记为置顶，并在卡片上显示一个"置顶"徽章（包含图钉图标和"置顶"文字）。

### 为什么需要自定义颜色？

当文章封面图的颜色与徽章的图标/文字颜色相近时，可能会导致徽章不够醒目或看不清。通过自定义图标和文字的颜色，可以确保在任何封面图下都能清晰可见。

### 可配置项

- ✅ 图钉图标颜色
- ✅ "置顶"文字颜色
- ✅ 暗色模式单独配置（可选）

**注意**：徽章的背景渐变色保持主题默认配置，本功能仅调整图标和文字颜色。

---

## 配置方法

### 在 hugo.toml 中配置

```toml
# ===== 置顶文章样式配置 =====
[params.pinned]
  # 置顶徽章图标和文字颜色配置
  iconColor = "#FFFFFF"                  # 图标颜色（默认：#FFFFFF 白色）
  textColor = "#FFFFFF"                  # 文字颜色（默认：#FFFFFF 白色）
  
  # 暗色模式颜色（可选，不配置则使用亮色模式的颜色）
  iconColorDark = "#FFFFFF"              # 暗色模式图标颜色
  textColorDark = "#FFFFFF"              # 暗色模式文字颜色
```

### 配置参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `iconColor` | String | `#FFFFFF` | 图钉图标颜色（亮色模式） |
| `textColor` | String | `#FFFFFF` | "置顶"文字颜色（亮色模式） |
| `iconColorDark` | String | 继承亮色 | 图钉图标颜色（暗色模式） |
| `textColorDark` | String | 继承亮色 | "置顶"文字颜色（暗色模式） |

### 颜色格式

支持以下颜色格式：
- **十六进制**：`#FF6B6B`
- **RGB**：`rgb(255, 107, 107)`
- **RGBA**：`rgba(255, 107, 107, 0.9)`
- **颜色名称**：`red`, `blue`, `green` 等

---

## 配置示例

### 示例 1：白色图标和文字（默认）

```toml
[params.pinned]
  iconColor = "#FFFFFF"
  textColor = "#FFFFFF"
```

**效果：** 白色图标和文字

**适用场景：** 适合深色封面图，对比鲜明

---

### 示例 2：黑色图标和文字

```toml
[params.pinned]
  iconColor = "#000000"
  textColor = "#000000"
```

**效果：** 黑色图标和文字

**适用场景：** 适合浅色封面图，清晰醒目

---

### 示例 3：彩色图标

```toml
[params.pinned]
  iconColor = "#FF0000"  # 红色图标
  textColor = "#FFFFFF"  # 白色文字
```

**效果：** 红色图标，白色文字

**适用场景：** 强调图标，增加视觉吸引力

---

### 示例 4：金色图标和文字

```toml
[params.pinned]
  iconColor = "#FFD700"
  textColor = "#FFD700"
```

**效果：** 金色图标和文字

**适用场景：** 深色封面图，高级感

---

### 示例 5：渐变效果（图标和文字不同颜色）

```toml
[params.pinned]
  iconColor = "#FF6B6B"  # 红色图标
  textColor = "#FFA500"  # 橙色文字
```

**效果：** 红色图标，橙色文字

**适用场景：** 创意设计，增加层次感

---

### 示例 6：亮色模式和暗色模式不同颜色

```toml
[params.pinned]
  # 亮色模式：黑色
  iconColor = "#000000"
  textColor = "#000000"
  
  # 暗色模式：白色
  iconColorDark = "#FFFFFF"
  textColorDark = "#FFFFFF"
```

**效果：** 亮色模式显示黑色，暗色模式显示白色

**适用场景：** 适配不同主题模式

---

### 示例 7：半透明颜色

```toml
[params.pinned]
  iconColor = "rgba(255, 255, 255, 0.9)"
  textColor = "rgba(255, 255, 255, 0.9)"
```

**效果：** 半透明白色

**适用场景：** 柔和效果，不过于突兀

---

### 示例 8：彩虹色

```toml
[params.pinned]
  iconColor = "#E91E63"  # 粉色图标
  textColor = "#9C27B0"  # 紫色文字
```

**效果：** 粉色图标，紫色文字

**适用场景：** 个性化设计

---

## 颜色建议

### 根据封面图选择徽章颜色

| 封面图主色调 | 推荐徽章颜色 | 原因 |
|-------------|-------------|------|
| 🔴 红色系 | 蓝色、绿色 | 互补色，对比强烈 |
| 🔵 蓝色系 | 橙色、黄色 | 互补色，醒目 |
| 🟢 绿色系 | 紫色、粉色 | 对比明显 |
| 🟡 黄色系 | 蓝色、紫色 | 冷暖对比 |
| 🟣 紫色系 | 黄色、绿色 | 互补色 |
| ⚫ 深色系 | 亮黄色、橙色、白底黑字 | 高亮度对比 |
| ⚪ 浅色系 | 深色、黑色 | 明度对比 |

### 文字颜色选择

**白色文字** (`#FFFFFF`)：
- ✅ 适合深色徽章背景
- ✅ 适合中等亮度徽章
- ❌ 不适合浅色徽章（如浅黄、浅绿）

**黑色文字** (`#000000`)：
- ✅ 适合浅色徽章背景
- ✅ 适合高亮度徽章（如金色、浅蓝）
- ❌ 不适合深色徽章

### 对比度建议

为确保可读性，建议：
- **文字与背景对比度** ≥ 4.5:1（WCAG AA标准）
- **徽章与封面图对比度** ≥ 3:1

可使用在线工具检查对比度：
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio](https://contrast-ratio.com/)

---

## 颜色预设方案

### 方案 1：经典红色系

```toml
badgeStartColor = "#FF6B6B"
badgeEndColor = "#FF8E8E"
badgeTextColor = "#FFFFFF"
```

### 方案 2：清新蓝色系

```toml
badgeStartColor = "#3498DB"
badgeEndColor = "#5DADE2"
badgeTextColor = "#FFFFFF"
```

### 方案 3：活力橙色系

```toml
badgeStartColor = "#FF6F00"
badgeEndColor = "#FF9800"
badgeTextColor = "#FFFFFF"
```

### 方案 4：优雅紫色系

```toml
badgeStartColor = "#8E44AD"
badgeEndColor = "#A569BD"
badgeTextColor = "#FFFFFF"
```

### 方案 5：自然绿色系

```toml
badgeStartColor = "#27AE60"
badgeEndColor = "#52C41A"
badgeTextColor = "#FFFFFF"
```

### 方案 6：高级金色系

```toml
badgeStartColor = "#F39C12"
badgeEndColor = "#FFC300"
badgeTextColor = "#000000"
```

### 方案 7：科技蓝绿渐变

```toml
badgeStartColor = "#11998E"
badgeEndColor = "#38EF7D"
badgeTextColor = "#FFFFFF"
```

### 方案 8：热情红橙渐变

```toml
badgeStartColor = "#FF416C"
badgeEndColor = "#FF4B2B"
badgeTextColor = "#FFFFFF"
```

---

## 常见问题

### Q1：修改颜色后没有效果？

**解决步骤：**

1. 确认配置格式正确（缩进、语法）
2. 重新构建站点：
   ```bash
   hugo --cleanDestinationDir
   hugo server
   ```
3. 清除浏览器缓存（Ctrl+F5 强制刷新）
4. 检查浏览器控制台是否有错误

### Q2：如何找到合适的颜色？

**推荐工具：**

1. **取色器**：
   - [HTML Color Picker](https://www.w3schools.com/colors/colors_picker.asp)
   - [ColorZilla](https://www.colorzilla.com/)（浏览器扩展）

2. **配色方案**：
   - [Coolors](https://coolors.co/)
   - [Adobe Color](https://color.adobe.com/)
   - [Material Design Colors](https://materialui.co/colors/)

3. **渐变生成器**：
   - [CSS Gradient](https://cssgradient.io/)
   - [UI Gradients](https://uigradients.com/)

### Q3：如何从封面图提取颜色？

**方法：**

1. 使用浏览器开发者工具的取色器
2. 使用 [Image Color Picker](https://imagecolorpicker.com/)
3. 使用 Photoshop 或其他图片编辑工具的取色器

### Q4：暗色模式不生效？

**检查：**

1. 确认配置了 `badgeStartColorDark` 等暗色模式参数
2. 确认站点启用了暗色模式切换功能
3. 切换到暗色模式测试

**如果不需要暗色模式单独配置：**
```toml
# 不配置 Dark 参数，会自动使用亮色模式的颜色
[params.pinned]
  badgeStartColor = "#FF6B6B"
  badgeEndColor = "#FF8E8E"
  badgeTextColor = "#FFFFFF"
```

### Q5：如何恢复默认颜色？

**方法 1：使用默认值**
```toml
[params.pinned]
  badgeStartColor = "#FF6B6B"
  badgeEndColor = "#FF8E8E"
  badgeTextColor = "#FFFFFF"
```

**方法 2：删除配置**
```toml
# 完全删除或注释掉 [params.pinned] 配置
# 将使用主题的默认颜色
```

### Q6：能否为不同文章设置不同颜色？

**目前不支持。**

置顶徽章颜色是全局配置，所有置顶文章使用相同的徽章颜色。

**建议：**
- 选择一个与大部分封面图对比明显的颜色
- 或统一调整封面图的色调

### Q7：徽章位置可以调整吗？

**当前位置：** 右上角

**如需调整：** 需要修改 CSS 文件：
```css
/* 在自定义CSS中 */
.post-pinned-badge {
  top: 1rem;      /* 距离顶部 */
  right: 1rem;    /* 距离右侧 */
  /* 改为左上角：left: 1rem; right: auto; */
}
```

---

## 技术细节

### 实现原理

1. **配置注入**：Hugo 将 `hugo.toml` 中的配置注入到 HTML 的 `window.siteConfig`
2. **CSS变量**：JavaScript 读取配置并设置 CSS 自定义属性（CSS Variables）
3. **样式应用**：CSS 使用变量动态渲染徽章颜色

### CSS变量命名

```css
--pinned-badge-start       /* 亮色模式起始颜色 */
--pinned-badge-end         /* 亮色模式结束颜色 */
--pinned-badge-text        /* 亮色模式文字颜色 */
--pinned-badge-start-dark  /* 暗色模式起始颜色 */
--pinned-badge-end-dark    /* 暗色模式结束颜色 */
--pinned-badge-text-dark   /* 暗色模式文字颜色 */
```

### 文件结构

```
themes/demius/
├── layouts/
│   └── _default/
│       └── baseof.html              # 配置注入
├── assets/
│   ├── css/
│   │   └── _post-card.css           # 徽章样式（使用CSS变量）
│   └── js/
│       ├── main.js                  # 导入配置脚本
│       └── _pinned-style.js         # 读取配置并设置CSS变量
└── ...
```

---

## 最佳实践

### 1. 封面图统一色调

**建议：** 使用统一的封面图色调，这样只需配置一次徽章颜色即可适配所有文章。

### 2. 定期检查效果

在添加新文章时，预览徽章在新封面图上的效果，必要时微调颜色。

### 3. 保持对比度

确保徽章颜色与封面图有足够的对比度，避免视觉疲劳。

### 4. 测试暗色模式

如果站点支持暗色模式，务必在两种模式下都测试徽章效果。

### 5. 文档记录

在项目文档中记录选择特定颜色的原因，方便后续调整。

---

## 相关文档

- [文章置顶功能指南](post-pinned-guide.md)
- [主题颜色配置](theme-colors-guide.md)（如有）
- [主题文档索引](README.md)

---

**配置完成！现在您可以根据封面图灵活调整置顶徽章颜色了！** 🎨

**最后更新：** 2025-10-25  
**功能版本：** v2.1.0

