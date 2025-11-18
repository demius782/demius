# 阅读进度显示功能

## 📋 功能概述

在悬浮按钮组中新增了阅读进度显示功能，位于"回到顶部"按钮和"设置"按钮之间，实时显示当前页面的阅读进度（1-100%）。

---

## 🎯 功能特点

### 1. 实时进度显示
- 📊 显示1-100的数字进度
- 🔄 随页面滚动实时更新
- 💯 精确到百分比
- ⚡ 流畅无延迟

### 2. 智能显示逻辑
- 📄 页面顶部（未滚动300px）：进度按钮隐藏
- 📜 滚动后：自动显示进度按钮
- 📏 内容不足一屏：直接显示100
- 🎯 准确计算可滚动距离

### 3. 视觉设计
- 🎨 圆形按钮设计
- 🔢 大号数字显示
- 🌈 渐变悬停效果（粉橙色渐变）
- 🌓 完整的暗色模式支持

### 4. 响应式适配
- 💻 桌面端：正常尺寸显示
- 📱 平板端：适中尺寸
- 📲 手机端：紧凑尺寸
- 📐 超小屏：字体缩小

---

## 📍 按钮位置

### 从底部到顶部的顺序

**滚动后（所有按钮显示）**：
```
↑ 侧栏切换 (4)
↑ 主题切换 (3)
↑ 设置按钮 (2)  ← 展开/收起其他按钮
↑ 阅读进度 (1)  ← 新增
↑ 回到顶部 (0)
```

**未滚动（进度和回顶隐藏）**：
```
↑ 侧栏切换 (2)
↑ 主题切换 (1)
↑ 设置按钮 (0)  ← 在底部
(阅读进度隐藏)
(回到顶部隐藏)
```

---

## 🔧 技术实现

### HTML 结构

```html
<!-- 阅读进度按钮 -->
<button id="reading-progress" class="floating-btn" aria-label="阅读进度" title="阅读进度">
  <span class="progress-number">0</span>
</button>
```

### CSS 定位

```css
/* 阅读进度按钮在回到顶部按钮上方 */
#reading-progress {
  position: absolute;
  bottom: calc(3rem + 0.75rem);
  right: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  font-weight: 600;
}

/* 当页面滚动时显示 */
body.scrolled #reading-progress {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
```

### JavaScript 逻辑

```javascript
// 计算并更新阅读进度
function updateReadingProgress() {
  if (!readingProgress) return;
  
  // 获取页面总高度和当前滚动位置
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
  // 计算可滚动距离
  const scrollableDistance = documentHeight - windowHeight;
  
  // 计算进度百分比 (1-100)
  let progress = 0;
  if (scrollableDistance > 0) {
    progress = Math.round((scrollTop / scrollableDistance) * 100);
    progress = Math.max(1, Math.min(100, progress));
  } else {
    progress = 100;  // 页面内容不足一屏
  }
  
  // 更新显示
  const progressNumber = readingProgress.querySelector('.progress-number');
  if (progressNumber) {
    progressNumber.textContent = progress;
  }
}
```

---

## 🎨 样式细节

### 按钮尺寸（响应式）

| 屏幕尺寸 | 按钮大小 | 字体大小 | 间距 |
|---------|---------|---------|------|
| 桌面 (≥1024px) | 3rem × 3rem | 0.9rem | 0.75rem |
| 平板 (768-1023px) | 2.75rem × 2.75rem | 0.9rem | 0.65rem |
| 手机 (<768px) | 2.5rem × 2.5rem | 0.9rem | 0.5rem |
| 超小屏 (<480px) | 2.25rem × 2.25rem | 0.85rem | 0.5rem |

### 悬停效果

```css
#reading-progress:hover {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
```

### 层级管理

```css
#sidebar-toggle     { z-index: 1001; }
#theme-toggle       { z-index: 1002; }
#fab-settings       { z-index: 1003; }
#reading-progress   { z-index: 1004; }  ← 新增
#back-to-top        { z-index: 1005; }
```

---

## 📊 进度计算逻辑

### 公式

```javascript
progress = (scrollTop / (documentHeight - windowHeight)) × 100
```

### 边界处理

1. **页面顶部**：
   - `scrollTop = 0`
   - 显示：1%（最小值）

2. **页面底部**：
   - `scrollTop = documentHeight - windowHeight`
   - 显示：100%

3. **内容不足一屏**：
   - `documentHeight ≤ windowHeight`
   - 显示：100%

4. **范围限制**：
   - 最小值：1
   - 最大值：100
   - 四舍五入到整数

---

## 🎯 使用场景

### 1. 长文章阅读
- 📖 清晰了解阅读进度
- ⏱️ 估算剩余阅读时间
- 🎯 快速定位阅读位置

### 2. 技术文档
- 📚 追踪学习进度
- ✅ 确认完成度
- 📍 记录阅读位置

### 3. 博客文章
- 📝 了解文章长度
- 🔄 继续上次阅读
- 📈 监控阅读状态

---

## ✅ 优势特点

### 1. 用户体验
- ✅ 直观的进度反馈
- ✅ 无需额外交互
- ✅ 流畅的动画效果
- ✅ 不遮挡内容

### 2. 性能优化
- ✅ 轻量级实现
- ✅ 节流优化（通过 scroll 事件）
- ✅ 最小DOM操作
- ✅ CSS硬件加速

### 3. 兼容性
- ✅ 现代浏览器完全支持
- ✅ PJAX无缝兼容
- ✅ 响应式完美适配
- ✅ 暗色模式自动适配

### 4. 可访问性
- ✅ `aria-label` 属性
- ✅ `title` 提示文字
- ✅ 语义化HTML
- ✅ 键盘可聚焦

---

## 🔍 常见问题

### Q1: 为什么显示范围是1-100而不是0-100？
A: 考虑到用户体验，即使在页面顶部，显示1表示"已开始阅读"，更符合直觉。

### Q2: 进度按钮什么时候显示？
A: 当页面向下滚动超过300px时自动显示，与"回到顶部"按钮同步。

### Q3: 点击进度按钮会发生什么？
A: 当前版本仅显示进度，不响应点击。可以考虑未来添加点击跳转到对应进度的功能。

### Q4: 如何禁用阅读进度功能？
A: 目前与"回到顶部"按钮绑定。如需禁用，可以在CSS中添加：
```css
#reading-progress {
  display: none !important;
}
```

### Q5: 进度计算准确吗？
A: 非常准确！基于实际的页面高度和滚动位置计算，精确到百分比。

### Q6: 支持横向滚动吗？
A: 当前版本仅支持纵向滚动进度。横向滚动不常见，暂未实现。

---

## 🚀 未来改进

### 计划中的功能
- [ ] 点击进度按钮跳转到对应位置
- [ ] 可配置的进度显示方式（数字/百分号/进度条）
- [ ] 自定义颜色配置
- [ ] 阅读时间估算
- [ ] 进度记忆功能（localStorage）
- [ ] 章节级别的进度显示

---

## 📝 更新日志

### v2.6.2 (2025-10-28)
- ✅ 新增阅读进度显示功能
- ✅ 实时计算和更新进度（1-100）
- ✅ 完整的响应式适配（桌面/平板/手机/超小屏）
- ✅ 渐变悬停效果
- ✅ 暗色模式完美支持
- ✅ 与现有按钮完美集成

---

## 🎯 影响范围

- ✅ **样式不受影响**：新增按钮不影响其他组件样式
- ✅ **功能不受影响**：所有现有功能正常工作
- ✅ **布局不受影响**：按钮间距自动调整，布局协调
- ✅ **端口不受影响**：Hugo 本地预览服务器默认端口 1313

---

## 📚 相关文档

- [浮动按钮配置指南](float-buttons-guide.md)
- [主题使用文档](demius主题使用文档.md)
- [PJAX兼容性说明](pjax-compatibility.md)

---

**最后更新**: 2025-10-28  
**文档版本**: v1.0  
**适用版本**: Demius v2.6.2+

