# 超级密码机 - 部署指南

## 快速开始

### 1. 配置部署脚本

编辑 `deploy.sh` 文件，修改以下变量：

```bash
# VPS 服务器配置
VPS_IP="8.8.8.8"           # 你的VPS IP地址
VPS_USER="root"                  # SSH用户名
VPS_PORT="22"                    # SSH端口
SSH_KEY="~/.ssh/id_rsa"          # SSH私钥路径（可选）

# 域名配置
DOMAIN="game.yourdomain.com"     # 你的域名
ENABLE_HTTPS="true"              # 是否启用HTTPS
EMAIL="admin@yourdomain.com"     # SSL证书邮箱
```

### 2. 配置SSH免密登录（推荐）

```bash
# 生成SSH密钥（如果没有）
ssh-keygen -t rsa -b 4096

# 复制公钥到VPS
ssh-copy-id -p 22 root@123.456.789.0
```

### 3. 执行部署

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行部署
./deploy.sh
```

---

## 手动部署步骤

如果不想使用自动脚本，可以手动执行：

### 1. 本地构建

```bash
cd super-code
npm install
npm run build
```

### 2. 上传到VPS

```bash
# 打包
cd super-code/dist
tar -czf ../super-code.tar.gz .

# 上传
scp super-code.tar.gz root@your-vps:/tmp/

# 解压
ssh root@your-vps "mkdir -p /var/www/super-code && tar -xzf /tmp/super-code.tar.gz -C /var/www/super-code"
```

### 3. 安装Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx

# 启动
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. 配置Nginx

创建 `/etc/nginx/sites-available/super-code`：

```nginx
server {
    listen 80;
    server_name game.yourdomain.com;

    root /var/www/super-code;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/javascript;
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/super-code /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. 配置HTTPS（可选）

```bash
# 安装certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d game.yourdomain.com
```

---

## Docker部署

### 使用Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3'
services:
  super-code:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./super-code/dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
```

启动：

```bash
docker-compose up -d
```

---

## 常见问题

### 1. 部署后页面空白

检查Nginx配置中的 `try_files` 是否正确：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. HTTPS证书申请失败

- 确保域名已正确解析到VPS
- 确保80端口可被外网访问
- 检查防火墙设置

### 3. SSH连接失败

- 检查IP、用户名、密码/密钥
- 检查VPS防火墙是否允许SSH端口
- 检查本地SSH密钥权限 (`chmod 600 ~/.ssh/id_rsa`)

### 4. 权限问题

确保Web目录权限正确：
```bash
sudo chown -R www-data:www-data /var/www/super-code
sudo chmod -R 755 /var/www/super-code
```

---

## 更新部署

重新运行 `deploy.sh` 即可，脚本会自动：
1. 备份现有部署
2. 构建新版本
3. 上传到服务器
4. 保持原有配置

---

## 安全建议

1. 使用非root用户运行部署（修改 `VPS_USER`）
2. 配置防火墙，只开放80/443端口
3. 定期更新系统和Nginx
4. 启用自动备份（`ENABLE_BACKUP="true"`）
