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

let clickerCost = parseInt(clickerCostDisplay.innerHTML);
let clickerLevel = parseInt(clickerLevelDisplay.innerHTML);

let clicker2Cost = parseInt(clicker2CostDisplay.innerHTML);
let clicker2Level = parseInt(clicker2LevelDisplay.innerHTML);

let clicker3Cost = parseInt(clicker3CostDisplay.innerHTML);
let clicker3Level = parseInt(clicker3LevelDisplay.innerHTML);

function incrementLabubu() {
    labubuCount += labubuPerClick;
    labubuDisplay.innerHTML = Math.floor(labubuCount);
}

function buyClicker() {
    if (labubuCount >= clickerCost) {
        labubuCount -= clickerCost;
        clickerLevel++;
        labubuPerClick += 1;
        passiveIncome1 += 0.5;
        clickerCost = Math.round(clickerCost * 1.15);
        updateGameTotals();
    } else {
        alert("Недостаточно средств!");
    }
}

function buyClicker2() {
    if (labubuCount >= clicker2Cost) {
        labubuCount -= clicker2Cost;
        clicker2Level++;
        labubuPerClick += 5;
        passiveIncome2 += 2.5;
        clicker2Cost = Math.round(clicker2Cost * 1.25);
        updateGameTotals();
    } else {
        alert("Недостаточно средств!");
    }
}

function buyClicker3() {
    if (labubuCount >= clicker3Cost) {
        labubuCount -= clicker3Cost;
        clicker3Level++;
        labubuPerClick += 10;
        passiveIncome3 += 5;
        clicker3Cost = Math.round(clicker3Cost * 1.35);
        updateGameTotals();
    } else {
        alert("Недостаточно средств!");
    }
}

function updateGameTotals() {
    labubuPerSecond = passiveIncome1 + passiveIncome2 + passiveIncome3;
    updateDisplay();
}

function updateDisplay() {
    labubuDisplay.innerHTML = Math.floor(labubuCount);

    clickerCostDisplay.innerHTML = clickerCost;
    clickerLevelDisplay.innerHTML = clickerLevel;

    clicker2CostDisplay.innerHTML = clicker2Cost;
    clicker2LevelDisplay.innerHTML = clicker2Level;

    clicker3CostDisplay.innerHTML = clicker3Cost;
    clicker3LevelDisplay.innerHTML = clicker3Level;

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