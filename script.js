const GAMEBOARD = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const PATTERNS = {
    row1: GAMEBOARD.filter(item => item < 3),
    row2: GAMEBOARD.filter(item => item > 2 && item < 6),
    row3: GAMEBOARD.filter(item => item > 5),

    column1: GAMEBOARD.filter(item => item === 0 || item === 3 || item === 6),
    column2: GAMEBOARD.filter(item => item === 1 || item === 4 || item === 7),
    column3: GAMEBOARD.filter(item => item === 2 || item === 5 || item === 8),

    diagonal1: GAMEBOARD.filter(item => item === 0 || item === 4 || item === 8),
    diagonal2: GAMEBOARD.filter(item => item === 2 || item === 4 || item === 6),
}

const playerOneCells = [];
const playerTwoCells = [];

let isGameEnd = false;
let rounds = 0;

function showGameboard() {
    console.log(GAMEBOARD[0], GAMEBOARD[1], GAMEBOARD[2]);
    console.log(GAMEBOARD[3], GAMEBOARD[4], GAMEBOARD[5]);
    console.log(GAMEBOARD[6], GAMEBOARD[7], GAMEBOARD[8]);
}

showGameboard();

function handleRepeatedCellInputs(playerOneChoice, playerTwoChoice) {
    playerOneCells.forEach(cell => {
        if (playerOneChoice === cell || playerTwoChoice === cell) {
            throw new Error(`Player one already marked the #${cell} cell!`);
        }
    });

    playerTwoCells.forEach(cell => {
        if (playerTwoChoice === cell || playerOneChoice === cell) {
            throw new Error(`Player two already marked the #${cell} cell!`);
        }
    });
}

function handleGameEnd(gameResult, winningPlayer) {
    isGameEnd = true;

    if (gameResult === 'hasWinner') {
        console.log(`Game over! ${winningPlayer} wins!`);
    }
    else if (gameResult === 'tie') {
        console.log('Game over! its a tie!');
    }

    console.log("Type 'reset()' and hit enter to start a new game");
}

function areArraysEqual(playerCells, pattern) {
    if (playerCells.length !== pattern.length) return;
    
    const set = new Set(pattern);
    return playerCells.every(cell => set.has(cell));
}

function isPatternMatch(playerOneCells, playerTwoCells) {
    const isPlayerOnePatternMatch = Object.values(PATTERNS).some(pattern => 
        areArraysEqual(playerOneCells, pattern));

    const isPlayerTwoPatternMatch = Object.values(PATTERNS).some(pattern =>
        areArraysEqual(playerTwoCells, pattern));

    if (isPlayerOnePatternMatch === true) {
        handleGameEnd('hasWinner', 'Player 1');
    }
    else if (isPlayerTwoPatternMatch === true) {
        handleGameEnd('hasWinner', 'Player 2');
    }
    else if (
        rounds > 3 &&
        isPlayerOnePatternMatch === false &&
        isPlayerTwoPatternMatch === false
    ) {
        handleGameEnd('tie', '');
    }
}

function playGame(playerOneChoice, playerTwoChoice) {
    if (isGameEnd === true) {
        console.error('Game has already ended!');
        return;
    }

    handleRepeatedCellInputs(playerOneChoice, playerTwoChoice);

    if (playerOneChoice === playerTwoChoice) {
        console.error("Players can't pick the same cell at once!");
        return;
    }
    if (isNaN(playerOneChoice) || isNaN(playerTwoChoice)) {
        console.error('Enter a valid number!');
        return;
    }
    if (playerOneChoice < 0 || playerTwoChoice < 0) {
        console.error('0 is the minimum input!');
        return;
    }
    if (playerOneChoice > 8 || playerTwoChoice > 8) {
        console.error('8 is the maximum input!');
        return;
    }

    rounds ++;

    GAMEBOARD[playerOneChoice] = 'x';
    GAMEBOARD[playerTwoChoice] = 'o';

    playerOneCells.push(playerOneChoice);
    playerTwoCells.push(playerTwoChoice);

    showGameboard();

    if (playerOneCells.length >= 3) {
        isPatternMatch(playerOneCells, playerTwoCells);
    }
}

function reset() {
    location.reload();
}