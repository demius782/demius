# 网友圈 JSON 数据生成说明

## 简介

参考 [Friend-Circle-Lite](https://github.com/willow-god/Friend-Circle-Lite) 方案，使用 Python 脚本从友链 RSS 抓取文章并生成 `all.json` 文件，避免前端 CORS 限制。

## 安装依赖

```bash
pip install -r requirements-friends-circle.txt
```

或者手动安装：

```bash
pip install feedparser pyyaml requests
```

## 使用方法

### 1. 配置友链 RSS

确保 `data/links.yaml` 文件中每个需要抓取的友链都配置了 `rss` 字段：

```yaml
groups:
  - name: "技术博客"
    links:
      - name: "站点名称"
        url: "https://example.com"
        avatar: "/img/avatar.png"
        rss: "https://example.com/index.xml"  # 必须配置 RSS 地址
```

### 2. 运行脚本生成 JSON

```bash
python generate_friends_circle_json.py
```

脚本会：
1. 读取 `data/links.yaml` 文件
2. 抓取所有配置了 RSS 的友链文章
3. 生成 `public/all.json` 文件（Hugo 会自动部署）

### 3. 配置 Hugo

在 `hugo.toml` 中配置预生成 JSON 路径：

```toml
[params.friendsCircle]
  preGeneratedJsonUrl = "/all.json"  # 使用生成的 JSON 文件
```

### 4. 部署

运行 `hugo` 构建站点，`public/all.json` 会被包含在构建输出中。

## 自动更新

### 方案一：本地定时任务

**Windows (任务计划程序)**：
1. 打开"任务计划程序"
2. 创建基本任务
3. 设置触发器（如：每天凌晨2点）
4. 操作：启动程序
   - 程序：`python`
   - 参数：`generate_friends_circle_json.py`
   - 起始于：项目目录路径

**Linux/Mac (crontab)**：
```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天凌晨2点运行）
0 2 * * * cd /path/to/demius-blog && python generate_friends_circle_json.py && hugo
```

### 方案二：GitHub Actions（推荐）

创建 `.github/workflows/update-friends-circle.yml`：

```yaml
name: Update Friends Circle

on:
  schedule:
    - cron: '0 2 * * *'  # 每天 UTC 2:00 (北京时间 10:00)
  workflow_dispatch:  # 允许手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install -r requirements-friends-circle.txt
      
      - name: Generate JSON
        run: python generate_friends_circle_json.py
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/all.json
          git diff --staged --quiet || git commit -m "Update friends circle data [skip ci]"
          git push
```

## 配置说明

可以在脚本中修改以下配置：

```python
CONFIG = {
    'links_yaml': 'data/links.yaml',
    'output_json': 'public/all.json',
    'timeout': 10,  # RSS 请求超时时间（秒）
    'blog_org_group_names': ['博客组织'],
    'blog_org_article_days': 20,  # 博客组织显示最近N天内的文章
    'normal_friend_article_count': 3,  # 普通友链显示的文章数量
}
```

## JSON 格式

生成的 `all.json` 文件格式：

```json
{
  "articles": [
    {
      "title": "文章标题",
      "link": "https://example.com/post/1",
      "date": "2025-01-01T12:00:00",
      "siteName": "站点名称",
      "siteUrl": "https://example.com",
      "siteAvatar": "/img/avatar.png",
      "siteGroup": "技术博客",
      "description": "文章描述",
      "author": "作者名"
    }
  ],
  "generated_at": "2025-01-01T12:00:00",
  "total_count": 100,
  "sites_count": 10
}
```

## 故障排除

### 1. 某些 RSS 抓取失败

- 检查 RSS 地址是否正确
- 检查网络连接
- 某些站点可能限制了 User-Agent，脚本已设置默认 UA

### 2. 日期解析失败

脚本会自动使用当前时间作为备用日期，确保数据正常显示。

### 3. 生成的文件为空

- 检查 `data/links.yaml` 中是否有配置 `rss` 字段的友链
- 检查友链的 RSS 地址是否可访问
- 查看脚本输出的错误信息

## 参考

- [Friend-Circle-Lite](https://github.com/willow-god/Friend-Circle-Lite) - 友链朋友圈项目

