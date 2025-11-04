# 哲学辩论功能 - 开发文档

## 📋 项目概述

这是为 The Toxic Philosopher 项目开发的哲学辩论功能，让5位历史上最伟大的哲学家同台辩论，50位AI观众实时投票和发言。

## 🎯 核心功能

### 1. 邀请码系统
- **无需登录**：使用 localStorage + 浏览器指纹技术
- **三级权限**：免费用户、内测用户、VIP用户
- **防滥用机制**：浏览器指纹绑定、使用次数限制

### 2. 辩论模式
- **基础模式**：固定话题和辩手，5分钟快速体验
- **完整模式**：完全自定义，10分钟深度体验（需邀请码）

### 3. AI个性化
- **5位哲学家**：每位都有完整的人格档案
- **50位观众**：6种人格类型，独特的说服机制

## 🛠️ 技术栈

### 后端
- **Node.js + Express**：API服务器
- **PostgreSQL**：数据库
- **OpenAI API**：AI服务（gpt-4o-mini）

### 前端
- **React 18 + TypeScript**：UI框架
- **Wouter**：路由
- **Shadcn/ui**：组件库
- **Tailwind CSS**：样式

## 📁 项目结构

```
toxic-philosopher-dev/
├── server/
│   ├── api/
│   │   ├── invitation.ts      # 邀请码API
│   │   └── debate.ts           # 辩论API
│   ├── services/
│   │   └── ai-service.ts       # AI服务
│   ├── utils/
│   │   ├── db.ts               # 数据库连接
│   │   └── init-db.sql         # 数据库初始化
│   └── index.ts                # 服务器入口
├── client/src/
│   ├── pages/debate/
│   │   ├── DebateEntry.tsx     # 辩论入口页
│   │   ├── DebateOngoing.tsx   # 辩论进行中页
│   │   └── DebateResult.tsx    # 辩论结果页
│   └── lib/debate/
│       ├── fingerprint.ts      # 浏览器指纹
│       ├── permission.ts       # 权限管理
│       └── api.ts              # API客户端
├── scripts/
│   └── init-db.sh              # 数据库初始化脚本
└── .env.example                # 环境变量示例
```

## 🚀 快速开始

### 1. 环境准备

#### 安装依赖
```bash
pnpm install
```

#### 配置环境变量
复制 `.env.example` 到 `.env` 并填写：
```bash
cp .env.example .env
```

编辑 `.env`：
```env
DATABASE_URL=postgresql://user:password@localhost:5432/debate_db
OPENAI_API_KEY=sk-...
PORT=3000
NODE_ENV=development
```

### 2. 数据库设置

#### 创建数据库
```bash
createdb debate_db
```

#### 初始化数据库表
```bash
./scripts/init-db.sh
```

或者手动执行：
```bash
psql $DATABASE_URL -f server/utils/init-db.sql
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问：http://localhost:5173

## 📊 数据库结构

### 1. invitation_codes（邀请码表）
- `id`：UUID主键
- `code`：邀请码（唯一）
- `type`：类型（beta/vip/trial）
- `max_uses`：最大使用次数（-1表示无限）
- `current_uses`：当前使用次数
- `expires_at`：过期时间
- `features`：功能权限（JSONB）
- `is_active`：是否激活

### 2. invitation_activations（激活记录表）
- `id`：UUID主键
- `code`：邀请码
- `fingerprint`：浏览器指纹
- `ip_address`：IP地址
- `user_agent`：用户代理
- `activated_at`：激活时间
- `last_used_at`：最后使用时间

### 3. debates（辩论记录表）
- `id`：UUID主键
- `user_fingerprint`：用户指纹
- `mode`：模式（basic/full）
- `topic`：辩题
- `topic_pro_side`：正方观点
- `topic_con_side`：反方观点
- `user_role`：用户角色（audience/debater）
- `user_side`：用户阵营（pro/con）
- `status`：状态（preparing/ongoing/finished）
- `pro_side_philosophers`：正方哲学家
- `con_side_philosophers`：反方哲学家
- `final_pro_votes`：最终正方票数
- `final_con_votes`：最终反方票数
- `winner`：获胜方

### 4. debate_statements（发言记录表）
- `id`：UUID主键
- `debate_id`：辩论ID
- `round_number`：轮次
- `speaker_id`：发言者ID
- `speaker_type`：发言者类型
- `speaker_name`：发言者姓名
- `side`：阵营
- `content`：发言内容
- `votes_changed`：改变的票数
- `audiences_persuaded`：被说服的观众

### 5. debate_audiences（观众状态表）
- `id`：UUID主键
- `debate_id`：辩论ID
- `audience_id`：观众ID
- `name`：姓名
- `occupation`：职业
- `avatar_url`：头像URL
- `initial_vote`：初始投票
- `current_vote`：当前投票
- `persuasion_level`：说服程度
- `vote_changed_count`：改变投票次数

### 6. debate_vote_history（投票历史表）
- `id`：UUID主键
- `debate_id`：辩论ID
- `statement_id`：发言ID
- `audience_id`：观众ID
- `old_vote`：旧投票
- `new_vote`：新投票
- `reason`：原因

## 🔌 API接口

### 邀请码相关

#### POST /api/invitation/activate
激活邀请码
```json
{
  "code": "DEBATE-2024-TEST1",
  "fingerprint": "abc123",
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0..."
}
```

#### POST /api/invitation/verify
验证用户权限
```json
{
  "fingerprint": "abc123"
}
```

#### POST /api/invitation/check-usage
检查今日使用次数
```json
{
  "fingerprint": "abc123"
}
```

#### POST /api/invitation/generate
生成邀请码（管理员）
```json
{
  "type": "beta",
  "maxUses": 10,
  "expiresInDays": 30,
  "createdBy": "admin"
}
```

### 辩论相关

#### POST /api/debate/create
创建辩论
```json
{
  "userFingerprint": "abc123",
  "mode": "basic",
  "topic": "AI会取代人类吗？",
  "topicProSide": "会取代",
  "topicConSide": "不会取代",
  "userRole": "audience",
  "proSidePhilosophers": ["socrates", "kant"],
  "conSidePhilosophers": ["nietzsche", "freud"]
}
```

#### POST /api/debate/:debateId/start
开始辩论
```json
{
  "audiences": [
    {
      "id": "audience_1",
      "name": "张伟",
      "occupation": "CEO",
      "initialVote": "pro",
      "persuasionLevel": 50
    }
  ]
}
```

#### POST /api/debate/:debateId/statement
添加发言
```json
{
  "roundNumber": 1,
  "speakerId": "socrates",
  "speakerType": "philosopher",
  "speakerName": "苏格拉底",
  "side": "pro",
  "content": "那么，让我们来思考..."
}
```

#### POST /api/debate/:debateId/vote
更新观众投票
```json
{
  "audienceId": "audience_1",
  "newVote": "con",
  "reason": "被说服了",
  "statementId": "statement_id"
}
```

#### GET /api/debate/:debateId/status
获取辩论状态

#### POST /api/debate/:debateId/finish
结束辩论

#### GET /api/debate/history/:fingerprint
获取辩论历史

## 🎭 AI服务

### 哲学家人格档案

每位哲学家都有完整的人格档案：
- **核心特质**：理性度、情绪化、固执度、开放性、攻击性
- **思维模式**：questioning/provocative/systematic/analytical/linguistic
- **语言风格**：典型用语、句式长度、比喻频率
- **说服抗性**：对不同论证类型的抵抗力

### AI调用

#### 生成哲学家发言
```typescript
import { generatePhilosopherStatement } from '@/server/services/ai-service';

const statement = await generatePhilosopherStatement(
  'socrates',
  'AI会取代人类吗？',
  'pro',
  {
    previousStatements: [...],
    currentVotes: { pro: 25, con: 25 },
    roundNumber: 1
  }
);
```

#### 计算观众投票变化
```typescript
import { calculateAudienceVotes } from '@/server/services/ai-service';

const changes = await calculateAudienceVotes(
  audiences,
  {
    philosopherId: 'socrates',
    side: 'pro',
    content: '...'
  }
);
```

## 🧪 测试

### 测试邀请码
数据库初始化时会自动创建两个测试邀请码：
- `DEBATE-2024-TEST1`：内测用户，10次/天
- `DEBATE-2024-VIP01`：VIP用户，无限次

### 测试流程
1. 访问 `/debate`
2. 点击"激活邀请码"
3. 输入测试邀请码
4. 选择"完整模式"
5. 开始辩论

## 📝 开发计划

### Phase 1: MVP基础模式 ✅
- [x] 后端API（邀请码、辩论）
- [x] AI服务（哲学家发言、观众投票）
- [x] 前端页面（入口、进行中、结果）
- [x] 数据库设计和初始化

### Phase 2: 完整模式（待开发）
- [ ] 话题选择页
- [ ] 身份选择页
- [ ] 阵营分配页（拖拽功能）
- [ ] 辩论预览页
- [ ] 用户作为辩手参与

### Phase 3: AI增强（待开发）
- [ ] 记忆系统
- [ ] 情绪系统
- [ ] 社交网络
- [ ] 从众效应

### Phase 4: 优化（待开发）
- [ ] 性能优化
- [ ] 错误处理
- [ ] 用户引导
- [ ] 分享功能

## 🐛 已知问题

1. **AI调用延迟**：需要优化AI调用策略
2. **观众投票计算**：目前是简化版本，需要完善
3. **前端状态管理**：需要添加Context或Redux
4. **错误处理**：需要完善错误提示

## 📞 联系方式

如有问题，请通过GitHub Issues反馈。

---

**开发分支**：`feature/debate-system`  
**最后更新**：2025年11月5日  
**开发者**：Manus AI
