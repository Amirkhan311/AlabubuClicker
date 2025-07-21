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
let labubuPerClick = 1; // Это базовая ценность лабубукоинов за клик

let passiveIncome1 = 0;
let passiveIncome2 = 0;
let passiveIncome3 = 0;
let labubuPerSecond = 0;

const bgm = new Audio('/sounds/bgm.mp3')
bgm.volume = 0.05

// Переменные и элементы для кнопки 2x
let currentClickMultiplier = 1;
let isDoubleClickActive = false;
let doubleClickActiveEndTime = 0;
let doubleClickCooldownEndTime = 0;

let durationTimerInterval; // ID таймера для отображения времени действия 2x
let cooldownTimerInterval; // ID таймера для обновления состояния кнопки 2x (кулдаун)
let cooldownMessageTimerInterval; // ID таймера для обновления текста в плашке кулдауна

const doubleClickButton = document.getElementById('doubleClickButton'); // Новая ссылка на кнопку 2x
const doubleClickDurationTimerDisplay = document.getElementById('doubleClickDurationTimer');

const cooldownMessageOverlay = document.getElementById('cooldownMessageOverlay');
const cooldownMessageText = document.getElementById('cooldownMessageText');

// Новые переменные и элементы для управления музыкой
const musicToggleButton = document.getElementById('musicToggleButton');
const musicIcon = document.getElementById('musicIcon'); // Новая ссылка на иконку
let isMusicOn = true; 

// Новые переменные и элементы для магазина
const shopButton = document.getElementById('shopButton');
const shopOverlay = document.getElementById('shopOverlay');
const shopItemsContainer = document.getElementById('shopItemsContainer');
const shopLabubuCountDisplay = document.getElementById('shopLabubuCount');


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
         // Сохраняем переменные состояния 2x кнопки
         localStorage.setItem('isDoubleClickActive', JSON.stringify(isDoubleClickActive));
         localStorage.setItem('doubleClickActiveEndTime', JSON.stringify(doubleClickActiveEndTime));
         localStorage.setItem('doubleClickCooldownEndTime', JSON.stringify(doubleClickCooldownEndTime));
         // Сохраняем состояние музыки
         localStorage.setItem('isMusicOn', JSON.stringify(isMusicOn));
         updateGameTotals()


    }
    function load(){
          upgrades.map((upgrade) =>{
                const savedValues = JSON.parse(localStorage.getItem(upgrade.name))
                upgrade.parsedCost = savedValues.parsedCost
                upgrade.level.innerHTML = savedValues.parsedLevel
                // Теперь стоимость всегда округляется для чистого вида.
                upgrade.cost.innerHTML =  Math.round(upgrade.parsedCost); 


          })
          labubuPerClick = JSON.parse(localStorage.getItem('lbc')) || 1; 
          labubuPerSecond = JSON.parse(localStorage.getItem('lbs'))
          passiveIncome1 = JSON.parse(localStorage.getItem('lbs1'))
          passiveIncome2 = JSON.parse(localStorage.getItem('lbs2'))
          passiveIncome3 = JSON.parse(localStorage.getItem('lbs3'))
          labubuCount= JSON.parse(localStorage.getItem('labubu'))

          // Загружаем переменные состояния 2x кнопки
          isDoubleClickActive = JSON.parse(localStorage.getItem('isDoubleClickActive')) || false;
          doubleClickActiveEndTime = JSON.parse(localStorage.getItem('doubleClickActiveEndTime')) || 0;
          doubleClickCooldownEndTime = JSON.parse(localStorage.getItem('doubleClickCooldownEndTime')) || 0;

          // Загружаем состояние музыки. Если сохранения нет, по умолчанию true.
          isMusicOn = JSON.parse(localStorage.getItem('isMusicOn'));
          if (isMusicOn === null) { // Проверяем, если значения нет в localStorage
              isMusicOn = true; // Устанавливаем по умолчанию на true
          }


          initializeDoubleClickState(); // Инициализация состояния 2x кнопки после загрузки
          initializeMusicState(); // Инициализация состояния музыки после загрузки
          updateGameTotals()
    }


let labubuImageCon = document.querySelector('.labubuImage')






function incrementLabubu(event) {
    const clickingSound = new Audio('/sounds/click.wav')
    clickingSound.play()
    // Используем текущий множитель клика для расчета дохода
    const actualClickValue = labubuPerClick * currentClickMultiplier;
    labubuCount += actualClickValue;
    labubuDisplay.innerHTML = Math.floor(labubuCount);

    const x = event.offsetX;
    const y = event.offsetY;

    const gbc = actualClickValue; // Отображаем фактическое значение

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
    });// Этот код создает анимированные числа, которые вылетают при клике по Лабубу.
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
    
    // Отображаем значение клика с учетом текущего множителя
    lbcTextDisplay.innerHTML = Math.floor(labubuPerClick * currentClickMultiplier); 
    lbsTextDisplay.innerHTML = labubuPerSecond.toFixed(1);

    // Обновляем количество лабубукоинов в магазине
    if (shopLabubuCountDisplay) {
        shopLabubuCountDisplay.innerHTML = Math.floor(labubuCount);
    }
}

const ticksPerSecond = 10;
setInterval(function() {
    if (labubuPerSecond > 0) {
        const incomePerTick = labubuPerSecond / ticksPerSecond;
        labubuCount += incomePerTick;
        labubuDisplay.innerHTML = Math.floor(labubuCount);
        // Обновляем количество лабубукоинов в магазине, если он открыт
        if (shopOverlay.classList.contains('show')) {
            shopLabubuCountDisplay.innerHTML = Math.floor(labubuCount);
        }
    }
}, 1000 / ticksPerSecond);


updateDisplay(); // Обновляем дисплей при загрузке игры

// Функция для переключения музыки
function toggleMusic() {
    if (isMusicOn) {
        // Если музыка включена, ставим на паузу
        bgm.pause();
        isMusicOn = false;
        musicIcon.src = './images/music_off.png'; // Показываем иконку "Музыка выключена"
    } else {
        // Если музыка выключена, пытаемся воспроизвести
        bgm.play().then(() => {
            console.log("Фоновая музыка запущена");
            isMusicOn = true;
            bgm.loop = true; // Убеждаемся, что зацикливание установлено после успешного запуска
            musicIcon.src = './images/music_on.png'; // Показываем иконку "Музыка включена"
        }).catch((e) => {
            console.warn("Ошибка запуска звука:", e);
            // Если воспроизведение не удалось, оставляем состояние "выключено"
            isMusicOn = false;
            musicIcon.src = './images/music_off.png';
        });
    }
}


// Функции для кнопки 2x
// Форматирует время в удобный вид (Ч М С)
function formatTime(milliseconds) {
    let totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let timeString = "";
    if (hours > 0) timeString += `${hours}ч `;
    if (minutes > 0) timeString += `${minutes}м `;
    timeString += `${seconds}с`;
    return timeString.trim();
}

// Обновляет отображение таймера длительности эффекта 2x на кнопке
function updateDurationTimerDisplay() {
    const remainingTime = doubleClickActiveEndTime - Date.now();

    if (remainingTime > 0) {
        doubleClickDurationTimerDisplay.classList.add('active');
        doubleClickDurationTimerDisplay.innerHTML = formatTime(remainingTime);
    } else {
        // Эффект 2x закончился
        doubleClickDurationTimerDisplay.classList.remove('active');
        doubleClickDurationTimerDisplay.innerHTML = '';
        if (isDoubleClickActive) { // Проверяем, был ли эффект активен
            isDoubleClickActive = false;
            currentClickMultiplier = 1; // Сбрасываем множитель
            updateDisplay(); // Обновляем отображение Лабубукоинов за клик
        }
        clearInterval(durationTimerInterval); // Останавливаем таймер
        durationTimerInterval = null;
    }
}

// Обновляет состояние кнопки 2x в зависимости от кулдауна
function updateCooldownTimerAndButton() {
    const remainingCooldown = doubleClickCooldownEndTime - Date.now();

    if (remainingCooldown > 0) {
        doubleClickButton.classList.add('cooldown'); // Добавляем класс кулдауна
    } else {
        // Кулдаун закончился
        doubleClickButton.classList.remove('cooldown'); // Убираем класс кулдауна
        clearInterval(cooldownTimerInterval); // Останавливаем таймер
        cooldownTimerInterval = null;
    }
}

// Показывает плашку с сообщением о кулдауне и запускает таймер обновления текста
function showCooldownMessage() {
    const remainingCooldown = doubleClickCooldownEndTime - Date.now();
    if (remainingCooldown > 0) {
        // Запускаем таймер для обновления текста сообщения
        if (cooldownMessageTimerInterval) { // Если таймер уже был, очищаем его
            clearInterval(cooldownMessageTimerInterval);
        }
        cooldownMessageTimerInterval = setInterval(() => {
            const currentRemaining = doubleClickCooldownEndTime - Date.now();
            if (currentRemaining > 0) {
                cooldownMessageText.innerHTML = `2x недоступен. Попробуйте через ${formatTime(currentRemaining)}.`;
            } else {
                cooldownMessageText.innerHTML = `2x теперь доступен!`; // Сообщение, когда кулдаун закончился, но плашка ещё висит
                clearInterval(cooldownMessageTimerInterval); // Останавливаем таймер
                cooldownMessageTimerInterval = null;
            }
        }, 1000); // Обновляем каждую секунду

        // Устанавливаем начальный текст и показываем оверлей
        cooldownMessageText.innerHTML = `2x недоступен. Попробуйте через ${formatTime(remainingCooldown)}.`;
        cooldownMessageOverlay.classList.add('show');
    }
}

// Скрывает плашку с сообщением о кулдауне и очищает таймер
function hideCooldownMessage() {
    cooldownMessageOverlay.classList.remove('show');
    if (cooldownMessageTimerInterval) {
        clearInterval(cooldownMessageTimerInterval);
        cooldownMessageTimerInterval = null;
    }
}


function doubleClick() {
    const now = Date.now();

    // Проверяем, активен ли эффект или кнопка на кулдауне
    if (isDoubleClickActive || now < doubleClickCooldownEndTime) {
        showCooldownMessage(); // Показываем сообщение о кулдауне
        return; // Выходим из функции
    }

    const doubleSound = new Audio('/sounds/upgrade.mp3'); 
    doubleSound.play();
    doubleSound.volume = 0.1;

    // Активируем эффект 2x
    isDoubleClickActive = true;
    currentClickMultiplier = 2; // Устанавливаем множитель
    doubleClickActiveEndTime = now + 30 * 1000; // Эффект длится 30 секунд
    doubleClickCooldownEndTime = now + 1 * 60 * 60 * 1000; // Кулдаун 1 час

    updateDisplay(); // Обновляем отображение Лабубукоинов за клик на экране

    // Запускаем таймер длительности эффекта
    updateDurationTimerDisplay(); // Обновляем немедленно, чтобы показать таймер
    durationTimerInterval = setInterval(updateDurationTimerDisplay, 1000);

    // Запускаем таймер кулдауна кнопки
    updateCooldownTimerAndButton(); // Обновляем немедленно, чтобы заблокировать кнопку
    cooldownTimerInterval = setInterval(updateCooldownTimerAndButton, 1000);
}

// Функция инициализации состояния 2x кнопки после загрузки
function initializeDoubleClickState() {
    const now = Date.now();

    // Восстанавливаем состояние активности 2x эффекта
    if (isDoubleClickActive && doubleClickActiveEndTime > now) {
        currentClickMultiplier = 2; // Применяем множитель
        updateDurationTimerDisplay();
        durationTimerInterval = setInterval(updateDurationTimerDisplay, 1000);
    } else {
        isDoubleClickActive = false; // Эффект неактивен, если время истекло
        currentClickMultiplier = 1; // Сбрасываем множитель
        doubleClickDurationTimerDisplay.classList.remove('active');
        doubleClickDurationTimerDisplay.innerHTML = '';
    }

    // Восстанавливаем состояние кулдауна кнопки 2x
    if (doubleClickCooldownEndTime > now) {
        doubleClickButton.classList.add('cooldown'); // Применяем стиль кулдауна
        updateCooldownTimerAndButton();
        cooldownTimerInterval = setInterval(updateCooldownTimerAndButton, 1000);
    } else {
        doubleClickButton.classList.remove('cooldown'); // Убираем стиль кулдауна
    }
    updateDisplay(); // Обновляем дисплей, чтобы все отображалось корректно
}

// Функция инициализации состояния музыки после загрузки
function initializeMusicState() {
    if (musicIcon) { // Проверяем, что иконка существует в DOM
        if (isMusicOn) {
            musicIcon.src = './images/music_on.png'; // Устанавливаем иконку "Музыка включена"
            bgm.loop = true; // Убеждаемся, что зацикливание установлено
            // Пытаемся воспроизвести музыку. Браузер может заблокировать.
            bgm.play().then(() => {
                console.log("Фоновая музыка успешно запущена при инициализации.");
                // isMusicOn уже true
            }).catch((e) => {
                console.warn("Автоматический запуск музыки заблокирован браузером:", e);
                isMusicOn = false; // Устанавливаем в false, если заблокировано
                musicIcon.src = './images/music_off.png'; // Устанавливаем иконку "Музыка выключена"
            });
        } else {
            // Если музыка должна быть выключена (по сохранению или из-за блокировки), ставим на паузу
            musicIcon.src = './images/music_off.png';
            bgm.pause(); 
        }
    }
}

// Функции для магазина
function openShop() {
    // Устанавливаем display: flex перед добавлением класса 'show', чтобы transition сработал
    shopOverlay.style.display = 'flex';
    // Небольшая задержка, чтобы браузер успел применить display: flex, прежде чем начнется transition
    setTimeout(() => {
        shopOverlay.classList.add('show');
    }, 10); 
    updateDisplay(); // Обновляем количество лабубукоинов в магазине при открытии
}

function closeShop() {
    shopOverlay.classList.remove('show');
    // После завершения перехода, полностью скрываем оверлей
    shopOverlay.addEventListener('transitionend', function handler() {
        shopOverlay.style.display = 'none';
        shopOverlay.removeEventListener('transitionend', handler); // Удаляем обработчик, чтобы он не срабатывал повторно
    });
}


// Вызываем инициализацию состояния кнопок после основной инициализации игры
initializeDoubleClickState();
initializeMusicState();


window.incrementLabubu=incrementLabubu;
window.buyUpgrade = buyUpgrade;
window.save = save;
window.load = load;
window.doubleClick = doubleClick; // Делаем функцию doubleClick доступной глобально
window.hideCooldownMessage = hideCooldownMessage; // Делаем функцию скрытия сообщения доступной глобально
window.toggleMusic = toggleMusic; // Делаем функцию toggleMusic доступной глобально
window.openShop = openShop; // Делаем функцию openShop доступной глобально
window.closeShop = closeShop; // Делаем функцию closeShop доступной глобально