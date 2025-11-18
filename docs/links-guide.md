# 友链页面配置指南

本指南详细介绍如何在 Demius 主题中配置友链页面的卡片背景色。

---

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [配置模式](#配置模式)
- [友链数据配置](#友链数据配置)
- [使用示例](#使用示例)
- [常见问题](#常见问题)

---

## ✨ 功能特性

- ✅ **三种模式**：透明、随机彩色、自定义颜色
- ✅ **8种渐变**：随机模式提供8种精美渐变色
- ✅ **点击跳转**：卡片点击直接跳转
- ✅ **悬停效果**：精美的悬停动画
- ✅ **响应式**：自适应网格布局
- ✅ **暗色适配**：完美支持暗色主题

---

## 🚀 快速开始

### 1. 配置背景色模式

在 `hugo.toml` 中配置：

```toml
[params.links]
  cardColorMode = "transparent"   # transparent / random / custom
  cardCustomColor = "#f5f5f5"     # 自定义颜色
```

### 2. 配置友链数据

在 `data/links.yaml` 中配置：

```yaml
links:
  - name: "示例网站"
    url: "https://example.com"
    avatar: "https://example.com/avatar.jpg"
    description: "这是一个示例网站"
```

### 3. 重新构建

```bash
hugo server
```

### 4. 访问友链页面

访问 `http://localhost:1313/links/`

---

## 🎨 配置模式

### 模式一：透明背景 (transparent)

**配置：**
```toml
[params.links]
  cardColorMode = "transparent"
```

**效果：**
- ✅ 卡片使用主题默认背景
- ✅ 适配亮/暗色模式
- ✅ 简洁清爽

**视觉效果：**
```
┌──────────────┐ ┌──────────────┐
│  [头像]      │ │  [头像]      │
│   网站名     │ │   网站名     │
│   简介...    │ │   简介...    │
└──────────────┘ └──────────────┘
    透明背景         透明背景
```

**CSS 实现：**
```css
.link-card {
  background: var(--bg-primary);
}
```

---

### 模式二：随机彩色 (random)

**配置：**
```toml
[params.links]
  cardColorMode = "random"
```

**效果：**
- ✅ 8种精美渐变色轮播
- ✅ 文字自动变为白色
- ✅ 悬停效果增强
- ✅ 视觉冲击力强

**8种渐变颜色：**

1. **紫蓝渐变**
   ```css
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   ```

2. **粉红渐变**
   ```css
   background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
   ```

3. **蓝青渐变**
   ```css
   background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
   ```

4. **绿青渐变**
   ```css
   background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
   ```

5. **粉黄渐变**
   ```css
   background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
   ```

6. **青紫渐变**
   ```css
   background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
   ```

7. **粉蓝渐变**
   ```css
   background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
   ```

8. **粉橙渐变**
   ```css
   background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
   ```

**视觉效果：**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  [头像]      │ │  [头像]      │ │  [头像]      │
│   网站名 ⚪  │ │   网站名 ⚪  │ │   网站名 ⚪  │
│   简介... ⚪ │ │   简介... ⚪ │ │   简介... ⚪ │
└──────────────┘ └──────────────┘ └──────────────┘
  紫蓝渐变         粉红渐变         蓝青渐变
```

**特殊效果：**
- 文字白色 + 阴影
- 悬停上浮 + 放大
- 头像边框发光

---

### 模式三：自定义颜色 (custom)

**配置：**
```toml
[params.links]
  cardColorMode = "custom"
  cardCustomColor = "#f5f5f5"  # 浅灰色
```

**效果：**
- ✅ 所有卡片统一背景色
- ✅ 支持任意 #RRGGBB 颜色
- ✅ 文字颜色自动适配

**视觉效果：**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  [头像]      │ │  [头像]      │ │  [头像]      │
│   网站名     │ │   网站名     │ │   网站名     │
│   简介...    │ │   简介...    │ │   简介...    │
└──────────────┘ └──────────────┘ └──────────────┘
    #f5f5f5         #f5f5f5         #f5f5f5
```

---

## 📝 友链数据配置

### 数据文件位置

`data/links.yaml`

### 完整配置示例

```yaml
links:
  - name: "Demius Blog"
    url: "https://demius.tech"
    avatar: "https://demius.tech/avatar.png"
    description: "一个专注技术分享的博客"
  
  - name: "Hugo 官网"
    url: "https://gohugo.io"
    avatar: "https://gohugo.io/img/hugo.png"
    description: "世界上最快的静态网站生成器"
  
  - name: "GitHub"
    url: "https://github.com"
    avatar: "https://github.com/favicon.ico"
    description: "全球最大的代码托管平台"
```

### 参数说明

| 参数 | 必填 | 说明 | 示例 |
|------|------|------|------|
| name | ✅ | 网站名称 | "Demius Blog" |
| url | ✅ | 网站链接 | "https://demius.tech" |
| avatar | ✅ | 头像图片URL | "https://..." |
| description | ⭕ | 网站简介 | "技术分享博客" |

---

## 🎯 使用示例

### 示例一：默认透明

```toml
[params.links]
  cardColorMode = "transparent"
```

**适合：**
- 简洁风格
- 内容为主
- 统一设计

---

### 示例二：随机彩色

```toml
[params.links]
  cardColorMode = "random"
```

**适合：**
- 活泼风格
- 个人博客
- 视觉冲击

---

### 示例三：浅灰色

```toml
[params.links]
  cardColorMode = "custom"
  cardCustomColor = "#f5f5f5"
```

**适合：**
- 浅色主题
- 柔和设计
- 统一配色

---

### 示例四：深蓝色

```toml
[params.links]
  cardColorMode = "custom"
  cardCustomColor = "#2c3e50"
```

**适合：**
- 深色主题
- 科技风格
- 专业形象

---

### 示例五：品牌色

```toml
[params.links]
  cardColorMode = "custom"
  cardCustomColor = "#4fc3f7"  # 天蓝色
```

**适合：**
- 品牌展示
- 统一VI
- 主题色强调

---

## 🎨 颜色选择建议

### 浅色系

```toml
cardCustomColor = "#f5f5f5"  # 浅灰
cardCustomColor = "#ecf0f1"  # 极浅灰
cardCustomColor = "#e3f2fd"  # 浅蓝
cardCustomColor = "#f3e5f5"  # 浅紫
```

**特点：**
- ✅ 柔和舒适
- ✅ 适合亮色主题
- ✅ 视觉不疲劳

---

### 深色系

```toml
cardCustomColor = "#2c3e50"  # 深蓝灰
cardCustomColor = "#34495e"  # 深灰
cardCustomColor = "#1a1a1a"  # 深黑
cardCustomColor = "#263238"  # 深炭灰
```

**特点：**
- ✅ 专业稳重
- ✅ 适合暗色主题
- ✅ 对比度高

---

### 彩色系

```toml
cardCustomColor = "#4fc3f7"  # 天蓝
cardCustomColor = "#66bb6a"  # 绿色
cardCustomColor = "#ffa726"  # 橙色
cardCustomColor = "#ab47bc"  # 紫色
```

**特点：**
- ✅ 个性鲜明
- ✅ 品牌突出
- ❌ 可能不统一

---

## 🌙 暗色模式适配

### 透明模式

```css
/* 亮色模式 */
background: var(--bg-primary);

/* 暗色模式 */
[data-theme="dark"] .link-card {
  background: var(--bg-secondary-dark);
}
```

### 随机彩色模式

- 渐变色保持不变
- 文字始终白色
- 无需额外适配

### 自定义颜色模式

- 背景色保持不变
- 文字颜色自动适配
- 建议使用中性色

---

## 🔧 高级定制

### 修改悬停效果

```css
.link-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
```

### 修改卡片圆角

```css
.link-card {
  border-radius: 16px;  /* 默认12px */
}
```

### 添加边框

```css
.link-card {
  border: 2px solid var(--accent-primary);
}
```

### 修改头像样式

```css
.link-avatar {
  border-radius: 50%;  /* 圆形 */
  /* border-radius: 8px; */  /* 圆角矩形 */
}
```

---

## 📱 响应式布局

### 桌面端 (> 768px)

- 3列网格布局
- 卡片间距 1.5rem
- 完整悬停效果

### 平板端 (481-768px)

- 2列网格布局
- 卡片间距 1.2rem
- 简化悬停效果

### 移动端 (< 480px)

- 1列网格布局
- 卡片间距 1rem
- 取消悬停效果

---

## 🔍 常见问题

### Q1: 友链不显示？

**检查：**
1. ✅ `data/links.yaml` 文件存在
2. ✅ YAML 格式正确
3. ✅ 数据有 `links` 键
4. ✅ 清除缓存重新构建

### Q2: 头像不显示？

**原因：** 图片链接失效或跨域

**解决：**
1. 使用本地图片
2. 使用稳定的CDN
3. 检查图片URL是否正确

### Q3: 点击卡片无反应？

**检查：**
1. ✅ `url` 字段填写正确
2. ✅ URL 包含 `http://` 或 `https://`
3. ✅ JavaScript 未报错

### Q4: 随机颜色不随机？

**说明：** 颜色按顺序轮播，每8个一循环

**非问题**

### Q5: 自定义颜色不生效？

**检查：**
1. ✅ `cardColorMode = "custom"`
2. ✅ 颜色格式为 `#RRGGBB`
3. ✅ 重新构建项目
4. ✅ 清除浏览器缓存

### Q6: 如何添加新友链？

在 `data/links.yaml` 中添加：

```yaml
links:
  # ... 现有友链 ...
  
  - name: "新网站"
    url: "https://new-site.com"
    avatar: "https://new-site.com/avatar.jpg"
    description: "新网站简介"
```

### Q7: 如何批量导入友链？

使用脚本或直接编辑 YAML 文件：

```yaml
links:
  - name: "网站1"
    url: "https://site1.com"
    avatar: "/img/avatars/1.png"
    description: "简介1"
  
  - name: "网站2"
    url: "https://site2.com"
    avatar: "/img/avatars/2.png"
    description: "简介2"
  
  # ... 更多友链 ...
```

---

## 🎯 最佳实践

### 1. 模式选择

**推荐透明模式：**
- ✅ 统一设计语言
- ✅ 适应主题切换
- ✅ 简洁专业

**推荐随机模式：**
- ✅ 个人博客
- ✅ 视觉丰富
- ✅ 活泼有趣

**推荐自定义模式：**
- ✅ 品牌色统一
- ✅ 特定配色需求
- ✅ 企业网站

### 2. 友链管理

**头像建议：**
- 尺寸：80×80px 或更高
- 格式：PNG/JPG/WebP
- 大小：< 50KB

**简介建议：**
- 长度：10-30字
- 内容：简明扼要
- 避免：过长换行

**数量建议：**
- 首屏：6-12个
- 总数：< 50个（性能考虑）

### 3. 性能优化

- 使用 CDN 托管头像
- 压缩图片
- 合理控制数量

---

## 📊 模式对比

| 模式 | 视觉冲击 | 统一性 | 适配性 | 维护成本 |
|------|---------|--------|--------|----------|
| 透明 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ 低 |
| 随机彩色 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ 低 |
| 自定义 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ 低 |

---

## 🔄 更新日志

### v1.0.0 (2025-10-24)
- ✨ 支持3种背景模式
- ✅ 8种随机渐变色
- ✅ 点击跳转功能
- ✅ 精美悬停效果
- ✅ 响应式网格布局
- ✅ 暗色模式适配

---

**祝使用愉快！** 🎉

