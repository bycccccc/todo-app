#!/bin/bash

echo "=== GitHub Pages 404错误修复 ==="

# 1. 检查本地文件
echo "🔍 验证项目文件..."
if [ ! -f "index.html" ]; then
  echo "❌ 错误：index.html不存在"
  exit 1
fi

# 2. 重新部署
echo "🚀 重新部署到GitHub..."
git add .
git commit -m "Fix GitHub Pages 404 error"
git push origin main

echo ""
echo "✅ 已重新部署！请执行以下操作："
echo "1. 访问 https://github.com/您的用户名/todo-app/settings/pages"
echo "2. 确认分支设置为 main/master"
echo "3. 选择 / (root) 文件夹"
echo "4. 等待约5分钟后访问："
echo "   https://您的用户名.github.io/todo-app/"
echo ""
echo "⚠️ 注意："
echo "- 首次部署可能需要10分钟"
echo "- 确保仓库是Public状态"
echo "- 仓库名不要包含特殊字符"