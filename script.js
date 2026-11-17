// Select DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const itemsLeftSpan = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// State variables
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Initialize the application
function init() {
    renderTodos();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Add new task on submit
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText !== '') {
            addTodo(taskText);
            todoInput.value = '';
            todoInput.focus();
        }
    });

    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Filter tasks
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
}

// Save tasks to localStorage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add a new task
function addTodo(text) {
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    todos.push(newTodo);
    saveToLocalStorage();
    renderTodos();
}

// Toggle complete status
function toggleTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveToLocalStorage();
    renderTodos();
}

// Delete task
function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
}

// Edit task
function editTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newText = prompt('Edit your task:', todo.text);
    if (newText !== null && newText.trim() !== '') {
        todo.text = newText.trim();
        saveToLocalStorage();
        renderTodos();
    }
}

// Clear all completed tasks
function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    saveToLocalStorage();
    renderTodos();
}

// Update task counter
function updateItemsLeft() {
    const activeCount = todos.filter((todo) => !todo.completed).length;
    itemsLeftSpan.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
}

// Render tasks to the DOM
function renderTodos() {
    todoList.innerHTML = '';

    // Filter tasks according to selected tab
    const filteredTodos = todos.filter((todo) => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true; // 'all'
    });

    if (filteredTodos.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'empty-state';
        emptyLi.textContent = todos.length === 0 ? 'No tasks yet. Add one above!' : 'No tasks in this view.';
        todoList.appendChild(emptyLi);
    } else {
        filteredTodos.forEach((todo) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleTodo(todo.id));

            // Task text
            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = todo.text;

            // Action buttons container
            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTodo(todo.id));

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(btnGroup);

            todoList.appendChild(li);
        });
    }

    updateItemsLeft();
}

// Start application
init();

