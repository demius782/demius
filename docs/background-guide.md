# 背景图系统使用指南

本指南详细介绍如何在 Demius 主题中配置和使用背景图系统。

---

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [背景效果模式](#背景效果模式)
- [整站背景图配置](#整站背景图配置)
- [高级定制](#高级定制)
- [常见问题](#常见问题)

---

## ✨ 功能特性

- ✅ **多种效果模式**：透明、毛玻璃、半透明、纯色
- ✅ **高度可定制**：模糊、亮度、透明度独立调节
- ✅ **性能优化**：渐进式加载，避免卡顿
- ✅ **响应式适配**：自动适配各种屏幕
- ✅ **暗色模式兼容**：完美支持明暗主题切换
- ✅ **SEO友好**：正确的图片加载策略

---

## 🚀 快速开始

### 1. 基础配置

在 `hugo.toml` 中配置：

```toml
[params.background]
  # 三栏布局背景效果
  effect_mode = "transparent"
  
  # 整站背景图
  [params.background.site]
    enable = true
    image = "https://example.com/background.jpg"
    blur = 0
    brightness = 100
    opacity = 70
```

### 2. 重新构建

```bash
hugo server
```

### 3. 查看效果

访问网站查看背景图效果

---

## 🎨 背景效果模式

### 模式概览

| 模式 | 效果 | 适用场景 |
|------|------|----------|
| transparent | 透明 | 强调背景图 |
| glass | 毛玻璃 | 现代设计风格 |
| translucent | 半透明 | 平衡内容与背景 |
| solid | 纯色 | 简洁风格 |

### 1. 透明模式 (transparent)

**配置：**
```toml
[params.background]
  effect_mode = "transparent"
```

**效果：**
- ✅ 三栏布局完全透明
- ✅ 背景图清晰可见
- ✅ 文字有对比度阴影保证可读性

**适合：**
- 高质量背景图片
- 强调视觉设计
- 个人作品展示

**视觉示例：**
```
┌─────────────────────────────────┐
│  [透明栏]  [透明栏]  [透明栏]    │
│                                 │ ← 背景图清晰可见
│  文字内容  文字内容  文字内容    │
└─────────────────────────────────┘
```

---

### 2. 毛玻璃模式 (glass)

**配置：**
```toml
[params.background]
  effect_mode = "glass"
```

**效果：**
- ✅ 高斯模糊 + 半透明背景
- ✅ 现代拟物化设计
- ✅ 内容清晰易读

**CSS 实现：**
```css
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.7);
```

**适合：**
- 现代设计风格
- macOS/iOS风格
- 专业博客

**视觉示例：**
```
┌─────────────────────────────────┐
│ [毛玻璃栏] [毛玻璃栏] [毛玻璃栏] │
│    模糊       模糊       模糊    │ ← 背景模糊
│  文字内容  文字内容  文字内容    │
└─────────────────────────────────┘
```

---

### 3. 半透明模式 (translucent)

**配置：**
```toml
[params.background]
  effect_mode = "translucent"
```

**效果：**
- ✅ 半透明白色背景
- ✅ 背景图若隐若现
- ✅ 文字最易阅读

**CSS 实现：**
```css
background: rgba(255, 255, 255, 0.85);
```

**适合：**
- 内容为主的博客
- 长文阅读
- 学术网站

**视觉示例：**
```
┌─────────────────────────────────┐
│ [半透明栏] [半透明栏] [半透明栏] │
│    85%        85%        85%    │ ← 背景隐约可见
│  文字内容  文字内容  文字内容    │
└─────────────────────────────────┘
```

---

### 4. 纯色模式 (solid)

**配置：**
```toml
[params.background]
  effect_mode = "solid"  # 或使用十六进制颜色如 "#4fc3f7"
```

**效果：**
- ✅ 纯色背景，无背景图
- ✅ 最佳可读性
- ✅ 减少视觉干扰

**支持格式：**
```toml
effect_mode = "solid"      # 默认白色
effect_mode = "#4fc3f7"    # 自定义颜色
effect_mode = "#2c3e50"    # 深灰色
effect_mode = "#ffffff"    # 纯白色
```

**适合：**
- 极简设计
- 专注内容
- 减少加载时间

**视觉示例：**
```
┌─────────────────────────────────┐
│  [纯色栏]  [纯色栏]  [纯色栏]    │
│   #4fc3f7   #4fc3f7   #4fc3f7  │ ← 统一纯色
│  文字内容  文字内容  文字内容    │
└─────────────────────────────────┘
```

---

## 🖼️ 整站背景图配置

### 完整配置参数

```toml
[params.background.site]
  enable = true                    # 是否启用背景图
  image = "/img/background.jpg"    # 背景图片路径
  blur = 0                         # 模糊程度 (0-20px)
  brightness = 100                 # 亮度 (0-200%)
  opacity = 70                     # 透明度 (0-100%)
```

### 参数详解

#### **enable** (布尔值)

- **作用：** 启用/禁用整站背景图
- **默认值：** `false`
- **示例：**
```toml
enable = true   # 启用
enable = false  # 禁用，使用纯色背景
```

---

#### **image** (字符串)

- **作用：** 背景图片 URL 或路径
- **支持格式：**
  - 本地路径：`"/img/bg.jpg"` (放在 `static/img/`)
  - 外部URL：`"https://example.com/bg.jpg"`
  - CDN链接：`"https://cdn.example.com/bg.jpg"`

- **建议规格：**
  - 尺寸：1920×1080px 或更高
  - 格式：JPG（压缩）或 WebP
  - 大小：< 500KB

- **示例：**
```toml
image = "/img/background.jpg"                    # 本地
image = "https://example.com/background.webp"    # 外部
```

---

#### **blur** (数字)

- **作用：** 背景模糊程度（像素）
- **范围：** 0-20
- **默认值：** `0`
- **效果：**
  - `0`：无模糊，清晰
  - `5`：轻微模糊
  - `10`：中等模糊（推荐）
  - `15-20`：强烈模糊

- **CSS 实现：**
```css
filter: blur(10px);
```

- **示例：**
```toml
blur = 0   # 清晰
blur = 5   # 轻微模糊
blur = 10  # 中等模糊（推荐）
```

**对比效果：**
```
blur = 0:   清晰的风景 🌄
blur = 5:   稍微模糊的风景 🌁
blur = 10:  模糊的风景 ☁️
```

---

#### **brightness** (数字)

- **作用：** 背景亮度（百分比）
- **范围：** 0-200
- **默认值：** `100`
- **效果：**
  - `0-50`：变暗
  - `100`：原始亮度
  - `150-200`：变亮

- **CSS 实现：**
```css
filter: brightness(100%);
```

- **示例：**
```toml
brightness = 80   # 稍微变暗（推荐）
brightness = 100  # 原始亮度
brightness = 120  # 稍微变亮
```

**使用建议：**
- 明亮图片：80-90（避免刺眼）
- 深色图片：110-120（提升可见度）

---

#### **opacity** (数字)

- **作用：** 背景透明度（百分比）
- **范围：** 0-100
- **默认值：** `100`
- **效果：**
  - `0`：完全透明（不可见）
  - `50`：半透明
  - `100`：完全不透明

- **CSS 实现：**
```css
opacity: 0.7; /* 70% */
```

- **示例：**
```toml
opacity = 50   # 半透明
opacity = 70   # 较透明（推荐）
opacity = 100  # 完全不透明
```

**使用建议：**
- 复杂图片：50-70（避免干扰内容）
- 简洁图片：80-100（充分展示）

---

## 🎯 配置示例

### 示例一：清晰背景

```toml
[params.background]
  effect_mode = "transparent"
  
  [params.background.site]
    enable = true
    image = "/img/clear-sky.jpg"
    blur = 0
    brightness = 100
    opacity = 100
```

**效果：** 背景图清晰可见，适合高质量图片

---

### 示例二：柔和背景

```toml
[params.background]
  effect_mode = "glass"
  
  [params.background.site]
    enable = true
    image = "/img/landscape.jpg"
    blur = 10
    brightness = 90
    opacity = 70
```

**效果：** 毛玻璃 + 模糊 + 降低亮度和透明度，柔和舒适

---

### 示例三：专注阅读

```toml
[params.background]
  effect_mode = "translucent"
  
  [params.background.site]
    enable = true
    image = "/img/simple-bg.jpg"
    blur = 15
    brightness = 80
    opacity = 50
```

**效果：** 半透明 + 高度模糊 + 低透明度，内容清晰易读

---

### 示例四：纯色背景

```toml
[params.background]
  effect_mode = "#f5f5f5"
  
  [params.background.site]
    enable = false
```

**效果：** 浅灰色纯色背景，极简风格

---

### 示例五：暗色主题

```toml
[params.background]
  effect_mode = "#2c3e50"
  
  [params.background.site]
    enable = true
    image = "/img/dark-bg.jpg"
    blur = 5
    brightness = 60
    opacity = 40
```

**效果：** 深色背景 + 暗化图片，适合暗色模式

---

## 🎨 背景图选择建议

### 图片类型

#### **✅ 推荐：**
- 风景照片（天空、山川、海洋）
- 抽象纹理（几何、渐变）
- 低对比度图片
- 模糊/景深效果照片

#### **❌ 不推荐：**
- 文字密集的图片
- 高对比度图片
- 杂乱的照片
- 人像特写

### 颜色搭配

**亮色背景图：**
```toml
effect_mode = "translucent"
brightness = 90
opacity = 70
```

**深色背景图：**
```toml
effect_mode = "glass"
brightness = 70
opacity = 60
```

### 性能优化

1. **使用 WebP 格式：**
   - 体积小 50%
   - 质量无损
   
2. **压缩图片：**
   - 目标大小：< 500KB
   - 工具：TinyPNG, Squoosh

3. **使用 CDN：**
   - 加快全球访问
   - 减轻服务器压力

---

## 🌙 暗色模式适配

### 自动适配

Demius 主题会自动调整暗色模式下的背景：

**亮色模式：**
```css
background: rgba(255, 255, 255, 0.85);
```

**暗色模式：**
```css
background: rgba(30, 30, 30, 0.85);
```

### 自定义暗色背景

```toml
[params.background]
  effect_mode = "glass"
```

**CSS 覆盖：**
```css
[data-theme="dark"] .site-main,
[data-theme="dark"] .site-aside-left,
[data-theme="dark"] .site-aside-right {
  background: rgba(20, 20, 20, 0.9);
}
```

---

## 🔧 高级定制

### 修改三栏布局背景

**透明模式：**
```css
.site-main { background: transparent; }
```

**毛玻璃模式：**
```css
.site-main {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}
```

### 添加渐变遮罩

```css
.site-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,0.3) 100%
  );
}
```

### 动态背景切换

```javascript
// 根据时间切换背景
const hour = new Date().getHours();
if (hour >= 6 && hour < 18) {
  // 白天背景
  document.body.style.backgroundImage = 'url(/img/day.jpg)';
} else {
  // 夜晚背景
  document.body.style.backgroundImage = 'url(/img/night.jpg)';
}
```

---

## 📱 响应式适配

### 移动端优化

背景图会自动适配移动端：

```css
@media (max-width: 768px) {
  .site-background {
    background-size: cover;
    background-attachment: scroll; /* 避免性能问题 */
  }
}
```

### 性能优化

```toml
# 移动端使用较小的图片
image = "/img/bg-mobile.jpg"  # < 200KB
blur = 5                       # 减少模糊计算
```

---

## 🔍 常见问题

### Q1: 背景图不显示？

**检查清单：**
1. ✅ `enable = true`
2. ✅ 图片路径正确
3. ✅ 图片已上传到 `static/img/`
4. ✅ 图片格式正确（JPG/PNG/WebP）
5. ✅ 清除浏览器缓存

### Q2: 背景图加载慢？

**解决方案：**
1. 压缩图片到 < 500KB
2. 使用 WebP 格式
3. 启用 CDN 加速
4. 使用渐进式JPEG

### Q3: 文字不清晰？

**调整方案：**
```toml
effect_mode = "translucent"  # 使用半透明
opacity = 60                  # 降低背景透明度
brightness = 80               # 降低亮度
```

### Q4: 毛玻璃效果不生效？

**原因：** 浏览器不支持 `backdrop-filter`

**解决：**
1. 使用现代浏览器（Chrome 76+, Safari 9+）
2. 或使用 `translucent` 模式替代

### Q5: 背景图闪烁？

**原因：** 图片加载延迟

**解决：**
```toml
# 使用较小的图片或占位图
image = "/img/bg-placeholder.jpg"
```

### Q6: 如何禁用背景图？

```toml
[params.background.site]
  enable = false
```

或使用纯色：
```toml
[params.background]
  effect_mode = "#ffffff"
```

---

## 🎯 最佳实践

### 1. 模式选择

**内容为主：**
```toml
effect_mode = "translucent"
opacity = 70
```

**设计为主：**
```toml
effect_mode = "transparent"
opacity = 100
```

**现代风格：**
```toml
effect_mode = "glass"
blur = 10
```

### 2. 参数组合

**柔和舒适：**
```toml
blur = 10
brightness = 90
opacity = 70
```

**清晰明亮：**
```toml
blur = 0
brightness = 110
opacity = 100
```

**低调内敛：**
```toml
blur = 15
brightness = 70
opacity = 50
```

### 3. 性能优先

```toml
# 压缩图片
image = "/img/bg-compressed.webp"

# 适度模糊
blur = 5

# 合理透明度
opacity = 70
```

---

## 📊 效果对比表

| 模式 | 模糊 | 亮度 | 透明度 | 适用场景 |
|------|------|------|--------|----------|
| 清晰展示 | 0 | 100 | 100 | 摄影作品 |
| 柔和舒适 | 10 | 90 | 70 | 日常博客 |
| 专注阅读 | 15 | 80 | 50 | 长文阅读 |
| 现代设计 | 10 | 100 | 70 | 设计展示 |
| 极简风格 | - | - | - | 纯色背景 |

---

## 🔄 更新日志

### v1.0.0 (2025-10-24)
- ✨ 支持 4 种效果模式
- ✅ 模糊、亮度、透明度独立控制
- ✅ 渐进式加载优化
- ✅ 暗色模式自动适配
- ✅ 响应式设计

---

**祝使用愉快！** 🎉

