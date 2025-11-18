# TOML 配置顺序问题修复

## 🐛 问题描述

**现象：** 页脚自定义内容（`custom`）没有显示

**原因：** TOML 配置文件的顺序问题

---

## 🔍 问题分析

### TOML 语法规则

在 TOML 中，一旦定义了子表（例如 `[params.footer.runningTime]`），之后的所有键值对都会被归属到这个子表中，直到遇到新的表定义。

### 错误的配置顺序

```toml
[params.footer]
  # beian = "粤ICP备12345678号"
  
  [params.footer.runningTime]    # ← 定义子表
    enable = true
    startDate = "2024-01-01"
    prefix = "本站已运行"
  
  custom = """                    # ❌ 错误！这会被当作 runningTime 的属性
    <div class="footer-links">
      <a href="/about">关于</a>
    </div>
  """
```

**问题：** `custom` 会被解析为 `params.footer.runningTime.custom`，而不是 `params.footer.custom`

---

## ✅ 解决方案

### 正确的配置顺序

**方法：将 `custom` 放在子表定义之前**

```toml
[params.footer]
  # beian = "粤ICP备12345678号"
  
  # 自定义内容（在子表之前定义）
  custom = """                    # ✅ 正确！属于 params.footer
    <div class="footer-links">
      <a href="/about">关于</a>
      <a href="/privacy">隐私政策</a>
      <a href="/sitemap.xml">网站地图</a>
    </div>
  """
  
  # 运行时间显示配置（子表放在最后）
  [params.footer.runningTime]    # ← 子表定义放在最后
    enable = true
    startDate = "2024-01-01"
    prefix = "本站已运行"
```

---

## 📊 配置层级说明

### 正确的层级结构

```
params.footer
  ├── beian (字符串，可选)
  ├── custom (字符串，HTML内容)
  └── runningTime (子表)
      ├── enable (布尔值)
      ├── startDate (字符串)
      └── prefix (字符串)
```

### Hugo 模板访问方式

```go
{{ .Site.Params.footer.custom }}              // ✅ 能访问到
{{ .Site.Params.footer.runningTime.enable }}  // ✅ 能访问到
```

---

## 💡 关键要点

### TOML 配置的黄金规则

1. **父级键值对在前** - 先定义父表的直接属性
2. **子表定义在后** - 子表定义要放在所有父级属性之后
3. **顺序很重要** - 一旦定义子表，后续内容都归属于该子表

### 常见错误模式

```toml
❌ 错误示例 1：子表之后定义父级属性
[params.footer]
  [params.footer.runningTime]
    enable = true
  custom = "..."  # 会被当作 runningTime 的属性

❌ 错误示例 2：混乱的顺序
[params.footer]
  custom1 = "..."
  [params.footer.runningTime]
    enable = true
  custom2 = "..."  # custom2 会被当作 runningTime 的属性

✅ 正确示例：所有父级属性在前
[params.footer]
  custom1 = "..."
  custom2 = "..."
  [params.footer.runningTime]
    enable = true
```

---

## 🔧 修复步骤

### 步骤 1：识别问题

检查配置文件，找出父级属性和子表定义的顺序。

### 步骤 2：调整顺序

将所有父级直接属性移到子表定义之前。

### 步骤 3：重新构建

```bash
hugo --cleanDestinationDir
hugo server
```

### 步骤 4：验证结果

检查生成的 HTML 中是否包含自定义内容：

```bash
# Windows
findstr /C:"footer-custom" public\index.html

# Linux/Mac
grep "footer-custom" public/index.html
```

---

## 📝 完整配置示例

### 页脚完整配置（正确顺序）

```toml
# ===== 页脚配置 =====
[params.footer]
  # 备案信息（可选）
  beian = "京ICP备2024012345号"
  
  # 自定义内容（HTML）
  custom = """
    <div class="footer-links">
      <a href="/about">关于</a>
      <a href="/privacy">隐私政策</a>
      <a href="/sitemap.xml">网站地图</a>
      <a href="/links">友链</a>
    </div>
  """
  
  # 运行时间显示配置（子表，放在最后）
  [params.footer.runningTime]
    enable = true
    startDate = "2024-01-01"
    prefix = "本站已运行"
```

---

## ✅ 验证清单

修复后，请验证以下内容：

- [x] 版权信息显示正常（年份范围）
- [x] 运行时间动态更新
- [x] 自定义链接正常显示
- [x] 备案信息显示（如有配置）
- [x] 所有链接可点击
- [x] 样式正常渲染

---

## 🎯 最终效果

```
─────────────────────────────────────
© 2024-2025 字·兮·书

本站已运行 365 天 12 时 34 分 56 秒

京ICP备2024012345号

关于  隐私政策  网站地图
─────────────────────────────────────
```

---

## 📚 相关文档

- [TOML 官方规范](https://toml.io/cn/)
- [Hugo 配置文档](https://gohugo.io/getting-started/configuration/)
- [页脚配置指南](docs/footer-guide.md)

---

## 💡 温馨提示

### 其他可能遇到的类似问题

如果您发现其他配置项也没有生效，请检查：

1. **是否在子表之后定义** - 移到子表之前
2. **缩进是否正确** - 使用2个空格缩进
3. **语法是否正确** - 多行字符串用 `"""`

### 配置建议

- ✅ 简单属性（字符串、数字、布尔）放在前面
- ✅ 子表定义放在最后
- ✅ 相关配置分组注释
- ✅ 使用一致的缩进（2个空格）

---

**问题已解决！** ✅

**修复内容：**
- 调整配置顺序
- `custom` 移到 `runningTime` 之前
- 重新构建站点

**服务器运行中：** `http://localhost:1313`

**请刷新浏览器查看自定义链接！**

---

**最后更新：** 2025-10-25

