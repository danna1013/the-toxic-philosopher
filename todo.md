# 毒舌哲学家项目迁移待办清单

## 静态资源迁移
- [x] 复制所有图片资源（哲学家头像等）到 client/public/
- [x] 复制 favicon 和其他静态文件

## 页面组件迁移
- [x] 迁移 Home.tsx（首页）
- [x] 迁移 SelectPhilosopher.tsx（哲学家选择页面）
- [x] 迁移 SocratesIntro.tsx（苏格拉底介绍动画页面）
- [x] 迁移 Chat.tsx（对话页面）
- [x] 迁移 NotFound.tsx（404页面）

## 共享组件和工具迁移
- [x] 迁移 components/ 目录下的所有组件
- [x] 迁移 contexts/ 目录（ThemeContext等）
- [x] 迁移 hooks/ 目录
- [x] 迁移 lib/ 目录工具函数
- [x] 复制 const.ts 常量定义

## 样式和配置
- [x] 迁移 index.css 全局样式
- [x] 检查并调整 tailwind.config.ts
- [x] 检查 components.json 配置

## 路由配置
- [x] 配置 App.tsx 路由（/, /select, /intro/socrates, /chat/:id）
- [x] 确保所有路由正常工作

## 测试和优化
- [x] 测试首页显示
- [ ] 测试哲学家选择页面的星空动画
- [ ] 测试苏格拉底介绍动画的流畅度
- [ ] 测试对话页面功能
- [ ] 检查响应式布局

## 部署
- [ ] 创建项目检查点
- [ ] 通知用户在右侧预览

