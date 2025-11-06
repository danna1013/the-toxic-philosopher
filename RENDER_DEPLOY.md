# Render 部署指南

## 📋 前提条件

1. GitHub 账号
2. Render 账号（https://render.com - 免费注册）
3. 代码已推送到 GitHub 仓库

## 🚀 部署步骤

### 步骤 1：创建 Render 账号并连接 GitHub

1. 访问 https://render.com
2. 点击 **"Get Started"** 或 **"Sign Up"**
3. 选择 **"Sign up with GitHub"**
4. 授权 Render 访问您的 GitHub 仓库

### 步骤 2：创建 Redis 数据库

1. 在 Render Dashboard 点击 **"New +"**
2. 选择 **"Redis"**
3. 配置：
   - **Name**: `toxic-philosopher-redis`
   - **Region**: 选择离您最近的区域（如 Singapore）
   - **Plan**: **Free**
4. 点击 **"Create Redis"**
5. 等待数据库创建完成（约 1-2 分钟）
6. **重要**：复制 **Internal Redis URL**（稍后需要）

### 步骤 3：创建 Web Service

1. 在 Render Dashboard 点击 **"New +"**
2. 选择 **"Web Service"**
3. 连接 GitHub 仓库：
   - 找到 `danna1013/the-toxic-philosopher`
   - 点击 **"Connect"**
4. 配置服务：
   - **Name**: `toxic-philosopher`
   - **Region**: 选择与 Redis 相同的区域
   - **Branch**: `master`
   - **Runtime**: **Node**
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: **Free**

### 步骤 4：配置环境变量

在 **Environment Variables** 部分添加：

| Key | Value | 说明 |
|-----|-------|------|
| `NODE_ENV` | `production` | 运行环境 |
| `ADMIN_PASSWORD` | `admin123456` | 管理员密码 |
| `API2D_API_KEY` | `fk235458-WKTawL7NrVFHp5xO70RXZsD7RmAC17oc` | API2D 密钥 |
| `HAIHUB_API_KEY` | `sk-60177c6b-64cd-491a-8f59-bcc4585a1cce` | HaiHub 密钥 |
| `OPENAI_MODEL` | `gpt-4o-mini` | AI 模型 |
| `REDIS_URL` | *从步骤 2 复制的 Internal Redis URL* | Redis 连接 |

### 步骤 5：部署

1. 点击 **"Create Web Service"**
2. Render 会自动：
   - 克隆代码
   - 安装依赖
   - 构建前端
   - 启动服务器
3. 等待部署完成（约 3-5 分钟）
4. 部署成功后，您会看到一个 URL，类似：
   - `https://toxic-philosopher.onrender.com`

## ✅ 验证部署

1. 访问您的 Render URL
2. 测试功能：
   - 前端页面是否正常显示
   - 管理员登录：`/admin/login`（密码：admin123456）
   - API 健康检查：`/api/health`

## 🔧 常见问题

### Q: 部署失败怎么办？
A: 查看 Render 的 **Logs** 标签，检查错误信息。

### Q: Redis 连接失败？
A: 确保使用的是 **Internal Redis URL**（不是 External URL）。

### Q: 服务启动后自动休眠？
A: 免费套餐在 15 分钟无活动后会休眠，首次访问需要等待 30 秒唤醒。

### Q: 如何更新代码？
A: 推送到 GitHub 的 `master` 分支，Render 会自动重新部署。

## 📝 注意事项

1. **免费套餐限制**：
   - Web Service: 750 小时/月
   - Redis: 25 MB 存储
   - 15 分钟无活动后休眠

2. **自动部署**：
   - 每次推送到 `master` 分支都会触发自动部署
   - 可以在 Render Dashboard 中禁用自动部署

3. **日志查看**：
   - 在 Render Dashboard 的 **Logs** 标签查看实时日志
   - 用于调试和监控

## 🎉 完成！

您的应用现在已经部署到 Render 上了！

- **前端**: `https://toxic-philosopher.onrender.com`
- **管理后台**: `https://toxic-philosopher.onrender.com/admin/login`
- **API**: `https://toxic-philosopher.onrender.com/api/*`
