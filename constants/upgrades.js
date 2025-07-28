// upgrades.js

// 1. Начальные данные (константы) для всех апгрейдов
const UPGRADES_DATA = {
    'clicker': { 
        mainName:'Кликер1', 
        image:'./images/cursor.png', 
        baseCost: 10, 
        costMultiplier: 1.12, 
        lpc: 1, 
        pi: 0 
    },
    'clicker2': { 
        mainName: 'Кликер2', 
        image:'./images/diamond.png', 
        baseCost: 150, 
        costMultiplier: 1.25, 
        lpc: 5, 
        pi: 2.5 
    },
    'clicker3': { 
        mainName:'Кликер3', 
        image:'./images/gold.png', 
        baseCost: 1500, 
        costMultiplier: 1.35, 
        lpc: 10, 
        pi: 5.0 
    }
};

// 2. Ссылки на DOM-элементы, которыми управляет этот модуль
const dom = {
    container: document.getElementById('upgrades-container'),
    template: document.getElementById('upgrade-template')
};

// --- ПУБЛИЧНЫЕ ФУНКЦИИ ---

// Создает HTML-элементы для апгрейдов
export function createUpgradeElements() {
    if (!dom.template) return; // Защита, если шаблон не найден
    const templateContent = dom.template.textContent;
    let allUpgradesHTML = '';

    for (const key in UPGRADES_DATA) {
        const upgrade = UPGRADES_DATA[key];
        let html = templateContent
            .replace(/{{mainName}}/g, upgrade.mainName)
            .replace(/{{image}}/g, upgrade.image)
            .replace(/{{name}}/g, key) // заменяем {{name}} на 'clicker', 'clicker2' и т.д.
            .replace(/{{cost}}/g, upgrade.baseCost);
        allUpgradesHTML += html;
    }
    dom.container.innerHTML = allUpgradesHTML;
}

// Возвращает начальные данные апгрейда
export function getUpgradeData(name) {
    return UPGRADES_DATA[name];
}