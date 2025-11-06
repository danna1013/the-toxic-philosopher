# 浏览器兼容性说明

## 支持的浏览器

本项目已针对以下浏览器进行优化和测试：

### 桌面浏览器

| 浏览器 | 最低版本 | 推荐版本 |
|--------|---------|---------|
| **Chrome** | 90+ | 最新版 |
| **Edge** | 90+ | 最新版 |
| **Firefox** | 88+ | 最新版 |
| **Safari** | 14+ | 最新版 |
| **Opera** | 76+ | 最新版 |

### 移动浏览器

| 浏览器 | 最低版本 | 推荐版本 |
|--------|---------|---------|
| **iOS Safari** | 14+ | 最新版 |
| **Chrome Mobile** | 90+ | 最新版 |
| **Samsung Internet** | 14+ | 最新版 |
| **Android Browser** | 90+ | 最新版 |

## 不支持的浏览器

- ❌ Internet Explorer (所有版本)
- ❌ Opera Mini
- ❌ 过时的浏览器版本

## 技术实现

### 1. CSS 兼容性

- **Autoprefixer**: 自动添加浏览器前缀
- **PostCSS**: 处理现代 CSS 特性
- **Tailwind CSS**: 使用兼容性良好的工具类

### 2. JavaScript 兼容性

- **目标**: ES2015 (ES6)
- **转译**: Vite 自动处理
- **Polyfills**: 按需加载

### 3. CSS 特性支持

#### 已启用的特性
- ✅ CSS Grid (自动放置)
- ✅ Flexbox (现代语法)
- ✅ CSS Variables (自定义属性)
- ✅ CSS Transitions & Animations
- ✅ Media Queries

#### 浏览器前缀
自动添加以下前缀：
- `-webkit-` (Chrome, Safari, Edge)
- `-moz-` (Firefox)
- `-ms-` (旧版 Edge)

### 4. 响应式设计

支持的屏幕尺寸：
- 📱 移动端: 320px - 640px
- 📱 平板: 640px - 1024px
- 💻 桌面: 1024px+
- 🖥️ 大屏: 1280px+

## 构建配置

### Vite 配置

```javascript
build: {
  target: 'es2015',      // 兼容 ES2015+
  cssTarget: 'chrome90', // CSS 兼容 Chrome 90+
  minify: 'terser',      // 使用 Terser 压缩
}
```

### PostCSS 配置

```javascript
autoprefixer: {
  overrideBrowserslist: [
    '> 0.5%',           // 市场份额 > 0.5%
    'last 2 versions',  // 最近 2 个版本
    'Firefox ESR',      // Firefox 长期支持版
    'not dead',         // 非停止维护的浏览器
    'not IE 11',        // 不支持 IE 11
    'Chrome >= 90',
    'Edge >= 90',
    'Firefox >= 88',
    'Safari >= 14',
    'iOS >= 14',
  ],
  grid: 'autoplace',    // 启用 Grid 自动放置
  flexbox: 'no-2009',   // 使用现代 Flexbox 语法
}
```

## 测试建议

### 开发阶段

1. **Chrome DevTools**
   - 使用设备模拟器测试不同屏幕尺寸
   - 测试不同网络速度

2. **Firefox Developer Tools**
   - 测试 CSS Grid 布局
   - 检查无障碍性

3. **Safari Web Inspector**
   - 测试 iOS 兼容性
   - 检查 WebKit 特定问题

### 生产环境

建议在以下真实设备上测试：
- iPhone (iOS 14+)
- Android 手机 (Android 10+)
- Windows PC (Chrome/Edge)
- macOS (Safari/Chrome)

## 常见问题

### Q: 为什么不支持 IE 11？

A: IE 11 已于 2022 年停止支持，且不支持现代 Web 标准（CSS Grid、Flexbox、ES6 等）。支持 IE 11 会显著增加开发成本和代码复杂度。

### Q: 如何检查我的浏览器是否支持？

A: 访问网站时，如果样式和功能正常，说明您的浏览器受支持。如遇问题，请升级到最新版本。

### Q: 移动端性能如何？

A: 项目已针对移动设备优化：
- 响应式设计
- 图片懒加载
- 代码分割
- CSS 压缩

### Q: 是否支持暗色模式？

A: 是的，项目支持系统级暗色模式，会自动跟随系统设置。

## 报告兼容性问题

如果您在特定浏览器上遇到问题，请提供：
1. 浏览器名称和版本
2. 操作系统
3. 问题截图
4. 控制台错误信息

## 更新日志

### 2025-11-06
- ✅ 添加 Autoprefixer 配置
- ✅ 添加 .browserslistrc 文件
- ✅ 更新 Vite 构建目标
- ✅ 优化 CSS 兼容性
- ✅ 添加浏览器兼容性文档

---

**最后更新**: 2025-11-06
**维护者**: The Toxic Philosopher Team
