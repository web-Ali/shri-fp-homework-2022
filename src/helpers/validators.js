/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
    allPass,
    complement,
    compose,
    count,
    equals,
    filter,
    partial,
    prop,
    values,
    length
} from "ramda";

// my func
const isLessOrEqual = (a, b) => a <= b;
const maxRepeatInArray = (array)=>{
    let obj = {}
    array.forEach(item=>{
        if (obj.hasOwnProperty(item)){
            obj[item]++
        }else{
            obj[item] = 1
        }
    })
    let key = Object.entries(obj).reduce((acc, curr) => acc[1] > curr[1] ? acc : curr)[0]
    return obj[key]
}
// getters
const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');

// checkColors
const isRed = equals('red');
const isWhite = equals('white');
const isNotWhite = complement(isWhite);
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');

// checkColorShape
const isRedStar = compose(isRed,getStar)
const isOrangeStar = compose(isOrange,getStar)
const isWhiteStar = compose(isWhite,getStar)

const isRedSquare = compose(isRed,getSquare)
const isWhiteSquare = compose(isWhite,getSquare)
const isNotWhiteSquare = complement(isWhiteSquare)
const isGreenSquare = compose(isGreen,getSquare)
const isOrangeSquare = compose(isOrange,getSquare)

const isWhiteTriangle = compose(isWhite,getTriangle)
const isNotWhiteTriangle = complement(isWhiteTriangle)
const isGreenTriangle = compose(isGreen,getTriangle)
const isOrangeTriangle = compose(isOrange,getTriangle)

const isWhiteCircle = compose(isWhite,getCircle)
const isBlueCircle = compose(isBlue,getCircle)
const isOrangeCircle = compose(isOrange,getCircle)


// count

const getGreenCount = count(isGreen)
const getRedCount = count(isRed)
const getBlueCount = count(isBlue)

// compare
const isGreaterOrEqualThanTwo = partial(isLessOrEqual, [2]);
const isGreaterOrEqualThanThree = partial(isLessOrEqual, [3]);



// result func
const isRedStarGreenSquareNotWhiteOther = allPass([isRedStar,isGreenSquare,isWhiteTriangle,isWhiteCircle])

const isMinTwoShapeGreen = compose(isGreaterOrEqualThanTwo,getGreenCount, values)

const isRedAndBlueCountEqual = (values)=> equals(getRedCount(values),getBlueCount(values))
const isRedShapeEqualBlueShape = compose(isRedAndBlueCountEqual,values)

const isRedStarOrangeSquareBlueCircle = allPass([isRedStar,isOrangeSquare,isBlueCircle])

const isThreeShapeOneColor = compose(isGreaterOrEqualThanThree,maxRepeatInArray,filter(isNotWhite),values)

const isTwoGreenFigureWithTriangleAndOneRed = allPass([isGreenTriangle,isMinTwoShapeGreen, isRedSquare ])

const isAllOrange = allPass([isOrangeStar, isOrangeCircle, isOrangeSquare, isOrangeTriangle])

const isNotRedOrWhiteStar = allPass([complement(isRedStar),complement(isWhiteStar)])

const isAllGreen = compose(equals(4),length,filter(isGreen),values)

const isEqualColorSquareAndTriangle = values=> equals(getSquare(values),getTriangle(values))
const isEqualColorSquareAndTriangleNoWhite = allPass([isNotWhiteTriangle, isNotWhiteSquare,isEqualColorSquareAndTriangle])

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = isRedStarGreenSquareNotWhiteOther

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = isMinTwoShapeGreen

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = isRedShapeEqualBlueShape

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = isRedStarOrangeSquareBlueCircle

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = isThreeShapeOneColor

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = isTwoGreenFigureWithTriangleAndOneRed

// 7. Все фигуры оранжевые.
export const validateFieldN7 = isAllOrange

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = isNotRedOrWhiteStar

// 9. Все фигуры зеленые.
export const validateFieldN9 = isAllGreen

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = isEqualColorSquareAndTriangleNoWhite
