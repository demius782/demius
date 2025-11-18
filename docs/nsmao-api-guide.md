# nsmao 音乐API使用指南

## 📋 概述

nsmao API 是一个需要密钥认证的音乐解析服务，支持网易云音乐解析。

**API地址：** https://api.nsmao.net/api/wy/query

---

## 🔑 API特点

### 优势
- ✅ 需要密钥认证，相对稳定
- ✅ 支持超清母带音质（jymaster）
- ✅ 返回完整的歌曲信息（封面、歌词、时长等）
- ✅ 支持MV信息

### 限制
- ⚠️ **仅支持网易云音乐单曲**
- ❌ **不支持歌单功能** - 需要手动列出歌曲ID
- ❌ 不支持QQ音乐
- ❌ 不支持酷狗音乐
- ⚠️ 需要密钥才能使用
- ⚠️ 可能有调用频率限制

---

## 🔧 配置说明

### 当前配置（hugo.toml）

```toml
[params.music]
  [[params.music.apis]]
    name = "nsmao"
    enabled = true
    netease = "https://api.nsmao.net/api/wy/query?key=r2h1QwIUVmntyGn08Nf7psADpG&id={id}&type=json&level=jymaster"
```

### 参数说明

| 参数 | 值 | 说明 |
|------|---|------|
| `key` | r2h1QwIUVmntyGn08Nf7psADpG | 您的API密钥 |
| `id` | {id} | 歌曲ID（自动替换） |
| `type` | json | 返回格式 |
| `level` | jymaster | 音质等级（超清母带） |

### 音质等级选项

| 等级 | 说明 | 文件大小 |
|------|------|---------|
| `jymaster` | 超清母带（推荐） | 最大 |
| `jyeffect` | 高清臻品 | 大 |
| `jysky` | 高清环绕 | 中 |
| `standard` | 标准音质 | 小 |

**修改音质：**
```toml
# 改为标准音质（节省带宽）
netease = "https://api.nsmao.net/api/wy/query?key=r2h1QwIUVmntyGn08Nf7psADpG&id={id}&type=json&level=standard"
```

---

## 📝 使用方法

### 网易云音乐单曲

```markdown
{{< music "netease:86369" >}}
```

**示例：**
- 偏爱（张芸京）- ID: 86369
- 成都（赵雷）- ID: 436514312

### 获取歌曲ID

1. 打开网易云音乐网页版
2. 搜索歌曲
3. 点击歌曲进入播放页面
4. 从URL中获取ID

**示例URL：**
```
https://music.163.com/#/song?id=86369
                              ↑
                           歌曲ID
```

---

## 📋 关于歌单功能

### ❌ nsmao API不支持歌单

nsmao API目前只提供单曲解析接口，**不支持直接使用歌单ID**。

```markdown
# ❌ 这样不会工作
{{< music "netease-playlist:2884035" >}}
```

### ✅ 替代方案

#### 方案1：手动列出歌曲（推荐）

```markdown
{{< music 
  "netease:86369"      # 歌单中的第1首
  "netease:436514312"  # 歌单中的第2首
  "netease:1868553"    # 歌单中的第3首
>}}
```

**优点：**
- ✅ 可以正常使用
- ✅ 完全控制播放列表
- ✅ 可以选择喜欢的歌曲

**缺点：**
- ❌ 需要手动获取每首歌的ID
- ❌ 歌单更新时需要手动修改

#### 方案2：使用injahow API作为备用

injahow API支持歌单，但目前不稳定。如需使用：

```toml
# 在 hugo.toml 中
[[params.music.apis]]
  name = "injahow"
  enabled = true  # 改为true
```

然后可以使用：
```markdown
{{< music "netease-playlist:2884035" >}}
```

**注意：** injahow API可能随时失效！

#### 方案3：下载为本地文件

最可靠的方案：

1. 从歌单下载歌曲
2. 放到 `static/audio/` 目录
3. 使用本地文件

```markdown
{{< music 
  "local:audio/song1.mp3" 
  "local:audio/song2.mp3" 
>}}
```

---

## 🔍 API返回格式

### 成功响应

```json
{
  "code": 200,
  "msg": "解析成功",
  "data": {
    "id": "86369",
    "name": "偏爱",
    "artist": "张芸京",
    "album": "仙剑奇侠传三 电视原声带",
    "duration": "03:32",
    "size": "137.70MB",
    "format": "超清母带",
    "pic": "http://p1.music.126.net/...",
    "url": "https://m7.music.126.net/...",
    "lyric": "[00:00.00] 作词 : ...",
    "mv_info": {
      "mv": "https://vodkgeyttp8.vod.126.net/...",
      "size": "40.73MB",
      "br": 720
    }
  },
  "exec_time": 0.453551
}
```

### 字段映射

播放器会自动将API返回的字段映射为：

| API字段 | 播放器字段 | 说明 |
|---------|-----------|------|
| `data.name` | `title` | 歌曲名称 |
| `data.artist` | `artist` | 艺术家 |
| `data.url` | `url` | 播放地址 |
| `data.pic` | `cover` | 封面图片 |
| `data.lyric` | `lrc` | 歌词 |
| `data.duration` | `duration` | 时长 |

---

## 🎯 实际使用示例

### 单首歌曲

```markdown
{{< music "netease:86369" >}}
```

### 多首歌曲（模拟歌单）

由于nsmao API不支持歌单，需要手动列出每首歌的ID：

```markdown
{{< music 
  "netease:86369" 
  "netease:436514312" 
  "netease:1868553" 
>}}
```

**如何获取歌单中的歌曲ID：**
1. 打开网易云音乐歌单页面
2. 点击每首歌曲
3. 从URL中复制歌曲ID
4. 手动添加到shortcode中

**示例：**
```
歌单URL: https://music.163.com/#/playlist?id=2884035
点击第一首歌: https://music.163.com/#/song?id=86369
点击第二首歌: https://music.163.com/#/song?id=436514312
...
```

### 混合使用

```markdown
{{< music 
  "netease:86369" 
  "local:audio/song.mp3" 
  "url:https://example.com/music.mp3" 
>}}
```

---

## 🔍 控制台日志

### 成功时

```
✓ 加载了 1 个API配置
可用API: nsmao
尝试使用API [nsmao]: https://api.nsmao.net/api/wy/query?key=...&id=86369&type=json&level=jymaster
API [nsmao] 原始返回: {code: 200, msg: "解析成功", data: {...}}
API [nsmao] 提取data字段: {id: "86369", name: "偏爱", artist: "张芸京", ...}
✓ API [nsmao] 成功
```

### 失败时

```
尝试使用API [nsmao]: https://api.nsmao.net/...
✗ API [nsmao] 失败: API返回错误代码: 400
```

**常见错误代码：**
- `400` - 参数错误（检查歌曲ID）
- `401` - 密钥无效
- `404` - 歌曲不存在
- `429` - 请求频率限制

---

## ⚠️ 注意事项

### 1. 密钥安全

```toml
# ❌ 不要将密钥提交到公开仓库
netease = "https://api.nsmao.net/api/wy/query?key=YOUR_KEY&id={id}..."

# ✅ 如果仓库是公开的，考虑使用环境变量
# 或在 .gitignore 中排除 hugo.toml
```

### 2. 调用频率

- 避免短时间内大量请求
- 建议使用本地文件作为主要方案
- API作为备用或在线引用方案

### 3. 版权问题

- 确保您有权使用这些音乐
- 仅用于个人学习和研究
- 商业使用需获得授权

### 4. API稳定性

- 第三方API可能随时失效
- 建议配置多个备用API
- 重要音乐建议本地化

---

## 🔄 切换到其他API

如果nsmao API失效，可以快速切换：

```toml
[[params.music.apis]]
  name = "nsmao"
  enabled = false  # 禁用失效的API

[[params.music.apis]]
  name = "新API"
  enabled = true  # 启用新的API
  netease = "https://new-api.com/song?id={id}"
```

---

## 🛠️ 故障排查

### 问题1：音乐无法播放

**检查步骤：**

1. **查看控制台日志**
   ```
   F12 → Console
   查看是否有错误信息
   ```

2. **验证API返回**
   ```
   访问: https://api.nsmao.net/api/wy/query?key=YOUR_KEY&id=86369&type=json&level=jymaster
   查看是否返回正确数据
   ```

3. **检查歌曲ID**
   ```markdown
   # 确保ID正确
   {{< music "netease:86369" >}}  ✅
   {{< music "netease:abcde" >}}  ❌ 错误的ID
   ```

### 问题2：返回401错误

**原因：** 密钥无效或过期

**解决：**
```toml
# 更新密钥
netease = "https://api.nsmao.net/api/wy/query?key=NEW_KEY&id={id}..."
```

### 问题3：返回429错误

**原因：** 请求频率过高

**解决：**
- 减少API调用
- 使用本地文件
- 等待限制解除（通常几分钟到几小时）

---

## 📊 性能对比

| 方案 | 速度 | 音质 | 可靠性 | 推荐度 |
|------|------|------|--------|--------|
| **nsmao API** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 本地文件 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| CDN托管 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 💡 推荐使用方式

### 个人博客

```markdown
# 主要使用nsmao API（方便引用在线音乐）
{{< music "netease:86369" >}}

# 重要音乐使用本地文件（确保可靠）
{{< music "local:audio/important.mp3" >}}
```

### 音乐分享

```markdown
# 混合使用
{{< music 
  "netease:86369"              # API引用
  "local:audio/demo.mp3"       # 本地备份
>}}
```

---

## 📚 相关文档

- [音乐播放器使用指南](music-guide.md)
- [音乐API配置指南](music-api-config-guide.md)
- [本地音乐使用说明](../static/audio/README.md)
- [API不稳定性分析](../MUSIC_API_INSTABILITY_ANALYSIS.md)

---

## 🔄 更新日志

### v1.0.0 (2025-10-25)
- ✨ 首次集成nsmao API
- ✅ 支持网易云音乐单曲解析
- ✅ 支持超清母带音质
- ✅ 自动处理API响应格式
- 📝 创建使用指南文档

---

**API提供商：** nsmao.net  
**文档版本：** v1.0.0  
**更新时间：** 2025-10-25  
**当前密钥：** r2h1QwIUVmntyGn08Nf7psADpG (请妥善保管)

