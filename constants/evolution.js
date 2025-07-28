// evolution.js

// 1. Начальные данные (константы) для эволюции
export const evolutionCosts = [
    10000, 50000, 250000, 1000000, 5000000, 25000000, 100000000, 500000000
];
export const evolutionBonuses = [1, 1.5, 2, 2.5, 3, 4, 5, 7, 10]; // Множители

// 2. Функция логики эволюции
// Она принимает текущее состояние и возвращает true/false в зависимости от успеха
export function evolve(gameState, showNotification) {
    if (gameState.labubuLevel >= 9) return false;

    const cost = evolutionCosts[gameState.labubuLevel - 1];

    if (gameState.labubuCount >= cost) {
        gameState.labubuCount -= cost;
        gameState.labubuLevel++;
        
        // ИСПРАВЛЕН ПУТЬ К ЗВУКУ
        const evolutionSound = new Audio('./sounds/evolution.mp3');
        evolutionSound.volume = 0.3;
        evolutionSound.play().catch(e => console.warn("Evolution sound failed:", e));

        showNotification(gameState.labubuLevel); // Вызываем функцию для показа уведомления
        return true; // Эволюция успешна
    } else {
        alert(`Недостаточно лабубукоинов для эволюции!`);
        return false; // Эволюция не удалась
    }
}