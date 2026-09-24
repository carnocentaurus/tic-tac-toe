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

function isPatternMatch(playerCells, rowPattern) {
    for (let i = 0; i < playerCells.length; i++) {
        if (playerCells[i] === rowPattern[i]) {
            alert(true)
        }
        else {
            alert(false)
        }
    }
}

function playGame(playerOneChoice, playerTwoChoice) {
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
    console.log(playerOneCells)
    playerTwoCells.push(playerTwoChoice);

    if (playerOneCells.length === 3) {
        isPatternMatch(playerOneCells, row1);
    }

    showGrid();
}