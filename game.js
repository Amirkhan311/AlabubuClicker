let cost = document.querySelector('.labubuCost')
let parsedCost=parseFloat(cost.innerHTML)
let clickerCost = document.querySelector('.clicker')
let parsedClickerCost = parseFloat(clickerCost.innerHTML)
function incrementLabubu(){
    parsedCost+=1
    cost.innerHTML = parsedCost;
}
function buyClicker(){
    if(parsedCost>=parsedClickerCost){
        parsedCost-=parsedClickerCost
        cost.innerHTML= parsedCost
    }
}