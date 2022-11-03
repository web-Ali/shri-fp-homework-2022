/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
 import Api from '../tools/api';
import {allPass, andThen, compose, ifElse, partial, prop, tap} from "ramda";

 const api = new Api();

 /**
  * Я – пример, удали меня
  */
 const wait = time => new Promise(resolve => {
     setTimeout(resolve, time);
 })
const isMoreThanNumber = (a,b)=> +a < +b
const isLessThanNumber = (a,b)=> +a > +b
const isMoreThanTwo = partial(isMoreThanNumber,[2]);
const isMoreThanZero = partial(isMoreThanNumber,[0]);
const isLessThanTen = partial(isLessThanNumber,[10]);

const getStringLength = (string) => string.toString().length;
const valuesLengthMoreThanTwo = compose(isMoreThanTwo, getStringLength)
const valuesLengthMoreThanTen = compose(isLessThanTen,getStringLength)

const isHaveOnlyNumberOrTouch = (string) => string.match(/[^.\d]/g) === null

const isValidValue = allPass([valuesLengthMoreThanTen,valuesLengthMoreThanTwo, isMoreThanZero,isHaveOnlyNumberOrTouch])

const roundValue = compose(Math.round, parseFloat);
const squareIt = (n) => n ** 2;
const remainderByThree = (a) => a % 3;

const getResult = prop('result');
const thenGetResult = andThen(getResult);
const convertNumberParams = (from, to, number) =>
    api.get('https://api.tech/numbers/base')({from,to,number});
const convertFrom10to2System = partial(convertNumberParams,[10,2])
const convertNumberRequest = compose(
    thenGetResult,
    convertFrom10to2System
);
const getAnimalById = (id) => api.get(`https://animals.tech/`)(id);
const getAnimalByIdRequest = compose(
    thenGetResult,
    getAnimalById
);


const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
     /**
      * Я – пример, удали меня
      */
     const log = tap(writeLog)
    const logError = partial(handleError, ['ValidationError']);

    const startProcess = compose(
        andThen(handleSuccess),
        andThen(getAnimalByIdRequest),
        andThen(log),
        andThen(remainderByThree),
        andThen(log),
        andThen(squareIt),
        andThen(log),
        andThen(getStringLength),
        andThen(log),
        convertNumberRequest,
        log,
        roundValue
    )
    const validatorAndStart = ifElse(isValidValue, startProcess, logError)

    const result = compose(validatorAndStart,log)
    result(value)
 }

 export default processSequence;
