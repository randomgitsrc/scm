# GitHub Actions 自动部署

## 配置步骤

### 1. 添加 Secrets

在 GitHub 仓库设置中添加以下 Secrets：

| Secret Name | 说明 | 示例 |
|-------------|------|------|
| `VPS_IP` | VPS 服务器 IP | `123.456.789.0` |
| `VPS_USER` | SSH 用户名 | `root` |
| `SSH_PRIVATE_KEY` | SSH 私钥内容 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT` | SSH 端口（可选） | `22` |
| `REMOTE_DIR` | 远程部署目录（可选） | `/var/www/super-code` |

### 2. 生成 SSH 密钥

```bash
# 在本地生成密钥（如果还没有）
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# 复制公钥到 VPS
cat ~/.ssh/github_actions.pub | ssh root@your-vps "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# 复制私钥内容到 GitHub Secrets
cat ~/.ssh/github_actions
```

### 3. 准备工作

确保 VPS 上已安装和配置 Nginx：

```bash
# 安装 Nginx
sudo apt update
sudo apt install -y nginx

# 创建部署目录
sudo mkdir -p /var/www/super-code
sudo chown -R www-data:www-data /var/www/super-code
```

### 4. 触发部署

- **自动触发**: 推送代码到 `main` 或 `master` 分支
- **手动触发**: 在 GitHub Actions 页面点击 "Run workflow"

### 5. 查看部署状态

在 GitHub 仓库的 Actions 标签页查看部署状态。

---

## 故障排查

### 部署失败

1. 检查 Secrets 是否正确配置
2. 检查 VPS 防火墙是否允许 SSH
3. 检查 `.ssh/authorized_keys` 权限是否为 600

### 构建失败

1. 检查 `super-code/package.json` 是否存在
2. 检查是否有语法错误

### 权限问题

确保部署目录权限正确：
```bash
sudo chown -R www-data:www-data /var/www/super-code
sudo chmod -R 755 /var/www/super-code
```
