# 打赏按钮功能使用指南

本指南详细介绍如何在 Demius 主题中使用打赏按钮功能。

---

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [样式定制](#样式定制)
- [常见问题](#常见问题)

---

## ✨ 功能特性

- ✅ **双平台支持**：微信、支付宝收款码
- ✅ **悬停显示**：鼠标移上显示二维码
- ✅ **移动适配**：触摸点击显示/隐藏
- ✅ **自定义文字**：可配置按钮和标题文字
- ✅ **美观设计**：渐变背景、平滑动画
- ✅ **响应式**：自动适配各种屏幕
- ✅ **暗色模式**：自动适配网站主题

---

## 🚀 快速开始

### 1. 准备收款码

**微信收款码：**
1. 打开微信
2. 我 → 服务 → 收付款 → 我的收款码
3. 保存收款码图片
4. 上传到图床或 `static/img/`

**支付宝收款码：**
1. 打开支付宝
2. 首页 → 收钱
3. 保存收款码图片
4. 上传到图床或 `static/img/`

### 2. 配置打赏功能

在 `hugo.toml` 中配置：

```toml
[params.reward]
  enable = true
  buttonText = "☕ 感谢支持"
  title = "如果觉得文章有帮助，可以请我喝杯咖啡~"
  wechat = "https://example.com/wechat-qr.jpg"
  alipay = "https://example.com/alipay-qr.jpg"
```

### 3. 重新构建

```bash
hugo server
```

### 4. 查看效果

访问任意文章详情页，在底部标签和版权之间会看到打赏按钮。

---

## ⚙️ 配置说明

### 完整配置

```toml
[params.reward]
  enable = true                          # 是否启用打赏按钮
  buttonText = "☕ 感谢支持"              # 按钮显示文字
  title = "如果觉得文章有帮助，可以请我喝杯咖啡~"  # 打赏提示文字
  wechat = "https://mpimg.cn/view.php/xxx.webp"    # 微信收款码URL
  alipay = "https://mpimg.cn/view.php/xxx.webp"    # 支付宝收款码URL
```

### 参数详解

#### **enable** (布尔值)
- **作用：** 总开关
- **默认值：** `false`
- **说明：** 设置为 `true` 启用打赏功能

#### **buttonText** (字符串)
- **作用：** 按钮上显示的文字
- **默认值：** `"感谢支持"`
- **建议：**
  - `"☕ 感谢支持"`
  - `"💰 赞助"`
  - `"❤️ 打赏"`
  - `"🎁 请喝咖啡"`

#### **title** (字符串)
- **作用：** 二维码面板上方的标题
- **默认值：** `"如果觉得文章有帮助，可以请我喝杯咖啡~"`
- **建议：**
  - 简短友好
  - 表达感谢
  - 说明用途

#### **wechat** (字符串)
- **作用：** 微信收款码图片URL
- **格式：** 完整的URL或相对路径
- **示例：**
  - `"https://example.com/wechat.jpg"` （图床）
  - `"/img/wechat-qr.jpg"` （本地）

#### **alipay** (字符串)
- **作用：** 支付宝收款码图片URL
- **格式：** 完整的URL或相对路径
- **示例：**
  - `"https://example.com/alipay.jpg"` （图床）
  - `"/img/alipay-qr.jpg"` （本地）

---

## 🎯 配置示例

### 示例一：基础配置

```toml
[params.reward]
  enable = true
  buttonText = "☕ 感谢支持"
  title = "如果觉得文章有帮助，可以请我喝杯咖啡~"
  wechat = "https://example.com/wechat-qr.jpg"
  alipay = "https://example.com/alipay-qr.jpg"
```

### 示例二：仅微信

```toml
[params.reward]
  enable = true
  buttonText = "微信赞助"
  title = "感谢您的支持！"
  wechat = "https://example.com/wechat-qr.jpg"
  # alipay = ""  # 不设置支付宝
```

### 示例三：仅支付宝

```toml
[params.reward]
  enable = true
  buttonText = "支付宝打赏"
  title = "请作者喝杯奶茶~"
  # wechat = ""  # 不设置微信
  alipay = "https://example.com/alipay-qr.jpg"
```

### 示例四：本地图片

```toml
[params.reward]
  enable = true
  buttonText = "❤️ 打赏"
  title = "您的支持是我创作的动力！"
  wechat = "/img/reward/wechat.jpg"
  alipay = "/img/reward/alipay.jpg"
```

**目录结构：**
```
static/
└── img/
    └── reward/
        ├── wechat.jpg
        └── alipay.jpg
```

---

## 🎨 使用说明

### 桌面端（鼠标操作）

1. **鼠标移到按钮上**
   - 二维码面板淡入显示
   - 显示标题和二维码

2. **鼠标移到面板上**
   - 面板保持显示
   - 可以扫码打赏

3. **鼠标移开**
   - 二维码面板淡出隐藏

### 移动端（触摸操作）

1. **点击按钮**
   - 二维码面板显示/隐藏（切换）

2. **点击面板外部**
   - 二维码面板自动隐藏

---

## 🎨 样式说明

### 按钮样式

```css
.reward-button {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}
```

**特点：**
- 渐变红色背景
- 圆角按钮
- 阴影效果
- 悬停动画

### 二维码面板

```css
.reward-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

**特点：**
- 白色背景
- 圆角设计
- 深色阴影
- 淡入淡出

### 二维码样式

- **尺寸：** 200×200px
- **排列：** 横向排列
- **间距：** 1rem
- **标签：** 平台名称

---

## 🎯 位置说明

打赏按钮位于文章详情页的：

```
文章正文
  ↓
标签区域
  ↓
📌 打赏按钮（在这里）
  ↓
版权声明
  ↓
上一篇/下一篇
  ↓
评论区
```

**HTML结构：**
```html
<article class="post">
  <div class="post-content">...</div>
  <div class="post-tags-simple">...</div>
  
  <!-- 打赏按钮 -->
  <div class="post-reward">
    <button class="reward-button">☕ 感谢支持</button>
    <div class="reward-panel">...</div>
  </div>
  
  <div class="post-copyright">...</div>
</article>
```

---

## 🎨 样式定制

### 修改按钮颜色

```css
.reward-button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}
```

### 修改按钮形状

```css
.reward-button {
  border-radius: 8px;  /* 方形 */
}
```

### 修改按钮大小

```css
.reward-button {
  padding: 1rem 3rem;
  font-size: 1.2rem;
}
```

### 修改二维码尺寸

```css
.reward-qrcode img {
  width: 250px;
  height: 250px;
}
```

### 修改面板背景

```css
.reward-panel {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
}
```

---

## 📱 响应式适配

### 桌面端（>768px）

```css
.reward-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
}

.reward-qrcode img {
  width: 200px;
  height: 200px;
}

.reward-qrcodes {
  flex-direction: row;  /* 横向排列 */
  gap: 2rem;
}
```

### 移动端（≤768px）

```css
.reward-button {
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
}

.reward-qrcode img {
  width: 150px;
  height: 150px;
}

.reward-qrcodes {
  flex-direction: column;  /* 纵向排列 */
  gap: 1.5rem;
}
```

---

## 🌙 暗色模式

自动适配暗色模式：

**亮色模式：**
- 面板背景：白色
- 文字：深色
- 阴影：浅色

**暗色模式：**
- 面板背景：深灰色
- 文字：浅色
- 阴影：深色

**自动切换：** 跟随网站主题，无需额外配置。

---

## 🔍 常见问题

### Q1: 打赏按钮不显示？

**检查清单：**
1. ✅ `enable = true`
2. ✅ 至少设置了微信或支付宝
3. ✅ 访问的是文章详情页（非首页）

### Q2: 二维码不显示？

**原因：** 图片URL错误

**解决：**
1. 检查URL是否可访问
2. 检查图片格式（jpg/png/webp）
3. 确保图片已上传

### Q3: 鼠标悬停不显示？

**检查：**
1. 浏览器是否支持 `:hover`
2. CSS是否正确加载
3. 是否在移动端（移动端需点击）

### Q4: 如何禁用打赏功能？

```toml
[params.reward]
  enable = false
```

### Q5: 可以只显示一个平台吗？

**可以。** 只设置一个平台的URL即可：

```toml
# 只显示微信
wechat = "url..."
# alipay = ""  # 留空或不设置

# 只显示支付宝
# wechat = ""
alipay = "url..."
```

### Q6: 如何修改按钮位置？

**向上移动：**
```css
.post-reward {
  margin-top: -1rem;
}
```

**向下移动：**
```css
.post-reward {
  margin-bottom: 2rem;
}
```

### Q7: 如何隐藏标题？

```css
.reward-title {
  display: none;
}
```

### Q8: 移动端点击无反应？

**检查：**
1. JavaScript是否正确加载
2. 浏览器控制台是否有错误
3. PJAX是否正确重新初始化

---

## 🎯 最佳实践

### 1. 二维码图片

- ✅ 分辨率：至少300×300px
- ✅ 格式：JPG/PNG/WebP
- ✅ 大小：<100KB
- ❌ 避免：过大图片（影响加载）

### 2. 按钮文字

**推荐：**
- ✅ "☕ 感谢支持"
- ✅ "💰 赞助作者"
- ✅ "❤️ 请喝咖啡"
- ✅ "🎁 打赏"

**避免：**
- ❌ 过长的文字
- ❌ 生硬的表达
- ❌ 过于商业化

### 3. 标题文字

**推荐：**
- ✅ 表达感谢
- ✅ 说明用途
- ✅ 简短友好

**示例：**
- "如果觉得文章有帮助，可以请我喝杯咖啡~"
- "您的支持是我创作的动力！"
- "感谢您的支持，您的鼓励让我继续前行"

### 4. 使用建议

**适合启用：**
- ✅ 原创内容博客
- ✅ 教程类网站
- ✅ 个人创作平台

**不适合启用：**
- ❌ 纯转载内容
- ❌ 企业官网
- ❌ 新闻资讯站

---

## 💡 创意用法

### 1. 多用途说明

```toml
title = "支持方式：\n☕ 请喝咖啡 | 📚 买本好书 | 💻 升级设备"
```

### 2. 感谢名单链接

```toml
title = "感谢支持！查看 <a href='/thanks/'>感谢名单</a>"
```

### 3. 使用Emoji

```toml
buttonText = "💖 赞助"
title = "🎁 您的支持是最好的礼物"
```

---

## 🔧 高级定制

### 始终显示面板

```css
.reward-panel {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) translateY(0) !important;
}
```

### 修改动画速度

```css
.reward-panel {
  transition: all 0.5s ease;  /* 默认0.3s */
}
```

### 添加背景模糊

```css
.reward-panel {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}
```

---

## 🔄 更新日志

### v1.0.0 (2025-10-24)
- ✨ 初始版本发布
- ✅ 支持微信、支付宝
- ✅ 桌面端悬停显示
- ✅ 移动端点击切换
- ✅ 响应式设计
- ✅ 暗色模式适配

---

## 📝 许可证

本功能遵循 Demius 主题的许可证协议。

---

**祝使用愉快！** 🎉

