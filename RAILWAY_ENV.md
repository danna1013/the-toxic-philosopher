# Railway 环境变量配置

在 Railway 项目中添加以下环境变量：

## 必需的环境变量

```bash
OPENAI_API_KEY=fk235458-WKTawL7NrVFHp5xO70RXZsD7RmAC17oc
OPENAI_BASE_URL=https://oa.api2d.net
OPENAI_MODEL=gpt-4o-mini
ADMIN_PASSWORD=admin123456
NODE_ENV=production
PORT=3000
BASE_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

## 说明

- `OPENAI_API_KEY`: 您的 API2D 密钥（已提供）
- `OPENAI_BASE_URL`: API2D 的接口地址
- `OPENAI_MODEL`: 使用的模型
- `ADMIN_PASSWORD`: 管理后台密码（建议修改为更安全的密码）
- `NODE_ENV`: 生产环境标识
- `PORT`: 服务端口
- `BASE_URL`: Railway 会自动提供公网域名

## 如何添加

1. 在 Railway 项目页面，点击 "Variables" 标签
2. 点击 "New Variable"
3. 逐个添加上述环境变量
4. 或点击 "Raw Editor"，粘贴以下内容：

```
OPENAI_API_KEY=fk235458-WKTawL7NrVFHp5xO70RXZsD7RmAC17oc
OPENAI_BASE_URL=https://oa.api2d.net
OPENAI_MODEL=gpt-4o-mini
ADMIN_PASSWORD=admin123456
NODE_ENV=production
PORT=3000
```

注意：BASE_URL 会自动设置，无需手动添加
