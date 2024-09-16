// SELECTORS & CONSTANTS
const calledNumbers = []
const availableNumbers = []
const playBtn = document.getElementById("playBtn")
const resetBtn = document.getElementById("resetBtn")
const buyBtn = document.getElementById("buyBtn")
const calledNumsDisplayed = document.getElementById("calledNumsDisplayed")
const playerSection = document.getElementById("playerSection")

// EXECUTION
playBtn.addEventListener("click", callNumber)
resetBtn.addEventListener("click", resetGame)
buyBtn.addEventListener("click", showPlayerCard)
refillAvailableNums()
showPlayerCard()

// FUNCTIONS
function refillAvailableNums() {
    for (let i = 1; i <= 75; i++) {
        availableNumbers.push(i)
    }
}

function callNumber() {
    const pickedIndex = Math.floor(Math.random() * availableNumbers.length)
    const pickedNum = availableNumbers.splice(pickedIndex, 1)
    calledNumbers.push(pickedNum)
    calledNumsDisplayed.textContent += ` ${pickedNum}`
    return pickedNum
}

function resetGame() {
    while (calledNumbers.length) {
        calledNumbers.pop()
    }
    while (availableNumbers.length) {
        availableNumbers.pop()
    }
    refillAvailableNums()
    calledNumsDisplayed.textContent = ""
    playerSection.innerHTML = ""
    showPlayerCard()
}

function generatePlayerCard() {
    const bingoStarts = [1, 16, 31, 46, 61]
    const playerNumbers = []
    for (num in bingoStarts) {
        for (let i = 0; i < 5; i++) {
            let numTry = null
            while (true) {
                numTry = (Math.floor(Math.random() * 15)) + bingoStarts[num]
                if (playerNumbers.includes(numTry)) continue
                playerNumbers.push(numTry)
                break
            }
        }
    }   
    return playerNumbers
}

function showPlayerCard() {
    const playerNumbers = generatePlayerCard()
    const playerCard = document.createElement("table")
    const cardHeader = document.createElement("thead")
    const cardHeaderRow = document.createElement("tr")
    const bHead = document.createElement("th")
    const iHead = document.createElement("th")
    const nHead = document.createElement("th")
    const gHead = document.createElement("th")
    const oHead = document.createElement("th")
    const cardBody = document.createElement("tbody")
    const bodyRows = [document.createElement("tr"), document.createElement("tr"), document.createElement("tr"), document.createElement("tr"), document.createElement("tr")]
    
    for (let i = 0; i < playerNumbers.length; i++) {
        const toAdd = document.createElement("td")
        i == 12 ? toAdd.textContent = "FREE" : toAdd.textContent = playerNumbers[i]
        toAdd.addEventListener("click", checkoffNumber)
        bodyRows[i % 5].appendChild(toAdd)
    }
    bHead.textContent = "B"
    iHead.textContent = "I"
    nHead.textContent = "N"
    gHead.textContent = "G"
    oHead.textContent = "O"
    cardHeaderRow.appendChild(bHead)
    cardHeaderRow.appendChild(iHead)
    cardHeaderRow.appendChild(nHead)
    cardHeaderRow.appendChild(gHead)
    cardHeaderRow.appendChild(oHead)
    cardHeader.appendChild(cardHeaderRow)
    playerCard.appendChild(cardHeader)
    for (let i = 0; i < 5; i++) {
        cardBody.appendChild(bodyRows[i])
    }
    playerCard.appendChild(cardBody)
    playerCard.classList.add("player-card")
    document.getElementById("playerSection").appendChild(playerCard)
}

function checkoffNumber() {
    this.classList.toggle("num-called")
}