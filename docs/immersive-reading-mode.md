# 沉浸阅读模式功能

## 📋 功能概述

沉浸阅读模式是一个专注阅读的功能，可以隐藏页面中的所有干扰元素（导航栏、侧栏、页脚），让用户完全专注于文章内容本身。

---

## 🎯 功能特点

### 1. 一键切换
- 🎯 点击按钮即可开启/关闭
- 💾 状态自动保存到本地
- 🔄 刷新页面保持状态
- ⚡ 平滑过渡动画

### 2. 隐藏元素
开启沉浸模式后，以下元素将被隐藏：
- 🧭 导航栏 (`.site-header`)
- 📚 左侧栏 (`.site-aside-left`)
- 📋 右侧栏 (`.site-aside-right`)
- 🦶 页脚 (`.site-footer`)

### 3. 内容优化
- 📖 内容区域最大宽度800px
- 🎯 居中显示，易于阅读
- 📏 适当的内边距（2rem）
- 🔘 保持浮动按钮可见

### 4. 视觉反馈
- 🎨 按钮激活时高亮显示
- 💫 平滑的淡入淡出动画
- 🌈 特殊的渐变色（青粉渐变）
- ✨ 悬停效果一致

---

## 📍 按钮位置

### 在悬浮按钮组中的位置

**展开后从底部向上：**
```
6️⃣ 沉浸阅读  ← 新增（最顶部）
5️⃣ 侧栏切换
4️⃣ 主题切换
3️⃣ 设置按钮  ← 点击展开
2️⃣ 阅读进度
1️⃣ 回到顶部
```

---

## 🔧 技术实现

### HTML 结构

```html
<button id="immersive-mode" class="floating-btn fab-extra" aria-label="沉浸阅读" title="沉浸阅读模式">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
</button>
```

**图标说明**：使用"书本"图标，象征阅读和学习。

### CSS 样式

#### 按钮定位
```css
.fab-extra#immersive-mode {
  bottom: calc(5 * (3rem + 0.75rem));  /* 在侧栏切换上方 */
}
```

#### 沉浸模式样式
```css
/* 隐藏导航栏、侧栏和页脚 */
body.immersive-mode .site-header,
body.immersive-mode .site-aside-left,
body.immersive-mode .site-aside-right,
body.immersive-mode .site-footer {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* 中间内容区域全宽 */
body.immersive-mode .site-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  transition: all 0.3s ease;
}

/* 沉浸模式激活时按钮高亮 */
body.immersive-mode #immersive-mode {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #fff;
}
```

### JavaScript 逻辑

```javascript
// 沉浸阅读模式功能
function setupImmersiveMode() {
  if (!immersiveMode) return;
  
  // 检查本地存储中的沉浸模式状态
  const immersiveState = localStorage.getItem('immersive-mode');
  if (immersiveState === 'true') {
    body.classList.add('immersive-mode');
  }
  
  immersiveMode.addEventListener('click', () => {
    const isImmersive = body.classList.toggle('immersive-mode');
    localStorage.setItem('immersive-mode', isImmersive);
  });
}
```

---

## 🎨 样式细节

### 悬停效果
```css
#immersive-mode:hover {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #fff;
}
```

**渐变色说明**：
- 起始色：`#a8edea` - 青色
- 结束色：`#fed6e3` - 粉色
- 方向：135度对角渐变

### 激活状态
当沉浸模式开启时，按钮会持续显示渐变背景，提供清晰的视觉反馈。

---

## 📊 工作原理

### 状态管理

#### 本地存储
```javascript
// 保存状态
localStorage.setItem('immersive-mode', 'true');

// 读取状态
const immersiveState = localStorage.getItem('immersive-mode');
```

#### CSS类切换
```javascript
// 切换沉浸模式
body.classList.toggle('immersive-mode');
```

### 显示逻辑

**正常模式**：
- 显示所有页面元素
- 三栏布局正常
- 导航栏和页脚可见

**沉浸模式**：
- 隐藏导航栏、侧栏、页脚
- 内容区域居中显示
- 最大宽度800px，专注阅读
- 仅保留浮动按钮

---

## 🎯 使用场景

### 1. 长文章阅读
- 📖 技术文档阅读
- 📝 博客文章深度阅读
- 📚 教程学习

### 2. 专注场景
- 🎯 需要集中注意力
- 📱 在小屏设备上阅读
- 🌙 夜间阅读

### 3. 打印准备
- 🖨️ 打印前预览
- 📄 导出为PDF
- 📋 纯内容展示

---

## 📱 响应式适配

### 桌面端（≥1024px）
- 按钮间距：0.75rem
- 内容最大宽度：800px
- 内边距：2rem

### 平板端（768-1023px）
- 按钮间距：0.65rem
- 内容最大宽度：800px
- 内边距：2rem

### 手机端（<768px）
- 按钮间距：0.5rem
- 内容最大宽度：100%（自适应）
- 内边距：1.5rem

### 超小屏（<480px）
- 按钮间距：0.5rem
- 内容最大宽度：100%
- 内边距：1rem

---

## ✅ 优势特点

### 1. 用户体验
- ✅ 一键开启，操作简单
- ✅ 状态持久化，刷新保持
- ✅ 平滑过渡，视觉舒适
- ✅ 浮动按钮始终可用

### 2. 设计理念
- ✅ 极简主义
- ✅ 专注内容
- ✅ 减少干扰
- ✅ 提升阅读效率

### 3. 技术实现
- ✅ 纯CSS控制显示
- ✅ localStorage持久化
- ✅ 最小JavaScript逻辑
- ✅ 性能影响极小

### 4. 兼容性
- ✅ 所有现代浏览器
- ✅ PJAX完全兼容
- ✅ 响应式完美适配
- ✅ 暗色模式自动适配

---

## 🔍 常见问题

### Q1: 如何退出沉浸模式？
A: 再次点击沉浸阅读按钮即可退出。

### Q2: 沉浸模式下如何导航？
A: 可以通过浮动按钮中的其他功能（如回到顶部）进行操作，或退出沉浸模式后使用导航栏。

### Q3: 状态会保存吗？
A: 是的，沉浸模式状态会保存在localStorage中，刷新页面后会自动恢复。

### Q4: 如何清除保存的状态？
A: 在浏览器开发者工具中，清除localStorage中的`immersive-mode`键即可。

### Q5: 沉浸模式下侧栏内容丢失吗？
A: 不会！侧栏只是被隐藏（`opacity: 0`），内容仍然存在，退出沉浸模式后会重新显示。

### Q6: 可以自定义内容宽度吗？
A: 可以！在CSS中修改`body.immersive-mode .site-main`的`max-width`值。

---

## 🎨 自定义配置

### 修改内容宽度

```css
/* 在自定义CSS中覆盖 */
body.immersive-mode .site-main {
  max-width: 1000px;  /* 改为1000px */
}
```

### 修改按钮颜色

```css
/* 自定义渐变色 */
#immersive-mode:hover {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### 保留某些元素

```css
/* 例如保留页脚 */
body.immersive-mode .site-footer {
  opacity: 1;
  pointer-events: auto;
}
```

---

## 🚀 未来改进

### 计划中的功能
- [ ] 可配置隐藏元素（选择性保留）
- [ ] 自定义内容宽度（配置文件）
- [ ] 阅读焦点高亮
- [ ] 阅读位置记忆
- [ ] 打字机滚动模式
- [ ] 快捷键支持（如：F11）

---

## 📝 更新日志

### v2.6.2 (2025-10-28)
- ✅ 新增沉浸阅读模式功能
- ✅ 一键隐藏导航栏、侧栏、页脚
- ✅ 内容区域自动优化（800px居中）
- ✅ localStorage状态持久化
- ✅ 完整的响应式适配
- ✅ 平滑过渡动画
- ✅ 暗色模式完美支持

---

## 🎯 影响范围

- ✅ **样式不受影响**：新增功能不影响其他组件样式
- ✅ **功能不受影响**：所有现有功能正常工作
- ✅ **布局不受影响**：退出沉浸模式后布局恢复
- ✅ **端口不受影响**：Hugo 本地预览服务器默认端口 1313

---

## 📚 相关文档

- [浮动按钮配置指南](float-buttons-guide.md)
- [阅读进度显示功能](reading-progress-feature.md)
- [主题使用文档](demius主题使用文档.md)

---

**最后更新**: 2025-10-28  
**文档版本**: v1.0  
**适用版本**: Demius v2.6.2+

