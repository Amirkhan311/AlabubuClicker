// state.js

export const gameState = {
    labubuCount: 15500,
    baseLPC: 1, // Базовая сила клика от апгрейдов
    labubuPerSecond: 0,
    
    // Состояние бонуса 2x
    isDoubleClickActive: false,
    doubleClickActiveEndTime: 0,
    doubleClickCooldownEndTime: 0,
    currentClickMultiplier: 1,

    // Состояние музыки
    isMusicOn: true,
    
    // Состояние эволюции
    labubuLevel: 1
};

// Отдельно храним состояние апгрейдов
export const upgradesState = {
    'clicker': { level: 0, cost: 10 },
    'clicker2': { level: 0, cost: 150 },
    'clicker3': { level: 0, cost: 1500 }
};