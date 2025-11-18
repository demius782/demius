# Meting API 使用指南

## 📋 概述

Meting API (injahow) 是一个基于 [Meting](https://github.com/metowolf/Meting) 构建的音乐解析服务，支持多平台音乐解析。

**API地址：** https://api.injahow.cn/meting/

**GitHub：** [meting-api](https://github.com/injahow/meting-api)

---

## 🎯 API特点

### 优势
- ✅ 支持网易云音乐
- ✅ 支持QQ音乐
- ✅ **支持歌单功能**
- ✅ 无需密钥
- ✅ 基于开源项目Meting

### 限制
- ⚠️ 可能不稳定（免费API）
- ⚠️ 可能有调用频率限制
- ⚠️ 不保证长期可用

---

## 🔧 API参数说明

### server (数据源)

| 值 | 说明 |
|---|------|
| `netease` | 网易云音乐（默认） |
| `tencent` | QQ音乐 |

### type (类型)

| 值 | 说明 | 返回内容 |
|---|------|----------|
| `song` | 单曲信息 | 歌曲完整信息（URL、封面、歌词等） |
| `playlist` | 歌单信息 | 歌单中所有歌曲列表 |
| `url` | 获取播放URL | 仅返回音频地址 |
| `pic` | 获取封面 | 仅返回封面图片 |
| `lrc` | 获取歌词 | 仅返回歌词内容 |
| `name` | 歌曲名 | 仅返回歌曲名称 |
| `artist` | 歌手 | 仅返回歌手名称 |

### id (类型ID)

根据 `type` 不同：
- `song` - 单曲ID
- `playlist` - 歌单ID
- `url/pic/lrc` - 单曲ID

---

## 📝 配置说明

### 当前配置（hugo.toml）

```toml
[params.music]
  # nsmao API（主要，网易云单曲，超清音质）
  [[params.music.apis]]
    name = "nsmao"
    enabled = true
    netease = "https://api.nsmao.net/api/wy/query?key=r2h1QwIUVmntyGn08Nf7psADpG&id={id}..."
  
  # injahow Meting API（备用，支持歌单）
  [[params.music.apis]]
    name = "injahow"
    enabled = true
    netease = "https://api.injahow.cn/meting/?server=netease&type=song&id={id}"
    neteasePlaylist = "https://api.injahow.cn/meting/?server=netease&type=playlist&id={id}"
    qq = "https://api.injahow.cn/meting/?server=tencent&type=song&id={id}"
    qqPlaylist = "https://api.injahow.cn/meting/?server=tencent&type=playlist&id={id}"
```

### API切换逻辑

播放器会按顺序尝试：

1. **nsmao** - 网易云单曲（超清音质）
2. **injahow** - 如果nsmao失败或不支持（如歌单），自动切换

---

## 🎵 使用方法

### 网易云音乐单曲

```markdown
{{< music "netease:591321" >}}
```

**工作流程：**
1. 先尝试 nsmao API（超清音质）
2. 如果失败，自动切换到 injahow Meting API

### 网易云音乐歌单

```markdown
{{< music "netease-playlist:2619366284" >}}
```

**工作流程：**
1. nsmao 不支持歌单，返回失败
2. 自动切换到 injahow Meting API
3. 解析歌单中的所有歌曲

### QQ音乐单曲

```markdown
{{< music "qq:001vJijV1gXaxA" >}}
```

### QQ音乐歌单

```markdown
{{< music "qq-playlist:8263316214" >}}
```

---

## 🔍 API测试

### 测试URL示例

根据您提供的例子：

1. **获取播放URL**
   ```
   https://api.injahow.cn/meting/?type=url&id=416892104
   ```

2. **获取单曲信息**
   ```
   https://api.injahow.cn/meting/?type=song&id=591321
   ```

3. **获取歌单**
   ```
   https://api.injahow.cn/meting/?type=playlist&id=2619366284
   ```

### 返回格式

**单曲（type=song）：**
```json
[{
  "id": "591321",
  "name": "歌曲名",
  "artist": ["艺术家"],
  "album": "专辑名",
  "pic_id": "...",
  "url_id": "591321",
  "lyric_id": "591321",
  "source": "netease"
}]
```

**歌单（type=playlist）：**
```json
[
  {
    "id": "歌曲1ID",
    "name": "歌曲1",
    "artist": ["艺术家1"],
    ...
  },
  {
    "id": "歌曲2ID",
    "name": "歌曲2",
    "artist": ["艺术家2"],
    ...
  }
]
```

---

## 🎯 实际使用示例

### 单曲

```markdown
# 网易云单曲
{{< music "netease:591321" >}}

# QQ音乐单曲
{{< music "qq:001vJijV1gXaxA" >}}
```

### 歌单

```markdown
# 网易云歌单
{{< music "netease-playlist:2619366284" >}}

# QQ音乐歌单
{{< music "qq-playlist:8263316214" >}}
```

### 混合播放

```markdown
{{< music 
  "netease:591321"                    # 网易云单曲
  "netease-playlist:2619366284"       # 网易云歌单
  "qq:001vJijV1gXaxA"                 # QQ音乐单曲
  "local:audio/song.mp3"              # 本地文件
>}}
```

---

## 📊 双API策略

现在配置了两个API，它们会智能切换：

### 场景1：网易云单曲

```markdown
{{< music "netease:591321" >}}
```

**流程：**
1. ✅ nsmao API 成功（超清音质）
2. ⏭️ injahow API 不会尝试

**优势：** 使用超清音质

### 场景2：网易云歌单

```markdown
{{< music "netease-playlist:2619366284" >}}
```

**流程：**
1. ❌ nsmao API 不支持（跳过）
2. ✅ injahow Meting API 成功

**优势：** 自动使用支持歌单的API

### 场景3：QQ音乐

```markdown
{{< music "qq:001vJijV1gXaxA" >}}
```

**流程：**
1. ❌ nsmao API 不支持（跳过）
2. ✅ injahow Meting API 成功

**优势：** 自动切换到支持的API

---

## 🔍 控制台日志

### 网易云单曲（nsmao成功）

```
✓ 加载了 2 个API配置
可用API: nsmao, injahow
尝试使用API [nsmao]: https://api.nsmao.net/api/wy/query?key=...&id=591321
API [nsmao] 原始返回: {code: 200, data: {...}}
✓ API [nsmao] 成功
```

### 网易云歌单（切换到injahow）

```
✓ 加载了 2 个API配置
可用API: nsmao, injahow
尝试使用API [nsmao]: ...
✗ API [nsmao] 失败: ...
尝试使用API [injahow]: https://api.injahow.cn/meting/?server=netease&type=playlist&id=2619366284
API [injahow] 原始返回: [...]
✓ 切换到API [injahow]
```

---

## ⚠️ 注意事项

### 1. API稳定性

- ⚠️ injahow Meting API是免费服务
- ⚠️ 可能随时失效或限流
- ✅ 已配置nsmao作为主API
- ✅ injahow作为备用API

### 2. 音质对比

| API | 网易云单曲 | 网易云歌单 | QQ音乐 |
|-----|-----------|-----------|--------|
| nsmao | ⭐⭐⭐⭐⭐ 超清 | ❌ 不支持 | ❌ 不支持 |
| injahow | ⭐⭐⭐ 标准 | ✅ 支持 | ✅ 支持 |

### 3. 推荐使用方式

```markdown
# 高音质单曲：优先使用nsmao
{{< music "netease:591321" >}}

# 歌单：自动使用injahow
{{< music "netease-playlist:2619366284" >}}

# 本地文件：最可靠
{{< music "local:audio/song.mp3" >}}
```

---

## 🛠️ 故障排查

### 问题1：歌单无法播放

**可能原因：**
- injahow API失效
- 网络问题
- 歌单ID错误

**解决方案：**
1. 检查控制台日志
2. 验证歌单ID
3. 尝试手动列出歌曲：
   ```markdown
   {{< music 
     "netease:歌曲1ID" 
     "netease:歌曲2ID" 
   >}}
   ```

### 问题2：injahow API失败

**控制台显示：**
```
✗ API [injahow] 失败: ...
```

**解决方案：**
1. **禁用injahow API**
   ```toml
   [[params.music.apis]]
     name = "injahow"
     enabled = false
   ```

2. **使用本地文件**
   ```markdown
   {{< music "local:audio/song.mp3" >}}
   ```

3. **手动列出歌曲**（使用nsmao）
   ```markdown
   {{< music 
     "netease:ID1" 
     "netease:ID2" 
   >}}
   ```

---

## 📊 API对比

| 特性 | nsmao | injahow Meting | 本地文件 |
|------|-------|----------------|----------|
| **网易云单曲** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | - |
| **网易云歌单** | ❌ | ✅ | - |
| **QQ音乐** | ❌ | ✅ | - |
| **音质** | 超清母带 | 标准 | 原文件 |
| **稳定性** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **需要密钥** | ✅ | ❌ | ❌ |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 💡 最佳实践

### 策略1：质量优先

```markdown
# 单曲使用nsmao（超清音质）
{{< music "netease:591321" >}}

# 歌单使用injahow（自动切换）
{{< music "netease-playlist:2619366284" >}}
```

### 策略2：稳定优先

```markdown
# 下载为本地文件
{{< music 
  "local:audio/song1.mp3" 
  "local:audio/song2.mp3" 
>}}
```

### 策略3：混合使用

```markdown
# 重要音乐本地化，其他在线引用
{{< music 
  "local:audio/important.mp3"  # 本地备份
  "netease:591321"             # 在线引用
  "netease-playlist:2619366284" # 歌单
>}}
```

---

## 🔄 更新日志

### v1.0.0 (2025-10-25)
- ✨ 配置injahow Meting API
- ✅ 支持网易云音乐歌单
- ✅ 支持QQ音乐单曲和歌单
- ✅ 与nsmao API智能切换
- 📝 创建完整使用指南

---

## 📚 相关资源

- **Meting GitHub**: https://github.com/metowolf/Meting
- **Meting API**: https://github.com/injahow/meting-api
- [nsmao API使用指南](nsmao-api-guide.md)
- [音乐播放器使用指南](music-guide.md)
- [音乐API配置指南](music-api-config-guide.md)

---

## 🎉 总结

### 当前配置

```toml
主API：nsmao
├─ 网易云单曲 ✅
├─ 超清音质 ⭐⭐⭐⭐⭐
└─ 需要密钥

备用API：injahow Meting
├─ 网易云歌单 ✅
├─ QQ音乐 ✅
└─ 无需密钥
```

### 使用建议

1. **网易云单曲** - 自动使用nsmao（超清）
2. **网易云歌单** - 自动使用injahow（支持）
3. **QQ音乐** - 使用injahow
4. **重要音乐** - 下载为本地文件

### 优势

- ✅ 双API自动切换
- ✅ 支持歌单功能
- ✅ 支持多平台
- ✅ 高音质选项
- ✅ 无缝备份机制

**现在您可以完整使用网易云歌单和QQ音乐了！** 🎵

---

**API提供商：** injahow.cn  
**基于项目：** Meting by metowolf  
**文档版本：** v1.0.0  
**更新时间：** 2025-10-25

