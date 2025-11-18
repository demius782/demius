# Umami API CORS 跨域问题解决方案

## 问题描述

当前访问 `https://umamiapi.demius.tech/` API时遇到CORS跨域错误：

```
Access to fetch at 'https://umamiapi.demius.tech/' from origin 'http://localhost:1313' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 问题原因

API服务器 (`https://umamiapi.demius.tech/`) 没有配置CORS响应头，导致浏览器阻止跨域请求。

## 解决方案

### 方案1：配置API服务器CORS（推荐）

在API服务器端添加CORS响应头。根据你的服务器类型选择：

#### Node.js/Express

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// 允许所有域名（开发环境）
app.use(cors());

// 或者只允许特定域名（生产环境推荐）
app.use(cors({
  origin: ['https://blog.demius.tech', 'http://localhost:1313'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
```

#### Nginx

在Nginx配置文件中添加：

```nginx
location /api/ {
    # 允许的来源
    add_header 'Access-Control-Allow-Origin' '*' always;
    # 或指定域名
    # add_header 'Access-Control-Allow-Origin' 'https://blog.demius.tech' always;
    
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    add_header 'Access-Control-Max-Age' 1728000 always;
    
    # 处理OPTIONS预检请求
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    # 代理到实际API
    proxy_pass http://localhost:3000;
}
```

#### Apache (.htaccess)

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

#### Cloudflare Workers

如果使用Cloudflare Workers作为API：

```javascript
export default {
  async fetch(request) {
    // 原始API响应
    const response = await fetch('https://your-actual-api.com/data');
    const data = await response.json();
    
    // 添加CORS头
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
};
```

### 方案2：使用代理（临时方案）

如果无法修改API服务器配置，可以通过代理来解决：

#### Hugo本地代理（不推荐，仅用于开发）

在Hugo项目中创建一个代理端点（需要额外工具，较复杂）。

#### 浏览器扩展（仅用于本地开发测试）

安装Chrome扩展：[CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock)

**警告**：这只是临时调试方案，生产环境必须配置服务器端CORS。

### 方案3：使用JSONP（不推荐）

修改API返回格式为JSONP，但这需要修改API代码，且安全性较低。

## 推荐配置

### 生产环境

```nginx
# 只允许你的博客域名
add_header 'Access-Control-Allow-Origin' 'https://blog.demius.tech' always;
add_header 'Access-Control-Allow-Methods' 'GET' always;
add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
add_header 'Access-Control-Max-Age' 86400 always;
```

### 开发+生产环境

```nginx
# 允许多个域名
set $cors_origin "";
if ($http_origin ~* "^https://blog\.demius\.tech$|^http://localhost:1313$") {
    set $cors_origin $http_origin;
}

add_header 'Access-Control-Allow-Origin' $cors_origin always;
add_header 'Access-Control-Allow-Methods' 'GET' always;
add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
add_header 'Access-Control-Allow-Credentials' 'true' always;
```

## 验证配置

配置完成后，使用以下命令验证：

```bash
curl -I -X OPTIONS \
  -H "Origin: http://localhost:1313" \
  -H "Access-Control-Request-Method: GET" \
  https://umamiapi.demius.tech/
```

正确的响应应包含：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

## 当前网站配置

已完成的修改：

1. ✅ 移除了iframe统计图表（避免CSP错误）
2. ✅ 优化了CORS错误提示信息
3. ✅ 添加了详细的错误消息显示

待完成：

- ❌ **需要在 `https://umamiapi.demius.tech/` 服务器端配置CORS**

配置CORS后，数据页面将自动正常工作，无需修改任何前端代码。

## 安全注意事项

- 生产环境不要使用 `Access-Control-Allow-Origin: *`
- 只允许必要的HTTP方法（GET即可）
- 定期检查和更新CORS配置
- 考虑使用API密钥进行额外验证

