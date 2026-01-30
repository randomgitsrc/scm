# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-30

### 🎉 Initial Release

首个正式版本发布，包含完整的游戏功能、UI美化和部署方案。

### ✨ Added

#### 核心游戏功能
- **游戏机制**: 基于经典Mastermind的密码破解游戏
  - 4个颜色位置的密码组合
  - 7种可选颜色（红、黄、蓝、绿、紫、橙、青）
  - 每关7次尝试机会
  - 难度进阶：1-10关颜色不重复，11+关允许重复
  - 无限关卡，持续挑战

- **反馈系统**:
  - 🟢 绿灯：位置和颜色都正确
  - 🟡 黄灯：颜色正确但位置错误
  - 清晰的图例说明

- **智能输入**:
  - 自动防止重复颜色输入
  - 选择已存在颜色时自动移动到当前位置
  - 键盘快捷键支持（1-4选位置，Backspace清除，Enter验证）

- **状态持久化**:
  - LocalStorage自动保存游戏进度
  - 刷新页面后可恢复当前关卡和输入
  - 历史记录完整保留

#### UI/UX 设计

- **视觉风格**:
  - 军事迷彩主题背景
  - 深色面板设计
  - 金属质感和螺丝装饰元素
  - 屏幕发光效果

- **双语标题**:
  - 中文：超级密码机
  - 英文：SUPER CIPHER MACHINE
  - 呼吸动画锁形图标

- **历史记录区**:
  - 卡片式背景设计
  - 32px大尺寸色块
  - 当前行脉冲发光高亮
  - 已填行/空行视觉区分
  - 圆形数字徽章

- **输入区**:
  - 与历史区垂直对齐的4个输入槽
  - 当前选中位置指示器
  - 7色横向单行排列
  - 精致验证按钮

- **响应式设计**:
  - 手机端全屏适配
  - 桌面端卡片式居中显示
  - 横屏锁定提示
  - 自适应迷彩背景纹理

#### 技术实现

- **前端架构**:
  - React 19 + TypeScript
  - Tailwind CSS 4 样式系统
  - Vite 7 构建工具
  - React useReducer 状态管理

- **音频系统**:
  - Web Audio API 音效
  - 点击、成功、失败、胜利/失败音效

- **颜色系统**:
  - 高对比度颜色方案
  - 苹果系统风格配色
  - LED指示灯效果

#### 部署方案

- **自动部署脚本** (`deploy.sh`):
  - 一键构建、打包、上传
  - 自动安装配置Nginx
  - SSL证书自动申请（Certbot）
  - 备份和回滚机制

- **Docker支持**:
  - Docker Compose配置
  - Nginx Alpine镜像
  - 可选Traefik反向代理

- **GitHub Actions**:
  - 推送代码自动部署
  - 支持工作流手动触发

#### 文档

- **CLAUDE.md**: 项目开发指南
- **DEPLOY.md**: 详细部署文档
- **README.md**: 项目说明和使用指南
- **CHANGELOG.md**: 版本更新记录

### 🎨 Changed

- 反馈指示灯颜色：红灯→绿灯（位置对）
- 优化色块和指示灯的视觉大小一致性
- 统一历史区和输入区的垂直对齐
- 提升整体颜色对比度和饱和度

### 🔧 Fixed

- 修复输入区色块与历史区大小不一致问题
- 修复响应式布局下的对齐问题
- 修复部署脚本中的日志输出问题
- 优化小屏幕设备的显示效果

### 📦 Files Structure

```
supercolor/
├── super-code/              # 游戏源代码
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── utils/           # 工具函数
│   │   ├── types/           # 类型定义
│   │   ├── App.tsx
│   │   └── index.css
│   ├── dist/                # 构建输出
│   └── package.json
├── deploy.sh                # 自动部署脚本
├── docker-compose.yml       # Docker部署配置
├── nginx.conf              # Nginx配置
├── CLAUDE.md               # 开发指南
├── DEPLOY.md               # 部署文档
├── README.md               # 项目说明
└── CHANGELOG.md            # 更新日志
```

### 🌐 Live Deployment

- **访问地址**: http://scm.gsis.top
- **服务器**: VPS (62.192.173.109)
- **Web服务器**: Nginx
- **部署方式**: 自动脚本部署

### 📝 Known Issues

- 暂无已知问题

### 🔮 Future Plans

- [ ] 添加音效开关控制
- [ ] 添加震动反馈（移动端）
- [ ] 添加排行榜功能
- [ ] 支持多语言切换
- [ ] 添加深色/浅色主题切换
- [ ] 添加游戏统计信息

---

## Version History

### v1.0.0 (2026-01-30)
- 首个正式版本
- 完整的游戏功能
- 响应式UI设计
- 自动部署方案
- 在线发布

---

## Contributing

When adding changes to this changelog:
- Use `Added` for new features
- Use `Changed` for changes in existing functionality
- Use `Deprecated` for soon-to-be removed features
- Use `Removed` for removed features
- Use `Fixed` for bug fixes
- Use `Security` for security improvements
