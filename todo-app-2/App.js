const API_URL = 'http://localhost:3001';

// Константы фильтров
const FILTERS = {
    ALL: 'all',
    ACTIVE: 'active', 
    COMPLETED: 'completed'
};

// Состояние приложения
let state = {
    tasks: [],
    filter: FILTERS.ALL  // начальное значение
};

// Чистые функции для фильтрации
const filterTasks = (tasks, filter) => {
    switch (filter) {
        case FILTERS.ACTIVE:
            return tasks.filter(task => !task.isDone);
        case FILTERS.COMPLETED:
            return tasks.filter(task => task.isDone);
        case FILTERS.ALL:
        default:
            return tasks;
    }
};

// Функция для получения статистики
const getTasksStats = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isDone).length;
    const active = total - completed;
    
    return { total, completed, active };
};

// Обработчик изменения фильтра
const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    
    // Обновляем состояние с новым фильтром
    setState({ filter: selectedFilter });
    
    console.log(`Фильтр изменён на:  ${selectedFilter}`);
};

// Функция для инициализации фильтра
const initializeFilter = () => {
    const filterSelect = document.querySelector('.filter-tasks');
    
    if (!filterSelect) {
        console.error('Элемент фильтра не найден!');
        return;
    }
    
    // Устанавливаем обработчик события
    filterSelect.addEventListener('change', handleFilterChange);
    
    // Устанавливаем начальное значение
    filterSelect.value = state.filter;
    
    console.log('Фильтр инициализирован');
};

// Функции для работы с API
const api = {
    // Получить все задачи
    async getTasks() {
        const response = await fetch(`${API_URL}/tasks`);
        return await response.json();
    },
    
    // Обновить задачу
    async updateTask(taskId, updates) {
        const response = await fetch(`${API_URL}/tasks/${Number(taskId)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });
        return await response.json();
    },
    
    // Создать задачу
    async createTask(task) {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        });
        return await response.json();
    },
    
    // Удалить задачу
    async deleteTask(taskId) {
        await fetch(`${API_URL}/tasks/${Number(taskId)}`, {
            method: 'DELETE'
        });
    }
};

// Обработчики
const handleTaskToggle = async (taskId) => {
    const task = state.tasks.find(t => t.id === String(taskId));
    if (!task) return;
    
    try {
        // Отправляем запрос на сервер
        const updatedTask = await api.updateTask(taskId, { isDone: !task.isDone });
        
        // Обновляем локальное состояние
        const updatedTasks = updateTaskStatus(state.tasks, taskId, !task.isDone);
        setState({ tasks: updatedTasks });
        
        console.log('Изменения сохранены на сервере');
    } catch (error) {
        console.error('Ошибка сохранения на сервере:', error);
    }
};

// Обновлённая функция загрузки
const loadTasks = async () => {
    try {
        return await api.getTasks();
    } catch (error) {
        console.error('Ошибка загрузки задач:', error);
        
        // Fallback: пробуем загрузить из локального файла
        try {
            const response = await fetch('tasks.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.error('Не удалось загрузить и из файла:', e);
        }
        
        return [];
    }
};

// Чистые функции для работы с задачами
const updateTaskStatus = (tasks, taskId, isDone) => {
    return tasks.map(task => 
        task.id === String(taskId)
            ? { ...task, isDone: isDone }
            : task
    );
};

const getFilteredTasks = (tasks, filter) => {
    switch (filter) {
        case 'active':
            return tasks.filter(task => !task.isDone);
        case 'completed':
            return tasks.filter(task => task.isDone);
        case 'all':
        default:
            return tasks;
    }
};

const generateId = (tasks) => {
    const numericIds = tasks.map(task => Number(task.id)).filter(id => !isNaN(id));
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    return maxId + 1;
};

const createNewTask = (tasks, text) => {
    const newTask = {
        id: generateId(tasks),
        text: text.trim(),
        isDone: false
    };
    
    // Иммутабельное добавление: создаём новый массив
    return [...tasks, newTask];
};

const validateTaskText = (text) => {
    const trimmedText = text.trim();
    return trimmedText.length > 0 && trimmedText.length <= 500;
};

// Обработчик добавления новой задачи
const handleAddTask = async () => {
    // Просто запрашиваем текст у пользователя
    const text = prompt('Ещё одна задача! Ого!:');
    
    // Если пользователь нажал "Отмена" или текст пустой
    if (text === null) {
        return; // Пользователь нажал "Отмена"
    }
    
    if (!validateTaskText(text)) {
        alert('Текст задачи не может быть пустым (только если вы не собираетесь ничего делать)!');
        return;
    }
    
    try {
        // Создаём новую задачу локально
        const newTasks = createNewTask(state.tasks, text);
        const newTask = newTasks[newTasks.length - 1];
        
        // Сохраняем на сервере через API
        const savedTask = await api.createTask(newTask);
        
         // Обновляем состояние
        const updatedTasks = state.tasks.map(task => 
            task.id === newTask.id ? savedTask : task
        );
        
        setState({ tasks: updatedTasks });
        
        console.log('Новая задача добавлена:', savedTask.text);
        
    } catch (error) {
        console.error('Ошибка при добавлении задачи:', error);
        alert('Кажется, задача не добавлена!');
    }
};

// Инициализация кнопки добавления
const initializeAddButton = () => {
    const addButton = document.querySelector('.add-button');
    
    if (!addButton) {
        console.error('Кнопка добавления не найдена!');
        return;
    }
    
    addButton.addEventListener('click', handleAddTask);
    
    console.log('Кнопка добавления инициализирована');
};

// Функция для создания DOM-элемента задачи
const createTaskElement = (task) => {
    const taskContainer = document.createElement('div');
    taskContainer.className = `task-container ${task.isDone ? 'task-completed' : ''}`;
    taskContainer.dataset.id = String(task.id);

    const checkButton = document.createElement('div');
    checkButton.className = `check-button ${task.isDone ? 'checked' : ''}`;
    checkButton.addEventListener('click', () => handleTaskToggle(String(task.id)));
    
    const taskText = document.createElement('div');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const toolsContainer = document.createElement('div');
    toolsContainer.className = 'todo-workspace-tasklist-tools';

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.innerHTML = '<img src="assets/icons/edit.svg" alt="edit icon"/>';
    editButton.addEventListener('click', () => handleTaskEdit(String(task.id)));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '<img src="assets/icons/remove.svg" alt="remove icon"/>';
    deleteButton.addEventListener('click', () => handleTaskDelete(String(task.id)));

    toolsContainer.appendChild(editButton);
    toolsContainer.appendChild(deleteButton);
    
    taskContainer.appendChild(checkButton);
    taskContainer.appendChild(taskText);
    taskContainer.appendChild(toolsContainer);

    return taskContainer;
};

// Функция для отрисовки списка задач
const renderTasks = (tasks, container) => {
    container.innerHTML = '';
    const taskElements = tasks.map(createTaskElement);
    taskElements.forEach(element => {
        container.appendChild(element);
    });
};

// Система состояния
const setState = (newState) => {
    state = { ...state, ...newState };
    render();
};

const render = () => {
    const taskListContainer = document.querySelector('.todo-workspace-tasklist');
    
    if (!taskListContainer) {
        console.error('Контейнер задач не найден!');
        return;
    }
    
    // Используем чистую функцию для фильтрации
    const filteredTasks = filterTasks(state.tasks, state.filter);
    
    // Отрисовываем отфильтрованные задачи
    renderTasks(filteredTasks, taskListContainer);
    
    // Обновляем статистику и UI
    updateTasksCounter();
    updateFilterUI();
};

// Функция для обновления интерфейса фильтра
const updateFilterUI = () => {
    const filterSelect = document.querySelector('.filter-tasks');
    if (filterSelect) {
        filterSelect.value = state.filter;
    }
};

// Функция для обновления счётчика задач
const updateTasksCounter = () => {
    const stats = getTasksStats(state.tasks);
    const filteredStats = getTasksStats(filterTasks(state.tasks, state.filter));
    
    console.log(`Всего: ${stats.total} | Можно не делать: ${stats.active} | Готовых: ${stats.completed}`);
    console.log(`РџРѕРєР°Р·Р°РЅРѕ: ${filteredStats.total} Р·Р°РґР°С‡`);
    
    // Можно добавить отображение счётчика в интерфейс
    updateTasksCounterUI(stats, filteredStats);
};

// Функция для отображения счётчика в UI (опционально)
const updateTasksCounterUI = (stats, filteredStats) => {
    // Найдём или создадим элемент для счётчика
    let counterElement = document.querySelector('.tasks-counter');
    const titleElement = document.querySelector('.title');
    
    if (!counterElement && titleElement) {
        counterElement = document.createElement('span');
        counterElement.className = 'tasks-counter';
        titleElement.parentNode.insertBefore(counterElement, titleElement.nextSibling);
    }
    
    if (counterElement) {
        counterElement.textContent = ` (${filteredStats.total}/${stats.total})`;
        counterElement.title = `Активных: ${stats.active}, Готовых: ${stats.completed}`;
    }
};

const handleTaskEdit = (taskId) => {
    console.log('Редактирование задачи (ну ладно, не получилось с 1го раза...):', String(taskId));
};

const handleTaskDelete = (taskId) => {
    console.log('Удаление задачи (удаляй, мы никому не скажем):', Srting(taskId));
};




const initializeApp = async () => {
    try {
        // Загружаем задачи
        const tasks = await loadTasks();
        
        // Инициализируем состояние
        setState({ tasks: tasks });
        
        // Инициализируем фильтр
        initializeFilter();
        
        // Инициализируем кнопку добавления
        initializeAddButton();
        
        console.log('Приложение инициализировано. Загружено задач:', tasks.length);
        
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
};


//Запуск
document.addEventListener('DOMContentLoaded', initializeApp);