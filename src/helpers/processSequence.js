import Api from '../tools/api';
import {allPass, andThen, compose, ifElse, otherwise, partial, prop, tap} from "ramda";

const api = new Api();

const isMoreThanNumber = (a, b) => +a < +b
const isLessThanNumber = (a, b) => +a > +b

const isMoreThanTwo = partial(isMoreThanNumber, [2]);
const isMoreThanZero = partial(isMoreThanNumber, [0]);
const isLessThanTen = partial(isLessThanNumber, [10]);

const getStringLength = (string) => string.toString().length;
const valuesLengthMoreThanTwo = compose(isMoreThanTwo, getStringLength)
const valuesLengthMoreThanTen = compose(isLessThanTen, getStringLength)

const isHaveOnlyNumberOrTouch = (string) => string.match(/[^.\d]/g) === null

const isValidValue = allPass([valuesLengthMoreThanTen, valuesLengthMoreThanTwo, isMoreThanZero, isHaveOnlyNumberOrTouch])

const roundValue = compose(Math.round, parseFloat);
const squareIt = (n) => n ** 2;
const remainderByThree = (a) => a % 3;

const getResult = prop('result');
const thenGetResult = andThen(getResult);

const convertNumberParams = (from, to, number) =>
    api.get('https://api.tech/numbers/base')({from, to, number});
const convertFrom10to2System = partial(convertNumberParams, [10, 2])
const convertNumberRequest = compose(
    thenGetResult,
    convertFrom10to2System
);

const getAnimalById = (id) => api.get(`https://animals.tech/${id}`, {});
const getAnimalByIdRequest = compose(
    thenGetResult,
    andThen(getAnimalById)
);


const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const log = tap(writeLog)
    const logError = partial(handleError, ['ValidationError']);
    const failedFetch = otherwise(handleError);
    const startProcess = compose(
        failedFetch,
        andThen(handleSuccess),
        getAnimalByIdRequest,
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
    const result = compose(validatorAndStart, log)
    result(value)
}
export default processSequence;
