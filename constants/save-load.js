// save-load.js

export function saveGame(gameState, upgradesState) {
    const saveData = {
        gameState: gameState,
        upgradesState: upgradesState
    };
    localStorage.clear(); // Очищаем старые данные
    localStorage.setItem('labubuClickerSave', JSON.stringify(saveData));
    console.log("Game Saved!");
}

export function loadGame() {
    const savedDataRaw = localStorage.getItem('labubuClickerSave');
    if (savedDataRaw) {
        try {
            console.log("Game Loaded!");
            return JSON.parse(savedDataRaw);
        } catch(e) {
            console.error("Failed to parse saved data:", e);
            return null;
        }
    }
    return null; // Возвращаем null, если сохранения нет
}