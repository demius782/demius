# Demius Hugo Theme

三栏瀑布流 + 数据组件 + PJAX 的现代化 Hugo 主题。Demius 为想要在同一站点中展示 **博客文章、动态说说、数据面板、相册、音乐/追番/愿望清单** 的玩家准备了完善的配置模板与短代码集合。

- 💻 演示站点：[blog.demius.tech](https://blog.demius.tech)
- 📸 截图：`images/screenshot.png` · `images/tn.png`

> **本仓库是 Demius 主题的完整源码仓库**，包含主题的所有文件。你可以通过 Git 子模块、直接下载或 Hugo Modules 的方式将其作为主题使用。

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

## 📁 仓库结构

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

> **注意**：
> - `yilai/` 文件夹包含开发工具（Node.js 依赖、PostCSS 配置等），这些文件与主题的**使用**无关。主题使用 Hugo Pipes 自动处理 CSS，如果使用 Hugo Extended 版本，**可以删除 `yilai/` 文件夹**。这些文件仅对**开发主题**或**使用非 Extended 版本的 Hugo** 有用。
> - `theme.toml` 和 `images/` 目录是为了让 Hugo 官方主题仓库定时拉取而创建的，与主题使用无关，**可以删除**。
> - `hugo.toml` 是主题仓库的示例配置文件，用于参考配置项，**不要直接使用**。你的站点配置文件应该在你自己的 Hugo 站点根目录下。

---

## 🚀 快速开始

### 环境要求

- **Hugo 版本**：`0.146.0` 或更高版本
- **Hugo Extended**：推荐使用 Extended 版本（支持 PostCSS/SCSS 处理）
- **Node.js**：`16.x` 或更高版本（如果使用 Hugo 非 Extended 版本，需要用于 CSS 合并）

### 安装方式

#### 方式 1：作为 Git 子模块引入（推荐）

在你的 Hugo 站点根目录下执行：

```bash
git submodule add https://github.com/demius782/demius-blog.git themes/demius
```

然后在你的站点配置文件（`hugo.toml` 或 `config.toml`）中添加：

```toml
theme = "demius"
```

#### 方式 2：直接下载使用

1. 从 GitHub 下载本仓库的压缩包（或使用 `git clone`）
2. 解压后，将整个仓库文件夹重命名为 `demius`
3. 将 `demius` 文件夹复制到你的 Hugo 站点根目录下的 `themes/` 目录中（即 `themes/demius/`）
4. 在你的站点配置文件（`hugo.toml` 或 `config.toml`）中添加：

```toml
theme = "demius"
```

#### 方式 3：使用 Hugo Modules

```bash
hugo mod init github.com/your/site
echo 'theme = "demius"' >> hugo.toml
hugo mod get github.com/demius782/demius-blog
```

然后在配置文件中添加：

```toml
theme = "demius"
```

### 使用示例内容（可选）

安装主题后，如果需要使用示例页面和数据来快速了解主题功能：

1. 将 `demius2/content/` 目录下的所有文件复制到你站点的 `content/` 目录中
2. 将 `demius2/data/` 目录下的所有文件复制到你站点的 `data/` 目录中

这些示例文件包括：
- 各种页面模板（关于、相册、装备、音乐星球等）
- 数据文件示例（轮播图、相册、装备、追番等）

> **提示**：
> - 如果你使用 **Hugo Extended 版本**（推荐），可以删除 `yilai/` 文件夹，这些是开发工具，与主题使用无关。
> - 如果你使用 **Hugo 非 Extended 版本**，需要保留 `yilai/` 文件夹，详细说明请查看[配置指南](/posts/theme-configuration-guide/)。

---

## 📖 详细文档

详细的配置说明、页面设置、数据文件配置和开发指南，请查看主题文章：[Demius 主题配置指南](/posts/theme-configuration-guide/)

---


## 🤝 贡献

欢迎提交 Issue / PR：

1. Fork 仓库并新建分支
2. 在仓库根目录下修改或新增功能（`archetypes/`、`assets/`、`layouts/`、`static/` 等）
3. 如涉及样式/JS，请同步更新 `assets/` 目录中的对应文件
4. 更新 `demius2/` 中的示例内容或文档，方便他人验证
5. 提交 PR 前请确保代码格式正确，并测试功能是否正常

---

## 📜 许可证

Demius 使用 [MIT License](./LICENSE)。保留版权声明即可在个人或商业项目中自由使用。

---

如果你把 Demius 应用到自己的博客或制作了衍生主题，欢迎在 issues 中分享，我们会把优秀站点加入示例列表！祝你玩得开心 🎉
