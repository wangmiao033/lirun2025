#!/bin/bash

echo "启动利润管理系统..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查MongoDB
if ! command -v mongod &> /dev/null; then
    echo "警告: 未找到MongoDB，请确保MongoDB服务正在运行"
fi

# 安装后端依赖
if [ ! -d "node_modules" ]; then
    echo "安装后端依赖..."
    npm install
fi

# 安装前端依赖
if [ ! -d "client/node_modules" ]; then
    echo "安装前端依赖..."
    cd client
    npm install
    cd ..
fi

# 启动后端服务
echo "启动后端服务..."
npm start &
BACKEND_PID=$!

# 等待后端服务启动
sleep 3

# 启动前端服务
echo "启动前端服务..."
cd client
npm start &
FRONTEND_PID=$!
cd ..

echo "系统启动完成！"
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:5000"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
