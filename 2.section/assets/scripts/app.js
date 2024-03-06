const defaultResult = 0;
let currentResult = defaultResult
let logEntries = [];

function getUserNumberInput() {
    return parseInt(userInput.value);
}
function createAndWriteLog(operator, resultBeforeCalc, calcNumber) {
    const calcDescription = `${resultBeforeCalc} ${operator} ${calcNumber}`
    outputResult(currentResult, calcDescription)
}

function writeToLog(operationIdentifier, prevResult, operationNumber, newResult) {
    const logEntry = {
        operation: operationIdentifier,
        prevResult : prevResult,
        number : operationNumber,
        result : newResult
    };
    logEntries.push(logEntry)
    console.log(logEntries)
}

function calculateResult(calculationType) {

    const enterNumber = getUserNumberInput();

    // 앞에 조건이 true 이면 다음 조건으로 이동 하여 비교 한다. 모든 조건에 true 가 나오게 되면 31번째 줄로 이동 하지 않는다.
    // OR 연산자를 이용해 앞에 && 조건과는 별개로 enterNumber 가 0 이면 참값을 반환해 실행 시키지 않는다.
    // enterNumber 값이 0 이면 false 인데 ! 이용해서 Falsy 가 아니다가 되므로 참이 true 반환, 0 !== false 와 같은 표현
    // TODO javascript Truthy and Falsy 찾아서 공부 하기
    if (calculationType !== 'ADD' && calculationType !== 'SUBTRACT' && calculationType !== 'MULTIPLY' && calculationType !== 'DIVIDE' || !enterNumber) {
        return;
    }
    const initialResult = currentResult;
    let mathOperator;

    // OR의 경우 첫 번째 조건이 false 이면 다음조건을 확인 한다. 하나라도 true 면 해당 블럭의 로직을 실행 한다.
    // if (calculationType === 'ADD' || calculationType === 'SUBTRACT' || calculationType === 'MULTIPLY' || calculationType === 'DIVIDE') {

        if (calculationType === 'ADD') {
            currentResult += enterNumber;
            mathOperator = '+';
        } else if (calculationType === 'SUBTRACT') {
            currentResult -= enterNumber;
            mathOperator = '-';
        } else if (calculationType === 'MULTIPLY') {
            currentResult *= enterNumber;
            mathOperator = '*';
        } else {
            currentResult /= enterNumber;
            mathOperator = '/';
        }

        createAndWriteLog(mathOperator, initialResult, enterNumber);
        writeToLog(calculationType, initialResult, enterNumber, currentResult);

    // }
}
function add() {
    calculateResult('ADD')
}

function subtract() {
    calculateResult('SUBTRACT')
}
function multiply() {
    calculateResult('MULTIPLY')
}

function divide() {
    calculateResult('DIVIDE')
}

addBtn.addEventListener('click', add);
subtractBtn.addEventListener('click', subtract);
multiplyBtn.addEventListener('click', multiply);
divideBtn.addEventListener('click', divide);

