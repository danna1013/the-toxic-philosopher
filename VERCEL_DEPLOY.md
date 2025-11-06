# Vercel 部署指南

## 🚀 快速部署步骤

### 1. 在 Vercel 导入项目

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Add New" → "Project"
3. 选择 "Import Git Repository"
4. 选择 `danna1013/the-toxic-philosopher` 仓库
5. 选择分支：`feature/access-code-system`

### 2. 配置构建设置

在 Vercel 项目设置中：

**Framework Preset**: Other

**Build Command**: 
```bash
pnpm build:full
```

**Output Directory**: 
```
dist/public
```

**Install Command**: 
```bash
pnpm install
```

### 3. 配置环境变量

在 Vercel 项目设置的 "Environment Variables" 中添加：

```
OPENAI_API_KEY=fk235458-WKTawL7NrVFHp5xO70RXZsD7RmAC17oc
OPENAI_BASE_URL=https://oa.api2d.net
OPENAI_MODEL=gpt-4o-mini
ADMIN_PASSWORD=admin123456
NODE_ENV=production
```

### 4. 部署

点击 "Deploy" 按钮，Vercel 将自动：
- 安装依赖
- 构建前端和后端
- 部署到全球 CDN

### 5. 访问网站

部署完成后，Vercel 会提供一个 URL，例如：
```
https://the-toxic-philosopher.vercel.app
```

## ⚠️ 重要说明

### 数据持久化

Vercel 是无服务器平台，不支持文件系统持久化。当前使用 JSON 文件存储数据的方式在 Vercel 上**无法持久化**。

**解决方案**：需要使用外部数据库服务：

1. **Vercel KV**（推荐）
   - Redis 兼容
   - 免费层可用
   - 官方集成

2. **MongoDB Atlas**
   - 免费层可用
   - 适合文档存储

3. **Supabase**
   - PostgreSQL
   - 免费层可用

### 如果不需要数据持久化

如果只是演示用途，可以接受数据在每次部署后重置，那么当前配置可以直接使用。

## 📝 后续优化

如需生产环境使用，建议：

1. 集成 Vercel KV 或其他数据库
2. 修改 `server/index.ts` 中的数据存储逻辑
3. 将 JSON 文件存储改为数据库存储

## 🔧 本地测试

```bash
# 安装依赖
pnpm install

# 构建
pnpm build:full

# 启动
pnpm start
```

## 📞 支持

如有问题，请查看 Vercel 部署日志或联系技术支持。
