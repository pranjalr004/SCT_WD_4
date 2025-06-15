// script.js
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        
        // DOM Elements
        this.taskInput = document.getElementById('taskInput');
        this.taskDateTime = document.getElementById('taskDateTime');
        this.taskList = document.getElementById('taskList');
        this.addTaskBtn = document.getElementById('addTask');
        this.clearAllBtn = document.getElementById('clearAll');
        this.pendingTasksCount = document.getElementById('pendingTasks');
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editTaskDateTime = document.getElementById('editTaskDateTime');
        
        this.initializeEventListeners();
        this.renderTasks();
    }

    initializeEventListeners() {
        // Add task
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Clear all tasks
        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());

        // Filter tasks
        document.querySelectorAll('.filter-options button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
                this.updateFilterButtons();
                this.renderTasks();
            });
        });

        // Edit modal events
        document.getElementById('saveEdit').addEventListener('click', () => this.saveEdit());
        document.getElementById('cancelEdit').addEventListener('click', () => this.closeEditModal());
    }

    addTask() {
        const text = this.taskInput.value.trim();
        const dateTime = this.taskDateTime.value;

        if (text) {
            const task = {
                id: Date.now(),
                text,
                dateTime,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.tasks.unshift(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
            this.taskDateTime.value = '';
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTaskStatus(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingTaskId = id;
            this.editTaskInput.value = task.text;
            this.editTaskDateTime.value = task.dateTime;
            this.editModal.classList.add('show');
        }
    }

    saveEdit() {
        const task = this.tasks.find(task => task.id === this.editingTaskId);
        if (task) {
            task.text = this.editTaskInput.value.trim();
            task.dateTime = this.editTaskDateTime.value;
            this.saveTasks();
            this.renderTasks();
        }
        this.closeEditModal();
    }

    closeEditModal() {
        this.editModal.classList.remove('show');
        this.editingTaskId = null;
    }

    clearAllTasks() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-options button').forEach(button => {
            button.classList.toggle('active', button.dataset.filter === this.currentFilter);
        });
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <span class="task-date">${task.dateTime ? new Date(task.dateTime).toLocaleString() : 'No date set'}</span>
                </div>
                <div class="task-actions">
                    <button onclick="taskManager.toggleTaskStatus(${task.id})">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button onclick="taskManager.editTask(${task.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="taskManager.deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            this.taskList.appendChild(li);
        });

        this.updatePendingCount();
    }

    updatePendingCount() {
        const pendingCount = this.tasks.filter(task => !task.completed).length;
        this.pendingTasksCount.textContent = pendingCount;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the Task Manager
const taskManager = new TaskManager();