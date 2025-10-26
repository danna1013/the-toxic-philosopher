# 毒舌哲学家 (The Toxic Philosopher)

一个充满哲学思辨和"毒舌"风格的互动式对话应用。与五位著名哲学家进行深度对话，体验审判庭般的思想交锋。

## 项目简介

"毒舌哲学家"是一个创新的哲学对话应用，用户可以与苏格拉底、尼采、维特根斯坦、康德、弗洛伊德五位哲学大师进行对话。每位哲学家都有独特的"毒舌"风格，通过犀利的提问和批判，引导用户进行深度思考。

## 核心特性

### 🎭 五位哲学家
- **苏格拉底**：连环追问，步步紧逼
- **尼采**：激烈批判，充满力量
- **维特根斯坦**：逻辑解构，精准打击
- **康德**：冷静剖析，道德审判
- **弗洛伊德**：本能揭露，深层剖析

### 🎨 精美动画
- **星球选择页面**：宇宙星空背景，粒子爆炸效果，背景渐变过渡
- **人物介绍动画**：三幕场景动画，黑白插画风格，手动翻页交互
- **审判庭风格对话**：深黑渐变背景，压迫感设计，Critical Hit特效

### 💬 独特对话体验
- 审判庭风格的对话界面
- 哲学家回复前的"沉默"效果（1-2秒）
- 犀利回复的"Critical Hit"标签
- 输入提示："你确定要这么说吗？"
- 所有消息带淡入动画

## 技术栈

### 前端
- **React 18.3** - UI框架
- **TypeScript 5.6** - 类型安全
- **Vite 7.1** - 构建工具
- **Tailwind CSS 4.1** - 样式框架
- **Framer Motion 12** - 动画库
- **Wouter 3.3** - 路由管理

### 后端
- **Express 4.21** - Web框架
- **Node.js** - 运行环境

### AI集成
- 自定义AI服务接口
- 支持对话历史上下文
- 个性化哲学家回复风格

## 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 10.4

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```

访问 http://localhost:5173

### 构建生产版本
```bash
pnpm build
```

### 启动生产服务器
```bash
pnpm start
```

## 项目结构

```
toxic-philosopher-manus/
├── client/                 # 前端代码
│   ├── public/            # 静态资源
│   │   ├── *.webp        # 哲学家头像
│   │   ├── *-scene-*.png # 场景图片
│   │   └── ...
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── pages/        # 页面组件
│   │   │   ├── Home.tsx
│   │   │   ├── SelectPhilosopher.tsx
│   │   │   ├── SocratesIntro.tsx
│   │   │   ├── NietzscheIntro.tsx
│   │   │   ├── WittgensteinIntro.tsx
│   │   │   ├── KantIntro.tsx
│   │   │   ├── FreudIntro.tsx
│   │   │   └── Chat.tsx
│   │   ├── lib/          # 工具函数
│   │   ├── App.tsx       # 应用入口
│   │   ├── index.css     # 全局样式
│   │   └── main.tsx      # React入口
│   ├── index.html
│   └── vite.config.ts
├── server/                # 后端代码
│   └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 页面流程

1. **首页** (`/`) - 欢迎页面，项目介绍
2. **选择哲学家** (`/select`) - 星球选择界面，粒子爆炸动画
3. **人物介绍** (`/intro/:id`) - 三幕场景动画，手动翻页
4. **对话页面** (`/chat/:id`) - 审判庭风格对话界面

## 环境变量

创建 `.env` 文件：

```env
# AI服务配置（可选）
VITE_AI_API_URL=your_api_url
VITE_AI_API_KEY=your_api_key
```

## 开发指南

### 添加新哲学家

1. 在 `client/public/` 添加头像和场景图片
2. 在 `client/src/pages/` 创建介绍页面组件
3. 在 `App.tsx` 中添加路由
4. 在 `SelectPhilosopher.tsx` 中添加星球
5. 在 `Chat.tsx` 中添加哲学家信息

### 自定义动画

所有动画使用 Framer Motion，可在各页面组件中调整：
- 动画时长：`duration`
- 缓动曲线：`ease`
- 延迟：`delay`

### 样式定制

使用 Tailwind CSS，支持：
- 自定义颜色
- 自定义动画
- 响应式设计

## 部署

### Vercel部署

1. Fork本仓库
2. 在Vercel导入项目
3. 配置环境变量
4. 自动部署

### Docker部署

```bash
# 构建镜像
docker build -t toxic-philosopher .

# 运行容器
docker run -p 3000:3000 toxic-philosopher
```

## 待办事项

查看 `todo.md` 了解项目进度和待完成功能。

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 致谢

- 所有哲学家的智慧和思想
- React、Vite、Tailwind CSS等开源项目
- Framer Motion提供的优秀动画库

## 联系方式

- GitHub: [danna1013/the-toxic-philosopher](https://github.com/danna1013/the-toxic-philosopher)
- Issues: [提交问题](https://github.com/danna1013/the-toxic-philosopher/issues)

---

**真相往往不太礼貌，但总比谎言有用。**

