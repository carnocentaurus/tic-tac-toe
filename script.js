/*
alert(`
    If your console is closed, open it by typing:
    Ctrl + Shift + J
    or
    Right click > Inspect > Console tab
`);
*/

console.log('TIC TAC TOE (Console Edition)');
console.log('');
console.log("Type 'GameController.play(number)' to mark a cell");
console.log('Valid cell numbers: 0-8');
console.log('Example: GameController.play(4)');
console.log('Already marked cells cannot be played again');
console.log("Type 'GameController.showCurrentTurn()' to see whose turn it is");
console.log("Type 'GameController.reset()' to reset the game");

const Gameboard = (() => {
    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const patterns = [
        [0, 1, 2], // row 1
        [3, 4, 5], // row 2
        [6, 7, 8], // row 3

        [0, 3, 6], // column 1
        [1, 4, 7], // column 2
        [2, 5, 8], // column 3

        [0, 4, 8], // diagonal 1
        [2, 4, 6], // diagonal 2
    ];

    function showGameboard() {
        console.log('');
        console.log(board[0], board[1], board[2]);
        console.log(board[3], board[4], board[5]);
        console.log(board[6], board[7], board[8]);
    }

    function markCell(cell, marker) {
        board[cell] = marker;
    }

    function hasWinningPattern(playerCells) {
        return patterns.some(pattern => {
            return pattern.every(cell => playerCells.includes(cell));
        });
    }

    return {
        showGameboard,
        markCell,
        hasWinningPattern,
    };
})();

const GameController = (() => {
    let isGameEnd = false;

    function endGame() {
        isGameEnd = true;
    }

    function handleGameEnd(gameResult, winningPlayer) {
        endGame();

        console.log('');

        if (gameResult === 'hasWinner') {
            console.log(`Game over! ${winningPlayer} wins!`);
        }
        else if (gameResult === 'tie') {
            console.log('Game over! Its a tie!');
        }

        console.log("Type 'GameController.reset()' and hit enter to start a new game");
    }

    function handleRepeatedCellInputs(playerChoice) {
        if (playerOne.hasCell(playerChoice) || playerTwo.hasCell(playerChoice)) {
            throw new Error(`Cell #${playerChoice} is already marked!`);
        }
    }

    function isPatternMatch() {
        const isPlayerOnePatternMatch = Gameboard.hasWinningPattern(playerOne.getCells());
        const isPlayerTwoPatternMatch = Gameboard.hasWinningPattern(playerTwo.getCells());

        if (isPlayerOnePatternMatch === true) {
            handleGameEnd('hasWinner', `Player 1 (${playerOne.name})`);
        }
        else if (isPlayerTwoPatternMatch === true) {
            handleGameEnd('hasWinner', `Player 2 (${playerTwo.name})`);
        }
        else if (
            playerOne.getCellCount() + playerTwo.getCellCount() >= 9 && 
            isPlayerOnePatternMatch === false && 
            isPlayerTwoPatternMatch === false
        ) {
            handleGameEnd('tie', '');
        }
    }

    function showCurrentTurn() {
        if (isGameEnd === true) {
            console.log('Game has already ended!');
            return;
        }

        const totalMoves = playerOne.getCellCount() + playerTwo.getCellCount();

        if (totalMoves % 2 === 0) {
            console.log(`${playerOne.name}'s turn (Player 1)`);
        }
        else {
            console.log(`${playerTwo.name}'s turn (Player 2)`);
        }
    }

    function play(playerChoice) {
        if (isGameEnd === true) {
            console.error('Game has already ended!');
            return;
        }

        if (
            typeof playerChoice !== 'number' || 
            Number.isNaN(playerChoice) || 
            !Number.isInteger(playerChoice)
        ) {
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

        const totalMoves = playerOne.getCellCount() + playerTwo.getCellCount();

        if (totalMoves % 2 === 0) {
            playerOne.addCell(playerChoice);
            Gameboard.markCell(playerChoice, playerOne.marker);
        }
        else {
            playerTwo.addCell(playerChoice);
            Gameboard.markCell(playerChoice, playerTwo.marker);
        }

        Gameboard.showGameboard();

        isPatternMatch();

        if (isGameEnd === false) {
            showCurrentTurn();
        }
    }

    function startGame() {
        Gameboard.showGameboard();
        showCurrentTurn();
    }

    function reset() {
        location.reload();
    }

    return {
        showCurrentTurn,
        play,
        startGame,
        reset,
    };
})();

function Player(nameInput, playerNumber, marker) {

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

    const name = sanitizePlayerName(nameInput, playerNumber);
    const cells = [];

    function addCell(cell) {
        cells.push(cell);
    }

    function hasCell(cell) {
        return cells.includes(cell);
    }

    function getCellCount() {
        return cells.length;
    }

    function getCells() {
        return [...cells];
    }

    return {
        name,
        marker,
        addCell,
        hasCell,
        getCellCount,
        getCells,
    };
}

/*
const playerOne = Player(
    prompt('Player one name:'),
    1,
    'x'
);

const playerTwo = Player(
    prompt('Player two name:'),
    2,
    'o'
);
*/

GameController.startGame();