import { addCharToInput, performOperation, clearState, deleteLastChar, setOperation, handleSqrt, isValidNumber } from './utils.js';
// Глобальное состояние
let currentState = {
    display: '0',
    currentInput: '0',
    previousInput: '',
    operation: null,
    result: null,
    isResult: false,
    history: [],
    lastOperation: null
};
let currentMode = 'basic'; // по умолчанию
// DOM элементы
const introScreen = document.getElementById('intro-screen');
const matrixScreen = document.getElementById('matrix-screen');
const choiceScreen = document.getElementById('choice-screen');
const fullCalculator = document.getElementById('full-calculator');
const basicCalculator = document.getElementById('basic-calculator');
const errorModal = document.getElementById('error-modal');
const okButton = document.getElementById('ok-button');
const errorGif = document.querySelector('.error-gif');
const errorMessage = document.getElementById('error-message');
const display = document.getElementById('display');
const basicDisplay = document.getElementById('basic-display');
// Установка курсора
//document.body.style.cursor = 'default';
document.body.style.cursor = "url('assets/white-rabbit32.png') 16 16, auto";
// Обработчик нажатия Enter для запуска
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (introScreen.style.display !== 'none') {
            startIntro();
        }
        else if (matrixScreen.classList.contains('hidden')) {
            // Ничего не делаем, пока не завершится анимация
        }
        else if (choiceScreen.classList.contains('hidden')) {
            // Ничего не делаем
        }
    }
});
function startIntro() {
    introScreen.style.display = 'flex';
    const texts = [
        "Wake up, Neo!",
        "The matrix has you...",
        "Follow the white rabbit."
    ];
    let index = 0;
    const container = document.getElementById('intro-text-container');
    const interval = setInterval(() => {
        if (index < texts.length) {
            const p = document.createElement('p');
            p.textContent = texts[index];
            p.className = 'intro-text';
            container.appendChild(p);
            setTimeout(() => p.classList.add('visible'), 100);
            index++;
        }
        else {
            clearInterval(interval);
            setTimeout(() => {
                const finalText = document.createElement('p');
                finalText.textContent = "Knock, knock, Neo!";
                finalText.style.marginTop = '40px';
                finalText.className = 'intro-text';
                container.appendChild(finalText);
                setTimeout(() => finalText.classList.add('visible'), 100);
                setTimeout(() => {
                    showMatrixCode();
                }, 2000);
            }, 3000);
        }
    }, 1200);
}
function showMatrixCode() {
    introScreen.style.display = 'none';
    matrixScreen.classList.remove('hidden');
    // Меняем курсор на пиксельного кролика
    //document.body.style.cursor = 'url("assets/white-rabbit.png"), auto';
    //console.log('Курсор должен измениться!');
    // Показываем заголовок
    const title = document.getElementById('calculator-title');
    title.style.opacity = '1';
    setTimeout(() => {
        title.style.opacity = '0';
        setTimeout(() => {
            matrixScreen.classList.add('hidden');
            choiceScreen.classList.remove('hidden');
        }, 1000);
    }, 1500);
}
// Обработчики кнопок выбора
document.getElementById('red-pill').addEventListener('click', () => {
    currentMode = 'full';
    showCalculator();
});
document.getElementById('blue-pill').addEventListener('click', () => {
    currentMode = 'basic';
    showCalculator();
});
function showCalculator() {
    choiceScreen.classList.add('hidden');
    if (currentMode === 'full') {
        fullCalculator.classList.remove('hidden');
        initFullCalculator();
    }
    else {
        basicCalculator.classList.remove('hidden');
        initBasicCalculator();
    }
}
function initFullCalculator() {
    const buttonsContainer = document.querySelector('#full-calculator .buttons');
    buttonsContainer.innerHTML = '';
    const buttons = [
        { label: 'C', action: 'clear' },
        { label: '⌫', action: 'delete' },
        { label: '^', action: 'power' },
        { label: '√', action: 'sqrt' },
        { label: '7', action: '7' },
        { label: '8', action: '8' },
        { label: '9', action: '9' },
        { label: '/', action: '/' },
        { label: '4', action: '4' },
        { label: '5', action: '5' },
        { label: '6', action: '6' },
        { label: '*', action: '*' },
        { label: '1', action: '1' },
        { label: '2', action: '2' },
        { label: '3', action: '3' },
        { label: '-', action: '-' },
        { label: '0', action: '0' },
        { label: '.', action: '.' },
        { label: '=', action: '=' },
        { label: '+', action: '+' }
    ];
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'button';
        button.textContent = btn.label;
        button.addEventListener('click', () => handleButtonClick(btn.action));
        buttonsContainer.appendChild(button);
    });
    updateDisplay();
    setupBackButtons();
}
function initBasicCalculator() {
    const buttonsContainer = document.querySelector('#basic-calculator .buttons');
    buttonsContainer.innerHTML = '';
    const buttons = [
        { label: 'C', action: 'clear' },
        { label: '⌫', action: 'delete' },
        { label: '/', action: '/' },
        { label: '*', action: '*' },
        { label: '7', action: '7' },
        { label: '8', action: '8' },
        { label: '9', action: '9' },
        { label: '-', action: '-' },
        { label: '4', action: '4' },
        { label: '5', action: '5' },
        { label: '6', action: '6' },
        { label: '+', action: '+' },
        { label: '1', action: '1' },
        { label: '2', action: '2' },
        { label: '3', action: '3' },
        { label: '=', action: '=' },
        { label: '0', action: '0' },
        { label: '.', action: '.' },
    ];
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'button';
        button.textContent = btn.label;
        if (btn.action) {
            button.addEventListener('click', () => handleButtonClick(btn.action));
        }
        buttonsContainer.appendChild(button);
    });
    updateDisplay();
    setupBackButtons();
}
function updateDisplay() {
    if (currentMode === 'full') {
        display.textContent = currentState.display;
    }
    else {
        basicDisplay.textContent = currentState.display;
    }
}
function handleButtonClick(action) {
    try {
        let newState = { ...currentState };
        if (action === 'clear') {
            newState = clearState(newState);
        }
        else if (action === 'delete') {
            newState = deleteLastChar(newState);
        }
        else if (action === '=') {
            newState = performOperation(newState);
        }
        else if (action === 'sqrt') {
            newState = handleSqrt(newState);
        }
        else if (action === 'power') {
            newState = setOperation(newState, '^');
        }
        else if (['+', '-', '*', '/', '.'].includes(action)) {
            if (action === '.') {
                newState = addCharToInput(newState, action);
            }
            else {
                newState = setOperation(newState, action);
            }
        }
        else if (/[0-9]/.test(action)) {
            newState = addCharToInput(newState, action);
        }
        currentState = newState;
        updateDisplay();
    }
    catch (error) {
        showError(error.message);
    }
}
function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
    errorGif.src = 'assets/error.gif'; // Убедись, что ссылка работает
    errorGif.style.width = '100%';
    errorGif.style.maxWidth = '300px';
    // При закрытии восстанавливаем состояние
    const recoverState = () => {
        // Возвращаемся к состоянию до ошибки
        // Это можно сделать, если хранить историю состояний
        // Для простоты — просто оставляем текущее состояние без изменений
        // Можно добавить логику восстановления, но это усложнит задачу
    };
    okButton.onclick = () => {
        errorModal.classList.add('hidden');
        // Полный сброс состояния калькулятора
        currentState = clearState(currentState);
        updateDisplay();
    };
}
// Обработчик возврата на выбор таблеток
function setupBackButtons() {
    const backButton1 = document.querySelector('#full-calculator .back-button');
    const backButton2 = document.querySelector('#basic-calculator .back-button');
    const goBack = () => {
        fullCalculator.classList.add('hidden');
        basicCalculator.classList.add('hidden');
        choiceScreen.classList.remove('hidden');
        // Опционально: сбросить состояние калькулятора
        currentState = clearState(currentState);
        updateDisplay();
    };
    if (backButton1)
        backButton1.addEventListener('click', goBack);
    if (backButton2)
        backButton2.addEventListener('click', goBack);
}
// Обработчик клавиатуры
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Можно добавить выход
        return;
    }
    if (currentMode === 'full' || currentMode === 'basic') {
        if (e.key === 'Enter') {
            handleButtonClick('=');
        }
        else if (e.key === 'Backspace') {
            handleButtonClick('delete');
        }
        else if (e.key === 'Escape') {
            handleButtonClick('clear');
        }
        else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            handleButtonClick(e.key);
        }
        else if (e.key === '.') {
            handleButtonClick('.');
        }
        else if (e.key >= '0' && e.key <= '9') {
            handleButtonClick(e.key);
        }
        else if (e.key === '^') {
            if (currentMode === 'full')
                handleButtonClick('^');
        }
        else if (e.key === 'r' || e.key === 'R') {
            if (currentMode === 'full')
                handleButtonClick('sqrt');
        }
    }
});
//# sourceMappingURL=main.js.map