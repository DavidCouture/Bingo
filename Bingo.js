// SELECTORS & CONSTANTS
const calledNumbers = []
const availableNumbers = []
const playBtn = document.getElementById("playBtn")
const resetBtn = document.getElementById("resetBtn")
const buyBtn = document.getElementById("buyBtn")
const calledNumsDisplayed = document.getElementById("calledNumsDisplayed")
const playerSection = document.getElementById("playerSection")
const markingMethod = document.getElementById("marking-method")
const winCondition = document.getElementById("win-condition")

let automaticMode = true
let gameType = "Standard"

// EXECUTION
playBtn.addEventListener("click", callNumber)
resetBtn.addEventListener("click", resetGame)
buyBtn.addEventListener("click", showPlayerCard)
markingMethod.addEventListener("change", markingMethodChange)
winCondition.addEventListener("change", winConditionChange)
refillAvailableNums()
showPlayerCard()

// FUNCTIONS
// Called on game start and resets. Makes all bingo numbers available to be called during the game.
function refillAvailableNums() {
    for (let i = 1; i <= 75; i++) {
        availableNumbers.push(i)
    }
}

// This is how bingo numbers are called.
function callNumber() {
    if (buyBtn.disabled == false) {
        buyBtn.disabled = true
    }
    if (markingMethod.disabled == false) {
        markingMethod.disabled = true
    }
    if (winCondition.disabled == false) {
        winCondition.disabled = true
    }
    if (availableNumbers.length == 0) {
        return
    }
    const pickedIndex = Math.floor(Math.random() * availableNumbers.length)
    const pickedNum = availableNumbers.splice(pickedIndex, 1)
    const bingoString = "BINGO"
    calledNumbers.push(pickedNum[0])
    const numDisplayedElement = document.createElement("li")
    numDisplayedElement.textContent += ` ${bingoString[Math.floor(pickedNum/15.1)]}-${pickedNum}`
    calledNumsDisplayed.appendChild(numDisplayedElement)
    document.getElementById("calledNumsHeading").textContent = `Called Numbers - ${calledNumbers.length}`
    if (automaticMode) {
        autoMark(pickedNum)
    }
    return pickedNum
}

// Resets the game, clears all bingo cards, generates one new card for the next game.
function resetGame() {
    while (calledNumbers.length) {
        calledNumbers.pop()
    }
    while (availableNumbers.length) {
        availableNumbers.pop()
    }
    refillAvailableNums()
    document.getElementById("calledNumsHeading").textContent = `Called Numbers`
    document.getElementById("win-notification").classList.add("hidden")
    document.getElementById("win-notification").textContent = ""
    calledNumsDisplayed.textContent = ""
    playerSection.innerHTML = ""    
    showPlayerCard()
    playBtn.disabled = false
    buyBtn.disabled = false
    markingMethod.disabled = false
    winCondition.disabled = false
}

// This function generates 25 numbers for a player's bingo card. Used in the show player card function.
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

// This function displays a bingo card on the page. Called every time a user buys a new card with the Buy Card button.
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
        if (i == 12) toAdd.classList.add("num-called")
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
    if (!automaticMode && calledNumbers.includes(Number(this.textContent))) {
        this.classList.toggle("num-called")
    }
    checkWin(gameType)
}

function markingMethodChange(event) {
    if (event.target.value == "Automatic") {
        automaticMode = true
    } else if (event.target.value == "Manual") {
        automaticMode = false
    }
}

function winConditionChange(event) {
    gameType = event.target.value
}

// Enables bingo cards to be automatically marked when a number is called, if mode is set to automatic.
function autoMark(num) {
    const tableData = document.querySelectorAll("td")
    for (dataElement of tableData) {
        if (dataElement.textContent == num) {
            dataElement.classList.add("num-called")
        }
    }
    const winArray = checkWin(gameType)
    if (winArray.length) {
        const winNotificiation = document.getElementById("win-notification")
        winNotificiation.textContent = `BINGO on card ${winArray[0]}`
        winNotificiation.classList.remove("hidden")
        playBtn.disabled = true
    }
}

// Check all cards for Bingo
function checkWin(gameWinCon) {
    const rowCounts = new Array(5).fill(0)
    const columnCounts = new Array(5).fill(0)
    const diagonals = new Array(2).fill(0)
    let cornerCounts = 0
    let totalCardHits = 0
    const bingoCards = document.querySelectorAll("tbody")
    let cardWins = false
    let cardNumber = 0
    const winningCards = []

    for (card of bingoCards) {
        cardNumber += 1
        const cardRows = card.querySelectorAll("tr")
        for (let i = 0; i < cardRows.length; i++) {
            for (let j = 0; j < 5; j++) {
                if (cardRows[i].querySelector(`:nth-child(${j+1})`).classList.contains("num-called")) {
                    rowCounts[i] += 1
                    columnCounts[j] += 1
                    if (i == j) {
                        diagonals[0] += 1
                    } 
                    if (i + j == 4) {
                        diagonals[1] += 1
                    }
                    if ((i == 0 && j == 0) || (i == 0 && j == 4) || (i == 4 && j == 0) || (i == 4 && j == 4)) {
                        cornerCounts += 1
                    }
                    totalCardHits += 1
                }
            }
        }

        // Standard game
        if (gameWinCon == "Standard") {
            if (rowCounts.includes(5) || columnCounts.includes(5) || diagonals.includes(5)) {
                card.parentElement.classList.add("winner")
                winningCards.push(cardNumber)
            }
        }
        
        // Four Corners game
        if (gameWinCon == "FourCorners" && cornerCounts == 4) {
            card.parentElement.classList.add("winner")
            winningCards.push(cardNumber)
        }
        
        // Full Card game
        if (gameWinCon == "FullCard" && totalCardHits == 25) {
            card.parentElement.classList.add("winner")
            winningCards.push(cardNumber)
        }

        rowCounts.fill(0)
        columnCounts.fill(0)
        diagonals.fill(0)
        cornerCounts = 0
        totalCardHits = 0
    }
    return winningCards
}