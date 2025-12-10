// Функция, которая принимает два числа и возвращает их сумму
let sum (num1:float) (num2:float): float = num1 + num2
printfn "0.2 + (-1) = %A" (sum 0.2 -1)

// Функция, которая принимает два числа и возвращает их разность
let difference (num1:float) (num2:float): float = num1 - num2
printfn "33 - 15 = %A" (difference 33 15)

// Функция, которая принимает два числа и возвращает их произведение
let multiplication (num1:float) (num2:float): float = num1 * num2
printfn "42.5 * (-10)= %A" (multiplication 42.5  -10)

// Функция, которая принимает два числа и возвращает результат деления
let division (num1: float) (num2: float) : Result<float, string> =
    match num2 with
    | x when x = 0.0 -> Error "Деление на ноль"
    | x -> Ok (num1 / x)
printfn "42 / (-1)= %A" (division 42  -1)


// Рекурсивная функция для вычисления факториала числа
let factorial (num:int):Result<int, string> =
    let rec loop num acc =
        if num <= 1 then Ok acc
        else loop (num - 1) (num * acc)

    if num < 0 then Error "Факториал отрицательного числа неопределён"
    else loop num 1

printfn "5! = %A" (factorial 5)

// Каррирование
// Возведение в квадрат
let square (x: float) : float = multiplication x x
printfn " 7 ** 2 = %A" (square 7)

// Умножение на -1 (нахождение соответствующего отрицательного числа)
let makeNegative = multiplication -1
printfn "Число противоположное 55 относительно 0: %A" (makeNegative 55)