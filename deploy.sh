#!/bin/bash

# =============================================================================
# 超级密码机 - 自动部署脚本
# =============================================================================
# 使用方法:
#   1. 修改下方配置变量
#   2. 运行: chmod +x deploy.sh && ./deploy.sh
# =============================================================================

# -----------------------------------------------------------------------------
# 配置变量 - 请根据你的环境修改
# -----------------------------------------------------------------------------

# VPS 服务器配置
VPS_IP="62.192.173.109"                    # VPS服务器IP地址
VPS_USER="root"                         # SSH登录用户名
VPS_PORT="22"                           # SSH端口
SSH_KEY=""                              # SSH私钥路径，如 ~/.ssh/id_rsa，留空使用密码

# 域名配置
DOMAIN="scm.gsis.top"                # 你的域名，如果没有可先用IP地址
ENABLE_HTTPS="false"                     # 是否启用HTTPS (true/false)
EMAIL="your-email@example.com"          # 用于SSL证书的邮箱

# 部署路径
REMOTE_DIR="/var/www/super-code"        # 服务器上的部署目录
WEB_USER="www-data"                     # Web服务器运行用户

# 本地项目路径
PROJECT_DIR="$(cd "$(dirname "$0")/super-code" && pwd)"
BUILD_OUTPUT="$PROJECT_DIR/dist"

# 日志和备份
ENABLE_BACKUP="true"                    # 是否启用备份
BACKUP_DIR="/var/backups/super-code"    # 服务器备份目录
KEEP_BACKUP_DAYS=7                      # 保留备份天数

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# 函数定义
# =============================================================================

# 打印带颜色的信息（输出到stderr，避免影响函数返回值）
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1" >&2
}

# 检查本地依赖
check_local_deps() {
    log_step "检查本地依赖..."

    if ! command -v node &> /dev/null; then
        log_error "未安装 Node.js，请先安装"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "未安装 npm，请先安装"
        exit 1
    fi

    log_info "本地依赖检查通过"
}

# 安装项目依赖
install_deps() {
    log_step "安装项目依赖..."

    cd "$PROJECT_DIR" || exit 1

    if [ -d "node_modules" ]; then
        log_info "依赖已存在，跳过安装"
    else
        npm install
        if [ $? -ne 0 ]; then
            log_error "依赖安装失败"
            exit 1
        fi
        log_info "依赖安装完成"
    fi
}

# 构建项目
build_project() {
    log_step "构建项目..."

    cd "$PROJECT_DIR" || exit 1

    # 清理旧构建
    rm -rf dist

    # 执行构建
    npm run build
    if [ $? -ne 0 ]; then
        log_error "构建失败"
        exit 1
    fi

    # 检查构建输出
    if [ ! -d "$BUILD_OUTPUT" ]; then
        log_error "构建输出目录不存在: $BUILD_OUTPUT"
        exit 1
    fi

    # 显示构建大小
    BUILD_SIZE=$(du -sh "$BUILD_OUTPUT" | cut -f1)
    log_info "构建完成，大小: $BUILD_SIZE"
}

# 打包构建文件
pack_build() {
    log_step "打包构建文件..."

    cd "$PROJECT_DIR" || exit 1

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    PACKAGE_NAME="super-code_${TIMESTAMP}.tar.gz"
    tar -czf "$PACKAGE_NAME" -C "$BUILD_OUTPUT" .

    if [ $? -ne 0 ]; then
        log_error "打包失败"
        exit 1
    fi

    log_info "打包完成: $PACKAGE_NAME"
    echo "$PACKAGE_NAME"
}

# 检查SSH连接
check_ssh() {
    log_step "检查SSH连接..."

    SSH_OPTS="-o ConnectTimeout=5 -o StrictHostKeyChecking=no -p $VPS_PORT"
    if [ -n "$SSH_KEY" ]; then
        SSH_OPTS="$SSH_OPTS -i $SSH_KEY"
    fi

    ssh $SSH_OPTS "$VPS_USER@$VPS_IP" "echo 'SSH连接成功'" &> /dev/null
    if [ $? -ne 0 ]; then
        log_error "SSH连接失败，请检查IP、用户名和密钥配置"
        exit 1
    fi

    log_info "SSH连接正常"
}

# 在服务器上执行命令
run_remote() {
    SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=no -p $VPS_PORT"
    if [ -n "$SSH_KEY" ]; then
        SSH_OPTS="$SSH_OPTS -i $SSH_KEY"
    fi
    ssh $SSH_OPTS "$VPS_USER@$VPS_IP" "$1"
}

# 上传文件到服务器
upload_file() {
    local file=$1
    local remote_path=$2

    SCP_OPTS="-P $VPS_PORT"
    if [ -n "$SSH_KEY" ]; then
        SCP_OPTS="$SCP_OPTS -i $SSH_KEY"
    fi

    scp $SCP_OPTS "$file" "$VPS_USER@$VPS_IP:$remote_path"
    if [ $? -ne 0 ]; then
        log_error "文件上传失败: $file"
        exit 1
    fi
}

# 备份现有部署
backup_remote() {
    if [ "$ENABLE_BACKUP" != "true" ]; then
        return 0
    fi

    log_step "备份现有部署..."

    run_remote "
        if [ -d '$REMOTE_DIR' ] && [ \"\$(ls -A '$REMOTE_DIR')\" ]; then
            mkdir -p '$BACKUP_DIR'
            BACKUP_FILE='$BACKUP_DIR/super-code_\$(date +%Y%m%d_%H%M%S).tar.gz'
            tar -czf \"\$BACKUP_FILE\" -C '$REMOTE_DIR' . 2>/dev/null
            if [ \$? -eq 0 ]; then
                echo '备份完成: '\$BACKUP_FILE
                # 清理旧备份
                find '$BACKUP_DIR' -name 'super-code_*.tar.gz' -mtime +$KEEP_BACKUP_DAYS -delete
            fi
        fi
    "

    log_info "备份完成"
}

# 安装和配置Nginx
setup_nginx() {
    log_step "检查和安装Nginx..."

    run_remote "
        # 检查是否已安装nginx
        if ! command -v nginx &> /dev/null; then
            echo 'Nginx未安装，开始安装...'

            # 检测操作系统类型
            if [ -f /etc/debian_version ]; then
                # Debian/Ubuntu
                apt-get update
                apt-get install -y nginx
            elif [ -f /etc/redhat-release ]; then
                # CentOS/RHEL/Rocky
                if command -v dnf &> /dev/null; then
                    dnf install -y nginx
                else
                    yum install -y nginx
                fi
            elif [ -f /etc/alpine-release ]; then
                # Alpine
                apk add nginx
            else
                echo '不支持的操作系统'
                exit 1
            fi

            # 启动nginx
            systemctl start nginx
            systemctl enable nginx
            echo 'Nginx安装完成'
        else
            echo 'Nginx已安装'
        fi
    "

    log_info "Nginx检查完成"
}

# 配置Nginx站点
configure_nginx() {
    log_step "配置Nginx站点..."

    # 创建nginx配置
    local NGINX_CONFIG="server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    root $REMOTE_DIR;
    index index.html;

    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态资源缓存
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # 前端路由支持
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;

    # 日志
    access_log /var/log/nginx/super-code-access.log;
    error_log /var/log/nginx/super-code-error.log;
}"

    # 写入配置文件
    run_remote "
        # 删除默认配置
        rm -f /etc/nginx/sites-enabled/default
        rm -f /etc/nginx/conf.d/default.conf

        # 写入新配置
        cat > /etc/nginx/sites-available/super-code << 'EOF'
$NGINX_CONFIG
EOF

        # 创建软链接
        ln -sf /etc/nginx/sites-available/super-code /etc/nginx/sites-enabled/super-code

        # 测试配置
        nginx -t
        if [ \$? -ne 0 ]; then
            echo 'Nginx配置测试失败'
            exit 1
        fi

        # 重载nginx
        systemctl reload nginx
    "

    log_info "Nginx配置完成"
}

# 安装Certbot并配置HTTPS
setup_https() {
    if [ "$ENABLE_HTTPS" != "true" ]; then
        log_warn "跳过HTTPS配置"
        return 0
    fi

    # 检查是否是IP地址
    if [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        log_warn "使用IP地址，无法配置HTTPS"
        return 0
    fi

    log_step "配置HTTPS..."

    run_remote "
        # 安装certbot
        if ! command -v certbot &> /dev/null; then
            echo '安装Certbot...'
            if [ -f /etc/debian_version ]; then
                apt-get update
                apt-get install -y certbot python3-certbot-nginx
            elif [ -f /etc/redhat-release ]; then
                if command -v dnf &> /dev/null; then
                    dnf install -y certbot python3-certbot-nginx
                else
                    yum install -y certbot python3-certbot-nginx
                fi
            fi
        fi

        # 申请证书
        certbot --nginx -d '$DOMAIN' --non-interactive --agree-tos --email '$EMAIL' --redirect

        # 设置自动续期
        if command -v systemctl &> /dev/null; then
            systemctl enable certbot.timer
            systemctl start certbot.timer
        fi
    "

    log_info "HTTPS配置完成"
}

# 部署到服务器
deploy_to_server() {
    local package=$1

    log_step "部署到服务器..."

    # 创建远程目录
    run_remote "mkdir -p '$REMOTE_DIR'"

    # 上传包
    log_info "上传部署包..."
    upload_file "$PROJECT_DIR/$package" "/tmp/"

    # 解压并设置权限
    run_remote "
        cd '$REMOTE_DIR'
        tar -xzf '/tmp/$package' -C '$REMOTE_DIR'
        rm -f '/tmp/$package'
        chown -R '$WEB_USER:$WEB_USER' '$REMOTE_DIR'
        chmod -R 755 '$REMOTE_DIR'
        echo '部署文件解压完成'
    "

    log_info "部署完成"
}

# 验证部署
verify_deployment() {
    log_step "验证部署..."

    local URL
    if [ "$ENABLE_HTTPS" = "true" ] && ! [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        URL="https://$DOMAIN"
    else
        URL="http://$DOMAIN"
    fi

    log_info "请访问: $URL"
    log_info "如果域名未解析，请添加hosts记录或直接使用IP访问"
}

# 清理本地临时文件
cleanup() {
    log_step "清理临时文件..."

    cd "$PROJECT_DIR" || return

    # 删除打包的临时文件
    rm -f super-code_*.tar.gz

    log_info "清理完成"
}

# 显示配置摘要
show_config() {
    echo ""
    echo "=============================================="
    echo "  超级密码机 - 部署配置"
    echo "=============================================="
    echo "VPS IP:       $VPS_IP"
    echo "VPS 用户:     $VPS_USER"
    echo "VPS 端口:     $VPS_PORT"
    echo "域名:         $DOMAIN"
    echo "HTTPS:        $ENABLE_HTTPS"
    echo "远程目录:     $REMOTE_DIR"
    echo "项目路径:     $PROJECT_DIR"
    echo "=============================================="
    echo ""
}

# 主函数
main() {
    echo ""
    echo "🎮 超级密码机 - 自动部署脚本"
    echo ""

    # 显示配置
    show_config

    # 确认部署
    read -p "确认开始部署? [y/N]: " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        log_warn "取消部署"
        exit 0
    fi

    # 执行部署步骤
    check_local_deps
    install_deps
    build_project
    PACKAGE=$(pack_build)
    check_ssh
    backup_remote
    setup_nginx
    deploy_to_server "$PACKAGE"
    configure_nginx
    setup_https
    verify_deployment
    cleanup

    echo ""
    echo "🎉 部署成功!"
    echo ""
    if [ "$ENABLE_HTTPS" = "true" ] && ! [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "🌐 访问地址: https://$DOMAIN"
    else
        echo "🌐 访问地址: http://$DOMAIN"
    fi
    echo ""
}

# 如果直接运行此脚本
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi
