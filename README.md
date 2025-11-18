# Hugo Demius 主题使用说明

## 📖 主题介绍

Hugo Demius 是一个功能丰富、设计精美的 Hugo 主题，专为个人博客和内容网站设计。主题采用现代化的三栏布局，支持多种功能模块，提供优秀的用户体验。

## 🧰 从整站仓库导出主题

如果你在同一仓库中维护完整博客与主题源码，可按以下流程将 `themes/demius` 导出成独立包再推送到 GitHub：

1. **准备示例站点**  
   - 确认 `themes/demius/exampleSite/` 可独立运行，尤其是 `data/*.yaml` 中的演示信息是否脱敏。  
   - 运行 `hugo server --source themes/demius/exampleSite --themesDir ../..` 检查页面是否正常。
2. **使用脚本复制主题**  
   ```bash
   python scripts/export_theme.py --output dist/demius-theme --zip
   ```  
   - `--output` 指定导出目录（默认 `dist/demius-theme`）。  
   - `--zip` 可选，会生成同名 ZIP 便于上传 release。  
   - 脚本会自动排除 `.git/`、`.github/`、`__pycache__` 等临时文件。
3. **初始化独立仓库并推送**  
   ```bash
   cd dist/demius-theme
   git init
   git remote add origin git@github.com:demius782/demius.git
   git add .
   git commit -m "release: demius vX.Y.Z"
   git push -u origin main
   ```
4. **发布新版本**  
   - 更新 `themes/demius/theme.toml` 中的 `version`、`min_version`。  
   - 创建 GitHub Release，并附上脚本生成的 ZIP 包。  
   - 如使用 Hugo Modules，运行 `hugo mod get -u github.com/demius782/demius`.

> 如果只需快速覆盖线上主题，也可以直接复制 `themes/demius`，但推荐使用脚本保持流程一致且可复现。

## 📚 演示与文档

主题的演示站点和全部配置文档都统一发布在博主的个人博客，保持实时更新：

- https://blog.demius.tech

- 版本号和变更日志以 [`Demius 主题更新日志`](https://blog.demius.tech/posts/ejcubuy9.html/) 为准，仓库仅同步主题源码。

开源仓库仅包含主题源码及基础页面，不再附带示例文章。

### ✨ 主要特性

- 🎨 **现代化设计**：简洁美观的界面设计，支持暗色/亮色主题切换
- 📱 **响应式布局**：完美适配桌面、平板和移动设备
- ⚡ **PJAX 支持**：无刷新页面切换，提升用户体验
- 🎯 **功能丰富**：评论系统、搜索功能、目录导航、相关文章等
- 🔧 **高度可定制**：丰富的配置选项，满足不同需求
- 🚀 **性能优化**：快速加载，SEO 友好

## 🚀 快速开始

### 环境要求

- Hugo 0.100.0 或更高版本
- Git

### 安装步骤

1. **克隆主题**
   ```bash
   git clone https://github.com/demius782/demius.git themes/demius
   ```

2. **复制配置文件**
   ```bash
   cp themes/demius/exampleSite/hugo.toml ./
   ```

3. **启动开发服务器**
   ```bash
   hugo server -D
   ```

4. **访问网站**
   打开浏览器访问 `http://localhost:1313`

## ⚙️ 配置说明

### 基础配置

#### 站点信息
```toml
baseURL = 'https://your-domain.com'  # 网站域名
languageCode = 'zh-CN'               # 网站语言
title = '你的网站标题'                # 网站标题
theme = 'demius'                     # 主题名称
```

#### 作者信息
```toml
[params]
  author = "你的名字"                 # 作者名称
  description = "网站描述"            # 网站描述，用于SEO
```

### 功能开关

#### 主题模式
```toml
[params]
  darkMode = true                    # 默认暗色模式
  tocOpen = true                     # 目录默认展开
  pjax = true                        # 启用无刷新切换
  stickyHeader = true                # 页面下滑时导航栏固定在顶部
```

**导航栏固定说明：**
- `stickyHeader = true`：启用导航栏固定功能，页面向下滚动时导航栏会固定在顶部
- `stickyHeader = false`：禁用导航栏固定功能，导航栏随页面滚动
- 固定时导航栏会有平滑的下滑动画效果
- 兼容PJAX，页面切换时自动重新初始化

#### 布局设置
```toml
[params]
  homeColumns = 3                    # 首页列数：1=单列|2=双列|3=瀑布流
  summaryLength = 120                # 文章摘要长度
```

### 侧边栏配置

#### 组件顺序
```toml
[params.aside]
  left = ["author","announcement","social-Media","recent-Comments","popular-Posts","advertisement"]
  right = ["search","toc","related-Posts","tags", "recent-Posts","categories", "archive"]
```

#### 组件开关
```toml
[params.aside]
  showAuthor = true                  # 作者信息
  showToc = true                     # 目录组件
  showTags = true                    # 标签云
  showRecent = true                  # 最新文章
  showSearch = false                 # 搜索组件
  showCategories = true              # 分类组件
  showArchive = true                 # 归档组件
  showPopularPosts = true            # 热门文章
  showRelatedPosts = true            # 相关文章
  showSocialMedia = false            # 社交媒体
  showAdvertisement = false          # 广告位
  showAnnouncement = true            # 公告栏
```

### 主页大图配置

#### 基础设置
```toml
[params.homeBigImage]
  enable = true                      # 启用主页大图
  mode = "mode2"                     # 模式：mode1 或 mode2
  title = "网站标题"                 # 大图标题
  subtitle = "网站副标题"            # 大图副标题
```

#### 模式一配置（中间栏大图）
```toml
[params.homeBigImage.mode1]
  backgroundImage = "/img/index.png" # 背景图片
  arrowAnimation = false             # 导航箭头
  scrollSpeed = 500                  # 滚动速度
  cardAnimation = true               # 卡片动画
  cardAnimationSpeed = "normal"      # 动画速度
```

#### 模式二配置（全屏大图）
```toml
[params.homeBigImage.mode2]
  fullScreen = true                  # 全屏显示
  overlayOpacity = 0.5               # 遮罩透明度
  customBackgroundImage = "/img/index.png"  # 自定义背景图
  
  # 打字机效果配置（仅Mode2模式的副标题）
  typewriterEnable = true            # 启用打字机效果
  typewriterSpeed = 100              # 打字速度（毫秒/字符，建议50-200）
  typewriterDelay = 1000             # 开始延迟（毫秒，建议500-2000）
  typewriterCursor = true            # 显示闪烁光标
  typewriterLoop = false             # 循环播放
```

### 背景图配置

#### 整站背景
```toml
[params.background]
  effect_mode = "transparent"        # 效果模式：transparent|glass|translucent|solid

[params.background.site]
  enable = true                      # 启用背景图
  image = "背景图URL"                # 背景图片
  blur = 0                           # 模糊程度
  brightness = 100                   # 亮度
  opacity = 70                       # 透明度
```

### 评论系统配置

#### Artalk 配置
```toml
[params.comment]
  enable = true                      # 启用评论
  system = "artalk"                  # 评论系统

[params.comment.artalk]
  server = "https://your-artalk-server.com"  # 服务器地址
  site = "your-site-name"            # 站点名称
  placeholder = "说点什么吧~"         # 输入提示
  darkMode = true                    # 暗色模式
  locale = "zh-CN"                   # 语言
  gravatar = "mp"                    # 头像源
  pageSize = 10                      # 每页评论数
  emoticons = true                   # 表情包
  heightLimit = 500                  # 最大高度
  useLocal = true                    # 使用本地资源
```

### 社交链接配置

```toml
[params.social]
  links = [
    { name = "GitHub", icon = "fab fa-github", url = "https://github.com/username", color = "#333333" },
    { name = "微博", icon = "fab fa-weibo", url = "https://weibo.com/username", color = "#e6162d" },
    { name = "邮箱", icon = "fas fa-envelope", url = "mailto:email@example.com", color = "#ea4335" },
    { name = "RSS", icon = "fas fa-rss", url = "/index.xml", color = "#ffa500" }
  ]
```

### 菜单配置

#### 主导航菜单
```toml
[menu]
  [[menu.main]]
    name = "首页"
    url = "/"
    weight = 1
    [menu.main.params]
      icon = "/img/icons/home.svg"

  [[menu.main]]
    name = "归档"
    url = "/posts/"
    weight = 2
    [menu.main.params]
      icon = "/img/icons/blog.svg"
```

#### 多级菜单
```toml
[menu]
  [[menu.main]]
    name = "项目"
    identifier = "projects"
    weight = 6
    [menu.main.params]
      icon = "/img/icons/mr.svg"

  [[menu.main]]
    name = "Web开发"
    url = "/projects/web/"
    weight = 1
    parent = "projects"
    [menu.main.params]
      icon = "/img/icons/mr.svg"
```

### 浮动按钮配置

现代化的悬浮按钮设计，优化了位置和自适应性，避免遮挡内容。

```toml
[params.floatButtons]
  position = "right"                  # 位置：left 或 right
  showBackToTop = true                # 返回顶部按钮
  showThemeToggle = true              # 主题切换按钮
  showSidebarToggle = true            # 侧边栏切换按钮
```

**按钮布局说明：**
- **设置按钮**（齿轮图标）：位于最底部，点击可展开/收起其他功能按钮
- **回到顶部按钮**：滚动页面后出现，与设置按钮在同一位置，优先级更高
- **主题切换按钮**：在设置按钮上方，用于切换亮色/暗色主题
- **侧边栏切换按钮**：在主题切换按钮上方，用于显示/隐藏左右侧边栏
- 所有按钮都有现代化的SVG图标和渐变悬停效果
- 自动适配不同屏幕尺寸，避免遮挡右侧栏

#### 特性说明

- ✅ **现代化图标**：使用 SVG 图标，清晰美观
- ✅ **渐变色悬停**：每个按钮有独特的渐变色效果
- ✅ **智能定位**：自动避让右侧栏，不会遮挡内容
- ✅ **完美自适应**：
  - 桌面 (>1024px)：按钮尺寸 3rem，距离右侧 1.5rem
  - 平板 (768-1023px)：按钮尺寸 2.75rem，距离右侧 0.75rem
  - 手机 (<768px)：按钮尺寸 2.5rem，距离右侧 0.5rem
  - 超小屏 (<480px)：按钮尺寸 2.25rem，紧贴边缘
- ✅ **毛玻璃效果**：支持背景模糊效果
- ✅ **流畅动画**：悬停、点击、展开动画流畅自然
- ✅ **键盘导航**：支持键盘焦点导航，无障碍友好

### 公告配置

```toml
[params.announcement]
  enable = true                       # 启用公告
  important = false                   # 重要公告
  title = "公告标题"                  # 公告标题
  content = "公告内容"                # 公告内容
  date = "2024-01-01"                 # 公告日期
  [params.announcement.link]
    text = "了解更多"                 # 链接文本
    url = "/about"                    # 链接地址
```

### 广告配置

```toml
[params.advertisement]
  enable = true                       # 启用广告
  title = "推荐产品"                  # 广告标题
  description = "产品描述"            # 广告描述
  image = "广告图片URL"               # 广告图片
  link = "广告链接"                   # 广告链接
```

## 📁 目录结构

```
your-site/
├── content/                    # 内容目录
│   ├── posts/                 # 文章目录
│   ├── about.md               # 关于页面
│   ├── links.md               # 友链页面
│   └── shuoshuo.md            # 说说页面
├── static/                    # 静态资源
│   └── img/                   # 图片资源
├── themes/
│   └── demius/                # 主题目录
├── hugo.toml                  # 配置文件
└── README.md                  # 说明文档
```

## 🎨 自定义样式

### 添加自定义CSS

在 `static/css/custom.css` 中添加自定义样式：

```css
/* 自定义样式 */
.custom-class {
  color: #ff6b6b;
  font-size: 16px;
}
```

### 修改主题颜色

在 `hugo.toml` 中配置CSS变量：

```toml
[params]
  customCSS = ["/css/custom.css"]
```

## 📝 内容管理

### 创建文章

```bash
hugo new posts/my-post.md
```

### 文章前置参数

```yaml
---
title: "文章标题"
date: 2024-01-01T00:00:00Z
draft: false
categories: ["分类1", "分类2"]
tags: ["标签1", "标签2"]
cover: "/img/cover.jpg"
---
```

### 创建页面

```bash
hugo new about.md
hugo new links.md
hugo new shuoshuo.md
hugo new gallery.md
```

## 🎠 轮播图功能

### 功能特性

- ✅ **文章轮播**：通过文章 slug 自动读取文章信息
- ✅ **图片轮播**：支持纯图片轮播，自定义标题和描述
- ✅ **双向切换**：支持左右切换和上下切换两种模式
- ✅ **自动播放**：可配置自动播放和播放间隔
- ✅ **触摸支持**：支持鼠标拖动和触摸滑动
- ✅ **键盘控制**：支持方向键导航
- ✅ **响应式设计**：完美适配各种屏幕尺寸
- ✅ **PJAX 兼容**：完美支持无刷新页面切换

### 配置方法

在 `hugo.toml` 中配置轮播图：

```toml
[params.carousel]
  enable = true                        # 是否启用轮播图
  height = 200                         # 轮播图高度(px)
  autoplay = true                      # 是否自动播放
  interval = 5000                      # 自动播放间隔(毫秒)
  direction = "horizontal"             # 切换方向：horizontal(左右) / vertical(上下)
  showOnPages = ["home"]               # 显示页面：["home"] / ["all"] / ["home", "posts"]
  
  # 文章轮播项
  [[params.carousel.items]]
    type = "post"                      # 类型：post
    slug = "文章slug"                  # 文章的slug字段值
  
  # 图片轮播项
  [[params.carousel.items]]
    type = "image"                     # 类型：image
    image = "图片URL"                  # 图片路径
    title = "图片标题"                 # 可选
    description = "图片描述"           # 可选
    link = "/链接地址/"                # 点击跳转链接（可选）
```

### 配置参数说明

#### 基础配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | boolean | false | 是否启用轮播图 |
| `height` | number | 200 | 轮播图高度（像素） |
| `autoplay` | boolean | true | 是否自动播放 |
| `interval` | number | 5000 | 自动播放间隔（毫秒） |
| `direction` | string | "horizontal" | 切换方向：horizontal / vertical |
| `showOnPages` | array/string | ["home"] | 显示在哪些页面："home"(首页) / "posts"(文章页) / "all"(所有页面) / ["home", "posts"] |

#### 轮播项配置

**文章类型（type = "post"）**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | 是 | 固定为 "post" |
| `slug` | string | 是 | 文章的slug字段值 |

**图片类型（type = "image"）**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | 是 | 固定为 "image" |
| `image` | string | 是 | 图片URL |
| `title` | string | 否 | 图片标题 |
| `description` | string | 否 | 图片描述 |
| `link` | string | 否 | 点击跳转链接 |

### 使用技巧

1. **文章slug获取**：文章的slug通常在文章front matter中定义，或由文件名自动生成
2. **切换方向**：
   - `horizontal`：左右滑动，适合文章展示（控件在底部居中）
   - `vertical`：上下滑动，适合图片展示（控件在右侧垂直排列）
3. **显示页面控制**：
   - `"home"`：只在首页显示
   - `"posts"`：只在文章详情页显示
   - `"all"`：在所有页面显示
   - `["home", "posts"]`：在首页和文章页显示
4. **自动播放**：鼠标悬停时自动暂停，移开后继续
5. **键盘控制**：
   - `←` / `→`：左右切换（horizontal模式）
   - `↑` / `↓`：上下切换（vertical模式）
6. **触摸滑动**：移动端支持手指滑动切换
7. **性能优化**：图片使用懒加载，优化页面性能

### 示例配置

```toml
[params.carousel]
  enable = true
  height = 200
  autoplay = true
  interval = 5000
  direction = "horizontal"
  showOnPages = ["home"]
  
  # 混合轮播：文章 + 图片
  [[params.carousel.items]]
    type = "post"
    slug = "demius主题使用文档"
  
  [[params.carousel.items]]
    type = "image"
    image = "https://example.com/banner.jpg"
    title = "欢迎访问"
    description = "探索更多精彩内容"
    link = "/posts/"
  
  [[params.carousel.items]]
    type = "post"
    slug = "hugo-快速入门"
```

## 📷 相册页面

### 功能特性

- ✅ **分组管理**：支持多个相册分组，每个分组独立命名
- ✅ **精选置顶**：可设置精选相册，自动置顶显示
- ✅ **自定义封面**：每个相册组可设置独立封面
- ✅ **图片查看器**：内置 Lightbox 查看器，支持键盘和手势控制
- ✅ **响应式设计**：完美适配桌面、平板、手机
- ✅ **懒加载**：图片懒加载，优化页面性能
- ✅ **PJAX 兼容**：完美支持无刷新页面切换

### 配置方法

在 `data/gallery.yaml` 文件中配置相册：

```yaml
groups:
  # 相册组1
  - name: "旅行足迹"
    description: "记录旅行中的美好瞬间"
    featured: true              # 精选相册，置顶显示
    cover: "https://example.com/cover.jpg"  # 相册封面
    photos:
      - url: "https://example.com/photo1.jpg"
        title: "照片标题"
        description: "照片描述"
        date: "2024-01-01"
      
      - url: "https://example.com/photo2.jpg"
        title: "照片标题2"
        description: "照片描述2"
        date: "2024-01-02"
  
  # 相册组2
  - name: "日常生活"
    description: "记录生活中的点点滴滴"
    featured: false
    cover: "https://example.com/cover2.jpg"
    photos:
      - url: "https://example.com/photo3.jpg"
        title: "生活照"
        description: "美好的一天"
        date: "2024-02-01"
```

### 配置参数说明

#### 相册组参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 相册组名称 |
| `description` | string | 否 | 相册组描述 |
| `featured` | boolean | 否 | 是否为精选相册（置顶） |
| `cover` | string | 是 | 相册封面图片 URL |
| `photos` | array | 是 | 照片列表 |

#### 照片参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | string | 是 | 照片 URL |
| `title` | string | 否 | 照片标题 |
| `description` | string | 否 | 照片描述 |
| `date` | string | 否 | 拍摄日期 |

### 使用技巧

1. **精选相册**：将 `featured` 设为 `true` 可以让相册置顶显示
2. **图片优化**：建议使用 WebP 格式和适当的图片尺寸（推荐 1200px 宽度）
3. **懒加载**：图片会自动懒加载，提升页面性能
4. **键盘控制**：
   - `←` / `→`：切换上一张/下一张
   - `Esc`：关闭查看器
5. **图片加载失败**：会自动使用 404 备用图片

## 🔧 高级配置

### 搜索功能

```toml
[params.search]
  engine = "local"               # 搜索引擎
  indexPath = "/index.json"      # 索引路径

[outputs]
  home = ["HTML", "JSON"]        # 输出格式
```

### 相关文章

```toml
[related]
  threshold = 80                 # 相关性阈值
  includeNewer = true            # 包含新文章
  toLower = true                 # 忽略大小写
  
  [[related.indices]]
    name = "tags"
    weight = 100
  
  [[related.indices]]
    name = "categories"
    weight = 80
```

### 归档配置

```toml
[params.aside.archive]
  defaultOpenCurrentYear = true   # 展开当前年份
  defaultOpenCurrentMonth = false # 展开当前月份
  showStats = true                # 显示统计
  groupBy = "month"               # 分组方式
```

## 🚀 部署

### GitHub Pages

1. 创建 GitHub 仓库
2. 配置 GitHub Actions
3. 推送代码自动部署

### Netlify

1. 连接 GitHub 仓库
2. 配置构建命令：`hugo --minify`
3. 设置发布目录：`public`

### Vercel

1. 导入 GitHub 仓库
2. 配置构建设置
3. 自动部署

## 🐛 常见问题

### Q: 如何修改主题颜色？
A: 在 `static/css/custom.css` 中覆盖CSS变量：

```css
:root {
  --primary-color: #your-color;
}
```

### Q: 如何添加新的侧边栏组件？
A: 在 `themes/demius/layouts/partials/aside/widgets/` 中创建新组件，然后在配置中添加。

### Q: 如何自定义主页布局？
A: 修改 `themes/demius/layouts/index.html` 文件。

### Q: 评论系统不显示怎么办？
A: 检查 Artalk 服务器配置和网络连接。

### Q: PJAX 功能异常怎么办？
A: 检查浏览器控制台错误，确保所有JavaScript文件正确加载。

## 📞 支持与反馈

- 📧 邮箱：your-email@example.com
- 🐛 问题反馈：[GitHub Issues](https://github.com/your-username/hugo-demius-theme/issues)
- 💬 讨论：[GitHub Discussions](https://github.com/your-username/hugo-demius-theme/discussions)

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

感谢所有为 Hugo 和开源社区做出贡献的开发者们！

---

**Hugo Demius 主题** - 让内容创作更简单，让网站更美观！
