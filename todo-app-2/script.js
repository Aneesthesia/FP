// Картинки справа
const RIGHT_IMAGES = [
    'assets/img/выполнено1.jpg',
    'assets/img/выполнено2.jpg',
    'assets/img/выполнено3.jpg',
    'assets/img/выполнено4.jpg',
    'assets/img/выполнено5.jpg',
    'assets/img/выполнено6.jpg',
    'assets/img/выполнено7.jpg',
    'assets/img/выполнено8.jpg',
    'assets/img/выполнено9.jpg',
    'assets/img/выполнено10.jpg',
    'assets/img/выполнено11.jpg',
    'assets/img/выполнено12.jpg',
    'assets/img/выполнено13.jpg',
    'assets/img/выполнено14.jpg',
    'assets/img/выполнено15.jpg',
    'assets/img/выполнено16.jpg',
    'assets/img/выполнено17.jpg',
    'assets/img/выполнено18.jpg',
    'assets/img/выполнено19.jpg',
    'assets/img/выполнено20.jpg',
    'assets/img/выполнено21.jpg',
];

let currentRightImageIndex = 0;
let rightImageInterval = null; // будет запущен один раз
let isRightImageVisible = false; // состояние видимости

// Константы и конфигурация
const API_URL = 'http://localhost:3001/tasks';
const FILTERS = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed'
};

// Генерация уникального ID строкой
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Чистые функции для работы с DOM
const createElement = (tag, className, content = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
};

const createButton = (className, onClick, innerHTML = '') => {
    const button = createElement('button', className);
    button.innerHTML = innerHTML;
    button.addEventListener('click', onClick);
    return button;
};

// Создание задачи (используется в обработчике события добавления)
const createTaskObject = (text, completed = false) => ({
    id: generateId(),
    text: text.trim(),
    completed
});

//Изменение статуса задачи (используется в обработчике изменения статуса)
const toggleTaskCompletion = (task) => ({
    ...task,
    completed: !task.completed
});

//Изменение текста задачи
const updateTaskText = (task, newText) => ({
    ...task,
    text: newText.trim()
});

//Фильтрация задач
const filterTasks = (tasks, filterType) => {
    switch (filterType) {
        case FILTERS.ACTIVE:
            return tasks.filter(task => !task.completed);
        case FILTERS.COMPLETED:
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
};

// Функции работы с API (с изоляцией побочных эффектов)
const apiRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

const fetchTasks = () => apiRequest(API_URL);
const createTask = (task) => apiRequest(API_URL, {
    method: 'POST',
    body: JSON.stringify(task)
});
const updateTask = (task) => apiRequest(`${API_URL}/${task.id}`, {
    method: 'PUT',
    body: JSON.stringify(task)
});
const deleteTask = (id) => apiRequest(`${API_URL}/${id}`, {
    method: 'DELETE'
});

// Функции для рендеринга (побочные эффекты)
const renderTask = (task, onToggle, onEdit, onDelete) => {
    const taskContainer = createElement('div', 'task-container');
    
    const checkButton = createButton('check-button', () => onToggle(task));
    if (task.completed) {
        checkButton.style.backgroundColor = '#4CAF50';
        checkButton.innerHTML = ' ';
    }

    const taskText = createElement('div', `task-text ${task.completed ? 'done' : ''}`, task.text);
    
    const toolsContainer = createElement('div', 'todo-workspace-tasklist-tools');
    const editButton = createButton('edit-button', () => onEdit(task), '<img src="assets/icons/edit.svg" alt="edit icon"/>');
    const deleteButton = createButton('delete-button', () => onDelete(task.id), '<img src="assets/icons/remove.svg" alt="remove icon"/>');
    
    toolsContainer.append(editButton, deleteButton);
    taskContainer.append(checkButton, taskText, toolsContainer);
    
    return taskContainer;
};

const renderTaskList = (tasks, onToggle, onEdit, onDelete) => {
    const taskList = document.querySelector('.todo-workspace-tasklist');
    taskList.innerHTML = '';
    
    const taskElements = tasks.map(task => 
        renderTask(task, onToggle, onEdit, onDelete)
    );
    
    taskElements.forEach(element => taskList.appendChild(element));
};

// Функции для обработки пользовательского ввода
// Добавление задачи
const handleAddTask = async (state, setState) => {
    const text = prompt('Ещё одна задача? ');
    if (!text || !text.trim()) return;

    try {
        const newTask = createTaskObject(text);
        const savedTask = await createTask(newTask);
        
        setState({
            ...state,
            tasks: [...state.tasks, savedTask]
        });

    } catch (err) {
        console.error('Не удалось добавить задачу:', err);
        alert('Ошибка при сохранении задачи.');
    }
};


// Отметка задач как выполненных
const handleToggleTask = async (task, state, setState) => {
    const updatedTask = toggleTaskCompletion(task);
    const savedTask = await updateTask(updatedTask);
    
    setState({
        ...state,
        tasks: state.tasks.map(t => t.id === task.id ? savedTask : t)
    });
};
// Изменение задачи
const handleEditTask = async (task, state, setState) => {
    const newText = prompt('Изменяй задачу, а мы никому не скажем ', task.text);
    if (!newText || newText.trim() === task.text) return;

    const updatedTask = updateTaskText(task, newText);
    const savedTask = await updateTask(updatedTask);
    
    setState({
        ...state,
        tasks: state.tasks.map(t => t.id === task.id ? savedTask : t)
    });
};
// Удаление задачи
const handleDeleteTask = async (taskId, state, setState) => {
    if (!confirm('Удаляешь, уверен? Ладно, делай, что хочешь...')) return;
    
    await deleteTask(taskId);
    
    setState({
        ...state,
        tasks: state.tasks.filter(task => task.id !== taskId)
    });
};

const handleFilterChange = (filterType, state, setState) => {
    setState({
        ...state,
        currentFilter: filterType
    });
};


// Функция для обновления состояния и UI
const updateUI = (state) => {
    const filteredTasks = filterTasks(state.tasks, state.currentFilter);
    renderTaskList(
        filteredTasks,
        (task) => handleToggleTask(task, state, setState),
        (task) => handleEditTask(task, state, setState),
        (taskId) => handleDeleteTask(taskId, state, setState)
    );

    const hasAnyTasks = state.tasks.length > 0;

    // Центральная картинка
    const centerImage = document.querySelector('.center-image');
    centerImage.style.display = hasAnyTasks ? 'none' : 'block';

    // Правая картинка: только видимость
    updateRightImageVisibility(hasAnyTasks);
};

// State management (имитация иммутабельного состояния)
let appState = {
    tasks: [],
    currentFilter: FILTERS.ALL
};

const setState = (newState) => {
    appState = newState;
    updateUI(appState);
};

//Правое изображение
const updateRightImageVisibility = (shouldShow) => {
    const rightImage = document.getElementById('right-image');
    if (!rightImage) return;

    if (shouldShow && !isRightImageVisible) {
        // Показываем
        rightImage.style.opacity = '1';
        isRightImageVisible = true;
    } else if (!shouldShow && isRightImageVisible) {
        // Скрываем
        rightImage.style.opacity = '0';
        isRightImageVisible = false;
    }
};


//таймер смены изображений
const startRightImageRotation = () => {
    if (rightImageInterval) return;

    //Установка первого изображения
    const rightImage = document.getElementById('right-image');
    if (rightImage && RIGHT_IMAGES.length > 0) {
        //Начало списка со случайного изображения
        currentRightImageIndex = Math.floor(Math.random() * RIGHT_IMAGES.length);
        rightImage.src = RIGHT_IMAGES[currentRightImageIndex];
    }

    rightImageInterval = setInterval(() => {
        if (RIGHT_IMAGES.length <= 1) return;

        let newIndex;
        //Новое изображение != предыдущему
        do {
            newIndex = Math.floor(Math.random() * RIGHT_IMAGES.length);
        } while (newIndex === currentRightImageIndex && RIGHT_IMAGES.length > 1);

        currentRightImageIndex = newIndex;

        const img = document.getElementById('right-image');
        if (img) {
            img.src = RIGHT_IMAGES[currentRightImageIndex];
        }
    }, 8000); 
};

// Инициализация приложения
const initializeApp = async () => {
    try {
        const tasks = await fetchTasks();
        setState({
            ...appState,
            tasks
        });

        const addButton = document.querySelector('.add-button');
        const filterSelect = document.querySelector('.filter-tasks');

        addButton.addEventListener('click', () => handleAddTask(appState, setState));
        filterSelect.addEventListener('change', (event) => 
            handleFilterChange(event.target.value, appState, setState)
        );

        startRightImageRotation();

    } catch (error) {
        console.error('Failed to initialize app:', error);
        alert('Ошибка при загрузке задач. Проверьте, запущен ли json-server.');
    }
};

// Запуск приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', initializeApp);
