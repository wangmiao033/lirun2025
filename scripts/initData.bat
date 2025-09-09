@echo off
echo 初始化利润管理系统示例数据...

echo 检查Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 检查MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo 警告: 未找到MongoDB，请确保MongoDB服务正在运行
)

echo 运行数据初始化脚本...
node scripts/initData.js

echo.
echo 数据初始化完成！
echo 现在可以启动系统查看示例数据
echo.
pause
