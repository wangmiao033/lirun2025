#!/bin/bash

echo "🚀 开始部署利润管理系统..."

# 检查Git状态
echo "📋 检查Git状态..."
git status

# 添加所有更改
echo "📁 添加所有更改..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "修复空白页面问题 - 创建简化版本 v1.8.1

- 创建了简化的HTML页面，不依赖复杂JavaScript
- 添加了静态的仪表盘内容
- 修复了构建和部署问题
- 确保网站可以正常显示内容"

# 推送到远程仓库
echo "🌐 推送到远程仓库..."
git push origin main

echo "✅ 部署完成！"
echo "🔗 请访问: https://lirun2025.onrender.com"
echo "⏱️ 等待Render自动部署完成（通常需要2-5分钟）"
