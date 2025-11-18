# jkapi 音乐API分析

## 📋 API概述

**接口地址：** https://jkapi.com/api/music  
**官方文档：** https://jkapi.com/doc/music.html

---

## 🔍 API特点

### 优势
- ✅ 支持网易云音乐（plat=wy）
- ✅ 支持QQ音乐（plat=qq）
- ✅ 支持付费歌曲
- ✅ 直接返回播放地址

### 限制
- ⚠️ **基于歌曲名搜索**，不是歌曲ID
- ⚠️ 需要API密钥
- ⚠️ 可能有请求限制

---

## 📝 请求参数

| 参数 | 必填 | 类型 | 说明 |
|------|------|------|------|
| `plat` | ✅ | string | 音乐平台：`wy`(网易云) / `qq`(QQ音乐) |
| `type` | ✅ | string | 返回格式：`json` |
| `apiKey` | ✅ | string | API密钥 |
| `name` | ✅ | string | **歌曲名称**（不是ID） |

---

## 🎯 API请求示例

### 网易云音乐

```
https://jkapi.com/api/music?plat=wy&type=json&apiKey=YOUR_KEY&name=小苹果
```

### QQ音乐

```
https://jkapi.com/api/music?plat=qq&type=json&apiKey=YOUR_KEY&name=告白气球
```

---

## 📊 返回格式

### 成功响应

```json
{
    "code": 1,
    "msg": "获取成功",
    "name": "小苹果",
    "album": "小苹果",
    "artist": "呼禾",
    "music_url": "https://m801.music.126.net/..."
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | number | 状态码：1=成功 |
| `msg` | string | 提示信息 |
| `name` | string | 歌曲名 |
| `album` | string | 专辑名 |
| `artist` | string | 艺术家 |
| `music_url` | string | **播放地址** |

---

## ⚠️ 兼容性问题

### 当前播放器设计

我们的音乐播放器是基于**歌曲ID**的：

```markdown
{{< music "netease:591321" >}}
           ↑      ↑
        平台    歌曲ID
```

### jkapi API设计

jkapi是基于**歌曲名**的：

```
https://jkapi.com/api/music?name=小苹果
                               ↑
                            歌曲名
```

### 不兼容原因

1. **参数类型不同**
   - 现有：歌曲ID（数字）
   - jkapi：歌曲名（字符串）

2. **搜索方式不同**
   - 现有：精确匹配ID
   - jkapi：按名称搜索（可能有多个结果）

3. **URL编码问题**
   - 歌曲名需要URL编码
   - 中文歌曲名处理复杂

---

## 💡 解决方案

### 方案1：不集成（推荐）

**原因：**
- 架构不兼容（ID vs 名称）
- 修改成本高
- 现有API（nsmao + injahow）已足够

**建议：**
继续使用现有的API组合：
- nsmao（网易云单曲、超清音质）
- injahow（歌单、QQ音乐）

---

### 方案2：作为备用URL直链

如果您有jkapi的密钥，可以手动获取播放URL，然后使用：

**步骤：**

1. **访问jkapi获取URL**
   ```
   https://jkapi.com/api/music?plat=wy&type=json&apiKey=YOUR_KEY&name=小苹果
   ```

2. **从返回中提取music_url**
   ```json
   {
     "music_url": "https://m801.music.126.net/..."
   }
   ```

3. **在文章中使用URL直链**
   ```markdown
   {{< music "url:https://m801.music.126.net/..." >}}
   ```

**优点：**
- ✅ 无需修改代码
- ✅ 可以使用当前播放器

**缺点：**
- ❌ 需要手动操作
- ❌ URL可能过期

---

### 方案3：创建新的shortcode（复杂）

如果真的需要集成，需要创建新的shortcode：

```markdown
{{< music-name platform="wy" name="小苹果" apikey="YOUR_KEY" >}}
```

**需要修改：**
1. 创建新的shortcode `music-name.html`
2. 修改JavaScript支持按名称查询
3. 处理URL编码
4. 处理搜索结果

**成本：**
- 高开发成本
- 维护复杂
- 可能影响现有功能

---

## 📊 API对比

| 特性 | nsmao | injahow | jkapi |
|------|-------|---------|-------|
| **查询方式** | ID | ID | **名称** |
| **网易云单曲** | ✅ 超清 | ✅ 标准 | ✅ |
| **网易云歌单** | ❌ | ✅ | ❌ |
| **QQ音乐** | ❌ | ✅ | ✅ |
| **需要密钥** | ✅ | ❌ | ✅ |
| **兼容现有系统** | ✅ | ✅ | ❌ |
| **开发成本** | 已完成 | 已完成 | **高** |

---

## 🎯 推荐策略

### 当前最佳配置

```toml
# 主API：nsmao（超清音质）
[[params.music.apis]]
  name = "nsmao"
  enabled = true
  netease = "https://api.nsmao.net/api/wy/query?key=YOUR_KEY&id={id}..."

# 备用API：injahow（歌单、QQ音乐）
[[params.music.apis]]
  name = "injahow"
  enabled = true
  netease = "https://api.injahow.cn/meting/?server=netease&type=song&id={id}"
  neteasePlaylist = "..."
  qq = "..."
```

**优势：**
- ✅ 两个API已集成完成
- ✅ 支持ID查询（标准化）
- ✅ 支持歌单功能
- ✅ 自动切换备份
- ✅ 无需额外开发

### 功能覆盖

| 功能 | 解决方案 |
|------|----------|
| 网易云单曲 | nsmao（超清） |
| 网易云歌单 | injahow |
| QQ音乐 | injahow |
| 本地文件 | local |

**结论：** 现有API组合已覆盖所有需求，无需集成jkapi

---

## 💡 如果仍想使用jkapi

### 手动使用流程

1. **获取歌曲播放URL**
   ```bash
   # 访问jkapi
   https://jkapi.com/api/music?plat=wy&type=json&apiKey=YOUR_KEY&name=小苹果
   
   # 获取返回的music_url
   "music_url": "https://m801.music.126.net/..."
   ```

2. **使用URL直链**
   ```markdown
   {{< music "url:https://m801.music.126.net/..." >}}
   ```

3. **多首歌曲**
   ```markdown
   {{< music 
     "url:https://m801.music.126.net/song1.mp3" 
     "url:https://m802.music.126.net/song2.mp3" 
   >}}
   ```

---

## ⚠️ 注意事项

### 1. URL时效性

```
jkapi返回的music_url可能有时效性
建议：定期更新或使用本地文件
```

### 2. 密钥安全

```
不要在公开仓库中暴露API密钥
建议：使用环境变量或私有配置
```

### 3. 请求限制

```
jkapi可能有每日请求限制
建议：合理使用，避免频繁请求
```

---

## 📚 相关文档

- [nsmao API使用指南](nsmao-api-guide.md)
- [Meting API使用指南](meting-api-guide.md)
- [音乐API配置指南](music-api-config-guide.md)
- [本地音乐使用说明](../static/audio/README.md)

---

## 🎉 总结

### 建议：不集成jkapi

**理由：**
1. ❌ 架构不兼容（基于名称vs基于ID）
2. ❌ 开发成本高
3. ✅ 现有API组合已满足需求
4. ✅ nsmao + injahow 覆盖所有功能

### 当前最优方案

```markdown
# 网易云单曲（超清）
{{< music "netease:591321" >}}

# 网易云歌单
{{< music "netease-playlist:2619366284" >}}

# QQ音乐
{{< music "qq:001vJijV1gXaxA" >}}

# 本地文件
{{< music "local:audio/song.mp3" >}}
```

### 如需使用jkapi

```markdown
# 手动获取URL后使用
{{< music "url:https://m801.music.126.net/..." >}}
```

---

**结论：建议继续使用nsmao + injahow的组合，无需集成jkapi。** ✅

**更新时间：** 2025-10-25  
**建议：** 保持现有API配置

