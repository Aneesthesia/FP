import type { Operation, CalculatorState } from './types.js';

// Чистая функция: добавляет символ в текущий ввод
export const addCharToInput = (state: CalculatorState, char: string): CalculatorState => {
    const current = state.currentInput;

    // Если результат уже вычислен — начинаем новый ввод
    if (state.isResult) {
        if (char === '.') {
            return { ...state, display: '0.', currentInput: '0.', isResult: false };
        }
        return { ...state, display: char, currentInput: char, isResult: false };
    }

    // Замена начального "0" на цифру (но не на точку!)
    if (current === '0' && char !== '.') {
        return {
            ...state,
            display: char,
            currentInput: char,
            isResult: false
        };
    }

    // Обработка ввода минуса: разрешён только в начале числа
    if (char === '-') {
        if (current === '' || current === '0') {
            return { ...state, display: '-', currentInput: '-', isResult: false };
        }
        throw new Error('Минус разрешён только в начале числа');
    }

    // Валидация точки
    if (char === '.') {
        if (current.includes('.')) {
            throw new Error('Только одна точка разрешена');
        }
        if (current === '') {
            return { ...state, display: '0.', currentInput: '0.', isResult: false };
        }
    }

    // Добавляем символ
    const newInput = current + char;

    return { ...state, display: newInput, currentInput: newInput, isResult: false };
};

// Вспомогательная функция: форматирование результата
const formatResult = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) {
        return 'Error';
    }

    // Используем toPrecision(12) → даёт до 12 значащих цифр
    let formatted = value.toPrecision(12);
    // Убираем лишние нули и десятичную точку, если не нужна
    formatted = parseFloat(formatted).toString();

    // Ограничиваем длину до 14 символов (на всякий случай)
    if (formatted.length > 14) {
        // Попытка использовать экспоненциальную запись, если слишком длинно
        formatted = value.toExponential(6).replace(/\.?0+e/, 'e');
    }

    return formatted;
};

// Чистая функция: выполнение операции
export const performOperation = (state: CalculatorState): CalculatorState => {
    if (!state.operation || state.previousInput === '') return state;

    const a = parseFloat(state.previousInput);
    const b = parseFloat(state.currentInput);

    if (isNaN(a) || isNaN(b)) {
        throw new Error('Некорректный ввод');
    }

    let result: number;

    switch (state.operation) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            if (b === 0) throw new Error('На 0 делить нельзя');
            result = a / b;
            break;
        case '^':
            result = Math.pow(a, b);
            break;
        case 'sqrt':
            if (a < 0) throw new Error('Корень из отрицательного числа');
            result = Math.sqrt(a);
            break;
        default:
            return state;
    }

    if (!isFinite(result)) {
        throw new Error('Результат слишком большой');
    }

    const newDisplay = formatResult(result);
    return {
        ...state,
        display: newDisplay,
        currentInput: newDisplay,
        previousInput: '',
        operation: null,
        result: result,
        isResult: true,
        history: [...state.history, `${a} ${state.operation} ${b} = ${newDisplay}`]
    };
};

// Чистая функция: очистка
export const clearState = (state: CalculatorState): CalculatorState => ({
    ...state,
    display: '0',
    currentInput: '0',
    previousInput: '',
    operation: null,
    result: null,
    isResult: false,
    history: []
});

// Чистая функция: удаление последнего символа
export const deleteLastChar = (state: CalculatorState): CalculatorState => {
    if (state.currentInput.length <= 1 || state.isResult) {
        return { ...state, display: '0', currentInput: '0', isResult: false };
    }
    const newInput = state.currentInput.slice(0, -1);
    return { ...state, display: newInput, currentInput: newInput, isResult: false };
};

// Чистая функция: установка операции
export const setOperation = (state: CalculatorState, op: Operation): CalculatorState => {
    if (state.operation && !state.isResult && state.currentInput !== '') {
        // Выполнить предыдущую операцию, если введено новое число
        const newState = performOperation(state);
        return {
            ...newState,
            operation: op,
            previousInput: newState.display,
            currentInput: ''
        };
    }
    // Иначе — просто запомнить операцию
    return {
        ...state,
        operation: op,
        previousInput: state.currentInput,
        currentInput: '',
        isResult: false
    };
};

// Чистая функция: обработка корня
export const handleSqrt = (state: CalculatorState): CalculatorState => {
    if (state.currentInput === '' || state.currentInput === '-') {
        throw new Error('Некорректное число');
    }
    const num = parseFloat(state.currentInput);
    if (isNaN(num)) {
        throw new Error('Некорректное число');
    }
    if (num < 0) throw new Error('квадратный корень из отрицательного числа не определен');
    const result = Math.sqrt(num);
    const newDisplay = formatResult(result);
    return {
        ...state,
        display: newDisplay,
        currentInput: newDisplay,
        isResult: true,
        result: result
    };
};

// Чистая функция: проверка на валидность числа (опционально, можно не использовать)
export const isValidNumber = (input: string): boolean => {
    if (input === '') return false;
    if (input === '-') return false;
    if (input === '.') return false;
    if (input === '0.') return true;
    if (/^-?\d*\.?\d+$/.test(input)) return true;
    return false;
};