# 弹幕功能调试指南

## 🔍 检查步骤

### 1. 确认配置已启用
打开 `hugo.toml`，确认以下配置：
```toml
[params.danmaku]
  enable = true  # 必须为 true
```

### 2. 清除浏览器缓存
- **Chrome/Edge**: Ctrl+Shift+Delete，选择"缓存的图像和文件"，点击"清除数据"
- **Firefox**: Ctrl+Shift+Delete，勾选"缓存"，点击"立即清除"
- **或者**: 直接按 Ctrl+F5 强制刷新

### 3. 找到设置按钮
- 在页面右下角（或左下角，取决于配置）
- 找到**齿轮图标**的按钮（⚙️）
- 这就是"设置"按钮

### 4. 展开菜单
- **点击齿轮按钮**
- 会看到其他按钮从下往上依次展开：
  ```
  7️⃣ 评论弹幕  ← 最上面（📺图标）
  6️⃣ 沉浸阅读  ← 📖图标
  5️⃣ 侧栏切换  ← 📋图标
  4️⃣ 主题切换  ← 🌙图标
  3️⃣ 设置按钮  ← ⚙️图标（你刚点击的）
  2️⃣ 阅读进度  ← 显示数字（1-100）
  1️⃣ 回到顶部  ← ⬆️图标
  ```

### 5. 点击评论弹幕按钮
- 图标是一个屏幕📺的形状
- 鼠标悬停时会显示"评论弹幕"提示
- 点击后按钮会变成粉红色渐变，表示已激活

## 🐛 如果还是看不到

### 检查JavaScript控制台
1. 按 **F12** 打开开发者工具
2. 切换到 **Console**（控制台）标签
3. 查看是否有红色错误信息
4. 截图发给我

### 检查元素是否存在
1. 按 **F12** 打开开发者工具
2. 切换到 **Elements**（元素）标签
3. 按 **Ctrl+F** 打开搜索
4. 搜索 `danmaku-mode`
5. 如果找到了，说明按钮存在，只是没显示
6. 查看该元素的 `style` 属性，看是否有 `display: none`

### 检查配置注入
1. 按 **F12** 打开开发者工具
2. 切换到 **Console**（控制台）标签
3. 输入以下代码并回车：
   ```javascript
   console.log(window.siteConfig.danmaku);
   ```
4. 应该看到类似这样的输出：
   ```javascript
   {
     enable: true,
     scope: "all",
     speed: 3,
     fontSize: 16,
     opacity: 0.9,
     maxCount: 50,
     updateInterval: 30000,
     showAvatar: true,
     showTime: true
   }
   ```
5. 如果 `enable` 是 `false` 或者整个对象是 `undefined`，说明配置没有正确注入

### 检查按钮初始化
1. 在控制台输入：
   ```javascript
   document.getElementById('danmaku-mode');
   ```
2. 应该返回按钮元素，而不是 `null`
3. 如果返回 `null`，说明按钮没有被渲染

## 🔧 手动强制显示（临时测试）

如果以上都检查了还是看不到，可以在控制台执行以下代码强制显示：

```javascript
// 强制显示弹幕按钮
const btn = document.getElementById('danmaku-mode');
if (btn) {
  btn.style.display = 'flex';
  btn.style.opacity = '1';
  btn.style.pointerEvents = 'auto';
  console.log('弹幕按钮已强制显示');
} else {
  console.error('找不到弹幕按钮元素');
}
```

## 📊 预期行为

### 正常状态
- 页面加载后，弹幕按钮默认隐藏（`opacity: 0`）
- 点击设置按钮后，弹幕按钮展开显示（`opacity: 1`）
- 位置在最上面，显示📺图标

### 激活状态
- 点击弹幕按钮后，按钮背景变为粉红色渐变
- 弹幕容器淡入显示
- 从Artalk API获取评论并转换为弹幕
- 弹幕从右向左滚动

### 关闭状态
- 再次点击弹幕按钮，背景恢复原色
- 弹幕容器淡出
- 所有弹幕清空

## 📸 截图位置

如果需要截图，请截取：
1. **整个页面右下角**（包含所有悬浮按钮）
2. **浏览器控制台**（显示任何错误信息）
3. **Elements标签**（搜索danmaku-mode的结果）

---

**最后更新**: 2025-10-28

