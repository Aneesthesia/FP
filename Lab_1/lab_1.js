//1_1. Функция, которая принимает массив чисел и возвращает новый массив, содержащий только четные числа.
arr1 = [54, 67, 908, 22, 11, 327, 15, 6, 9, 0];
const filterEven = arr => arr.filter(n => n % 2 === 0);
console.log(filterEven(arr1));

//1_2. Функция, которая принимает массив чисел и возвращает новый массив, содержащий квадраты этих чисел.
arr2 = [2, 3, 4, 5]
const squaredNum = arr => arr.map(n => n**2);
console.log(squaredNum(arr2));

//1_3. Функция, которая принимает массив объектов и возвращает новый массив, содержащий только объекты с определенным свойством.
arr3 = [
    {name: 'Ann', age: 12}, 
    {name: 'Sue', age: 34}, 
    {name: 'Veron', age: 22}, 
    {name: 'Bill', age: 19},
    {name: 'Mike', age: 27},
    {name: 'Lue', age:12}];
const findAge = arr => arr.filter(person => person.age === 12);
const printPerson = arr => findAge(arr).map(person => `${person.name} ${person.age}`).join(', ');
console.log(printPerson(arr3));

//1_4. Функция, которая принимает массив чисел и возвращает их сумму.
arr4 = [10, 20, 10, 30];
const sumArr = arr => arr.reduce((acc, cur) => acc + cur, 0);
console.log(sumArr(arr4));

//2. Функция высшего порядка
arr5 = ['яблоко', 'карта', 'плакат', 'кипяток', 'смерть']
const reverseWord = (word) => word.split('').reverse().join('');

const reverseArray = arr => arr.map(word => reverseWord(word)).reverse();
console.log(reverseArray(arr5));

//3_1. Нахождение суммы квадратов всех чётных чисел в заданном массиве.
arr6 = [2, 4, 6, 7, 19, 93];
const sumDoubledEven = arr => sumArr(squaredNum(filterEven(arr)));
console.log(sumDoubledEven(arr6));

//3_2. Нахождение среднего арифметического всех чисел, больших заданного значения, в заданном массиве объектов.
arr7 = [44, 18, 55, 3, 6, 90, 43, 1, 150, 380];
const moreThan50 = arr => arr.filter(n => n > 50);
const averageNum = arr => sumArr(moreThan50(arr))/moreThan50(arr).length;
console.log(averageNum(arr7));