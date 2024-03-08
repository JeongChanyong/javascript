// 전역 변수 값은 대문자로 해주는게 좋다.
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'MODE_STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'LOG_EVENT_MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'LOG_EVENT_PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'LOG_EVENT_GAME_OVER';

let battleLog = [];
let lastLoggedEntry;
function getMaxLifeValues() {

    const enteredValue = prompt('HP를 입력하세요', '100');
    let parserValue = parseInt(enteredValue);

    // 사용자로부터 입력 받은 문자열값을 숫자형으로 바꾸지 못할 경우 parseInt 는 NaN 값을 리턴
    // isNaN 함수를 통해 숫자 여부 확인
    if (isNaN(parserValue) || parserValue <= 0) {
        // 숫자가 아니면 오류를 발생 시켜 스크립트를 중지(오류가 발생하면 다른 이벤트 및 모두 실행 안됨)
        // throw 이후의 명령문은 실행 안됨
        throw {message: 'Invalid user input, not a number'}
    }
    return parserValue;
}

let chosenMaxLife; // block 내부에서만 사용하는 변수가 아니기에 block 밖에서 선언

try {
    // 문제가 발생할것 같은 코드
    chosenMaxLife = getMaxLifeValues();
} catch (e) {
    // 문제가 발생 하면 catch 하고 chosenMaxLife 의 값을 지정
    console.log(e)
    alert('입력값이 잘못 되었습니다. 기본값으로 지정 합니다')
    chosenMaxLife = 100;
} finally {

}


let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

// 체력 조정
adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {

    let logEntry = {
        event: ev, value: val, finalMonsterHealth: monsterHealth, finalPlayerHealth: playerHealth
    };

    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'MONSTER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: ev,
                value: val,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev, value: val, finalMonsterHealth: monsterHealth, finalPlayerHealth: playerHealth
            };
            break;
        default :
            logEntry = {};
    }
    /**
     if (ev === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
     **/
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {

    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth)
        alert('보너스 생명이 없으면 죽었습니다.')
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('몬스터를 처치 하였습니다.');
        writeToLog(LOG_EVENT_GAME_OVER, '플레이어 승', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('플레이어 사망');
        writeToLog(LOG_EVENT_GAME_OVER, '몬스터 승', currentMonsterHealth, currentPlayerHealth);
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert('무승부');
        writeToLog(LOG_EVENT_GAME_OVER, '무승부', currentMonsterHealth, currentPlayerHealth);
    }
    /**
     * else 사용할 경우 이벤트 발생시 마다 해당 블록을 실행됨
     */

    if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {

    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    /**
     위 코드 처럼 삼항연산자를 사용 해도 되고 아래와 같이 if 문을 이용 해도 된다.
     위 코드가 길거나 단순하지 않은 경우에는 일반적으로 if 문이 더 적합 할수 있다.
     if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
     **/
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {

    let healValue;

    /**
     * 처음 시작 시 currentPlayerHealth 100
     * 연산자 우선 순위로 인해 >= 기준 우항 먼저 계산
     * 초기값 100 - HEAL_VALUE (20) 의 값 80 보다 현재 currentPlayerHealth 값이 크다면
     * 피가 채워져서는 안된다.
     */
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert('피가 가득 입니다.')
        healValue = chosenMaxLife - currentPlayerHealth
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function printLogHandler() {

    for (let i = 0; i < battleLog.length; i++) {
        console.log('-------------------')
    }

    let i = 0;
    for (const logEntry of battleLog) {

        if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
            console.log(`#${i}`)
            for (const key in logEntry) {
                // []내의 이름은 문자열, 혹은 접근 하고자 하는 프로퍼티의 이름을 포함한 변수
                console.log(`${key} => ${logEntry[key]}`)
                // break;
            }
            lastLoggedEntry = i;
            break;
        }
        i++;
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);