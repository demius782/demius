# 页脚配置功能使用指南

本指南详细介绍 Demius 主题页脚的所有配置功能，包括运行时间显示、备案信息、网站地图等。

---

## 📋 目录

- [功能概述](#功能概述)
- [运行时间显示](#运行时间显示)
- [网站地图](#网站地图)
- [备案信息](#备案信息)
- [自定义内容](#自定义内容)
- [完整配置示例](#完整配置示例)
- [常见问题](#常见问题)

---

## 功能概述

页脚配置提供以下功能：

| 功能 | 说明 | 是否必需 |
|------|------|---------|
| **版权信息** | 自动显示站点名称和年份 | ✅ 自动 |
| **运行时间** | 动态显示网站运行天数时分秒 | ⭕ 可选 |
| **备案信息** | 显示ICP备案号 | ⭕ 可选 |
| **网站地图** | 链接到sitemap.xml | ⭕ 可选 |
| **自定义内容** | 添加自定义HTML内容 | ⭕ 可选 |

---

## 运行时间显示

### ✨ 功能说明

动态显示网站运行时间，精确到秒，每秒自动更新。

**效果示例：**
```
本站已运行 365 天 12 时 34 分 56 秒
```

### 📝 配置方法

在 `hugo.toml` 中添加以下配置：

```toml
[params.footer.runningTime]
  enable = true                          # 是否启用运行时间显示
  startDate = "2024-01-01"               # 网站建站日期（格式：YYYY-MM-DD）
  prefix = "本站已运行"                   # 前缀文字
```

### 🎨 配置参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | Boolean | `false` | 是否启用运行时间显示 |
| `startDate` | String | 无 | 网站建站日期，格式为 `YYYY-MM-DD` |
| `prefix` | String | `"本站已运行"` | 前缀文字，可自定义 |

### 💡 使用示例

#### 示例 1：基本配置

```toml
[params.footer.runningTime]
  enable = true
  startDate = "2024-01-01"
  prefix = "本站已运行"
```

**效果：**
```
本站已运行 300 天 8 时 15 分 42 秒
```

#### 示例 2：自定义前缀文字

```toml
[params.footer.runningTime]
  enable = true
  startDate = "2023-06-15"
  prefix = "网站稳定运行"
```

**效果：**
```
网站稳定运行 500 天 20 时 30 分 15 秒
```

#### 示例 3：禁用运行时间

```toml
[params.footer.runningTime]
  enable = false
```

页脚将不显示运行时间。

### 🎯 样式特性

- ✅ **动态更新**：每秒自动更新
- ✅ **精美动画**：秒数部分有呼吸动画效果
- ✅ **悬停效果**：鼠标悬停时有轻微上移和阴影
- ✅ **暗色模式**：自动适配暗色主题
- ✅ **响应式设计**：移动端自动缩小字体

### 🎨 视觉效果

- **背景色**：主题色半透明背景
- **字体**：数字使用等宽字体
- **数字样式**：每个数字有独立的圆角背景
- **动画**：秒数部分有呼吸效果

---

## 网站地图

### ✨ 功能说明

Hugo 自动生成 `sitemap.xml`，可在页脚添加链接方便访问。

### 📝 配置方法

在 `hugo.toml` 的 `[params.footer]` 部分添加：

```toml
[params.footer]
  custom = """
    <div class="footer-links">
      <a href="/sitemap.xml">网站地图</a>
    </div>
  """
```

### 🌐 网站地图说明

#### 自动生成

Hugo 会自动在 `public/sitemap.xml` 生成网站地图，包含：

- ✅ 所有文章页面
- ✅ 分类和标签页面
- ✅ 自定义页面（关于、友链等）
- ✅ 更新时间和优先级

#### 访问地址

- **本地开发**：`http://localhost:1313/sitemap.xml`
- **生产环境**：`https://your-domain.com/sitemap.xml`

#### 提交到搜索引擎

**Google Search Console：**
1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加站点地图：输入 `https://your-domain.com/sitemap.xml`
3. 点击提交

**百度搜索资源平台：**
1. 访问 [百度搜索资源平台](https://ziyuan.baidu.com/)
2. 在"数据引入 > 链接提交 > sitemap"中提交
3. 输入：`https://your-domain.com/sitemap.xml`

---

## 备案信息

### ✨ 功能说明

如果网站在中国大陆托管，需要显示ICP备案号。

### 📝 配置方法

在 `hugo.toml` 中添加：

```toml
[params.footer]
  beian = "粤ICP备12345678号"              # 替换为您的备案号
```

### 💡 使用说明

- **备案号格式**：例如 `京ICP备12345678号`、`粤ICP备12345678号`
- **链接**：自动链接到 [https://beian.miit.gov.cn](https://beian.miit.gov.cn)
- **位置**：显示在版权信息下方

### 📝 示例

```toml
[params.footer]
  beian = "京ICP备2024012345号"
```

**效果：**
```
© 2024 我的博客
京ICP备2024012345号
```

---

## 自定义内容

### ✨ 功能说明

在页脚添加自定义HTML内容，如友情链接、导航菜单等。

### 📝 配置方法

```toml
[params.footer]
  custom = """
    <div class="footer-links">
      <a href="/about">关于</a>
      <a href="/privacy">隐私政策</a>
      <a href="/sitemap.xml">网站地图</a>
      <a href="/links">友链</a>
    </div>
  """
```

### 💡 使用示例

#### 示例 1：导航链接

```toml
[params.footer]
  custom = """
    <div class="footer-links">
      <a href="/about">关于本站</a>
      <a href="/privacy">隐私政策</a>
      <a href="/terms">使用条款</a>
      <a href="/sitemap.xml">网站地图</a>
    </div>
  """
```

#### 示例 2：社交媒体链接

```toml
[params.footer]
  custom = """
    <div class="footer-social">
      <a href="https://github.com/yourusername" target="_blank">GitHub</a>
      <a href="https://twitter.com/yourusername" target="_blank">Twitter</a>
      <a href="/feed.xml">RSS</a>
    </div>
  """
```

#### 示例 3：复杂内容

```toml
[params.footer]
  custom = """
    <div class="footer-content">
      <div class="footer-links">
        <div class="link-group">
          <h4>关于</h4>
          <a href="/about">关于本站</a>
          <a href="/contact">联系我们</a>
        </div>
        <div class="link-group">
          <h4>资源</h4>
          <a href="/archives">归档</a>
          <a href="/tags">标签</a>
        </div>
        <div class="link-group">
          <h4>其他</h4>
          <a href="/privacy">隐私政策</a>
          <a href="/sitemap.xml">网站地图</a>
        </div>
      </div>
    </div>
  """
```

### ⚠️ 注意事项

1. **HTML转义**：使用 `"""` 三引号包裹多行HTML
2. **链接目标**：外部链接添加 `target="_blank"`
3. **样式**：可以添加自定义CSS类名
4. **安全性**：避免插入不安全的JavaScript代码

---

## 完整配置示例

### 示例 1：完整功能配置

```toml
# ===== 页脚配置 =====
[params.footer]
  # 备案信息
  beian = "京ICP备2024012345号"
  
  # 运行时间显示配置
  [params.footer.runningTime]
    enable = true
    startDate = "2024-01-01"
    prefix = "本站已运行"
  
  # 自定义内容（导航链接）
  custom = """
    <div class="footer-links">
      <a href="/about">关于</a>
      <a href="/privacy">隐私政策</a>
      <a href="/sitemap.xml">网站地图</a>
      <a href="/links">友链</a>
    </div>
  """
```

**效果：**
```
© 2024 我的博客

本站已运行 365 天 12 时 34 分 56 秒

京ICP备2024012345号

关于 | 隐私政策 | 网站地图 | 友链
```

### 示例 2：最小化配置

```toml
[params.footer]
  # 只显示版权信息和运行时间
  [params.footer.runningTime]
    enable = true
    startDate = "2024-01-01"
```

### 示例 3：无运行时间配置

```toml
[params.footer]
  beian = "粤ICP备2024012345号"
  
  custom = """
    <div class="footer-links">
      <a href="/about">关于</a>
      <a href="/sitemap.xml">网站地图</a>
    </div>
  """
```

---

## 常见问题

### Q1：运行时间不显示？

**检查项：**

1. ✅ 确认 `enable = true`
2. ✅ 确认 `startDate` 格式正确（`YYYY-MM-DD`）
3. ✅ 重新构建站点：`hugo --cleanDestinationDir`
4. ✅ 清除浏览器缓存

### Q2：运行时间计算不准确？

**原因：**
- `startDate` 配置错误
- 使用了非标准日期格式

**解决方法：**
```toml
# ✅ 正确格式
startDate = "2024-01-01"

# ❌ 错误格式
startDate = "2024/01/01"      # 使用斜杠
startDate = "01-01-2024"      # 顺序错误
startDate = "2024-1-1"        # 缺少前导零
```

### Q3：sitemap.xml 404错误？

**检查项：**

1. ✅ 确认Hugo已经构建：`hugo`
2. ✅ 检查 `public/sitemap.xml` 是否存在
3. ✅ 确认链接为 `/sitemap.xml`（不是 `/sitemap`）

### Q4：运行时间在PJAX页面切换后停止更新？

**检查项：**

1. ✅ 确认已导入 `_running-time.js`
2. ✅ 确认PJAX配置正确
3. ✅ 检查控制台是否有JavaScript错误

**已内置支持：**
- ✅ 主题已自动处理PJAX兼容性
- ✅ 页面切换时会自动重新初始化

### Q5：运行时间显示样式不正确？

**检查项：**

1. ✅ 确认已导入 `_running-time.css`
2. ✅ 清除浏览器缓存
3. ✅ 检查CSS变量是否正确定义

### Q6：如何自定义运行时间的样式？

**方法 1：修改CSS变量**

在您的自定义CSS中：

```css
.footer-running-time {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1rem;
}

.running-time-value .time-unit {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
```

**方法 2：覆盖默认样式**

在 `assets/css/custom.css` 中：

```css
.footer-running-time {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.running-time-value {
  font-size: 1.2em;
  font-weight: bold;
}
```

### Q7：如何隐藏某些页面的运行时间？

运行时间基于配置文件，全站统一显示。

**如需特殊控制：**

可以使用CSS根据页面类型隐藏：

```css
/* 在文章详情页隐藏 */
.single .footer-running-time {
  display: none;
}

/* 在首页显示 */
.home .footer-running-time {
  display: block;
}
```

### Q8：网站地图没有更新最新内容？

**解决方法：**

1. 重新构建站点：
   ```bash
   hugo --cleanDestinationDir
   ```

2. 检查文章是否设置了 `draft: true`：
   ```yaml
   ---
   title: "文章标题"
   draft: false  # 确保为 false 或删除此行
   ---
   ```

3. Hugo会自动更新sitemap.xml，无需手动干预

---

## 技术细节

### 运行时间实现原理

1. **数据传递**：通过 `data-start-date` 属性传递建站日期
2. **JavaScript计算**：每秒计算当前时间与建站日期的差值
3. **DOM更新**：动态更新 `.running-time-value` 的内容
4. **PJAX兼容**：页面切换时自动清理和重新初始化计时器

### 文件结构

```
themes/demius/
├── assets/
│   ├── css/
│   │   └── _running-time.css        # 运行时间样式
│   └── js/
│       ├── _running-time.js         # 运行时间功能
│       └── _simple-pjax.js          # PJAX兼容处理
├── layouts/
│   └── partials/
│       └── footer/
│           └── footer.html          # 页脚HTML模板
└── ...
```

### 性能优化

- ✅ **轻量级**：JavaScript代码不到2KB
- ✅ **高效**：使用 `setInterval` 每秒更新一次
- ✅ **自动清理**：PJAX切换时自动清除定时器
- ✅ **无依赖**：纯原生JavaScript实现

---

## 相关文档

- [主题配置总览](../README.md)
- [PJAX无刷新切换](pjax-guide.md)（如有）
- [自定义样式指南](custom-styles-guide.md)（如有）

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0.0 | 2025-10-25 | 初始版本，支持运行时间显示和网站地图 |

---

**提示：** 本功能完全兼容现有主题，不会影响任何其他样式和功能。

**最后更新：** 2025-10-25

