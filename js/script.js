const taskInput = document.getElementById('todo-add');
const dateInput = document.getElementById('todo-date');
const addTaskBtn = document.getElementById('addBtn');
const itemsLeft = document.getElementById('items-left');
const todoList = document.getElementById('todo-list');
const clearAll = document.getElementById('clear-task');
const emptyState = document.querySelector('.empty-state');
const filters = document.querySelectorAll('.filter');

let todos = [];
let currentFilter = 'all';

// === Event Listeners ===
addTaskBtn.addEventListener('click', () => {
    addTodo(taskInput.value, dateInput.value);
});

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo(taskInput.value, dateInput.value);
});

dateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo(taskInput.value, dateInput.value);
});

clearAll.addEventListener('click', () => {
    todos = [];
    saveTodos();
    renderTodos();
});

// === Fungsi Tambah Todo ===
function addTodo(text, date) {
    if (text.trim() === '') return;

    const newTodo = {
        id: Date.now(),
        text,
        date: date || "",
        completed: false
    };

    todos.push(newTodo);

    taskInput.value = "";
    dateInput.value = "";

    saveTodos();
    renderTodos();
}

// === Local Storage ===
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateItemsCount();
    checkEmptyState();
}

// === Hitung Item ===
function updateItemsCount() {
    const pendingTodos = todos.filter(todo => !todo.completed);
    itemsLeft.textContent = `${pendingTodos.length} item${pendingTodos.length !== 1 ? 's' : ''} left`;
}

// === Kosong State ===
function checkEmptyState() {
    const filtered = filterTodos(currentFilter);
    if (filtered.length === 0) emptyState.classList.remove('hidden');
    else emptyState.classList.add('hidden');
}

// === Filter ===
function filterTodos(filter) {
    switch (filter) {
        case 'pending':
            return todos.filter(todo => !todo.completed);
        case 'complete':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// === Render List ===
function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = filterTodos(currentFilter);
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        if (todo.completed) todoItem.classList.add('completed');

        // checkbox
        const checkboxContainer = document.createElement('label');
        checkboxContainer.classList.add('checkbox-container');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('todo-checkbox');
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const checkmark = document.createElement('span');
        checkmark.classList.add('checkmark');

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkmark);

        // text
        const todoText = document.createElement('span');
        todoText.classList.add('todo-text');
        todoText.textContent = todo.text;

        // date
        const todoDate = document.createElement('span');
        todoDate.classList.add('todo-date');
        todoDate.textContent = todo.date;

        // delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        todoItem.appendChild(checkboxContainer);
        todoItem.appendChild(todoText);
        todoItem.appendChild(todoDate);
        todoItem.appendChild(deleteBtn);

        todoList.appendChild(todoItem);
    });

    checkEmptyState();
}

// === Toggle Complete ===
function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    saveTodos();
    renderTodos();
}

// === Delete Todo ===
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// === Filter Buttons ===
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));

        filter.classList.add('active');

        currentFilter = filter.dataset.filter;

        renderTodos();
    });
});