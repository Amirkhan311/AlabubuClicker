// ui.js
import { evolutionCosts, evolutionBonuses } from './evolution.js';

// 1. Ссылки на DOM-элементы
const dom = {
    labubuDisplay: document.querySelector('.labubuCost'),
    lbcTextDisplay: document.querySelector('#lbc-text'),
    lbsTextDisplay: document.querySelector('#lbs-text'),
    labubuImage: document.getElementById('labubu'),
    labubuImageCon: document.querySelector('.labubuImage'),
    
    evolutionContainer: document.getElementById('evolutionContainer'),
    evolutionCostDisplay: document.getElementById('evolutionCost'),

    doubleClickButton: document.getElementById('doubleClickButton'),
    doubleClickDurationTimer: document.getElementById('doubleClickDurationTimer'),
    
    musicIcon: document.getElementById('musicIcon'),
    
    shopOverlay: document.getElementById('shopOverlay'),
    shopLabubuCountDisplay: document.getElementById('shopLabubuCount'),

    cooldownMessageOverlay: document.getElementById('cooldownMessageOverlay'),
    cooldownMessageText: document.getElementById('cooldownMessageText'),
};

// 2. Главная функция рендера
export function render(gameState, upgradesState) {
    // Основные счетчики
    dom.labubuDisplay.innerHTML = Math.floor(gameState.labubuCount).toLocaleString('ru-RU');
    
    const evolutionBonus = evolutionBonuses[gameState.labubuLevel - 1];
    const finalLPC = gameState.baseLPC * evolutionBonus;
    dom.lbcTextDisplay.innerHTML = Math.floor(finalLPC * gameState.currentClickMultiplier);
    
    dom.lbsTextDisplay.innerHTML = gameState.labubuPerSecond.toFixed(1);

    // Апгрейды, эволюция, картинка, 2x, магазин
    renderUpgrades(upgradesState);
    renderEvolutionButton(gameState);
    renderDoubleClick(gameState);
    dom.labubuImage.src = `./images/labubu${gameState.labubuLevel}.png`;
    if (dom.shopLabubuCountDisplay) {
        dom.shopLabubuCountDisplay.innerHTML = Math.floor(gameState.labubuCount).toLocaleString('ru-RU');
    }
}

// Рендер апгрейдов
function renderUpgrades(upgradesState) {
    for (const name in upgradesState) {
        const levelDisplay = document.querySelector(`.${name}Level`);
        const costDisplay = document.querySelector(`.${name}`);
        if(levelDisplay && costDisplay) {
            levelDisplay.innerHTML = upgradesState[name].level;
            costDisplay.innerHTML = Math.round(upgradesState[name].cost);
        }
    }
}

// Рендер кнопки эволюции
function renderEvolutionButton(gameState) {
    if (gameState.labubuLevel >= 9) {
        dom.evolutionContainer.innerHTML = `<div class="evolution-button">Макс. эволюция</div><p>🌟 Достигнут максимум! 🌟</p>`;
        dom.evolutionContainer.classList.add('max-level');
        dom.evolutionContainer.onclick = null;
    } else {
        const nextCost = evolutionCosts[gameState.labubuLevel - 1];
        dom.evolutionCostDisplay.innerHTML = nextCost.toLocaleString('ru-RU');
        if (gameState.labubuCount >= nextCost) {
            dom.evolutionContainer.classList.add('available');
        } else {
            dom.evolutionContainer.classList.remove('available');
        }
    }
}

// Рендер бонуса 2x
function renderDoubleClick(gameState) {
    const now = Date.now();
    if (now < gameState.doubleClickCooldownEndTime) {
        dom.doubleClickButton.classList.add('cooldown');
    } else {
        dom.doubleClickButton.classList.remove('cooldown');
    }
    
    const remainingTime = gameState.doubleClickActiveEndTime - now;
    if (remainingTime > 0) {
        dom.doubleClickDurationTimer.classList.add('active');
        dom.doubleClickDurationTimer.innerHTML = formatTime(remainingTime);
    } else {
        dom.doubleClickDurationTimer.classList.remove('active');
        dom.doubleClickDurationTimer.innerHTML = '';
    }
}

// Управление музыкой
export function renderMusic(isMusicOn, bgm) {
    if (isMusicOn && bgm.paused) {
        dom.musicIcon.src = './images/music_on.png';
        bgm.play().catch(e => console.warn("BGM play failed:", e));
    } else if (!isMusicOn) {
        dom.musicIcon.src = './images/music_off.png';
        bgm.pause();
    }
}

// Управление магазином
export function openShop() {
    dom.shopOverlay.style.display = 'flex';
    setTimeout(() => dom.shopOverlay.classList.add('show'), 10);
}
export function closeShop() {
    dom.shopOverlay.classList.remove('show');
    dom.shopOverlay.addEventListener('transitionend', function handler() {
        dom.shopOverlay.style.display = 'none';
        dom.shopOverlay.removeEventListener('transitionend', handler);
    });
}

// ДОБАВЛЕНА ОТСУТСТВУЮЩАЯ ФУНКЦИЯ - Управление сообщением о кулдауне
export function showCooldownMessage() {
    const now = Date.now();
    const remainingCooldown = Math.ceil((gameState.doubleClickCooldownEndTime - now) / 1000 / 60);
    dom.cooldownMessageText.innerHTML = `Бонус x2 недоступен! Осталось ${remainingCooldown} мин.`;
    dom.cooldownMessageOverlay.classList.add('show');
}

export function hideCooldownMessage() {
    dom.cooldownMessageOverlay.classList.remove('show');
}

// Всплывающие числа при клике
export function showClickEffect(event, amount) {
    const div = document.createElement('div');
    div.innerHTML = `+${Math.round(amount)}`;
    div.style.cssText = `color: white; position: absolute; top: ${event.offsetY}px; left: ${event.offsetX}px; font-size: 30px; pointer-events: none;`;
    dom.labubuImageCon.appendChild(div);
    div.classList.add('fadeUp');
    div.addEventListener('animationend', () => div.remove());
}

// ДОБАВЛЕНА ОТСУТСТВУЮЩАЯ ФУНКЦИЯ - Уведомление об эволюции
export function showEvolutionNotification(level) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 40px;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 3px solid #fbbf24;
        ">
            🎉 ЭВОЛЮЦИЯ! 🎉<br>
            Уровень ${level}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
}

// Анимация эволюции
export function playEvolutionAnimation() {
    dom.labubuImage.classList.add('evolving');
    dom.labubuImage.addEventListener('animationend', () => {
        dom.labubuImage.classList.remove('evolving');
    }, { once: true });
}

// Вспомогательная функция для форматирования времени
function formatTime(milliseconds) {
    const seconds = Math.ceil(milliseconds / 1000);
    if (seconds < 60) {
        return `${seconds}с`;
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}