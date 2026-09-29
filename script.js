console.log('TIC TAC TOE (Console Edition)');
console.log("Example: Type 'play(4)' to mark the #4 cell");
console.log('');

const playerOneName = prompt('Player one name:') || 'Player 1';
const playerTwoName = prompt('Player two name:') || 'Player 2';

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

const markedCells = [];

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

function sanitizePlayerName(playerNameInput, playerNumber) {
    playerNameInput = playerNameInput.trim();

    if (playerNameInput === null || playerNameInput === '') {
        playerNameInput = `Player ${playerNumber}`;
    }

    let sanitizedPlayerName = playerNameInput
        .replace(/[\x00-\x1F\x7F]/g, ' ') // replace line breaks and control codes with a single space
        .replace(/%/g, '%%'); // escape % to prevent console format specifiers (%c, %s)

    if (sanitizedPlayerName.length > 30) {
        sanitizedPlayerName = sanitizedPlayerName.slice(0, 30) + '...';
    }

    return sanitizedPlayerName;
}

function handleRepeatedCellInputs(playerChoice) {
    markedCells.forEach(cell => {
        if (playerChoice === cell) {
            throw new Error(`${playerOneName} already marked the #${cell} cell!`);
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
        handleGameEnd('hasWinner', sanitizePlayerName(playerOneName, '1'));
    }
    else if (isPlayerTwoPatternMatch === true) {
        handleGameEnd('hasWinner', sanitizePlayerName(playerTwoName, '2'));
    }
    else if (rounds > 6 && isPlayerOnePatternMatch === false && isPlayerOnePatternMatch === false) {
        handleGameEnd('tie', '');
    }
}

function play(playerChoice) {
    if (isGameEnd === true) {
        console.error('Game has already ended!');
        return;
    }

    playerChoice = Math.floor(playerChoice);

    handleRepeatedCellInputs(playerChoice);

    if (typeof playerChoice === 'string') {
        console.error('Enter a valid number!');
        return;
    }
    if (playerChoice < 0) {
        console.error('0 is the minimum input!');
        return;
    }
    if (playerChoice > 8) {
        console.error('8 is the maximum input!');
        return;
    }

    rounds ++;

    markedCells.push(playerChoice);
    const lastIndex = markedCells.length - 1;

    if (lastIndex % 2 === 0) {
        playerOneCells.push(playerChoice);
        GAMEBOARD[playerChoice] = 'x';
    }
    else {
        playerTwoCells.push(playerChoice);
        GAMEBOARD[playerChoice] = 'o';
    }

    showGameboard();

    isPatternMatch(playerOneCells, playerTwoCells);
}

function reset() {
    location.reload();
}