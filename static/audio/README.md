# 本地音乐文件目录

## 📁 目录说明

此目录用于存放本地音乐文件，供音乐播放器使用。

---

## 📝 使用方法

### 1. 放置音乐文件

将MP3或其他音频文件复制到此目录：

```
static/audio/
├── song1.mp3
├── song2.mp3
├── bgm.mp3
└── ...
```

### 2. 在文章中引用

在Markdown文章中使用：

```markdown
{{< music "local:audio/song1.mp3" >}}
```

或播放多首：

```markdown
{{< music 
  "local:audio/song1.mp3" 
  "local:audio/song2.mp3" 
  "local:audio/bgm.mp3" 
>}}
```

---

## 🎵 支持的音频格式

- **MP3** (.mp3) - 推荐，兼容性最好
- **OGG** (.ogg) - 开源格式
- **WAV** (.wav) - 无损格式
- **M4A** (.m4a) - Apple格式
- **FLAC** (.flac) - 无损压缩

---

## 💡 建议

### 音频文件命名

- 使用英文或拼音命名
- 避免使用特殊字符
- 使用有意义的名称

**推荐：**
```
静夜思.mp3  或  jing-ye-si.mp3
背景音乐.mp3 或  bgm-01.mp3
```

**不推荐：**
```
歌曲@#$%^.mp3
  空格.mp3
中文带特殊符号！.mp3
```

### 音频文件大小

为了网站加载速度，建议：

- **单曲**: 3-8 MB
- **码率**: 128-320 kbps
- **时长**: 3-5分钟

**压缩工具：**
- FFmpeg (命令行)
- Audacity (GUI)
- Format Factory (Windows)

---

## 🔧 FFmpeg 压缩示例

### 转换为128kbps MP3

```bash
ffmpeg -i input.mp3 -b:a 128k output.mp3
```

### 转换为192kbps MP3

```bash
ffmpeg -i input.mp3 -b:a 192k output.mp3
```

### 批量转换（Windows）

```powershell
Get-ChildItem *.wav | ForEach-Object {
    ffmpeg -i $_.FullName -b:a 192k "$($_.BaseName).mp3"
}
```

---

## 📋 示例文件结构

```
static/audio/
├── README.md                    # 本说明文件
├── bgm/                         # 背景音乐
│   ├── peaceful.mp3
│   └── relaxing.mp3
├── songs/                       # 歌曲
│   ├── song1.mp3
│   └── song2.mp3
└── effects/                     # 音效
    ├── click.mp3
    └── notification.mp3
```

引用方式：

```markdown
{{< music "local:audio/bgm/peaceful.mp3" >}}
{{< music "local:audio/songs/song1.mp3" >}}
```

---

## ⚠️ 注意事项

### 1. 版权问题

- 确保您有权使用这些音乐文件
- 不要上传有版权的商业音乐
- 推荐使用CC授权或自己创作的音乐

### 2. 存储空间

- 注意Git仓库大小限制
- 大文件考虑使用Git LFS
- 或使用CDN托管音频文件

### 3. 文件路径

- 路径区分大小写（Linux服务器）
- 使用斜杠 `/` 而非反斜杠 `\`
- 路径相对于 `static` 目录

**正确：**
```markdown
{{< music "local:audio/song.mp3" >}}
```

**错误：**
```markdown
{{< music "local:static/audio/song.mp3" >}}  ❌ 不要包含static
{{< music "local:audio\song.mp3" >}}         ❌ 不要使用反斜杠
```

---

## 🌐 免费音乐资源

如果您需要无版权音乐，可以从以下网站下载：

1. **Free Music Archive**
   - https://freemusicarchive.org/
   - CC授权音乐

2. **Incompetech**
   - https://incompetech.com/music/
   - Kevin MacLeod的作品

3. **YouTube Audio Library**
   - https://www.youtube.com/audiolibrary
   - 免费背景音乐

4. **Bensound**
   - https://www.bensound.com/
   - 高质量配乐（需署名）

5. **CC Mixter**
   - http://ccmixter.org/
   - CC授权混音作品

6. **Freesound**
   - https://freesound.org/
   - 音效和音乐

---

## 📚 相关文档

- [音乐播放器使用指南](../../docs/music-guide.md)
- [音乐API配置指南](../../docs/music-api-config-guide.md)
- [音乐播放器功能示例](../../content/posts/音乐播放器功能使用示例.md)

---

**提示：** 如果您找到了可用的音乐API，可以在 `hugo.toml` 的 `[params.music]` 部分配置使用。

