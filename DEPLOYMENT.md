# The Toxic Philosopher - 部署文档

## 📋 目录

1. [系统要求](#系统要求)
2. [快速开始](#快速开始)
3. [环境配置](#环境配置)
4. [部署步骤](#部署步骤)
5. [生产环境部署](#生产环境部署)
6. [常见问题](#常见问题)

---

## 🖥️ 系统要求

### 必需软件

- **Node.js**: v18.0.0 或更高版本
- **pnpm**: v8.0.0 或更高版本
- **Git**: 用于克隆代码

### 推荐配置

- **操作系统**: Ubuntu 20.04+ / macOS / Windows 10+
- **内存**: 至少 2GB RAM
- **存储**: 至少 1GB 可用空间

---

## 🚀 快速开始

### 1. 克隆代码

```bash
# 克隆仓库
git clone https://github.com/danna1013/the-toxic-philosopher.git
cd the-toxic-philosopher

# 切换到功能分支
git checkout feature/access-code-system
```

### 2. 安装依赖

```bash
# 安装 pnpm（如果还没有安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的配置
nano .env
```

### 4. 启动开发服务器

```bash
# 启动后端服务（端口 3000）
pnpm run dev:server

# 新开一个终端，启动前端服务（端口 5173）
pnpm run dev:client
```

访问 `http://localhost:5173` 即可看到网站！

---

## ⚙️ 环境配置

### .env 文件配置

创建 `.env` 文件，包含以下配置：

```bash
# OpenAI API 配置（用于AI识别截图）
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://oa.api2d.net
OPENAI_MODEL=gpt-4o-mini

# 管理员密码
ADMIN_PASSWORD=your_admin_password_here

# 服务器配置
BASE_URL=http://localhost:3000
PORT=3000
```

### 配置说明

#### 1. OpenAI API 配置

**推荐使用 API2D**（OpenAI API 代理服务）：

- 访问：https://api2d.com
- 注册账号并充值
- 获取 API Key（格式：`fk235458-xxxxx`）
- 配置：
  ```bash
  OPENAI_API_KEY=fk235458-你的密钥
  OPENAI_BASE_URL=https://oa.api2d.net
  OPENAI_MODEL=gpt-4o-mini
  ```

**或使用官方 OpenAI API**：

- 访问：https://platform.openai.com
- 获取 API Key（格式：`sk-xxxxx`）
- 配置：
  ```bash
  OPENAI_API_KEY=sk-你的密钥
  OPENAI_BASE_URL=https://api.openai.com/v1
  OPENAI_MODEL=gpt-4o-mini
  ```

#### 2. 管理员密码

设置一个强密码用于登录管理后台：

```bash
ADMIN_PASSWORD=your_secure_password_123
```

#### 3. 服务器配置

开发环境：
```bash
BASE_URL=http://localhost:3000
PORT=3000
```

生产环境：
```bash
BASE_URL=https://your-domain.com
PORT=3000
```

---

## 📦 部署步骤

### 开发环境部署

#### 方式1：分别启动前后端

```bash
# 终端1：启动后端
pnpm run dev:server

# 终端2：启动前端
pnpm run dev:client
```

- 前端地址：http://localhost:5173
- 后端地址：http://localhost:3000
- 管理后台：http://localhost:5173/admin/login

#### 方式2：同时启动

```bash
# 同时启动前后端（需要安装 concurrently）
pnpm run dev
```

### 生产环境部署

#### 步骤1：构建项目

```bash
# 构建前端
pnpm run build

# 构建后的文件在 dist/public 目录
```

#### 步骤2：启动生产服务器

```bash
# 设置环境变量
export NODE_ENV=production

# 启动服务器
pnpm run start
```

#### 步骤3：使用 PM2 管理进程（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server/index.ts --name toxic-philosopher --interpreter tsx

# 查看状态
pm2 status

# 查看日志
pm2 logs toxic-philosopher

# 设置开机自启
pm2 startup
pm2 save
```

---

## 🌐 生产环境部署

### 使用 Nginx 反向代理

#### 1. 安装 Nginx

```bash
sudo apt update
sudo apt install nginx
```

#### 2. 配置 Nginx

创建配置文件 `/etc/nginx/sites-available/toxic-philosopher`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API 请求
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 文件上传大小限制
    client_max_body_size 10M;
}
```

#### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/toxic-philosopher /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4. 配置 HTTPS（可选但推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 使用 Docker 部署（可选）

#### 1. 创建 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建前端
RUN pnpm run build

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["pnpm", "run", "start"]
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_BASE_URL=${OPENAI_BASE_URL}
      - OPENAI_MODEL=${OPENAI_MODEL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - BASE_URL=${BASE_URL}
      - PORT=3000
    volumes:
      - ./server/data:/app/server/data
    restart: unless-stopped
```

#### 3. 启动容器

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 🔧 常见问题

### Q1: 端口被占用

**问题**：启动时提示端口 3000 或 5173 被占用

**解决方案**：

```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :5173

# 杀死进程
kill -9 <PID>

# 或者修改 .env 中的 PORT 配置
```

### Q2: AI 识别失败

**问题**：上传截图后提示"AI 审核失败"

**可能原因**：
1. API Key 未配置或无效
2. API 余额不足
3. 网络连接问题

**解决方案**：

```bash
# 检查 .env 配置
cat .env | grep OPENAI

# 测试 API 连接
curl -X POST https://oa.api2d.net/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Q3: 管理后台无法登录

**问题**：输入密码后提示"密码错误"

**解决方案**：

```bash
# 检查 ADMIN_PASSWORD 配置
cat .env | grep ADMIN_PASSWORD

# 确保密码与配置一致
# 重启服务器使配置生效
pm2 restart toxic-philosopher
```

### Q4: 截图上传失败

**问题**：上传截图时提示"文件过大"或"格式不支持"

**解决方案**：

- 支持的格式：JPG、PNG、GIF、WEBP
- 最大文件大小：10MB
- 如需修改限制，编辑 `server/routes/access-code.ts`：

```typescript
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 修改这里
  }
});
```

### Q5: 数据丢失

**问题**：重启服务器后体验码或申请记录丢失

**解决方案**：

数据存储在 `server/data/` 目录：
- `codes.json` - 体验码数据
- `applications.json` - 申请记录
- `uploads/` - 上传的截图

**备份数据**：

```bash
# 定期备份
cp -r server/data server/data.backup.$(date +%Y%m%d)

# 或使用 cron 自动备份
0 2 * * * cp -r /path/to/server/data /path/to/backup/data.$(date +\%Y\%m\%d)
```

### Q6: 前端构建失败

**问题**：运行 `pnpm run build` 时出错

**解决方案**：

```bash
# 清理缓存
rm -rf node_modules dist
pnpm store prune

# 重新安装依赖
pnpm install

# 再次构建
pnpm run build
```

---

## 📝 维护建议

### 日志管理

```bash
# 使用 PM2 查看日志
pm2 logs toxic-philosopher

# 清理日志
pm2 flush

# 设置日志轮转
pm2 install pm2-logrotate
```

### 数据备份

```bash
# 每天自动备份数据
#!/bin/bash
BACKUP_DIR="/path/to/backup"
DATE=$(date +%Y%m%d)

# 备份数据
cp -r /path/to/server/data "$BACKUP_DIR/data.$DATE"

# 保留最近7天的备份
find "$BACKUP_DIR" -name "data.*" -mtime +7 -delete
```

### 监控建议

- 使用 PM2 监控进程状态
- 配置服务器监控（CPU、内存、磁盘）
- 设置 API 用量监控（避免超额）
- 定期检查日志文件

---

## 🎯 访问地址

部署完成后，可以通过以下地址访问：

- **主页**：http://your-domain.com
- **管理后台登录**：http://your-domain.com/admin/login
- **体验码管理**：http://your-domain.com/admin/codes
- **申请记录**：http://your-domain.com/admin/applications

---

## 📞 技术支持

如有问题，请查看：

- GitHub Issues: https://github.com/danna1013/the-toxic-philosopher/issues
- 项目文档: https://github.com/danna1013/the-toxic-philosopher

---

## 📄 许可证

本项目采用 MIT 许可证
