
import { upgrades } from "./constants/upgrades.js";

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

const bgm = new Audio('/sounds/bgm.mp3')
bgm.volume = 0.05


 

function buyUpgrade(upgrade){
    const mu=upgrades.find((u)=> {  //mu=matchedUpgrade
        if(u.name===upgrade) return u
    })
    
    if (labubuCount >= mu.parsedCost) {
    const upgradeSound = new Audio('/sounds/upgrade.mp3')
    upgradeSound.play()
    upgradeSound.volume = 0.1
    labubuCount -= mu.parsedCost;
    labubuDisplay.innerHTML = Math.round(labubuCount);

    mu.level.innerHTML++;
    labubuPerClick += mu.lpc;

    if (mu.name === "clicker") {
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

    function save(){
        localStorage.clear()
        upgrades.map((upgrade) =>{

            const obj = JSON.stringify({
                parsedLevel: parseFloat(upgrade.level.innerHTML),
                parsedCost: upgrade.parsedCost,
            })

            localStorage.setItem(upgrade.name,obj)
        })
         localStorage.setItem('lbc', JSON.stringify(labubuPerClick))
         localStorage.setItem('lbs', JSON.stringify(labubuPerSecond))
         localStorage.setItem('lbs1', JSON.stringify(passiveIncome1))
         localStorage.setItem('lbs2', JSON.stringify(passiveIncome2))
         localStorage.setItem('lbs3', JSON.stringify(passiveIncome3))
         localStorage.setItem('labubu', JSON.stringify(labubuCount))
         updateGameTotals()


    }
    function load(){
          upgrades.map((upgrade) =>{
                const savedValues = JSON.parse(localStorage.getItem(upgrade.name))
                upgrade.parsedCost = savedValues.parsedCost
                upgrade.level.innerHTML = savedValues.parsedLevel
                upgrade.cost.innerHTML =  upgrade.parsedCost 


          })
          labubuPerClick = JSON.parse(localStorage.getItem('lbc'))
          labubuPerSecond = JSON.parse(localStorage.getItem('lbs'))
          passiveIncome1 = JSON.parse(localStorage.getItem('lbs1'))
          passiveIncome2 = JSON.parse(localStorage.getItem('lbs2'))
          passiveIncome3 = JSON.parse(localStorage.getItem('lbs3'))
          labubuCount= JSON.parse(localStorage.getItem('labubu'))
          updateGameTotals()
    }


let labubuImageCon = document.querySelector('.labubuImage')






function incrementLabubu(event) {
    const clickingSound = new Audio('/sounds/click.wav')
    clickingSound.play()
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
        font-size: 30px;
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

let bgmStarted = false;

function startBgmOnce() {
    if (!bgmStarted) {
        bgm.loop = true;
        bgm.play().then(() => {
            console.log("Фоновая музыка запущена");
        }).catch((e) => {
            console.warn("Ошибка запуска звука:", e);
        });
        bgmStarted = true;
    }
}

document.addEventListener('click', startBgmOnce);

window.incrementLabubu=incrementLabubu;
window.buyUpgrade = buyUpgrade;
window.save = save;
window.load = load;
