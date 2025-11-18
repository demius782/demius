# Demius Hugo Theme

三栏瀑布流 + 数据组件 + PJAX 的现代化 Hugo 主题。Demius 为想要在同一站点中展示 **博客文章、动态说说、数据面板、相册、音乐/追番/愿望清单** 的玩家准备了完善的配置模板与短代码集合。

- 💻 演示站点：[blog.demius.tech](https://blog.demius.tech)
- 📸 截图：`images/screenshot.png` · `images/tn.png`
- 📦 示例站点：`exampleSite/`（包含完整 `hugo.toml`、页面与数据文件）

> 本仓库包含主题源码，你可以直接拷贝到 `themes/demius`，或者作为 Hugo Module 引入。

---

## ✨ 主要特性

- **三栏/双栏/单栏主页切换**，支持文章卡片透明/毛玻璃模式
- **浮动工具条 + 沉浸阅读 + PJAX 无刷新跳转**
- **多级导航 + 顶部公告 + 自定义弹窗**
- **数据驱动页面**：音乐星球、追番星球、装备、友圈、说说、愿望清单、支持者等
- **丰富短代码**：按钮、时间线、折叠、选项卡、局部加密、视频/音乐嵌入
- **侧栏组件**：访客信息、随机语录、热门/最新文章、目录、社交媒体、广告位
- **全站灰度、字体、背景、评论、打赏、浮动音乐播放器等 80+ 开关式配置**

---

## 📁 目录速览

```
themes/demius
├── archetypes/        # 默认 Front Matter 模板
├── assets/            # 原子化 CSS / JS
├── layouts/           # 页面、分区、短代码与组件
├── static/            # 主题内置静态资源（图标、音频、avatar 等）
├── data/              # 主题层级默认数据（可被站点覆盖）
├── exampleSite/       # 完整示例站点（内容 + 数据 + 配置）
├── images/            # 主题截图（screenshot.png / tn.png）
├── theme.toml         # 主题元数据（供 Hugo 官方主题库识别）
├── README.md          # 当前文档
└── LICENSE            # MIT 许可证
```

---

## 🚀 快速开始

### 1. Git 子模块

```bash
git submodule add https://github.com/demius782/demius themes/demius
```

### 2. Hugo Modules

```bash
hugo mod init github.com/your/site
echo 'module = "github.com/demius782/demius"' >> hugo.toml
hugo mod get github.com/demius782/demius
```

### 3. 直接下载

从 Releases 或 `main` 分支下载并解压到 `themes/demius`。

---

## 🧪 示例站点

`exampleSite/` 包含了一套可直接运行的演示内容：

- `hugo.toml`：完整配置，演示全部功能开关
- `content/`：关于页、数据页、网友圈、说说、友链、支持者等页面，以及两篇示例文章
- `data/`：`gallery.yaml`、`gear.yaml`、`bangumi-planet.yaml`、`wishlist.yaml` 等数据源

运行体验：

```bash
cd themes/demius/exampleSite
hugo server --themesDir ../..
```

---

## ⚙️ 关键配置摘录

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

更多配置请参考 `exampleSite/hugo.toml`，其中对每个模块都附带注释说明。

---

## 🗂️ 数据驱动页面

| 页面 | 数据文件 | 说明 |
| --- | --- | --- |
| 相册/gallery | `data/gallery.yaml` | 支持多分组、封面、精选置顶 |
| 装备/gear | `data/gear.yaml` | 卡片式装备清单，支持多平台购买链接 |
| 愿望清单/wishlist | `data/wishlist.yaml` | 状态、优先级、进度条 |
| 追番星球/bangumi-planet | `data/bangumi-planet.yaml` | 想看/在看/看过 列表 |
| 音乐星球/music-planet | `data/music-planet.yaml` | 网易云/QQ/本地混合播放 |
| 支持者/supporters | `data/supporters.yaml` | 统计信息 + 分组等级 |
| 轮播图 | `data/carousel.yaml` | 首页多图 banner |
| 弹窗 | `data/popup.yaml` | 模态框 / Toast / Banner 组合 |

根据需要复制到你自己站点的 `data/` 下即可覆盖。

---

## 🧩 常用短代码

```markdown
{{</* button href="https://example.com" color="primary" icon="fas fa-play" */>}}访问演示{{</* /button */>}}

{{</* collapse "展开更多" "open" */>}}支持 Markdown 内容{{</* /collapse */>}}

{{</* timeline */>}}
  {{</* timeline-item "2025-10-24" "v2.8.0 发布" "success" "star" */>}}新增数据页{{</* /timeline-item */>}}
{{</* /timeline */>}}

{{</* encrypt password="demo" hint="输入 demo 解锁" */>}}
这是加密内容示例
{{</* /encrypt */>}}

{{</* bilibili bvid="BV1hE411c7mD" */>}}
{{</* music server="netease" type="playlist" id="4977885420" */>}}
```

更多用法可查看 `layouts/shortcodes/` 中的注释。

---

## 🤝 贡献

欢迎提交 Issue / PR：

1. Fork 仓库并新建分支
2. 在 `themes/demius` 内修改或新增功能
3. 如涉及样式/JS，请同步更新 `assets/`
4. 更新 `exampleSite/` 或文档，方便他人验证

---

## 📜 许可证

Demius 使用 [MIT License](./LICENSE)。保留版权声明即可在个人或商业项目中自由使用。

---

如果你把 Demius 应用到自己的博客或制作了衍生主题，欢迎在 issues 中分享，我们会把优秀站点加入示例列表！祝你玩得开心 🎉

