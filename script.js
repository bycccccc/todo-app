// Todo List 应用主逻辑
class TodoApp {
    constructor() {
        // 初始化数据模型
        this.tasks = JSON.parse(localStorage.getItem('todo-tasks')) || [];
        this.currentFilter = 'all';
        
        // 缓存DOM元素
        this.cacheElements();
        // 绑定事件监听器
        this.bindEvents();
        // 初始化应用
        this.init();
    }
    
    // 缓存常用DOM元素
    cacheElements() {
        this.elements = {
            taskInput: document.getElementById('taskInput'),
            addTaskBtn: document.getElementById('addTaskBtn'),
            taskList: document.getElementById('taskList'),
            totalTasks: document.getElementById('totalTasks'),
            pendingTasks: document.getElementById('pendingTasks'),
            completedTasks: document.getElementById('completedTasks'),
            filterTabs: document.querySelectorAll('.filter-tab'),
            clearCompletedBtn: document.getElementById('clearCompletedBtn'),
            dataModal: document.getElementById('dataModal'),
            modalClose: document.querySelector('.modal-close'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            resetBtn: document.getElementById('resetBtn'),
            modalTitle: document.getElementById('modalTitle'),
            exportContent: document.getElementById('exportContent'),
            importContent: document.getElementById('importContent'),
            jsonData: document.getElementById('jsonData'),
            copyBtn: document.getElementById('copyBtn'),
            importData: document.getElementById('importData'),
            importConfirmBtn: document.getElementById('importConfirmBtn')
        };
    }
    
    // 绑定所有事件监听器
    bindEvents() {
        // 添加任务事件
        this.elements.addTaskBtn.addEventListener('click', () => this.addTask());
        this.elements.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        // 过滤事件
        this.elements.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => this.setFilter(tab.dataset.filter));
        });
        
        // 清除已完成事件
        this.elements.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        // 模态框事件
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.exportBtn.addEventListener('click', () => this.openExportModal());
        this.elements.importBtn.addEventListener('click', () => this.openImportModal());
        this.elements.resetBtn.addEventListener('click', () => this.resetData());
        
        // 数据操作事件
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.elements.importConfirmBtn.addEventListener('click', () => this.confirmImport());
        
        // 点击模态框外部关闭
        this.elements.dataModal.addEventListener('click', (e) => {
            if (e.target === this.elements.dataModal) {
                this.closeModal();
            }
        });
    }
    
    // 初始化应用
    init() {
        this.updateTaskList();
        this.updateStats();
        this.saveToLocalStorage();
    }
    
    // 添加新任务
    addTask() {
        const text = this.elements.taskInput.value.trim();
        
        if (!text) {
            this.showMessage('请输入任务内容！', 'warning');
            this.elements.taskInput.focus();
            return;
        }
        
        // 检查是否已存在相同任务（避免重复）
        const isDuplicate = this.tasks.some(task => 
            task.text.toLowerCase() === text.toLowerCase()
        );
        
        if (isDuplicate) {
            this.showMessage('该任务已存在！', 'warning');
            return;
        }
        
        // 创建新任务对象
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        // 添加到任务列表
        this.tasks.unshift(newTask);
        
        // 更新界面
        this.updateTaskList();
        this.updateStats();
        this.saveToLocalStorage();
        
        // 清空输入框
        this.elements.taskInput.value = '';
        this.elements.taskInput.focus();
        
        // 显示成功消息
        this.showMessage('任务添加成功！', 'success');
    }
    
    // 切换任务完成状态
    toggleTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) return;
        
        this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
        this.tasks[taskIndex].completedAt = this.tasks[taskIndex].completed ? 
            new Date().toISOString() : null;
        
        // 重新排序：未完成的任务在前，已完成的任务在后
        const completedTasks = this.tasks.filter(task => task.completed);
        const pendingTasks = this.tasks.filter(task => !task.completed);
        this.tasks = [...pendingTasks, ...completedTasks];
        
        this.updateTaskList();
        this.updateStats();
        this.saveToLocalStorage();
    }
    
    // 编辑任务文本
    editTask(taskId, newText) {
        if (!newText.trim()) {
            this.deleteTask(taskId);
            return;
        }
        
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) return;
        
        // 检查是否与现有任务重复
        const isDuplicate = this.tasks.some((task, index) => 
            index !== taskIndex && 
            task.text.toLowerCase() === newText.trim().toLowerCase()
        );
        
        if (isDuplicate) {
            this.showMessage('该任务已存在！', 'warning');
            return;
        }
        
        this.tasks[taskIndex].text = newText.trim();
        this.updateTaskList();
        this.saveToLocalStorage();
        this.showMessage('任务已更新', 'success');
    }
    
    // 删除任务
    deleteTask(taskId) {
        if (!confirm('确定要删除这个任务吗？')) return;
        
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) return;
        
        const taskText = this.tasks[taskIndex].text;
        this.tasks.splice(taskIndex, 1);
        
        this.updateTaskList();
        this.updateStats();
        this.saveToLocalStorage();
        this.showMessage(`任务"${taskText}"已删除`, 'info');
    }
    
    // 删除所有已完成任务
    clearCompleted() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        if (completedCount === 0) {
            this.showMessage('没有已完成的任务', 'info');
            return;
        }
        
        if (!confirm(`确定要删除 ${completedCount} 个已完成的任务吗？`)) return;
        
        this.tasks = this.tasks.filter(task => !task.completed);
        
        this.updateTaskList();
        this.updateStats();
        this.saveToLocalStorage();
        this.showMessage(`已删除 ${completedCount} 个已完成的任务`, 'success');
    }
    
    // 设置当前过滤器
    setFilter(filter) {
        this.currentFilter = filter;
        
        // 更新过滤标签状态
        this.elements.filterTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });
        
        // 更新任务列表
        this.updateTaskList();
    }
    
    // 获取过滤后的任务
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return [...this.tasks];
        }
    }
    
    // 更新任务列表显示
    updateTaskList() {
        const filteredTasks = this.getFilteredTasks();
        const listElement = this.elements.taskList;
        
        if (filteredTasks.length === 0) {
            const emptyState = {
                all: '<li class="empty-state"><i class="fas fa-clipboard-list"></i><p>还没有任务，开始添加你的第一个任务吧！</p></li>',
                pending: '<li class="empty-state"><i class="fas fa-clock"></i><p>没有未完成的任务，太棒了！</p></li>',
                completed: '<li class="empty-state"><i class="fas fa-check-circle"></i><p>还没有完成的任务，继续努力！</p></li>'
            }[this.currentFilter] || emptyState.all;
            
            listElement.innerHTML = emptyState;
            return;
        }
        
        listElement.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox" onclick="todoApp.toggleTask('${task.id}')"></div>
                <div class="task-content">
                    <div 
                        class="task-text" 
                        contenteditable="true"
                        ondblclick="todoApp.toggleTask('${task.id}')"
                        onkeypress="if(event.key === 'Enter') {this.blur(); return false;}"
                        onblur="todoApp.editTask('${task.id}', this.textContent)"
                    >${this.escapeHTML(task.text)}</div>
                    ${task.completed && task.completedAt ? `
                        <small class="task-completed-time">
                            完成于 ${new Date(task.completedAt).toLocaleDateString()}
                        </small>
                    ` : ''}
                    ${task.createdAt ? `
                        <small class="task-created-time">
                            创建于 ${new Date(task.createdAt).toLocaleDateString()}
                        </small>
                    ` : ''}
                </div>
                <div class="task-actions">
                    <button class="task-action-btn" onclick="todoApp.deleteTask('${task.id}')" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
    }
    
    // 更新统计信息
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        this.elements.totalTasks.textContent = total;
        this.elements.pendingTasks.textContent = pending;
        this.elements.completedTasks.textContent = completed;
    }
    
    // 打开导出模态框
    openExportModal() {
        this.elements.modalTitle.textContent = '导出任务数据';
        this.elements.exportContent.classList.add('active');
        this.elements.importContent.classList.remove('active');
        
        const data = JSON.stringify(this.tasks, null, 2);
        this.elements.jsonData.value = data;
        
        this.elements.dataModal.classList.add('active');
    }
    
    // 打开导入模态框
    openImportModal() {
        this.elements.modalTitle.textContent = '导入任务数据';
        this.elements.exportContent.classList.remove('active');
        this.elements.importContent.classList.add('active');
        this.elements.importData.value = '';
        
        this.elements.dataModal.classList.add('active');
    }
    
    // 确认导入数据
    confirmImport() {
        const dataString = this.elements.importData.value.trim();
        
        if (!dataString) {
            this.showMessage('请输入要导入的JSON数据', 'warning');
            return;
        }
        
        try {
            const importedTasks = JSON.parse(dataString);
            
            // 验证数据格式
            if (!Array.isArray(importedTasks)) {
                throw new Error('数据格式错误：应为数组');
            }
            
            // 验证每个任务对象
            for (const task of importedTasks) {
                if (!task.id || !task.text || typeof task.completed !== 'boolean') {
                    throw new Error('任务数据格式错误：每个任务应包含 id, text, completed 字段');
                }
            }
            
            // 确认导入
            if (!confirm(`确定要导入 ${importedTasks.length} 个任务吗？当前任务将被覆盖。`)) {
                return;
            }
            
            this.tasks = importedTasks;
            this.updateTaskList();
            this.updateStats();
            this.saveToLocalStorage();
            this.closeModal();
            this.showMessage(`成功导入 ${importedTasks.length} 个任务`, 'success');
            
        } catch (error) {
            this.showMessage(`导入失败：${error.message}`, 'warning');
        }
    }
    
    // 复制到剪贴板
    copyToClipboard() {
        this.elements.jsonData.select();
        
        try {
            document.execCommand('copy');
            this.showMessage('数据已复制到剪贴板！', 'success');
        } catch (error) {
            this.showMessage('复制失败，请手动复制', 'warning');
        }
    }
    
    // 重置数据
    resetData() {
        if (!confirm('确定要重置所有数据吗？这将删除所有任务且不可恢复。')) {
            return;
        }
        
        this.tasks = [];
        this.updateTaskList();
        this.updateStats();
        this.saveToLocalStorage();
        this.showMessage('所有数据已重置', 'success');
    }
    
    // 关闭模态框
    closeModal() {
        this.elements.dataModal.classList.remove('active');
    }
    
    // 保存到本地存储
    saveToLocalStorage() {
        localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
    }
    
    // 显示消息提示
    showMessage(message, type = 'info') {
        // 移除现有的消息
        const existingMessage = document.querySelector('.message-toast');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `message-toast message-${type}`;
        messageElement.innerHTML = `
            <i class="fas ${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // 添加到页面
        document.body.appendChild(messageElement);
        
        // 显示消息
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // 自动移除
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 3000);
    }
    
    // 获取消息图标
    getMessageIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            danger: 'fa-times-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
    
    // HTML转义，防止XSS攻击
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// 初始化消息提示样式
const messageStyles = document.createElement('style');
messageStyles.textContent = `
.message-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 350px;
}

.message-toast.show {
    transform: translateX(0);
    opacity: 1;
}

.message-success {
    border-left: 4px solid #4cc9f0;
    color: #2e8b57;
}

.message-warning {
    border-left: 4px solid #f72585;
    color: #b8860b;
}

.message-info {
    border-left: 4px solid #7209b7;
    color: #31708f;
}

.message-danger {
    border-left: 4px solid #dc3545;
    color: #721c24;
}

.message-toast i {
    font-size: 18px;
}

.task-completed-time,
.task-created-time {
    display: block;
    font-size: 0.8rem;
    color: var(--text-light);
    margin-top: 4px;
}
`;
document.head.appendChild(messageStyles);

// 初始化TodoApp实例
let todoApp;

// 当页面加载完成时初始化应用
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});

// 暴露到全局作用域，以便在HTML中调用
window.todoApp = todoApp;