# 视频嵌入功能使用指南

本指南详细介绍如何在 Demius 主题中使用视频嵌入功能。

---

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [支持的平台](#支持的平台)
- [使用方法](#使用方法)
- [高级配置](#高级配置)
- [样式定制](#样式定制)
- [常见问题](#常见问题)

---

## ✨ 功能特性

- ✅ **多平台支持**：B站、抖音、YouTube、HTML5本地视频
- ✅ **响应式设计**：自动适配各种屏幕尺寸（16:9宽高比）
- ✅ **懒加载优化**：仅在视口可见时加载视频，提升性能
- ✅ **暗色模式**：自动适配网站主题
- ✅ **安全防护**：使用 sandbox 属性限制iframe权限
- ✅ **平台标识**：显示视频平台图标和名称
- ✅ **打印友好**：打印时显示提示文字
- ✅ **一键开关**：配置文件统一控制

---

## 🚀 快速开始

### 1. 启用功能

在 `hugo.toml` 中启用视频功能：

```toml
[params.video]
  enable = true  # 是否启用视频嵌入功能
```

### 2. 在文章中使用

在 Markdown 文件中使用 shortcode：

```markdown
{{</* bilibili bvid="BV1xx411c7mD" */>}}
```

### 3. 重新构建

```bash
hugo server
```

---

## 🎬 支持的平台

### 1. 哔哩哔哩（B站）

**Shortcode:** `bilibili`

**基础用法：**
```markdown
{{</* bilibili bvid="BV1xx411c7mD" */>}}
{{</* bilibili aid="170001" */>}}
```

**完整参数：**
```markdown
{{</* bilibili 
  bvid="BV1xx411c7mD"     # B站视频BV号（与aid二选一）
  aid="170001"            # B站视频AV号（与bvid二选一）
  cid="279786"            # 分P视频的CID（可选）
  page="1"                # 分P视频页码（默认1）
  autoplay="false"        # 是否自动播放（默认false）
  danmaku="true"          # 是否显示弹幕（默认true）
*/>}}
```

**获取参数方法：**
1. 打开B站视频页面
2. 从URL获取BV号：`https://www.bilibili.com/video/BV1xx411c7mD`
3. 或点击分享→嵌入代码，复制BV号

---

### 2. 抖音

**Shortcode:** `douyin`

**基础用法：**
```markdown
{{</* douyin id="7123456789012345678" */>}}
{{</* douyin url="https://www.douyin.com/video/7123456789012345678" */>}}
```

**参数说明：**
- `id`: 视频ID（与url二选一）
- `url`: 完整分享链接（与id二选一）

**获取参数方法：**
1. 打开抖音视频页面
2. 从URL获取ID：`https://www.douyin.com/video/7123456789012345678`
3. 或点击分享按钮，复制链接

---

### 3. YouTube

**Shortcode:** `youtube`

**基础用法：**
```markdown
{{</* youtube id="dQw4w9WgXcQ" */>}}
```

**完整参数：**
```markdown
{{</* youtube 
  id="dQw4w9WgXcQ"        # YouTube视频ID（必需）
  autoplay="false"        # 是否自动播放（默认false）
  start="30"              # 从第几秒开始（可选）
*/>}}
```

**获取参数方法：**
1. 打开YouTube视频页面
2. 从URL获取ID：`https://www.youtube.com/watch?v=dQw4w9WgXcQ`
3. ID就是 `v=` 后面的部分

---

### 4. HTML5 本地视频

**Shortcode:** `video`

**基础用法：**
```markdown
{{</* video src="/videos/demo.mp4" */>}}
```

**完整参数：**
```markdown
{{</* video 
  src="/videos/demo.mp4"        # 视频文件路径（必需）
  poster="/img/cover.jpg"       # 视频封面图片（可选）
  autoplay="false"              # 是否自动播放（默认false）
  loop="false"                  # 是否循环播放（默认false）
  muted="false"                 # 是否静音（默认false）
  controls="true"               # 是否显示控制栏（默认true）
*/>}}
```

**视频文件放置位置：**
- 放在 `static/videos/` 目录下
- 引用时使用 `/videos/文件名.mp4`

---

## ⚙️ 高级配置

### 关闭视频功能

在 `hugo.toml` 中设置：

```toml
[params.video]
  enable = false  # 禁用视频嵌入功能
```

**效果：**
- 所有视频shortcode不会渲染任何内容
- 不加载视频相关CSS和JavaScript
- 已有文章中的视频shortcode会被忽略

### 性能优化

**1. 懒加载**
- 所有视频默认启用 `loading="lazy"`
- 仅在视口可见时才加载iframe
- 减少首屏加载时间

**2. 减少自动播放**
- 避免使用 `autoplay="true"`
- 自动播放会消耗流量和影响用户体验

**3. 合理使用封面**
- HTML5视频建议设置 `poster` 封面
- 减少初始加载资源

---

## 🎨 样式定制

### 修改视频容器样式

在自定义CSS中覆盖 `.video-container`：

```css
/* 修改视频边框圆角 */
.video-container {
  border-radius: 20px;
}

/* 修改阴影效果 */
.video-container {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* 修改宽高比（例如改为4:3） */
.video-wrapper {
  padding-bottom: 75%; /* 4:3 = 75% */
}
```

### 自定义平台标识样式

```css
/* 修改B站视频信息栏颜色 */
.bilibili-video .video-info {
  background: linear-gradient(135deg, 
    rgba(251, 114, 153, 0.2) 0%, 
    rgba(0, 161, 214, 0.2) 100%);
}

/* 隐藏视频信息栏 */
.video-info {
  display: none;
}
```

### 响应式自定义

```css
/* 移动端修改视频边距 */
@media (max-width: 768px) {
  .video-container {
    margin: 1rem 0;
  }
}
```

---

## 🛠️ 技术实现

### 文件结构

```
themes/demius/
├── layouts/shortcodes/
│   ├── bilibili.html      # B站视频shortcode
│   ├── douyin.html        # 抖音视频shortcode
│   ├── youtube.html       # YouTube视频shortcode
│   └── video.html         # HTML5视频shortcode
├── assets/css/
│   └── _video.css         # 视频样式文件
└── assets/js/
    └── (无需JavaScript)   # 纯CSS实现
```

### 响应式布局原理

使用padding-bottom技巧实现16:9响应式：

```css
.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 = 9/16 = 56.25% */
  height: 0;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

### 安全机制

使用sandbox属性限制iframe权限：

```html
<iframe 
  sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts allow-popups"
  ...>
</iframe>
```

**允许的权限：**
- `allow-top-navigation`: 允许导航到顶层窗口
- `allow-same-origin`: 允许同源访问
- `allow-forms`: 允许表单提交
- `allow-scripts`: 允许脚本执行
- `allow-popups`: 允许弹窗

---

## ❓ 常见问题

### Q1: 视频无法播放？

**可能原因：**
1. 视频ID错误或视频已被删除
2. 浏览器安全策略限制（需HTTPS）
3. 网络连接问题
4. 视频平台地区限制

**解决方法：**
1. 检查视频ID是否正确
2. 确保网站使用HTTPS（生产环境）
3. 尝试在视频平台官网播放确认
4. 检查浏览器控制台错误信息

### Q2: 视频加载很慢？

**优化方法：**
1. 启用懒加载（默认已启用）
2. 减少单页面视频数量
3. 使用CDN加速
4. 压缩视频文件（本地视频）

### Q3: 可以修改视频尺寸吗？

**修改方法：**
1. 默认16:9响应式布局
2. 修改 `.video-wrapper` 的 `padding-bottom`：
   - 16:9 = 56.25%
   - 4:3 = 75%
   - 1:1 = 100%

### Q4: 支持其他平台吗？

**扩展方法：**
1. 参考现有shortcode代码
2. 创建新的shortcode文件
3. 添加对应CSS样式
4. 在 `hugo.toml` 中启用

示例（添加腾讯视频）：
```html
<!-- themes/demius/layouts/shortcodes/tencent.html -->
{{- if .Site.Params.video.enable -}}
{{- $vid := .Get "vid" -}}
<div class="video-container tencent-video">
  <div class="video-wrapper">
    <iframe src="https://v.qq.com/txp/iframe/player.html?vid={{ $vid }}" 
            frameborder="0" allowfullscreen></iframe>
  </div>
  <div class="video-info">
    <i class="fas fa-video"></i>
    <span>腾讯视频</span>
  </div>
</div>
{{- end -}}
```

### Q5: 移动端体验如何优化？

**优化建议：**
1. 视频自动适配屏幕宽度（已实现）
2. 避免自动播放（消耗流量）
3. 提供播放提示文字
4. 使用封面图片（减少流量）

### Q6: 打印时会显示什么？

**打印效果：**
- 显示提示文字："[视频内容，请访问网页版查看]"
- 隐藏视频播放器
- 保留视频容器样式（无阴影）

---

## 📊 兼容性

### 浏览器支持

| 浏览器 | 版本 | 支持度 |
|--------|------|--------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| IE | - | ❌ 不支持 |

### 移动设备支持

| 平台 | 支持度 |
|------|--------|
| iOS Safari | ✅ 完全支持 |
| Android Chrome | ✅ 完全支持 |
| 微信内置浏览器 | ⚠️ 部分支持（部分平台受限） |
| QQ浏览器 | ✅ 完全支持 |

---

## 🔄 更新日志

### v1.0.0 (2025-10-24)
- ✨ 初始版本发布
- ✅ 支持B站、抖音、YouTube视频
- ✅ 支持HTML5本地视频
- ✅ 响应式设计
- ✅ 暗色模式适配
- ✅ 懒加载优化

---

## 📝 许可证

本功能遵循 Demius 主题的许可证协议。

---

## 🤝 贡献

欢迎提交问题和改进建议！

---

**祝使用愉快！** 🎉

