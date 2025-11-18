# 音乐播放器API配置指南

## 📋 概述

从 v1.4.0 版本开始，音乐播放器的API端点可以在 `hugo.toml` 配置文件中自定义管理。

**优势：**
- ✅ 灵活配置多个API端点
- ✅ 快速切换或禁用API
- ✅ 支持自定义API服务
- ✅ 无需修改代码
- ✅ 自动故障转移

---

## 📍 配置位置

配置位于 `hugo.toml` 文件的 `[params.music]` 部分。

---

## 🔧 配置结构

```toml
[params.music]
  [[params.music.apis]]
    name = "API名称"
    enabled = true                         # 是否启用
    netease = "https://api.com/song?id={id}"
    neteasePlaylist = "https://api.com/playlist?id={id}"
    qq = "https://api.com/qq?id={id}"
    qqPlaylist = "https://api.com/qqplaylist?id={id}"
    kugou = "https://api.com/kugou?id={id}"
    kugouPlaylist = "https://api.com/kugouplaylist?id={id}"
```

### 配置字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | API的名称，用于日志标识 |
| `enabled` | ❌ | 是否启用此API，默认true |
| `netease` | ❌ | 网易云单曲API端点 |
| `neteasePlaylist` | ❌ | 网易云歌单API端点 |
| `qq` | ❌ | QQ音乐单曲API端点 |
| `qqPlaylist` | ❌ | QQ音乐歌单API端点 |
| `kugou` | ❌ | 酷狗单曲API端点 |
| `kugouPlaylist` | ❌ | 酷狗歌单API端点 |

**URL模板说明：**
- 使用 `{id}` 作为占位符
- 播放器会自动将 `{id}` 替换为实际的歌曲或歌单ID

---

## 🎯 使用场景

### 场景1：启用已有API

如果某个API恢复可用，只需修改 `enabled` 字段：

```toml
[[params.music.apis]]
  name = "uapis"
  enabled = true                    # 从false改为true
  netease = "https://api.uapis.cn/api/meting.php?server=netease&type=song&id={id}"
  # ... 其他配置
```

### 场景2：添加新的API

找到新的可用API后，添加新配置块：

```toml
[[params.music.apis]]
  name = "新API名称"
  enabled = true
  netease = "https://new-api.com/netease/{id}"
  neteasePlaylist = "https://new-api.com/netease/playlist/{id}"
  qq = "https://new-api.com/qq/{id}"
  qqPlaylist = "https://new-api.com/qq/playlist/{id}"
  kugou = "https://new-api.com/kugou/{id}"
  kugouPlaylist = "https://new-api.com/kugou/playlist/{id}"
```

### 场景3：使用自建API

如果您自己部署了音乐API服务：

```toml
[[params.music.apis]]
  name = "我的API"
  enabled = true
  netease = "https://my-music-api.example.com/api/song?platform=netease&id={id}"
  neteasePlaylist = "https://my-music-api.example.com/api/playlist?platform=netease&id={id}"
  qq = "https://my-music-api.example.com/api/song?platform=qq&id={id}"
  qqPlaylist = "https://my-music-api.example.com/api/playlist?platform=qq&id={id}"
  kugou = "https://my-music-api.example.com/api/song?platform=kugou&id={id}"
  kugouPlaylist = "https://my-music-api.example.com/api/playlist?platform=kugou&id={id}"
```

### 场景4：只支持部分平台

如果API只支持某些平台，只配置对应字段：

```toml
[[params.music.apis]]
  name = "仅网易云API"
  enabled = true
  netease = "https://netease-only-api.com/song/{id}"
  neteasePlaylist = "https://netease-only-api.com/playlist/{id}"
  # 不配置qq和kugou字段
```

---

## 🔄 API切换逻辑

### 自动切换流程

1. 按配置顺序尝试第一个启用的API
2. 如果失败，自动切换到下一个启用的API
3. 重复直到成功或所有API都尝试过
4. 记住成功的API，下次优先使用

### 控制台日志示例

```
✓ 加载了 2 个API配置
可用API: 我的API, uapis
尝试使用API [我的API]: https://my-api.com/song?id=12345
API [我的API] 原始返回: [...]
✓ API [我的API] 成功
```

切换示例：

```
尝试使用API [我的API]: https://my-api.com/song?id=12345
✗ API [我的API] 失败: HTTP错误: 404
尝试使用API [uapis]: https://api.uapis.cn/...
API [uapis] 原始返回: [...]
✓ 切换到API [uapis]
```

---

## 📝 完整配置示例

### 示例1：多个备用API

```toml
[params.music]
  # 自定义API（优先使用）
  [[params.music.apis]]
    name = "我的API"
    enabled = true
    netease = "https://my-api.com/song?platform=netease&id={id}"
    neteasePlaylist = "https://my-api.com/playlist?platform=netease&id={id}"
    qq = "https://my-api.com/song?platform=qq&id={id}"
    qqPlaylist = "https://my-api.com/playlist?platform=qq&id={id}"
    kugou = "https://my-api.com/song?platform=kugou&id={id}"
    kugouPlaylist = "https://my-api.com/playlist?platform=kugou&id={id}"
  
  # uapis（备用）
  [[params.music.apis]]
    name = "uapis"
    enabled = true
    netease = "https://api.uapis.cn/api/meting.php?server=netease&type=song&id={id}"
    neteasePlaylist = "https://api.uapis.cn/api/meting.php?server=netease&type=playlist&id={id}"
    qq = "https://api.uapis.cn/api/meting.php?server=tencent&type=song&id={id}"
    qqPlaylist = "https://api.uapis.cn/api/meting.php?server=tencent&type=playlist&id={id}"
    kugou = "https://api.uapis.cn/api/meting.php?server=kugou&type=song&id={id}"
    kugouPlaylist = "https://api.uapis.cn/api/meting.php?server=kugou&type=playlist&id={id}"
```

### 示例2：禁用所有云音乐API（仅本地）

```toml
[params.music]
  # 禁用所有API，只使用本地文件
  [[params.music.apis]]
    name = "示例API"
    enabled = false
    netease = "https://example.com/api"
```

或者直接删除所有 `[[params.music.apis]]` 配置块。

---

## 🧪 测试API配置

### 步骤1：修改配置

在 `hugo.toml` 中添加或修改API配置。

### 步骤2：重新构建

```bash
hugo --cleanDestinationDir
```

### 步骤3：启动服务器

```bash
hugo server
```

### 步骤4：查看控制台

打开浏览器控制台（F12），访问包含音乐播放器的页面，查看日志：

```
✓ 加载了 X 个API配置
可用API: API1, API2, API3
尝试使用API [API1]: https://...
```

### 步骤5：验证功能

- 查看是否有 `✓ API [xxx] 成功` 的消息
- 查看是否能正常播放音乐
- 如果失败，查看错误信息调整配置

---

## 🔍 故障排查

### 问题1：配置不生效

**检查：**
1. 配置格式是否正确（TOML语法）
2. 是否重新构建了站点
3. 浏览器是否清除了缓存

**解决：**
```bash
hugo --cleanDestinationDir
hugo server
```

### 问题2：所有API都失败

**控制台显示：**
```
✗ API [xxx] 失败: ...
✗ API [yyy] 失败: ...
```

**原因：**
- API端点不可用
- URL格式错误
- CORS问题

**解决：**
1. 检查API端点是否可访问
2. 验证URL模板格式
3. 考虑使用本地文件

### 问题3：没有加载API配置

**控制台显示：**
```
⚠️ 没有启用的API，仅支持本地文件和URL直链
```

**原因：**
- 所有API的 `enabled` 都设置为 `false`
- 配置格式错误
- 配置未传递到JavaScript

**解决：**
1. 确保至少有一个API的 `enabled = true`
2. 检查TOML语法
3. 重新构建站点

---

## 💡 最佳实践

### 1. 优先级排序

将最可靠的API放在最前面：

```toml
[[params.music.apis]]
  name = "主API"
  enabled = true
  # ...

[[params.music.apis]]
  name = "备用API1"
  enabled = true
  # ...

[[params.music.apis]]
  name = "备用API2"
  enabled = true
  # ...
```

### 2. 保留失效API配置

将失效的API设置为 `enabled = false`，而不是删除，便于将来恢复：

```toml
[[params.music.apis]]
  name = "临时失效的API"
  enabled = false  # 暂时禁用，将来可能恢复
  # ... 保留配置
```

### 3. 添加注释

为每个API添加说明注释：

```toml
[[params.music.apis]]
  name = "我的API"
  enabled = true
  # 自建API服务，部署在my-api.com
  # 更新时间：2025-10-25
  # 状态：正常
  netease = "https://my-api.com/song/{id}"
  # ...
```

### 4. 定期检查

定期检查API状态，及时更新配置：

```toml
# 当前状态检查：2025-10-25
# ✅ 我的API - 正常
# ❌ uapis - 失效 (HTTP 410)
# ❌ oioweb - CORS问题
```

---

## 📚 相关资源

### 自建API项目

如果您想自建音乐API服务，可以参考：

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
- [QQMusicApi](https://github.com/jsososo/QQMusicApi)
- [Meting-API](https://github.com/metowolf/Meting)

### API响应格式

播放器期望的API响应格式：

**单曲：**
```json
[{
  "title": "歌曲名",
  "artist": "艺术家",
  "url": "音频URL",
  "pic": "封面URL",
  "lrc": "歌词"
}]
```

**歌单：**
```json
[
  {"title": "歌曲1", "artist": "...", "url": "..."},
  {"title": "歌曲2", "artist": "...", "url": "..."}
]
```

或包装格式：
```json
{
  "code": 1,
  "data": [...]
}
```

---

## 🔄 更新日志

### v1.4.0 (2025-10-25)
- ✨ **新功能：支持在配置文件中管理API**
- ✅ 支持多个API端点配置
- ✅ 支持启用/禁用API
- ✅ 支持自定义API服务
- ✅ 自动API切换和故障转移
- 📝 添加详细的配置指南

---

## ❓ 常见问题

### Q1: 配置多个API会影响性能吗？

**A:** 不会。播放器只会按顺序尝试，一旦成功就不再尝试其他API。

### Q2: 可以只配置一个API吗？

**A:** 可以。但建议配置多个备用API以提高可用性。

### Q3: API顺序重要吗？

**A:** 重要。播放器会按配置顺序尝试，建议将最可靠的API放在前面。

### Q4: 修改配置后需要重启服务器吗？

**A:** 需要。修改 `hugo.toml` 后需要重新构建：
```bash
hugo --cleanDestinationDir
hugo server
```

### Q5: 如何知道哪个API正在使用？

**A:** 查看浏览器控制台，会显示：
```
✓ API [API名称] 成功
```
或
```
✓ 切换到API [API名称]
```

---

**文档版本**: v1.4.0  
**更新时间**: 2025-10-25  
**相关文档**: [音乐播放器使用指南](music-guide.md) | [API状态说明](../MUSIC_API_STATUS.md)

