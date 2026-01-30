# 🔐 超级密码机 (Super Code Machine)

一个现代化的 Mastermind 风格密码破解游戏。

![Game Preview](./docs/preview.png)

## 🎮 游戏介绍

- **密码长度**: 4 个颜色
- **颜色选择**: 7 种不同颜色
- **尝试次数**: 每局 7 次机会
- **难度进阶**: 1-10 关不重复，11 关以上允许重复
- **反馈系统**: 🔴 红-位置和颜色都对，⚪ 白-颜色对位置错

## 🚀 部署方式

### 方式一：自动部署脚本（推荐）

```bash
# 1. 编辑配置
vim deploy.sh  # 修改 VPS_IP, DOMAIN 等变量

# 2. 执行部署
chmod +x deploy.sh
./deploy.sh
```

详细说明见 [DEPLOY.md](./DEPLOY.md)

### 方式二：Docker 部署

```bash
# 1. 构建项目
cd super-code
npm install
npm run build
cd ..

# 2. 启动容器
docker-compose up -d

# 3. 访问 http://localhost
```

### 方式三：GitHub Actions 自动部署

1. Fork 本项目
2. 在 GitHub Settings -> Secrets 添加 VPS 配置
3. 推送代码到 main 分支自动部署

详细说明见 [.github/workflows/README.md](./.github/workflows/README.md)

### 方式四：手动部署

```bash
# 本地构建
cd super-code
npm install
npm run build

# 上传到服务器
scp -r dist/* root@vps-ip:/var/www/super-code/

# 配置 Nginx（参考 DEPLOY.md）
```

## 🛠️ 技术栈

- **前端**: React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **构建**: Vite 7
- **部署**: Nginx / Docker

## 📁 项目结构

```
supercolor/
├── deploy.sh              # 自动部署脚本
├── docker-compose.yml     # Docker 部署配置
├── nginx.conf            # Nginx 配置模板
├── DEPLOY.md             # 部署详细说明
├── super-code/           # 游戏源代码
│   ├── src/
│   ├── dist/            # 构建输出
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Actions 配置
```

## ⚙️ 本地开发

```bash
cd super-code
npm install
npm run dev
```

访问 http://localhost:5173

## 🔧 配置说明

### 部署脚本变量

编辑 `deploy.sh` 中的以下变量：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VPS_IP` | VPS 服务器 IP | 必填 |
| `VPS_USER` | SSH 用户名 | root |
| `DOMAIN` | 绑定的域名 | 必填 |
| `ENABLE_HTTPS` | 启用 HTTPS | true |
| `EMAIL` | SSL 证书邮箱 | 必填 |
| `REMOTE_DIR` | 服务器部署路径 | /var/www/super-code |

## 📝 更新日志

### v1.0.0
- ✅ 基础游戏功能
- ✅ 7 关难度进阶
- ✅ 响应式设计
- ✅ 军事风格 UI
- ✅ 自动部署脚本

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 PR！
