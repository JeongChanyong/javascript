// 전역 변수 값은 대문자로 해주는게 좋다.
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;


// 사용자와 몬스터의 최대 체력 (차후 사용자로 부터 입력 받기에 let 으로 설정)
let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

// 체력 조정
adjustHealthBars(chosenMaxLife);

function endRound() {

    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth)
        alert('보너스 생명이 없으면 죽었습니다.')
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("몬스터를 처치 하였습니다.");
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("플레이어 사망");
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("무승부");
    }
    /**
     * else 사용할 경우 이벤트 발생시 마다 해당 블록을 실행 하기에 해당 로직에서는 사용 하면 안된다.
     */
}

function attackMonster(mode) {

    let maxDamage;

    if (mode === 'ATTACK') {
        maxDamage = ATTACK_VALUE;
    } else if (mode === 'STRONG_ATTACK') {
        maxDamage = STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;

    endRound();
}

function attackHandler() {
    attackMonster('ATTACK');
}

function strongAttackHandler() {
    attackMonster('STRONG_ATTACK');
}

function healPlayerHandler() {

    let healValue;

    /**
     * 처음 시작 시 currentPlayerHealth 100
     * 연산자 우선 순위로 인해 >= 기준 우항 먼저 계산을 한다
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
    endRound();
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);