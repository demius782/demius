# 评论弹幕功能

## 📋 功能概述

评论弹幕功能将网站的真实评论转换为弹幕形式，从右向左滚动穿过屏幕。用户可以悬停暂停弹幕，点击跳转到对应的评论区，提供了一种有趣的互动方式来展示网站的评论内容。

---

## 🎯 功能特点

### 1. 真实评论数据
- 💬 从Artalk评论系统实时获取评论
- 🔄 自动定时更新（可配置）
- 📊 支持全站/页面/文章范围过滤
- 🎯 最多显示数量可配置

### 2. 透明背景
- 🪟 透明全屏覆盖层
- 👁️ 不遮挡原页面内容
- 🎨 白色/暗色卡片样式
- 🌓 自动适配主题

### 3. 交互体验
- 🖱️ 悬停暂停，移开继续
- 👆 点击跳转到评论区
- 📍 智能轨道分配
- ⚡ 平滑动画效果

### 4. 可配置性
- 🎚️ 速度可调（1-5级）
- 📏 字体大小可调
- 🎨 不透明度可调
- 📊 显示数量可调
- 🔄 更新频率可调
- 👤 头像显示开关
- ⏰ 时间显示开关

---

## 📍 按钮位置

### 在悬浮按钮组中的位置

**展开后从底部向上：**
```
7️⃣ 评论弹幕  ← 新增（最顶部）
6️⃣ 沉浸阅读
5️⃣ 侧栏切换
4️⃣ 主题切换
3️⃣ 设置按钮  ← 点击展开
2️⃣ 阅读进度
1️⃣ 回到顶部
```

---

## ⚙️ 配置说明

### hugo.toml 配置

```toml
# 弹幕功能配置
[params.danmaku]
  enable = true                           # 是否启用弹幕功能
  scope = "all"                           # 弹幕范围：all（全站）、page（当前页面）、post（当前文章）
  speed = 3                               # 弹幕速度（1-5，数字越大越快）
  fontSize = 16                           # 弹幕字体大小（px）
  opacity = 0.9                           # 弹幕不透明度（0.1-1）
  maxCount = 50                           # 最多显示弹幕数量
  updateInterval = 30000                  # 更新间隔（毫秒，30000 = 30秒）
  showAvatar = true                       # 是否显示头像
  showTime = true                         # 是否显示时间
  loop = true                             # 是否循环播放弹幕（评论播放完后重新开始）
  randomPosition = true                   # 是否随机Y轴位置（false则按固定轨道）
  colorful = true                         # 是否启用彩色弹幕（false则使用主题色）
  antiOverlap = true                      # 是否启用防重叠（智能检测避免弹幕碰撞）
```

### 配置项详解

#### 1. enable（启用开关）
- **类型**: Boolean
- **默认值**: `true`
- **说明**: 是否启用弹幕功能。设为`false`时，弹幕按钮将不显示。

#### 2. scope（弹幕范围）
- **类型**: String
- **可选值**: 
  - `"all"` - 全站所有评论
  - `"page"` - 当前页面的评论
  - `"post"` - 当前文章的评论（仅在文章详情页有效）
- **默认值**: `"all"`
- **说明**: 控制弹幕显示的评论范围

**使用场景**:
- `all`: 适合展示整个网站的活跃度
- `page`: 适合当前页面的评论互动
- `post`: 适合文章详情页的专属讨论

#### 3. speed（弹幕速度）
- **类型**: Number
- **范围**: 1-5
- **默认值**: `3`
- **说明**: 弹幕滚动速度，数字越大越快
  - 1: 非常慢（适合阅读长评论）
  - 2: 慢
  - 3: 中等（推荐）
  - 4: 快
  - 5: 非常快

#### 4. fontSize（字体大小）
- **类型**: Number
- **单位**: px
- **默认值**: `16`
- **推荐范围**: 14-20
- **说明**: 弹幕文字大小

#### 5. opacity（不透明度）
- **类型**: Number
- **范围**: 0.1-1
- **默认值**: `0.9`
- **说明**: 弹幕卡片的不透明度
  - 0.1: 几乎透明
  - 0.5: 半透明
  - 0.9: 几乎不透明（推荐）
  - 1.0: 完全不透明

#### 6. maxCount（最大数量）
- **类型**: Number
- **默认值**: `50`
- **推荐范围**: 20-100
- **说明**: 同时显示的最大弹幕数量

#### 7. updateInterval（更新间隔）
- **类型**: Number
- **单位**: 毫秒
- **默认值**: `30000`（30秒）
- **说明**: 自动获取新评论的时间间隔
  - 10000: 10秒（频繁更新）
  - 30000: 30秒（推荐）
  - 60000: 1分钟（低频更新）

#### 8. showAvatar（显示头像）
- **类型**: Boolean
- **默认值**: `true`
- **说明**: 是否在弹幕中显示评论者头像

#### 9. showTime（显示时间）
- **类型**: Boolean
- **默认值**: `true`
- **说明**: 是否在弹幕中显示评论时间

#### 10. loop（循环播放）
- **类型**: Boolean
- **默认值**: `true`
- **说明**: 是否循环播放弹幕

**工作原理**:
- `true`: 所有评论显示完后，会重新开始循环播放
- `false`: 每条评论只显示一次，显示完后不再重复

**使用场景**:
- `true`: 适合评论数量较少，希望持续有弹幕的场景
- `false`: 适合评论数量多，不希望重复显示的场景

**循环机制**:
- 每5秒检查一次弹幕数量
- 如果少于最大值的一半，自动补充弹幕
- 所有评论显示完后，重置记录并重新播放

#### 11. randomPosition（随机位置）
- **类型**: Boolean
- **默认值**: `true`
- **说明**: 是否随机Y轴位置

**工作原理**:
- `true`: 弹幕在整个可用高度内随机选择Y轴位置（50px - 屏幕高度-100px）
- `false`: 使用固定轨道系统，弹幕按轨道排列

**效果对比**:

| 模式 | 优点 | 缺点 |
|------|------|------|
| 随机位置 (`true`) | 视觉更自然、更像真实弹幕 | 可能出现重叠 |
| 固定轨道 (`false`) | 不会重叠、整齐有序 | 视觉较死板 |

**推荐配置**:
- 弹幕数量多：建议 `false`（固定轨道，避免混乱）
- 弹幕数量少：建议 `true`（随机位置，更自然）

#### 12. colorful（彩色弹幕）
- **类型**: Boolean
- **默认值**: `true`
- **说明**: 是否启用彩色弹幕

**工作原理**:
- `true`: 每条弹幕随机选择一种颜色（20种预设颜色）
- `false`: 使用主题默认配色（白色/暗色）

**颜色库**（20种预设颜色）:
```javascript
'#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
'#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
'#F8B500', '#FF69B4', '#00CED1', '#FFD700',
'#E74C3C', '#3498DB', '#2ECC71', '#F39C12',
'#9B59B6', '#1ABC9C', '#E67E22', '#16A085'
```

**视觉效果**:
- 使用 `color-mix` CSS函数混合颜色
- 亮色模式：颜色与白色混合（20%-30%）
- 暗色模式：颜色与暗色背景混合（15%-25%）
- 悬停时颜色加深（30%-40%）

**适用场景**:
- `true`: 适合活泼、趣味性强的网站
- `false`: 适合正式、专业的网站

#### 13. antiOverlap（防重叠）
- **类型**: Boolean
- **默认值**: `true`
- **说明**: 是否启用智能防重叠检测

**工作原理**:
1. **位置检测**: 在随机位置模式下，尝试20次找到不重叠的Y坐标
2. **碰撞预测**: 计算前方弹幕的实时位置，预测是否会碰撞
3. **安全距离**: 垂直方向保持10px安全距离
4. **智能降级**: 如果20次都找不到合适位置，自动切换到固定轨道模式

**检测算法**:
```javascript
// 检测条件
1. 垂直距离 < 弹幕高度(60px) + 安全距离(10px)
2. 前方弹幕还在右侧1/3屏幕内
→ 判定为可能碰撞，尝试其他位置
```

**效果对比**:

| 配置 | 优点 | 缺点 |
|------|------|------|
| `true` | 弹幕不重叠、清晰易读 | 略微影响性能 |
| `false` | 性能更好 | 可能出现重叠 |

**推荐配置**:
- 随机位置模式 + 弹幕多：**必须启用** `true`
- 固定轨道模式：可选（固定轨道本身就不重叠）

**性能影响**: 
- 每添加一条弹幕最多检测20次
- 维护活动弹幕列表（通常<50条）
- 对现代浏览器影响极小

---

## 🎨 弹幕样式

### 弹幕卡片结构

```
┌─────────────────────────────────────────┐
│ 👤 [头像] 昵称 · 3分钟前    [页面标识] │
│          这是一条评论内容...            │
└─────────────────────────────────────────┘
```

### 样式特点
- 🎨 圆角卡片（50px border-radius）
- ☁️ 阴影效果（box-shadow）
- 🔄 平滑过渡动画
- 🌓 自动适配暗色模式

---

## 🔧 技术实现

### HTML 结构

#### 弹幕按钮
```html
<button id="danmaku-mode" class="floating-btn fab-extra" 
        aria-label="评论弹幕" 
        title="评论弹幕">
  <svg><!-- 屏幕图标 --></svg>
</button>
```

#### 弹幕容器
```html
<div id="danmaku-container" class="danmaku-container"></div>
```

弹幕元素由JavaScript动态创建：

```html
<div class="danmaku-item" style="top: Ypx; left: Xpx;">
  <img class="danmaku-avatar" src="头像URL" alt="昵称">
  <div class="danmaku-content">
    <div class="danmaku-author">
      <span class="danmaku-author-name">昵称</span>
      <span class="danmaku-time">3分钟前</span>
    </div>
    <div class="danmaku-text">评论内容</div>
  </div>
  <span class="danmaku-page">页面标题</span>
</div>
```

### JavaScript 核心逻辑

#### CommentDanmaku 类

```javascript
class CommentDanmaku {
  constructor(container) {
    this.container = container;
    this.danmakuItems = [];
    this.tracks = [];  // 弹幕轨道
  }
  
  // 获取评论数据
  async fetchComments() {
    const url = `${server}/api/v2/comments?site=${site}&limit=${maxCount}`;
    const response = await fetch(url);
    return await response.json();
  }
  
  // 创建弹幕元素
  createDanmakuElement(comment) {
    const danmaku = document.createElement('div');
    danmaku.className = 'danmaku-item';
    // ... 创建头像、昵称、内容等
    return danmaku;
  }
  
  // 添加弹幕
  addDanmaku(comment) {
    const danmaku = this.createDanmakuElement(comment);
    const trackIndex = this.getAvailableTrack();
    
    // Web Animations API
    const animation = danmaku.animate([
      { transform: 'translateX(0)' },
      { transform: `translateX(-${window.innerWidth + width}px)` }
    ], {
      duration: duration * 1000,
      easing: 'linear'
    });
  }
  
  // 跳转到评论
  jumpToComment(comment) {
    if (currentPage === commentPage) {
      // 滚动到评论区
      commentSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // 跳转到评论页
      window.location.href = comment.page_key + '#comments';
    }
  }
}
```

#### 轨道分配算法

```javascript
getAvailableTrack() {
  const now = Date.now();
  for (let i = 0; i < this.tracks.length; i++) {
    if (!this.tracks[i].occupied && 
        now - this.tracks[i].lastDanmakuTime > 2000) {
      return i;
    }
  }
  return Math.floor(Math.random() * this.tracks.length);
}
```

**说明**:
- 将屏幕分为多条水平轨道
- 优先选择空闲且距离上次使用超过2秒的轨道
- 避免弹幕重叠和碰撞

---

## 🎬 使用流程

### 1. 开启弹幕
```
点击评论弹幕按钮
  ↓
容器淡入显示
  ↓
从Artalk API获取评论
  ↓
间隔500ms依次添加弹幕
  ↓
弹幕从右向左滚动
  ↓
定时更新新评论
```

### 2. 交互操作
```
鼠标悬停弹幕
  ↓
弹幕暂停滚动
  ↓
鼠标移开
  ↓
弹幕继续滚动
```

```
点击弹幕
  ↓
判断是否当前页面评论
  ↓
是：滚动到评论区
否：跳转到评论页
```

### 3. 关闭弹幕
```
再次点击弹幕按钮
  ↓
停止更新定时器
  ↓
容器淡出
  ↓
清除所有弹幕元素
  ↓
重置轨道状态
```

---

## 📡 API 接口

### Artalk 评论 API

**请求URL**:
```
GET {server}/api/v2/comments?site={site}&limit={limit}&offset={offset}&sort=created_desc
```

**可选参数**:
```
&page_key={url}  # 过滤指定页面的评论
```

**响应格式**:
```json
{
  "data": [
    {
      "id": 123,
      "nick": "用户昵称",
      "avatar": "头像URL",
      "content": "评论内容（HTML）",
      "created_at": "2025-10-28T12:00:00Z",
      "page_key": "/posts/article/",
      "page_title": "文章标题"
    }
  ]
}
```

---

## 📱 响应式适配

### 桌面端（≥1024px）
- 弹幕卡片：标准大小
- 头像：2rem (32px)
- 字体：0.9rem
- 最大宽度：500px

### 平板端（768-1023px）
- 弹幕卡片：标准大小
- 头像：2rem
- 字体：0.9rem
- 最大宽度：500px

### 手机端（<768px）
- 弹幕卡片：小型
- 头像：1.5rem (24px)
- 字体：0.85rem
- 最大宽度：300px

### 超小屏（<480px）
- 弹幕卡片：迷你
- 头像：1.2rem (19px)
- 字体：0.8rem
- 最大宽度：200px

---

## ✅ 优势特点

### 1. 用户体验
- ✅ 透明背景，不遮挡原页面
- ✅ 悬停暂停，便于阅读
- ✅ 点击跳转，快速互动
- ✅ 平滑动画，视觉舒适

### 2. 数据真实
- ✅ 真实评论数据
- ✅ 实时更新
- ✅ 智能过滤
- ✅ 可配置范围

### 3. 技术实现
- ✅ Web Animations API，性能卓越
- ✅ 智能轨道分配，避免碰撞
- ✅ 自动清理，内存优化
- ✅ 响应式设计，全平台适配

### 4. 可配置性
- ✅ 速度可调
- ✅ 样式可调
- ✅ 范围可选
- ✅ 显示可控

---

## 🔍 常见问题

### Q1: 弹幕数据从哪里来？
A: 从Artalk评论系统API实时获取，确保是网站的真实评论。

### Q2: 可以只显示当前页面的评论吗？
A: 可以！在`hugo.toml`中设置`scope = "page"`即可。

### Q3: 弹幕会一直显示吗？
A: 不会。再次点击弹幕按钮即可关闭，弹幕会淡出并清空。

### Q4: 弹幕速度太快/太慢怎么办？
A: 在`hugo.toml`中调整`speed`参数（1-5）。

### Q5: 可以自定义弹幕样式吗？
A: 可以！在`_danmaku.css`中修改`.danmaku-item`相关样式。

### Q6: 点击弹幕会跳转到哪里？
A: 如果是当前页面的评论，会滚动到评论区；如果是其他页面的评论，会跳转到对应页面的评论区。

### Q7: 弹幕会重复显示吗？
A: 不会。系统会过滤已显示的评论，只显示新评论。

### Q8: 如何禁用弹幕功能？
A: 在`hugo.toml`中设置`enable = false`，弹幕按钮将不显示。

---

## 🎨 自定义配置

### 修改弹幕卡片样式

```css
/* 在自定义CSS中覆盖 */
.danmaku-item {
  background: rgba(100, 200, 255, 0.95);  /* 自定义颜色 */
  border-radius: 20px;  /* 自定义圆角 */
  padding: 1rem 1.5rem;  /* 自定义内边距 */
}
```

### 调整弹幕轨道高度

```javascript
// 在 _danmaku.js 中修改
this.trackHeight = 80;  // 改为80px（默认60px）
```

### 自定义时间格式

```javascript
// 在 formatTime 方法中修改
formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN');  // 完整日期时间
}
```

---

## 🚀 未来改进

### 计划中的功能
- [ ] 弹幕密度控制
- [ ] 弹幕颜色主题
- [ ] 弹幕过滤关键词
- [ ] 弹幕点赞功能
- [ ] 多评论系统支持（Disqus、Gitalk等）
- [ ] 弹幕历史记录
- [ ] 弹幕统计数据

---

## 📝 更新日志

### v2.6.2 (2025-10-28)
- ✅ 新增评论弹幕功能
- ✅ 从Artalk API获取真实评论
- ✅ 透明背景，不遮挡原页面
- ✅ 悬停暂停，点击跳转
- ✅ 智能轨道分配
- ✅ 完整的配置选项
- ✅ 响应式适配
- ✅ PJAX完全兼容

---

## 🎯 影响范围

- ✅ **样式不受影响**：弹幕是独立透明层
- ✅ **功能不受影响**：所有现有功能正常
- ✅ **布局不受影响**：透明覆盖，不改变布局
- ✅ **端口不受影响**：Hugo 本地预览服务器默认端口 1313

---

## 📚 相关文档

- [Artalk 评论系统文档](https://artalk.js.org)
- [浮动按钮配置指南](float-buttons-guide.md)
- [主题配置文档](../content/posts/demius主题使用文档.md)

---

**最后更新**: 2025-10-28  
**文档版本**: v2.0  
**适用版本**: Demius v2.6.2+

## 🎉 开始使用

1. 确保Artalk评论系统已配置
2. 在`hugo.toml`中启用并配置弹幕功能
3. 点击设置按钮展开菜单
4. 点击最顶部的"评论弹幕"按钮
5. 享受真实评论弹幕的乐趣！🎊
