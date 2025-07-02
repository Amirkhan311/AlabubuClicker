const labubuDisplay = document.querySelector('.labubuCost');

const clickerCostDisplay = document.querySelector('.clicker');
const clickerLevelDisplay = document.querySelector('.clickerLevel');
const passiveIncomeDisplay1 = document.querySelector('.clicker-increase');

const clicker2CostDisplay = document.querySelector('.clicker2');
const clicker2LevelDisplay = document.querySelector('.clicker2Level');
const passiveIncomeDisplay2 = document.querySelector('.clicker2-increase');

const clicker3CostDisplay = document.querySelector('.clicker3');
const clicker3LevelDisplay = document.querySelector('.clicker3Level');
const passiveIncomeDisplay3 = document.querySelector('.clicker3-increase');

const lbcTextDisplay = document.querySelector('#lbc-text');
const lbsTextDisplay = document.querySelector('#lbs-text');

let labubuCount = parseInt(labubuDisplay.innerHTML);
let labubuPerClick = 1;

let passiveIncome1 = 0;
let passiveIncome2 = 0;
let passiveIncome3 = 0;
let labubuPerSecond = 0;
 
const upgrades = [
    {
        name: 'clicker1',
        cost: document.querySelector('.clicker'),
        parsedCost:parseFloat(document.querySelector('.clicker').innerHTML),
        increase:document.querySelector('.clicker-increase'),
        parsedIncrease:parseFloat(document.querySelector('.clicker-increase').innerHTML),
        level: document.querySelector('.clickerLevel'),
        pi: 0,//passive income nigga
        lpc:1,//labubu per click как свойство объекта
        labubuCostMult: 1.12,

    },
     {
        name: 'clicker2',
        cost: document.querySelector('.clicker2'),
        parsedCost:parseFloat(document.querySelector('.clicker2').innerHTML),
        increase:document.querySelector('.clicker2-increase'),
        parsedIncrease:parseFloat(document.querySelector('.clicker2-increase').innerHTML),
        level: document.querySelector('.clicker2Level'),
        pi:2.5,
        lpc:5,
        labubuCostMult: 1.25,

    },
     {
        name: 'clicker3',
        cost: document.querySelector('.clicker3'),
        parsedCost:parseFloat(document.querySelector('.clicker3').innerHTML),
        increase:document.querySelector('.clicker3-increase'),
        parsedIncrease:parseFloat(document.querySelector('.clicker3-increase').innerHTML),
        level: document.querySelector('.clicker3Level'),
        pi:5,
        lpc:10,
        labubuCostMult: 1.35,

    }
]
function buyUpgrade(upgrade){
    const mu=upgrades.find((u)=> {  //mu=matchedUpgrade
        if(u.name===upgrade) return u
    })
    
    if (labubuCount >= mu.parsedCost) {
    labubuCount -= mu.parsedCost;
    labubuDisplay.innerHTML = Math.round(labubuCount);

    mu.level.innerHTML++;
    labubuPerClick += mu.lpc;

    if (mu.name === "clicker1") {
        passiveIncome1 += mu.pi;
    } 
    else if (mu.name === "clicker2") {
        passiveIncome2 += mu.pi;
    } 
    else if (mu.name === "clicker3") {
        passiveIncome3 += mu.pi;
    }

    mu.parsedCost *= mu.labubuCostMult;
    mu.cost.innerHTML = Math.round(mu.parsedCost);

    updateGameTotals();
}
     else {
        alert("Недостаточно средств!");
    }

    }


let labubuImageCon = document.querySelector('.labubuImage')


function incrementLabubu(event) {
    labubuCount += labubuPerClick;
    labubuDisplay.innerHTML = Math.floor(labubuCount);

    const x = event.offsetX;
    const y = event.offsetY;

    const gbc = labubuPerClick;

    const div = document.createElement('div');
    div.innerHTML = `+${Math.round(gbc)}`;
    div.style.cssText = `
        color: white;
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        font-size: 15px;
        pointer-events: none;
    `;
    labubuImageCon.appendChild(div);

    div.classList.add('fadeUp');
    div.addEventListener('animationend', () => {
        div.remove();
    });//вот это вся залупа предназначена для анимации единичек , сам не поймешь , спроси у ИИ как это 
}

function updateGameTotals() {
    labubuPerSecond = passiveIncome1 + passiveIncome2 + passiveIncome3;
    updateDisplay();
}

function updateDisplay() {
    labubuDisplay.innerHTML = Math.floor(labubuCount);


    passiveIncomeDisplay1.innerHTML = passiveIncome1.toFixed(1);
    passiveIncomeDisplay2.innerHTML = passiveIncome2.toFixed(1);
    passiveIncomeDisplay3.innerHTML = passiveIncome3.toFixed(1);
    
    lbcTextDisplay.innerHTML = labubuPerClick;
    lbsTextDisplay.innerHTML = labubuPerSecond.toFixed(1);
}

const ticksPerSecond = 10;
setInterval(function() {
    if (labubuPerSecond > 0) {
        const incomePerTick = labubuPerSecond / ticksPerSecond;
        labubuCount += incomePerTick;
        labubuDisplay.innerHTML = Math.floor(labubuCount);
    }
}, 1000 / ticksPerSecond);

updateDisplay();