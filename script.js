alert(`
    If your console is closed, open it by typing:
    Ctrl + Shift + J
    or
    Right click > Inspect > Console tab
`);

console.log('TIC TAC TOE (Console Edition)');
console.log('');
console.log("Type 'GameController.play(number)' to mark a cell");
console.log('Valid cell numbers: 0-8');
console.log('Example: GameController.play(4)');
console.log('Already marked cells cannot be played again');
console.log("Type 'GameController.showCurrentTurn()' to see whose turn it is");
console.log("Type 'reset()' to reset the game");

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

    return {
        board,
        patterns,
        showGameboard,
        markCell,
    };
})();

const GameController = (() => {
    let isGameEnd = false;

    function getGameEnd() {
        return isGameEnd;
    }

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

        console.log("Type 'reset()' and hit enter to start a new game");
    }

    function handleRepeatedCellInputs(playerChoice) {
        if (playerOne.cells.includes(playerChoice) || playerTwo.cells.includes(playerChoice)) {
            throw new Error(`Cell #${playerChoice} is already marked!`);
        }
    }

    function isPatternMatch() {
        // Check if at least one pattern in PATTERNS has every cell present in playerOneCells
        const isPlayerOnePatternMatch = Gameboard.patterns.some(pattern => {
            return pattern.every(cell => playerOne.cells.includes(cell));
        });

        const isPlayerTwoPatternMatch = Gameboard.patterns.some(pattern => {
            return pattern.every(cell => playerTwo.cells.includes(cell));
        });

        if (isPlayerOnePatternMatch === true) {
            handleGameEnd('hasWinner', `Player 1 (${playerOne.name})`);
        }
        else if (isPlayerTwoPatternMatch === true) {
            handleGameEnd('hasWinner', `Player 2 (${playerTwo.name})`);
        }
        else if (
            playerOne.cells.length + playerTwo.cells.length >= 9 && 
            isPlayerOnePatternMatch === false && 
            isPlayerTwoPatternMatch === false
        ) {
            handleGameEnd('tie', '');
        }
    }

    function showPlayerTurn(lastIndex) {
        if (lastIndex % 2 !== 0 || lastIndex === -1) {
            console.log(`${playerOne.name}'s turn (Player 1)`);
        }
        else {
            console.log(`${playerTwo.name}'s turn (Player 2)`);
        }
    }

    function showCurrentTurn() {
        if (isGameEnd === true) {
            console.log('The game has already ended!');
            return;
        }

        if ((playerOne.cells.length + playerTwo.cells.length) % 2 === 0) {
            console.log(`${playerOne.name}'s turn`);
        }
        else {
            console.log(`${playerTwo.name}'s turn`);
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

        const totalMoves = playerOne.cells.length + playerTwo.cells.length;
        const lastIndex = totalMoves;

        if (lastIndex % 2 === 0) {
            playerOne.cells.push(playerChoice);
            Gameboard.markCell(playerChoice, playerOne.marker);
        }
        else {
            playerTwo.cells.push(playerChoice);
            Gameboard.markCell(playerChoice, playerTwo.marker);
        }

        Gameboard.showGameboard();

        isPatternMatch();

        if (isGameEnd === false) {
            showPlayerTurn(lastIndex);
        }
    }

    function startGame() {
        Gameboard.showGameboard();
        showPlayerTurn(-1);
    }

    return {
        getGameEnd,
        endGame,
        showCurrentTurn,
        play,
        startGame,
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

    return {
        name,
        marker,
        cells,
    };
}

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

GameController.startGame();

function reset() {
    location.reload();
}