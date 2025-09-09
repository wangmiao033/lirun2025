@echo off
echo 启动简化版利润管理系统...

echo 检查Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 启动后端服务...
start "利润管理系统后端" cmd /k "node server-simple.js"

echo 等待后端服务启动...
timeout /t 3 /nobreak >nul

echo 启动前端服务...
start "利润管理系统前端" cmd /k "cd client && npm start"

echo 系统启动完成！
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:5000
echo.
echo 按任意键退出...
pause >nul
