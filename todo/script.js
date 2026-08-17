// Todo App with Local Storage

class TodoApp {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    this.filter = 'all';
    this.sortBy = 'newest';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTheme();
    this.render();
  }

  setupEventListeners() {
    // Add Todo
    document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTodo();
    });

    // Theme Toggle
    document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());

    // Clear All
    document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());

    // Filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.filter = e.target.dataset.filter;
        this.render();
      });
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.render();
    });
  }

  addTodo() {
    const input = document.getElementById('todoInput');
    const priority = document.getElementById('prioritySelect').value;
    const text = input.value.trim();

    if (!text) {
      this.showToast('Please enter a task!');
      return;
    }

    if (text.length < 3) {
      this.showToast('Task must be at least 3 characters long!');
      return;
    }

    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      priority: priority,
      createdAt: new Date().toISOString(),
      dueDate: this.getNextDayISOString()
    };

    this.todos.unshift(todo);
    this.save();
    this.render();
    input.value = '';
    this.showToast('✓ Task added!');
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.save();
      this.render();
    }
  }

  deleteTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index > -1) {
      this.todos.splice(index, 1);
      this.save();
      this.render();
      this.showToast('✓ Task deleted!');
    }
  }

  editTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      const newText = prompt('Edit task:', todo.text);
      if (newText && newText.trim()) {
        todo.text = newText.trim();
        this.save();
        this.render();
        this.showToast('✓ Task updated!');
      }
    }
  }

  getFilteredTodos() {
    let filtered = this.todos;

    if (this.filter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (this.filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (this.filter === 'high') {
      filtered = filtered.filter(t => t.priority === 'high');
    }

    return this.sortTodos(filtered);
  }

  sortTodos(todos) {
    const sorted = [...todos];

    if (this.sortBy === 'oldest') {
      sorted.reverse();
    } else if (this.sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (this.sortBy === 'name') {
      sorted.sort((a, b) => a.text.localeCompare(b.text));
    }
    // newest is default (no change)

    return sorted;
  }

  render() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = this.getFilteredTodos();

    // Update stats
    this.updateStats();

    if (filteredTodos.length === 0) {
      todoList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📝</span>
          <p>No tasks found. ${this.filter === 'all' ? 'Add one to get started!' : 'Try changing your filter.'}</p>
        </div>
      `;
      return;
    }

    todoList.innerHTML = filteredTodos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${todo.completed ? 'checked' : ''}
          onchange="app.toggleTodo(${todo.id})"
        >
        <div class="todo-content">
          <div class="todo-text">${this.escapeHtml(todo.text)}</div>
          <div class="todo-info">
            <span class="todo-date">${this.formatDate(todo.createdAt)}</span>
            <span class="todo-priority priority-${todo.priority}">${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>
          </div>
        </div>
        <div class="todo-actions">
          <button class="btn-icon" onclick="app.editTodo(${todo.id})" title="Edit">✏️</button>
          <button class="btn-icon btn-delete" onclick="app.deleteTodo(${todo.id})" title="Delete">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const remaining = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('remainingTasks').textContent = remaining;
  }

  clearAll() {
    if (this.todos.length === 0) {
      this.showToast('No tasks to clear!');
      return;
    }

    if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
      this.todos = [];
      this.save();
      this.render();
      this.showToast('✓ All tasks cleared!');
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
  }

  loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.getElementById('themeBtn').textContent = '☀️';
    }
  }

  save() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  getNextDayISOString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize App
const app = new TodoApp();
