# 搜索引擎 URL 提交功能使用指南

## 📖 功能简介

本功能参考了 [hexo-submit-urls-to-search-engine](https://github.com/cjh0613/hexo-submit-urls-to-search-engine) 插件，为 Hugo 站点实现了自动提交新文章 URL 到 Google、Bing、Baidu 搜索引擎的功能，提升网站收录质量和速度。

## 🚀 快速开始

### 1. 配置脚本

打开 `submit_urls_to_search_engine.py` 文件，在脚本顶部的配置区域修改以下配置：

```python
# ====================== 配置参数（请在脚本顶部修改） ======================

# 提交条件设置
SUBMIT_CONDITION = "count"          # 提交条件：count（按数量）| period（按时间）
COUNT = 10                          # 提交最新 N 篇文章（当 SUBMIT_CONDITION="count" 时生效）
PERIOD = 900                        # 提交修改时间在 N 秒内的文章（当 SUBMIT_CONDITION="period" 时生效）

# 搜索引擎开关
GOOGLE = 0                          # 是否提交到 Google：1（是）| 0（否）
BING = 1                            # 是否提交到 Bing：1（是）| 0（否）
BAIDU = 1                           # 是否提交到 Baidu：1（是）| 0（否）

# Baidu 配置
BAIDU_HOST = "https://blog.demius.tech"     # 在百度站长平台注册的域名
BAIDU_TOKEN = "your_baidu_token"            # 百度推送接口的调用地址（请勿在公开仓库中暴露此密钥！）

# Bing 配置
BING_HOST = "https://blog.demius.tech"      # 在 Bing 站长平台注册的域名
BING_TOKEN = "your_bing_token"              # Bing API Key（请勿在公开仓库中暴露此密钥！）
BING_ENABLE_INDEXNOW = False                 # 是否启用 Bing IndexNow 功能：True（是）| False（否）

# Google 配置
GOOGLE_HOST = "https://blog.demius.tech"    # 在 Google Search Console 注册的域名
GOOGLE_KEY_FILE = "google-key.json"         # Google API 密钥 JSON 文件路径（请勿在公开仓库中暴露此文件！）
GOOGLE_PROXY = ""                            # Google API 使用的代理（可选，留空则不使用代理）
```

### 2. 获取各搜索引擎的 Token/Key

#### Baidu（百度）

1. 访问 [百度站长平台](https://ziyuan.baidu.com/)
2. 登录并添加网站
3. 在"数据引入" -> "链接提交" -> "接口调用"中获取 Token
4. 将 Token 填入 `baidu_token`

#### Bing（必应）

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters/)
2. 登录并添加网站
3. 在"设置" -> "API 访问"中获取 API Key
4. 将 API Key 填入 `bing_token`

**注意：** 如果启用 `bing_enable_indexnow`，需要在网站根目录放置 `{bing_token}.txt` 文件，文件内容为 Token 值。

#### Google（谷歌）

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 登录并添加网站
3. 创建服务账号并下载 JSON 密钥文件
4. 将 JSON 文件路径填入 `google_key_file`

**注意：** Google 提交功能需要完整的 OAuth2 实现，当前版本为简化实现，建议使用官方 API 或环境变量配置。

### 3. 运行脚本

#### 方式一：使用 npm 脚本（推荐）

```bash
# 仅提交 URL（不构建）
npm run submit-urls

# 构建并提交 URL
npm run build:submit
```

#### 方式二：直接运行 Python 脚本

```bash
# 构建站点
hugo --cleanDestinationDir

# 提交 URL
python submit_urls_to_search_engine.py
```

**注意：** 需要 Python 3.6 或更高版本

### 4. 验证提交

运行脚本后，会输出提交结果：

```
🚀 开始提交 URL 到搜索引擎...

📋 找到 35 篇文章

📝 筛选后 10 个 URL 待提交

📤 正在提交到 Bing...
✅ Bing 提交成功
Bing response: { d: null }

📤 正在提交到 Baidu...
✅ Baidu 提交成功
Baidu response: {"remain":2999,"success":1}

✨ 完成！
```

## 📝 配置说明

### 提交条件

- **`SUBMIT_CONDITION = "count"`**：按文章数量提交
  - `COUNT`：提交最新的 N 篇文章（默认 10 篇）

- **`SUBMIT_CONDITION = "period"`**：按时间范围提交
  - `PERIOD`：提交修改时间在 N 秒内的文章（默认 900 秒，即 15 分钟）

### 搜索引擎开关

- **`GOOGLE = 1`**：启用 Google 提交
- **`BING = 1`**：启用 Bing 提交
- **`BAIDU = 1`**：启用 Baidu 提交

### URL 替换

如果需要替换 URL 中的部分内容（例如将 `http://` 替换为 `https://`），在脚本顶部配置：

```python
REPLACE = 1
FIND_WHAT = "http://blog.demius.tech"
REPLACE_WITH = "https://blog.demius.tech"
```

### 文件保存

提交的 URL 会自动保存到 `submit_urls.txt` 文件中，可通过 `TXT_PATH` 配置修改保存路径。

## 🔐 安全提示

**重要：** 不要在公开仓库中暴露以下敏感信息：

- `baidu_token`：百度推送接口 Token
- `bing_token`：Bing API Key
- `google_key_file`：Google API 密钥文件路径

**建议使用环境变量：**

```bash
# Windows (PowerShell)
$env:BAIDU_TOKEN="your_token"
$env:BING_TOKEN="your_token"
$env:GOOGLE_KEY_FILE="path/to/key.json"

# Linux/Mac
export BAIDU_TOKEN="your_token"
export BING_TOKEN="your_token"
export GOOGLE_KEY_FILE="path/to/key.json"
```

环境变量的优先级高于配置文件中的值。

## ❓ 常见问题

### Q: 提交失败怎么办？

**A:** 检查以下几点：

1. **Token/Key 是否正确**
   - 检查各搜索引擎的 Token/Key 是否填写正确
   - 确认 Token/Key 是否已过期

2. **域名是否已注册**
   - 确认在各搜索引擎站长平台已添加并验证网站

3. **网络连接**
   - 检查网络连接是否正常
   - 某些搜索引擎可能需要代理访问

### Q: 如何查看提交历史？

**A:** 查看 `submit_urls.txt` 文件，其中保存了所有提交的 URL。

### Q: Google 提交不工作？

**A:** Google 提交功能需要完整的 OAuth2 实现，当前版本为简化版本。建议：

1. 使用 Google Search Console 的官方 API
2. 或使用环境变量配置完整的 Google 认证信息

### Q: 如何自动化提交？

**A:** 可以通过以下方式自动化：

1. **GitHub Actions**：在 `.github/workflows/deploy.yml` 中添加提交步骤
2. **本地脚本**：使用 `npm run build:submit` 命令
3. **定时任务**：使用 cron 或 Windows 任务计划程序

## 🔗 相关文档

- [hexo-submit-urls-to-search-engine 官方文档](https://github.com/cjh0613/hexo-submit-urls-to-search-engine)
- [百度站长平台](https://ziyuan.baidu.com/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/)
- [Google Search Console](https://search.google.com/search-console)

---

希望这个功能能够帮助您提升网站收录质量和速度！🚀

