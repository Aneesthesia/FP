//Набор чистых функций
//Функция, которая принимает массив чисел и возвращает новый массив, содержащий только числа, кратные заданному числу.
let num: number[] = [13, -1.2, 0, 80]

function filterNumbers (arr: number[], divider: number) :number[] {
  if (divider === 0) {
    console.error("Ошибка: нельзя делить на 0");
    return [];
  }

  return arr.filter(n => n % divider === 0)
}

console.log (filterNumbers(num, 2))

//Функция, которая принимает массив строк и возвращает новую строку, содержащую все строки, объединенные заданным разделителем.
let str: string[] = ["Mama", "aaaaaaaa", "", "nonono"]

function sumString (arr: string[], separator: string) :string {
  return arr.join(separator)
}
console.log (sumString(str, "#"))

//Функция, которая принимает массив объектов и возвращает новый массив, отсортированный по значению определенного свойства.
const obj: {name?: string, age?: number} [] = [
  { name: "Артём", age: 19 }, 
  { name: "Вероника"}, 
  { age: 72 }, 
  { age: 30 }, 
  { name: "Миша", age: 36 },
  { name: "Миша", age: 16 },
  { name: "Ксюша"},
 ]

function sortByProperty<T, K extends keyof T> (arr: T[], property: K) {
  return [...arr].sort((a: T, b: T) => {
    const valueA = a[property]
    const valueB = b[property]

    if (valueA == null && valueB == null) {
      return 0
    }
    if (valueA == null) {
      return 1
    }
    if (valueB == null) {
      return -1
    }

    if (valueA > valueB) {
      return 1;
    } else if (valueA < valueB) {
      return -1;
    } else {
      return 0;
    }
  });
}
const sortedByAge = sortByProperty(obj, "age");
console.log(sortedByAge);

const sortedByName = sortByProperty(obj, "name");
console.log(sortedByName);



//Cоздайте функцию, которая принимает другую функцию в качестве аргумента и возвращает новую функцию, которая выполняет логирование перед вызовом исходной функции.
function addNumbers(a: number, b: number): number {
    return a + b;
}

function withLog<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => ReturnType<T> {
    return (...args: Parameters<T>) => {
        console.log("Логирование с аргументами:", args)
        return func(...args)
    };
}

const loggedAdd = withLog(addNumbers)
const result = loggedAdd(5.75, 3)
console.log("Результат:", result)