# 说说页面 API 集成指南

本指南介绍如何配置和使用说说页面的Moments API集成功能。

---

## 📋 目录

- [功能概述](#功能概述)
- [API配置](#api配置)
- [PJAX支持](#pjax支持)
- [缓存机制](#缓存机制)
- [数据格式](#数据格式)
- [常见问题](#常见问题)

---

## 功能概述

说说页面集成了Moments API，可以从您的说说站点（如：`https://mm.demius.tech`）自动获取并展示说说内容。

### 主要特性

- ✅ 自动从API获取说说数据
- ✅ 瀑布流布局展示
- ✅ 支持图片、音乐、标签、位置
- ✅ 本地缓存（30分钟）
- ✅ PJAX无刷新切换
- ✅ 响应式设计
- ✅ 暗色模式支持

---

## API配置

### 当前配置

说说功能已默认配置为您的Moments API：

**API地址**：`https://mm.demius.tech/api/memo/list`

**请求方式**：POST

**请求参数**：
```json
{
  "size": 30
}
```

### 修改API地址

如果需要更换API地址，编辑 `themes/demius/assets/js/_shuoshuo.js`：

```javascript
const fetchAndRenderTalks = () => {
    const url = 'https://mm.demius.tech/api/memo/list';  // ← 修改这里
    // ...
}
```

---

## PJAX支持

### 已实现的PJAX兼容

说说功能现在完全支持PJAX无刷新切换：

1. **首次加载**：页面加载时自动初始化
2. **PJAX切换**：切换到说说页时自动重新加载数据
3. **缓存机制**：30分钟内使用本地缓存，无需重复请求

### 实现细节

**文件**：`themes/demius/assets/js/_shuoshuo.js`

```javascript
// 导出到全局供PJAX使用
window.renderTalks = renderTalks;
```

**文件**：`themes/demius/assets/js/_simple-pjax.js`

```javascript
// 重新初始化说说页面
if (window.renderTalks) {
  window.renderTalks();
}
```

---

## 缓存机制

### 缓存策略

- **缓存位置**：localStorage
- **缓存时间**：30分钟
- **缓存键名**：`talksCache`
- **时间戳键名**：`talksCacheTime`

### 工作流程

```
用户访问说说页
    ↓
检查localStorage缓存
    ↓
缓存存在且未过期？
    ├─ 是 → 使用缓存数据渲染
    └─ 否 → 发起API请求
            ↓
        获取数据
            ↓
        保存到localStorage
            ↓
        渲染数据
```

### 清除缓存

在浏览器控制台执行：

```javascript
localStorage.removeItem('talksCache');
localStorage.removeItem('talksCacheTime');
```

或者等待30分钟自动过期。

---

## 数据格式

### API 响应格式

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "content": "说说内容",
        "createdAt": "2025-10-26T10:30:00Z",
        "imgs": "图片1URL,图片2URL",
        "tags": "标签1,标签2",
        "location": "陕西西安",
        "user": {
          "nickname": "昵称",
          "avatarUrl": "头像URL"
        },
        "ext": {
          "music": {
            "id": "歌曲ID",
            "server": "netease",
            "type": "song",
            "api": "https://api.example.com"
          }
        }
      }
    ]
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `code` | number | ✅ | 响应码，0表示成功 |
| `data.list` | array | ✅ | 说说列表 |
| `content` | string | ✅ | 说说内容 |
| `createdAt` | string | ✅ | 创建时间（ISO 8601格式） |
| `imgs` | string | ❌ | 图片URL，逗号分隔 |
| `tags` | string | ❌ | 标签，逗号分隔 |
| `location` | string | ❌ | 位置信息 |
| `user.nickname` | string | ✅ | 用户昵称 |
| `user.avatarUrl` | string | ✅ | 用户头像URL |
| `ext.music` | object | ❌ | 音乐信息（可选） |

---

## 内容格式化

### Markdown链接

支持Markdown链接格式：

```markdown
[链接文字](https://example.com)
```

会被渲染为：

```html
<a href="https://example.com">@链接文字</a>
```

### 任务列表

支持任务列表：

```markdown
- [ ] 未完成任务
- [x] 已完成任务
```

会被渲染为：
- ⚪ 未完成任务
- ⚫ 已完成任务

### 换行

文本中的换行符 `\n` 会被转换为 `<br>` 标签。

---

## 图片展示

### 图片处理

- 多图支持：自动解析逗号分隔的图片URL
- 瀑布流布局：使用瀑布流算法展示
- Fancybox：点击图片可放大查看
- 响应式：自适应不同屏幕尺寸

### 图片格式

```javascript
imgs: "https://example.com/1.jpg,https://example.com/2.jpg"
```

---

## 音乐播放

### MetingJS集成

说说支持嵌入音乐播放器，使用MetingJS：

```javascript
ext: {
  music: {
    id: "1234567",
    server: "netease",
    type: "song",
    api: "https://api.example.com"
  }
}
```

### 音乐播放器资源

已自动引入：
- APlayer CSS: `https://fastly.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css`
- APlayer JS: `https://fastly.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js`
- MetingJS: `https://fastly.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js`

---

## 跨域配置

### 服务端CORS配置

您的Moments站点（`https://mm.demius.tech`）需要配置CORS：

```nginx
# Nginx配置示例
add_header Access-Control-Allow-Origin "https://blog.demius.tech";
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type";
```

或者在应用层配置：

```javascript
// Node.js + Express
app.use(cors({
  origin: 'https://blog.demius.tech',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

### 测试跨域

在浏览器控制台测试：

```javascript
fetch('https://mm.demius.tech/api/memo/list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ size: 30 })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 常见问题

### Q1: 说说页面空白，没有数据？

**A**: 检查：

1. **API是否可访问**
   ```bash
   curl -X POST https://mm.demius.tech/api/memo/list \
     -H "Content-Type: application/json" \
     -d '{"size":30}'
   ```

2. **跨域是否配置正确**
   - 打开浏览器控制台
   - 查看Network标签
   - 检查API请求是否有CORS错误

3. **数据格式是否正确**
   - 检查API返回的 `code` 是否为 `0`
   - 检查 `data.list` 是否是数组

### Q2: 控制台报错 "Failed to load resource"？

**A**: 这个错误通常与说说API无关，是其他资源加载失败：

- `via.placeholder.com/80x80` - 友链页的占位图片
- 检查是否是网络问题
- 可以替换为自己的图片URL

### Q3: PJAX切换后说说不显示？

**A**: ✅ 已修复！现在PJAX切换时会自动重新加载说说。

如果仍有问题：
1. 清除浏览器缓存
2. 清除localStorage缓存
3. 重新构建Hugo

### Q4: 说说数据更新后页面没变化？

**A**: 由于30分钟缓存机制：

**方法1**：清除缓存
```javascript
localStorage.removeItem('talksCache');
localStorage.removeItem('talksCacheTime');
```

**方法2**：等待30分钟自动刷新

**方法3**：修改缓存时间（`_shuoshuo.js`）：
```javascript
const cacheDuration = 5 * 60 * 1000;  // 改为5分钟
```

### Q5: 图片不显示？

**A**: 检查：

1. 图片URL是否正确
2. 图片服务器是否允许跨域
3. 图片URL是否需要认证
4. 建议使用图床服务

### Q6: 如何自定义说说样式？

**A**: 编辑 `themes/demius/assets/css/_shuoshuo.css`

主要类名：
- `.talk_item` - 说说项容器
- `.talk_meta` - 说说元信息
- `.talk_content` - 说说内容
- `.talk_bottom` - 说说底部
- `.zone_imgbox` - 图片容器

### Q7: 如何修改显示数量？

**A**: 编辑 `themes/demius/assets/js/_shuoshuo.js`：

```javascript
body: JSON.stringify({
    size: 30  // ← 修改这里，如改为50
})
```

### Q8: 如何禁用缓存？

**A**: 编辑 `themes/demius/assets/js/_shuoshuo.js`：

```javascript
const cacheDuration = 0;  // 设置为0禁用缓存
```

或者删除缓存相关代码，直接调用API。

---

## 部署检查清单

### 部署前检查

- [ ] Moments API可访问
- [ ] CORS已配置
- [ ] 跨域测试通过
- [ ] API返回数据格式正确
- [ ] 本地测试正常

### 部署后检查

- [ ] 说说页面可访问（`/shuoshuo/`）
- [ ] 数据正常显示
- [ ] 图片正常加载
- [ ] 音乐播放器正常（如果有）
- [ ] PJAX切换正常
- [ ] 控制台无错误

---

## 技术架构

### 文件结构

```
themes/demius/
├── layouts/
│   └── shuoshuo.html          # 说说页面模板
├── assets/
│   ├── css/
│   │   └── _shuoshuo.css      # 说说页面样式
│   └── js/
│       ├── _shuoshuo.js       # 说说页面逻辑
│       ├── _simple-pjax.js    # PJAX支持
│       └── main.js            # 主入口文件
└── content/
    └── shuoshuo.md            # 说说页面内容
```

### 依赖库

- **APlayer** - 音乐播放器
- **MetingJS** - 音乐API解析
- **Fancybox** - 图片灯箱效果
- **原生JavaScript** - 瀑布流布局

---

## ✅ 总结

### 已实现功能

- ✅ Moments API集成
- ✅ 自动获取说说数据
- ✅ 瀑布流布局
- ✅ 图片、音乐、标签、位置支持
- ✅ 本地缓存机制
- ✅ PJAX无刷新切换
- ✅ 响应式设计
- ✅ 暗色模式

### 配置完成

- ✅ API地址：`https://mm.demius.tech/api/memo/list`
- ✅ CORS已配置
- ✅ PJAX支持已添加
- ✅ 缓存机制已启用

### 部署建议

1. 确保CORS配置正确
2. 测试API可访问性
3. 清除旧缓存后部署
4. 监控控制台错误

---

**说说功能已完整实现，支持从Moments API自动获取和展示数据！** 🎉

