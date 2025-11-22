---
title: "Demius 主题配置指南"
date: 2025-01-01
draft: false
---

## 📦 配置说明

### 使用前准备

**重要提示：** 本仓库是 Demius 主题的完整源码仓库，包含了一些与主题使用无关的文件，这些文件是为了让 Hugo 官方主题仓库定时拉取而创建的。在使用主题前，请删除以下文件：

- `theme.toml` - 主题元数据文件（仅用于 Hugo 官方主题库）
- `images/` 目录 - 主题截图文件（仅用于 Hugo 官方主题库）
- `hugo.toml` - 这是主题仓库的示例配置文件，不是你的站点配置文件

**注意：** 
- 你的站点配置文件应该在你自己的 Hugo 站点根目录下，而不是在主题目录中
- `hugo.toml` 和 `theme.toml` 的用处不同：
  - `hugo.toml` 是站点配置文件，用于配置你的 Hugo 站点
  - `theme.toml` 是主题元数据文件，仅用于 Hugo 官方主题库展示主题信息

### 必需页面文件

启用主题后，需要在站点根目录的 `content/` 目录下创建以下页面（示例文件在主题仓库的 `demius2/content/` 目录中，可直接复制使用）：

| 页面文件 | 说明 | Front Matter 示例 |
| --- | --- | --- |
| `about.md` | 关于页面 | `type: "page"`, `layout: "single"` |
| `data.md` | 数据统计页面 | `type: "data"`, `layout: "data"` |
| `friends-circle.md` | 网友圈页面 | `type: "friends-circle"`, `layout: "friends-circle"` |
| `gallery.md` | 相册页面 | `type: "gallery"`, `layout: "gallery"` |
| `gear.md` | 装备页面 | `type: "gear"`, `layout: "gear"` |
| `links.md` | 友链页面 | `type: "links"`, `layout: "links"` |
| `message.md` | 留言板页面 | `type: "message"`, `layout: "message"` |
| `music-planet.md` | 音乐星球页面 | `type: "music-planet"`, `layout: "music-planet"` |
| `bangumi-planet.md` | 追番星球页面 | `type: "bangumi-planet"`, `layout: "bangumi-planet"` |
| `booklist.md` | 小说书单页面 | `type: "booklist"`, `layout: "booklist"` |
| `shuoshuo.md` | 说说页面 | `type: "shuoshuo"`, `layout: "shuoshuo"` |
| `supporters.md` | 支持者页面 | `type: "supporters"`, `layout: "supporters"` |
| `wishlist.md` | 愿望清单页面 | `type: "wishlist"`, `layout: "wishlist"` |
| `go.md` | 跳转中转页 | `layout: "go"` |
| `search/_index.md` | 搜索页面 | 标准搜索页配置 |

**提示：** 所有页面模板已包含在主题仓库的 `demius2/content/` 目录中，可直接复制到你的站点使用。

### 必需数据文件

启用主题后，需要在站点根目录的 `data/` 目录下创建以下数据文件（示例文件在主题仓库的 `demius2/data/` 目录中，可直接复制使用）：

| 数据文件 | 说明 | 用途 |
| --- | --- | --- |
| `carousel.yaml` | 轮播图配置 | 首页轮播图数据源 |
| `gallery.yaml` | 相册数据 | 相册页面图片数据 |
| `gear.yaml` | 装备数据 | 装备页面展示数据 |
| `bangumi-planet.yaml` | 追番数据 | 追番星球页面数据 |
| `music-planet.yaml` | 音乐数据 | 音乐星球页面数据 |
| `wishlist.yaml` | 愿望清单数据 | 愿望清单页面数据 |
| `supporters.yaml` | 支持者数据 | 支持者页面数据 |
| `links.yaml` | 友链数据 | 友链页面数据 |
| `popup.yaml` | 弹窗配置 | 弹窗公告数据 |

**提示：** 所有数据文件模板已包含在主题仓库的 `demius2/data/` 目录中，可直接复制到你的站点使用。

### 配置文件

主题的完整配置示例在主题仓库根目录的 `hugo.toml` 文件中，你可以参考该文件配置你的站点。主要配置项包括：

```toml
baseURL = "https://example.com"
languageCode = "zh-CN"
title = "Demius Theme"
theme = "demius"

[module.hugoVersion]
  min = "0.146.0"
  extended = true

[params]
  homeColumns = 3
  darkMode = true
  pjax = true
  stickyHeader = true

[params.floatToolbar]
  enable = true
  showImmersiveMode = true

[params.carousel]
  enable = true
  showOnPages = ["home"]

[params.topAnnouncement]
  enable = true
  mode = "shuoshuo"

[params.comment]
  enable = true
  system = "artalk"
```

更多配置请参考主题仓库根目录的 `hugo.toml` 文件，其中对每个模块都附带详细注释说明。

---

## 🛠️ 开发说明

### 使用 Hugo Extended 版本（推荐）

如果你使用 **Hugo Extended 版本**，Hugo 会自动通过 Pipes 处理 CSS，无需任何额外操作。你可以**直接删除 `yilai/` 文件夹**，这些开发工具对你来说是不需要的。

### 使用 Hugo 非 Extended 版本

如果你使用的是 **Hugo 非 Extended 版本**，由于 Hugo 无法自动处理 CSS 中的 `@import` 语句，你需要使用 `yilai/` 文件夹中的工具来合并 CSS 文件：

1. **安装 Node.js 依赖**：
   ```bash
   cd yilai
   npm install
   ```

2. **合并 CSS 文件**：
   ```bash
   npm run build:css
   ```
   这个命令会将 `assets/css/main.css` 中的所有 `@import` 语句合并，生成 `assets/css/main-merged.css` 文件。

3. **修改主题布局文件**（如果需要）：
   如果主题使用了 `main.css`，你可能需要修改布局文件，将引用改为 `main-merged.css`。或者，你可以直接使用合并后的 CSS 文件替换原文件。

**注意：** 每次修改 CSS 文件后，都需要重新运行 `npm run build:css` 来更新合并后的 CSS 文件。

### 开发主题

如果你需要修改主题代码或进行主题开发，可以使用 `yilai/` 文件夹中的依赖文件进行 CSS 处理和构建。

---

## 📁 仓库结构说明

```
demius-blog/                    # 主题源码仓库根目录
├── archetypes/                 # 默认 Front Matter 模板
├── assets/                     # 原子化 CSS / JS
├── layouts/                    # 页面、分区、短代码与组件
├── static/                     # 主题内置静态资源（图标、音频、avatar 等）
├── content/                    # 示例内容（可选，用于主题开发测试）
├── data/                       # 示例数据（可选，用于主题开发测试）
├── hugo.toml                   # 主题示例配置（参考用，不要直接使用）
├── theme.toml                  # 主题元数据（仅用于 Hugo 官方主题库，可删除）
├── demius2/                    # 示例页面和数据文件（可选）
│   ├── content/                # 示例页面内容
│   └── data/                   # 示例数据文件
├── yilai/                      # 开发工具（与主题使用无关）
│   ├── package.json            # Node.js 依赖配置（仅开发用）
│   ├── package-lock.json       # Node.js 依赖锁定文件
│   ├── postcss.config.js       # PostCSS 配置（仅开发用）
│   ├── go.mod                  # Go 模块配置（仅开发用）
│   └── scripts/                # CSS 合并脚本（仅开发用）
├── images/                     # 主题截图（Hugo 官方主题库需要，可删除）
│   ├── screenshot.png          # 主题截图
│   └── tn.png                  # 缩略图
├── LICENSE                     # MIT 许可证
└── README.md                   # 当前文档
```

> **注意**：`yilai/` 文件夹包含开发工具（Node.js 依赖、PostCSS 配置等），这些文件与主题的**使用**无关。主题使用 Hugo Pipes 自动处理 CSS，如果使用 Hugo Extended 版本，**可以删除 `yilai/` 文件夹**。这些文件仅对**开发主题**或**使用非 Extended 版本的 Hugo** 有用。

