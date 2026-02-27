#!/bin/bash

echo "=== GitHub Pages部署修复脚本 ==="

# 1. 检查本地文件
echo "🔍 检查项目文件..."
if [ ! -f "index.html" ]; then
  echo "❌ 错误：index.html不存在于当前目录"
  exit 1
fi

# 2. 重新提交
echo "🔄 重新提交代码..."
git add .
git commit -m "修复GitHub Pages部署"
git push origin main

echo ""
echo "✅ 修复步骤已完成！"
echo "请访问：https://您的用户名.github.io/todo-app/"
echo "如果仍然有问题："
echo "1. 等待5-10分钟"
echo "2. 检查 https://github.com/您的用户名/todo-app/settings/pages"
echo "3. 确保选择'main'分支和'/(root)'文件夹"