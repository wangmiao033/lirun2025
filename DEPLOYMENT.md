# 利润管理系统部署指南

## 系统要求

### 最低配置
- **操作系统**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: 16.0.0 或更高版本
- **MongoDB**: 4.4.0 或更高版本
- **内存**: 4GB RAM
- **存储**: 2GB 可用空间

### 推荐配置
- **内存**: 8GB RAM 或更多
- **存储**: 10GB 可用空间
- **网络**: 稳定的互联网连接

## 安装步骤

### 1. 安装 Node.js
访问 [Node.js官网](https://nodejs.org/) 下载并安装最新LTS版本。

验证安装：
```bash
node --version
npm --version
```

### 2. 安装 MongoDB

#### Windows
1. 下载 MongoDB Community Server
2. 运行安装程序
3. 启动 MongoDB 服务

#### macOS
```bash
# 使用 Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Ubuntu/Debian
```bash
# 导入公钥
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加仓库
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 安装 MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# 启动服务
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. 部署应用

#### 方法一：使用启动脚本（推荐）

**Windows:**
```bash
# 双击运行
start.bat

# 或命令行运行
start.bat
```

**Linux/macOS:**
```bash
# 给脚本执行权限
chmod +x start.sh

# 运行脚本
./start.sh
```

#### 方法二：手动启动

1. **安装依赖**
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

2. **初始化数据（可选）**
```bash
# Windows
scripts\initData.bat

# Linux/macOS
node scripts/initData.js
```

3. **启动服务**
```bash
# 启动后端（终端1）
npm start

# 启动前端（终端2）
cd client
npm start
```

### 4. 验证部署

访问以下地址验证系统是否正常运行：
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:5000

运行API测试：
```bash
node test-api.js
```

## 配置说明

### 环境变量配置

创建 `.env` 文件：
```env
# 应用配置
NODE_ENV=production
PORT=5000

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/profit_management

# 安全配置
JWT_SECRET=your_very_secure_jwt_secret_key_here

# 文件上传配置
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 生产环境配置

1. **修改数据库连接**
```env
MONGODB_URI=mongodb://username:password@host:port/database
```

2. **设置安全密钥**
```env
JWT_SECRET=your_production_jwt_secret_key
```

3. **配置反向代理（可选）**
使用 Nginx 或 Apache 作为反向代理。

## 生产环境部署

### 使用 PM2 部署

1. **安装 PM2**
```bash
npm install -g pm2
```

2. **创建 PM2 配置文件**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'profit-management-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

3. **启动应用**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 使用 Docker 部署

1. **创建 Dockerfile**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

2. **构建和运行**
```bash
docker build -t profit-management .
docker run -p 5000:5000 profit-management
```

### 使用 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/profit_management

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

启动：
```bash
docker-compose up -d
```

## 维护和监控

### 日志管理
```bash
# 查看 PM2 日志
pm2 logs

# 查看特定应用日志
pm2 logs profit-management-backend
```

### 数据备份
```bash
# 备份 MongoDB 数据
mongodump --db profit_management --out ./backup

# 恢复数据
mongorestore --db profit_management ./backup/profit_management
```

### 性能监控
- 使用 PM2 监控应用状态
- 监控 MongoDB 性能
- 设置日志轮转

## 故障排除

### 常见问题

1. **端口被占用**
```bash
# 查找占用端口的进程
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/macOS

# 杀死进程
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Linux/macOS
```

2. **MongoDB 连接失败**
- 检查 MongoDB 服务是否运行
- 验证连接字符串
- 检查防火墙设置

3. **前端无法连接后端**
- 检查后端服务是否运行
- 验证 API 地址配置
- 检查 CORS 设置

4. **文件上传失败**
- 检查文件大小限制
- 验证文件格式
- 检查磁盘空间

### 日志分析
```bash
# 查看应用日志
tail -f logs/app.log

# 查看错误日志
grep "ERROR" logs/app.log
```

## 安全建议

1. **更改默认配置**
   - 修改 JWT 密钥
   - 使用强密码
   - 限制数据库访问

2. **网络安全**
   - 使用 HTTPS
   - 配置防火墙
   - 定期更新依赖

3. **数据安全**
   - 定期备份数据
   - 加密敏感信息
   - 访问控制

## 更新和维护

### 应用更新
```bash
# 拉取最新代码
git pull origin main

# 更新依赖
npm install
cd client && npm install && cd ..

# 重启服务
pm2 restart profit-management-backend
```

### 数据库迁移
```bash
# 运行迁移脚本
node scripts/migrate.js
```

## 技术支持

如遇到问题，请：
1. 查看日志文件
2. 检查系统要求
3. 参考故障排除部分
4. 联系技术支持团队
