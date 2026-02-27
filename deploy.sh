#!/bin/bash

# 部署脚本：将项目推送到GitHub并启用GitHub Pages

set -e  # 遇到错误退出

echo "🚀 开始部署项目到GitHub..."

# 检查是否在正确的目录
cd /Users/yachenbo/ComateProjects/comate-zulu-demo

# 检查Git是否已初始化
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
fi

# 添加所有文件
echo "📄 添加文件到Git..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "部署: 前端任务管理应用 v1.0" || echo "没有更改需要提交"

# 添加远程仓库（需要您替换为实际的仓库URL）
echo ""
echo "🔗 添加远程仓库地址..."
echo "请在GitHub创建仓库后，复制以下信息："
echo ""
echo "1. 访问 https://github.com/new"
echo "2. 创建名为 'todo-app' 的仓库"
echo "3. 复制仓库的HTTPS/SSH地址"
echo "4. 回到此窗口继续部署"
echo ""
read -p "请输入您的GitHub仓库地址（例如：https://github.com/您的用户名/todo-app.git）: " repo_url

# 添加远程仓库
git remote remove origin 2>/dev/null || true
git remote add origin "$repo_url"

# 推送代码
echo "🚢 推送代码到GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ 代码推送完成！"
echo ""
echo "📱 现在启用GitHub Pages："
echo "1. 访问您的仓库页面：${repo_url%.git}"
echo "2. 点击 'Settings' 标签"
echo "3. 左侧菜单选择 'Pages'"
echo "4. 'Source' 选择 'Deploy from a branch'"
echo "5. 'Branch' 选择 'main'，文件夹选择 '/'"
echo "6. 点击 'Save'"
echo ""
echo "🌐 几分钟后您的项目将在以下地址访问："
echo "   https://您的用户名.github.io/todo-app/"
echo ""
echo "🎉 部署完成！可以将此链接分享给任何人"