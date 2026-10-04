alert(`
    If your console is closed, open it by typing:
    Ctrl + Shift + J
    or
    Right click > Inspect > Console tab
`);

const playerOneName = sanitizePlayerName(prompt('Player one name:'), 1);
const playerTwoName = sanitizePlayerName(prompt('Player two name:'), 2);

console.log('TIC TAC TOE (Console Edition)');
console.log('');
console.log("Type 'play(number)' to mark a cell.");
console.log('Valid cell numbers: 0-8');
console.log('Example: play(4)');
console.log('Already marked cells cannot be played again.');
console.log("Type 'showCurrentTurn()' to see whose turn it is.");

const GAMEBOARD = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const PATTERNS = [
    GAMEBOARD.filter(item => item < 3),
    GAMEBOARD.filter(item => item > 2 && item < 6),
    GAMEBOARD.filter(item => item > 5),

    GAMEBOARD.filter(item => item === 0 || item === 3 || item === 6),
    GAMEBOARD.filter(item => item === 1 || item === 4 || item === 7),
    GAMEBOARD.filter(item => item === 2 || item === 5 || item === 8),

    GAMEBOARD.filter(item => item === 0 || item === 4 || item === 8),
    GAMEBOARD.filter(item => item === 2 || item === 4 || item === 6),
];

const markedCells = [];

const playerOneCells = [];
const playerTwoCells = [];

let isGameEnd = false;

function showGameboard() {
    console.log('');
    console.log(GAMEBOARD[0], GAMEBOARD[1], GAMEBOARD[2]);
    console.log(GAMEBOARD[3], GAMEBOARD[4], GAMEBOARD[5]);
    console.log(GAMEBOARD[6], GAMEBOARD[7], GAMEBOARD[8]);
}

showGameboard();

function showPlayerTurn(lastIndex) {
    if (lastIndex % 2 !== 0 || lastIndex === -1) {
        console.log(`${playerOneName}'s turn (Player 1)`);
    }
    else {
        console.log(`${playerTwoName}'s turn (Player 2)`);
    }
}

showPlayerTurn(markedCells.length - 1);

function showCurrentTurn() {
    if (isGameEnd === true) {
        console.log('The game has already ended!');
        return;
    }

    if (markedCells.length % 2 === 0) {
        console.log(`${playerOneName}'s turn`);
    }
    else {
        console.log(`${playerTwoName}'s turn`);
    }
}

function sanitizePlayerName(playerNameInput, playerNumber) {
    if (playerNameInput === null) {
        playerNameInput = `Player ${playerNumber}`;
    }

    let sanitizedPlayerName = playerNameInput
        .replace(/[\x00-\x1F\x7F\u200B-\u200D\u2060\uFEFF]/g, ' ')
        .trim();

    if (sanitizedPlayerName === '') {
        sanitizedPlayerName = `Player ${playerNumber}`;
    }

    // equal to const playerNameCharacters = ['N', 'a', 'm', 'e'];
    const playerNameCharacters = [...sanitizedPlayerName];

    if (playerNameCharacters.length > 30) {
        sanitizedPlayerName = playerNameCharacters.slice(0, 30).join('') + '...';
    }

    return sanitizedPlayerName;
}

function handleRepeatedCellInputs(playerChoice) {
    if (markedCells.includes(playerChoice)) {
        throw new Error(`Cell #${playerChoice} is already marked!`);
    }
}

function handleGameEnd(gameResult, winningPlayer) {
    isGameEnd = true;

    console.log('');

    if (gameResult === 'hasWinner') {
        console.log(`Game over! ${winningPlayer} wins!`);
    }
    else if (gameResult === 'tie') {
        console.log('Game over! its a tie!');
    }

    console.log("Type 'reset()' and hit enter to start a new game");
}

function isPatternMatch(playerOneCells, playerTwoCells) {
    // Check if at least one pattern in PATTERNS has every cell present in playerOneCells
    const isPlayerOnePatternMatch = PATTERNS.some(pattern => {
        return pattern.every(cell => playerOneCells.includes(cell));
    });

    const isPlayerTwoPatternMatch = PATTERNS.some(pattern => {
        return pattern.every(cell => playerTwoCells.includes(cell));
    });

    if (isPlayerOnePatternMatch === true) {
        handleGameEnd('hasWinner', `Player 1 (${playerOneName})`);
    }
    else if (isPlayerTwoPatternMatch === true) {
        handleGameEnd('hasWinner', `Player 2 (${playerOneName})`);
    }
    else if (markedCells.length >=9 && isPlayerOnePatternMatch === false && isPlayerTwoPatternMatch === false) {
        handleGameEnd('tie', '');
    }
}

function play(playerChoice) {
    if (isGameEnd === true) {
        console.error('Game has already ended!');
        return;
    }

    if (typeof playerChoice !== 'number' || Number.isNaN(playerChoice) || !Number.isInteger(playerChoice)) {
        console.error('Enter a valid whole number from 0 to 8!');
        return;
    }

    handleRepeatedCellInputs(playerChoice);

    if (playerChoice < 0) {
        console.error('0 is the minimum input!');
        return;
    }
    if (playerChoice > 8) {
        console.error('8 is the maximum input!');
        return;
    }

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

    if (isGameEnd === false) {
        showPlayerTurn(lastIndex);
    }
}

function reset() {
    location.reload();
}