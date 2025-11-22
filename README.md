# Demius Hugo Theme

三栏瀑布流 + 数据组件 + PJAX 的现代化 Hugo 主题。Demius 为想要在同一站点中展示 **博客文章、动态说说、数据面板、相册、音乐/追番/愿望清单** 的玩家准备了完善的配置模板与短代码集合。

- 💻 演示站点：[blog.demius.tech](https://blog.demius.tech)
- 📸 截图：`images/screenshot.png` · `images/tn.png`

> **本仓库是 Demius 主题的完整源码仓库**，包含主题的所有文件。你可以通过 Git 子模块、直接下载或 Hugo Modules 的方式将其作为主题使用。

---

## ✨ 主要特性

- **瀑布流/双栏/单栏主页切换**，支持文章卡片透明/毛玻璃模式
- **浮动工具条 + 沉浸阅读 + PJAX 无刷新跳转**
- **多级导航 + 顶部公告 + 自定义弹窗**
- **数据驱动页面**：音乐星球、追番星球、装备、友圈、说说、愿望清单、支持者等
- **丰富短代码**：按钮、时间线、折叠、选项卡、局部加密、视频/音乐嵌入
- **侧栏组件**：访客信息、随机语录、热门/最新文章、目录、社交媒体、广告位
- **全站灰度、字体、背景、评论、打赏、浮动音乐播放器等 80+ 开关式配置**

---

## 📁 仓库结构

```
demius/                    # 主题源码仓库
├── archetypes/                 # 默认 Front Matter 模板
├── assets/                     # 原子化 CSS / JS
├── layouts/                    # 页面、分区、短代码与组件
├── static/                     # 主题内置静态资源（图标、音频、avatar 等）
├── content/                    # 示例内容（用于主题开发测试）
├── demius2/                    # 示例页面和数据文件
│   ├── content/                # 示例页面内容
│   └── data/                   # 示例数据文件
├── yilai/                      # 站点配置文件（需复制到站点根目录）
│   ├── package.json            # Node.js 依赖配置
│   ├── postcss.config.js       # PostCSS 配置
│   ├── go.mod                  # Go 模块配置
│   └── scripts/                # CSS 合并脚本
├── hugo.toml                   # 站点配置文件（需复制到站点根目录）
├── theme.toml                  # 主题元数据（可删除）
├── images/                     # 主题截图（可删除）
└── LICENSE                     # MIT 许可证
```

> **注意**：`theme.toml` 和 `images/` 目录仅用于 Hugo 官方主题库，与主题使用无关，可以删除。

---

## 🚀 快速开始

### 环境要求

- **Hugo 版本**：`0.146.0` 或更高版本
- **Hugo Extended**：推荐使用 Extended 版本（支持 PostCSS/SCSS 处理）
- **Node.js**：`16.x` 或更高版本（如果使用 Hugo 非 Extended 版本，需要用于 CSS 合并）

### 安装方式

#### 方式 1：作为主题使用（推荐）

1. 从 GitHub 下载本仓库的压缩包（或使用 `git clone`）并解压
2. 将整个仓库文件夹重命名为 `demius`，并复制到你的 Hugo 站点根目录下的 `themes/` 目录中（即 `themes/demius/`）
3. 将 `yilai/` 文件夹下的**所有内容**（`package.json`、`postcss.config.js`、`go.mod`、`scripts/` 等）复制到你的站点根目录
4. 将 `hugo.toml` 文件复制到你的站点根目录，替换原有的配置文件

#### 方式 2：作为 Git 子模块引入

在你的 Hugo 站点根目录下执行：

```bash
git submodule add https://github.com/demius782/demius-blog.git themes/demius
```

然后在你的站点配置文件（`hugo.toml` 或 `config.toml`）中添加：

```toml
theme = "demius"
```

> **注意**：使用此方式时，你仍需要将 `yilai/` 文件夹的内容和 `hugo.toml` 复制到站点根目录。

#### 方式 3：使用 Hugo Modules

1. **初始化 Hugo Modules**（如果还没有初始化）：

```bash
hugo mod init github.com/your-username/your-site
```

> 将 `github.com/your-username/your-site` 替换为你自己的模块路径

2. **获取主题模块**：

```bash
hugo mod get github.com/demius782/demius-blog
```

3. **在配置文件（`hugo.toml` 或 `config.toml`）中添加**：

```toml
[[module.imports]]
  path = "github.com/demius782/demius-blog"
```

或直接使用：

```toml
theme = "demius"
```

> **注意**：使用此方式时，你仍需要将 `yilai/` 文件夹的内容和 `hugo.toml` 复制到站点根目录。使用 Hugo Modules 的好处是可以自动管理主题更新，运行 `hugo mod get -u` 即可更新到最新版本。

### 使用示例内容（可选）

如果需要使用示例页面和数据来快速了解主题功能：

1. 将 `demius2/content/` 目录下的所有文件复制到你站点的 `content/` 目录中
2. 将 `demius2/data/` 目录下的所有文件复制到你站点的 `data/` 目录中

这些示例文件包括各种页面模板（关于、相册、装备、音乐星球等）和数据文件示例（轮播图、相册、装备、追番等）。

---

## 📖 详细文档

详细的配置说明、页面设置、数据文件配置和开发指南，请查看主题站点：[Demius 主题配置](https://blog.demius.tech/)

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
