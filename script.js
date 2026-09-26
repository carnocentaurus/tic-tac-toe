const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const row1 = grid.filter(item => item < 3);
const row2 = grid.filter(item => item > 2 && item < 6);
const row3 = grid.filter(item => item > 5);

const column1 = grid.filter(item => item === 0 || item === 3 || item === 6);
const column2 = grid.filter(item => item === 1 || item === 4 || item === 7);
const column3 = grid.filter(item => item === 2 || item === 5 || item === 8);

const diagonal1 = grid.filter(item => item === 0 || item === 4 || item === 8);
const diagonal2 = grid.filter(item => item === 2 || item === 4 || item === 6);

const playerOneCells = [];
const playerTwoCells = [];

let isGameEnd = false;

function showGrid() {
    console.log(grid[0], grid[1], grid[2]);
    console.log(grid[3], grid[4], grid[5]);
    console.log(grid[6], grid[7], grid[8]);
}

showGrid();

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
    if (gameResult === 'hasWinner') {
        console.log(`Game over! ${winningPlayer} wins!`);
    }
}

function isPatternMatch(playerOneCells, playerTwoCells, rowPattern) {
    let isPlayerOnePatternMatch;
    let isPlayerTwoPatternMatch;

    for (let i = 0; i < playerOneCells.length; i++) {
        if (playerOneCells[i] !== rowPattern[i]) {
            isPlayerOnePatternMatch = false;
        }
        else {
            isPlayerOnePatternMatch = true;
        }
    }

    for (let i = 0; i < playerTwoCells.length; i++) {
        if (playerTwoCells[i] !== rowPattern[i]) {
            isPlayerTwoPatternMatch = false;
        }
        else {
            isPlayerTwoPatternMatch = true;
        }
    }

    if (isPlayerOnePatternMatch === true) {
        handleGameEnd('hasWinner', 'Player 1');
        isGameEnd = true;
    }
    else if (isPlayerTwoPatternMatch === true) {
        handleGameEnd('hasWinner', 'Player 2');
        isGameEnd = true;
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

    grid[playerOneChoice] = 'x';
    grid[playerTwoChoice] = 'o';

    playerOneCells.push(playerOneChoice);
    playerTwoCells.push(playerTwoChoice);

    showGrid();

    if (playerOneCells.length >= 3) {
        isPatternMatch(playerOneCells, playerTwoCells, row1);
    }
}