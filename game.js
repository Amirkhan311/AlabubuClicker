// game.js

// 1. Импорты (ИСПРАВЛЕНЫ ПУТИ К ФАЙЛАМ В ПАПКЕ constants)
import { gameState, upgradesState } from './constants/state.js';
import * as Upgrades from './constants/upgrades.js';
import * as Evolution from './constants/evolution.js';
import * as UI from './constants/ui.js';
import * as SaveLoad from './constants/save-load.js';
import { evolutionBonuses } from './constants/evolution.js'; // Импортируем бонусы для расчетов

// 2. Глобальные объекты (звук)
const bgm = new Audio('./sounds/bgm.mp3'); // ИСПРАВЛЕН ПУТЬ
bgm.volume = 0.05;
bgm.loop = true;

// === ЛОГИКА ===

function buyUpgrade(upgradeName) {
    const upgradeData = Upgrades.getUpgradeData(upgradeName);
    const upgradeState = upgradesState[upgradeName];

    if (gameState.labubuCount >= upgradeState.cost) {
        const upgradeSound = new Audio('./sounds/upgrade.mp3'); // ИСПРАВЛЕН ПУТЬ
        upgradeSound.play();
        upgradeSound.volume = 0.1;
        
        gameState.labubuCount -= upgradeState.cost;
        upgradeState.level++;
        upgradeState.cost *= upgradeData.costMultiplier;
        gameState.baseLPC += upgradeData.lpc;
        
        recalculateTotals();
        UI.render(gameState, upgradesState);
    } else {
        alert("Недостаточно средств!");
    }
}

function evolveLabubu() {
    const evolutionSuccessful = Evolution.evolve(gameState, UI.showEvolutionNotification);
    if (evolutionSuccessful) {
        UI.playEvolutionAnimation();
        UI.render(gameState, upgradesState);
    }
}

function incrementLabubu(event) {
    const clickingSound = new Audio('./sounds/click.wav'); // ИСПРАВЛЕН ПУТЬ
    clickingSound.play();
    
    const evolutionBonus = evolutionBonuses[gameState.labubuLevel - 1];
    const finalLPC = gameState.baseLPC * evolutionBonus;
    const actualClickValue = finalLPC * gameState.currentClickMultiplier;
    gameState.labubuCount += actualClickValue;
    
    UI.showClickEffect(event, actualClickValue);
    UI.render(gameState, upgradesState);
}

function doubleClick() {
    const now = Date.now();
    if (gameState.isDoubleClickActive || now < gameState.doubleClickCooldownEndTime) {
        UI.showCooldownMessage(); // ДОБАВЛЕНА ОТСУТСТВУЮЩАЯ ФУНКЦИЯ
        return;
    }
    const doubleSound = new Audio('./sounds/upgrade.mp3'); // ИСПРАВЛЕН ПУТЬ
    doubleSound.play();
    doubleSound.volume = 0.1;

    gameState.isDoubleClickActive = true;
    gameState.currentClickMultiplier = 2;
    gameState.doubleClickActiveEndTime = now + 30 * 1000;
    gameState.doubleClickCooldownEndTime = now + 1 * 60 * 60 * 1000;

    UI.render(gameState, upgradesState);
}

function toggleMusic() {
    gameState.isMusicOn = !gameState.isMusicOn;
    UI.renderMusic(gameState.isMusicOn, bgm);
}

function recalculateTotals() {
    let totalPassiveIncome = 0;
    for (const name in upgradesState) {
        const upgrade = upgradesState[name];
        const upgradeData = Upgrades.getUpgradeData(name);
        totalPassiveIncome += upgrade.level * upgradeData.pi;
    }
    gameState.labubuPerSecond = totalPassiveIncome;
}

// === ИГРОВОЙ ЦИКЛ И ИНИЦИАЛИЗАЦИЯ ===

let lastUpdateTime = 0;
function gameLoop(currentTime) {
    if (!lastUpdateTime) lastUpdateTime = currentTime;
    const deltaTime = currentTime - lastUpdateTime;
    
    // Пассивный доход
    if (gameState.labubuPerSecond > 0) {
        gameState.labubuCount += (gameState.labubuPerSecond / 1000) * deltaTime;
    }

    // Сброс бонуса 2x, если время вышло
    if (gameState.isDoubleClickActive && currentTime > gameState.doubleClickActiveEndTime) {
        gameState.isDoubleClickActive = false;
        gameState.currentClickMultiplier = 1;
    }
    
    lastUpdateTime = currentTime;
    UI.render(gameState, upgradesState); // Постоянно обновляем UI
    requestAnimationFrame(gameLoop);
}

function init() {
    Upgrades.createUpgradeElements();
    
    const loadedData = SaveLoad.loadGame();
    if (loadedData) {
        Object.assign(gameState, loadedData.gameState);
        Object.assign(upgradesState, loadedData.upgradesState);
    }
    
    recalculateTotals();
    UI.renderMusic(gameState.isMusicOn, bgm); // Инициализируем музыку
    UI.render(gameState, upgradesState); // Первая отрисовка
    
    requestAnimationFrame(gameLoop); // Запускаем игровой цикл
}

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ HTML ===
window.buyUpgrade = buyUpgrade;
window.evolveLabubu = evolveLabubu;
window.incrementLabubu = incrementLabubu;
window.doubleClick = doubleClick;
window.toggleMusic = toggleMusic;
window.openShop = UI.openShop;
window.closeShop = UI.closeShop;
window.hideCooldownMessage = UI.hideCooldownMessage; // ДОБАВЛЕНА ОТСУТСТВУЮЩАЯ ФУНКЦИЯ
window.save = () => SaveLoad.saveGame(gameState, upgradesState);
window.load = () => {
    // Просто перезагружаем, чтобы применились данные из localStorage
    window.location.reload(); 
};

// === ЗАПУСК ИГРЫ ===
init();