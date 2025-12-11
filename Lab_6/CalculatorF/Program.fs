open System
open System.Globalization

// Сумма
let add a b = a + b

// Разность
let subtract a b = a - b

// Произведение
let multiply a b = a * b

// Частное
let divide a b =
    if b = 0.0 then None
    else Some (a / b)

// Возведение в степень
let power a b =
    let result = Math.Pow(a, b)
    if Double.IsInfinity(result) || Double.IsNaN(result) then
        None
    else
        Some result

// Квадратный корень
let sqrt a =
    if a < 0.0 then None
    else Some (Math.Sqrt(a))

// Погрешность
let epsilon = 0.0000000001

// Синус угла
let sinAngle a =
    let radians = a * Math.PI / 180.0
    let value = Math.Sin(radians)
    Some (if abs value < epsilon then 0.0 else value)

// Косинус угла
let cosAngle a =
    let radians = a * Math.PI / 180.0
    let value = Math.Cos(radians)
    Some (if abs value < epsilon then 0.0 else value)

// Тангенс угла
let tanAngle a =
    let radians = a * Math.PI / 180.0
    let cosA = Math.Cos(radians)
    if abs cosA < epsilon then
        None
    else
        let value = Math.Tan(radians)
        Some (if abs value < epsilon then 0.0 else value)

// Цветной вывод текста
let writeColored color text =
    let oldColor = Console.ForegroundColor
    Console.ForegroundColor <- color
    printfn "%s" text
    Console.ForegroundColor <- oldColor

// Проверка введенных чисел
let rec readNumber prompt =
    printf "%s" prompt
    let input = Console.ReadLine().Trim()
    match Double.TryParse(input, NumberStyles.Any, CultureInfo.InvariantCulture) with
    | true, value -> value
    | false, _ ->
        writeColored ConsoleColor.Red "Ошибка: число введено неверно! Попробуйте снова."
        readNumber prompt

// Вывод операции
let printOperation name =
    writeColored ConsoleColor.Cyan ("\n " + name )

// Функция, выполняющая расчёт
let calculation () =
    printfn "\nОперации на выбор:"
    printfn "1️  Сложение"
    printfn "2️  Вычитание"
    printfn "3️  Умножение"
    printfn "4️  Деление"
    printfn "5️  Возведение в степень"
    printfn "6️  Квадратный корень"
    printfn "7️  Синус"
    printfn "8️  Косинус"
    printfn "9️  Тангенс"
    printfn "%s" (String('-', 32))

    // Ввод операции
    printf "И на барабане: "
    let op = Console.ReadLine().Trim()

    match op with
    // Операции с двумя операндами
    | "1" | "2" | "3" | "4" | "5" ->
        let operationName =
            match op with
            | "1" -> "Сложение"
            | "2" -> "Вычитание"
            | "3" -> "Умножение"
            | "4" -> "Деление"
            | "5" -> "Возведение в степень"
            | _ -> ""
        printOperation operationName

        let a = readNumber "Введите первый операнд: "
        let b = readNumber "Введите второй операнд: "

        match op with
        | "1" -> writeColored ConsoleColor.Green (sprintf "Ответ: %g + %g = %g" a b (add a b))
        | "2" -> writeColored ConsoleColor.Green (sprintf "Ответ: %g - %g = %g" a b (subtract a b))
        | "3" -> writeColored ConsoleColor.Green (sprintf "Ответ: %g * %g = %g" a b (multiply a b))
        | "4" ->
            match divide a b with
            | Some res -> writeColored ConsoleColor.Green (sprintf "Ответ: %g / %g = %g" a b res)
            | None -> writeColored ConsoleColor.Red "Ошибка: деление на ноль!"
        | "5" ->  // возведение в степень
            match power a b with
            | Some res -> writeColored ConsoleColor.Green (sprintf "Ответ: %g ^ %g = %g" a b res)
            | None -> writeColored ConsoleColor.Red "Результат слишком большой для вычисления!"
        | _ -> ()

    // Операции с одним числом
    | "6" | "7" | "8" | "9" ->
        let operationName =
            match op with
            | "6" -> "Квадратный корень"
            | "7" -> "Синус"
            | "8" -> "Косинус"
            | "9" -> "Тангенс"
            | _ -> ""
        printOperation operationName

        let a = readNumber "Введите число: "

        match op with
        | "6" ->
            match sqrt a with
            | Some res -> writeColored ConsoleColor.Green (sprintf "Ответ: √%g = %g" a res)
            | None -> writeColored ConsoleColor.Red "Ошибка: нельзя извлечь корень из отрицательного числа!"
        | "7" ->
            match sinAngle a with
            | Some res -> writeColored ConsoleColor.Green (sprintf "Ответ: sin(%g°) = %g" a res)
            | None -> writeColored ConsoleColor.Red "Ошибка!"
        | "8" ->
            match cosAngle a with
            | Some res -> writeColored ConsoleColor.Green (sprintf "Ответ: cos(%g°) = %g" a res)
            | None -> writeColored ConsoleColor.Red "Ошибка!"
        | "9" ->
            match tanAngle a with
            | Some res -> writeColored ConsoleColor.Green (sprintf "Ответ: tan(%g°) = %g" a res)
            | None -> writeColored ConsoleColor.Red "Тангенс не определён для этого угла!"
        | _ -> ()

    | _ ->
        writeColored ConsoleColor.Red "\nНеизвестная операция. Попробуйте снова.\n"

// Точка входа
[<EntryPoint>]
let main _ =
    printfn "\n КАЛЬКУЛЯТОР на F#"


    let rec loop () =
        let _ = calculation ()

        writeColored ConsoleColor.Blue "\nСчитаем дальше? (y/n): "
        let answer = Console.ReadLine().Trim().ToLower()

        if answer = "y" then
            loop ()
        else
            writeColored ConsoleColor.Blue "\nВсего хо ро ше го!\n"

    loop ()
    0