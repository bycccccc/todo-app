# 项目部署指南

## 📋 部署准备

### 1. 检查本地环境
```bash
# 需要安装的工具
- Git（版本控制）
- 浏览器（访问GitHub）
```

### 2. 项目结构确认
确保您的文件夹包含以下文件：
```
comate-zulu-demo/
├── index.html
├── style.css
├── script.js
├── README.md
├── PROJECT_GUIDE.md
└── example-data.json
```

## 🚀 部署到GitHub步骤

### 步骤1：创建GitHub账户和仓库
1. 访问 https://github.com
2. 注册或登录您的账户
3. 点击右上角 "+" → "New repository"
4. 填写仓库信息：
   - **Repository name**: `todo-app`
   - **Description**: "前端任务管理应用 - 实习项目"
   - 选择 **Public**（公开）
   - 不要勾选"Initialize with README"
5. 点击"Create repository"

### 步骤2：连接到本地项目
```bash
# 在项目目录中
cd /Users/yachenbo/ComateProjects/comate-zulu-demo

# 初始化Git
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: Task Manager App"
```

### 步骤3：推送到GitHub
复制GitHub提供的命令，类似这样：
```bash
git remote add origin https://github.com/您的用户名/todo-app.git
git branch -M main
git push -u origin main
```

### 步骤4：启用GitHub Pages
1. 访问您的仓库页面：`https://github.com/您的用户名/todo-app`
2. 点击"Settings"标签
3. 左侧菜单选择"Pages"
4. "Source"选择"Deploy from a branch"
5. "Branch"选择"main" → "/ (root)"文件夹
6. 点击"Save"

等待几分钟，访问：`https://您的用户名.github.io/todo-app/`

## 🌐 其他部署方式

### Vercel（推荐）
1. 访问 https://vercel.com
2. 连接GitHub账号
3. 导入您的`todo-app`仓库
4. 自动部署，获得：`todo-app.vercel.app`

### Netlify
1. 访问 https://netlify.com
2. 直接拖放项目文件夹
3. 获得：`todo-app.netlify.app`

## 📱 简易部署脚本

创建一个一键部署脚本：

<run_command>