import { defaultValues } from "./defaultValues.js"; 

function createUpgrades() {
    const upgradesContainer = document.getElementById('upgrades-container');
    const template = document.getElementById('upgrade-template').textContent;

    defaultValues.forEach((object) => {
        let html = template;

        Object.keys(object).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, object[key]);
        });

        upgradesContainer.innerHTML += html;
    });
}
createUpgrades()
export const upgrades = [
    {
        name: 'clicker',
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