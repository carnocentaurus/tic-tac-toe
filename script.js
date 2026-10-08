const gameboardDiv = document.querySelector('.gameboard-div');

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

    function markCell(cell, marker) {
        board[cell] = marker;
    }

    function hasWinningPattern(playerCells) {
        return patterns.some(pattern => {
            return pattern.every(cell => playerCells.includes(cell));
        });
    }

    function getLength() {
        return board.length;
    }

    return {
        markCell,
        hasWinningPattern,
        getLength,
    };
})();

const GameController = (() => {
    let isGameEnd = false;

    function endGame() {
        isGameEnd = true;
    }

    function handleGameEnd(gameResult, winningPlayer) {
        endGame();

        if (gameResult === 'hasWinner') {
            alert(`Game over! ${winningPlayer} wins!`);
        }
        else if (gameResult === 'tie') {
            alert('Game over! Its a tie!');
        }
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
            alert('Game has already ended!');
            return;
        }

        const totalMoves = playerOne.getCellCount() + playerTwo.getCellCount();

        if (totalMoves % 2 === 0) {
            alert(`${playerOne.name}'s turn (Player 1)`);
        }
        else {
            alert(`${playerTwo.name}'s turn (Player 2)`);
        }
    }

    function play(playerChoice) {
        if (isGameEnd === true) {
            alert('Game has already ended!');
            return;
        }

        playerChoice = Number(playerChoice);

        handleRepeatedCellInputs(playerChoice);

        const totalMoves = playerOne.getCellCount() + playerTwo.getCellCount();

        if (totalMoves % 2 === 0) {
            playerOne.addCell(playerChoice);
            Gameboard.markCell(playerChoice, playerOne.marker);
        }
        else {
            playerTwo.addCell(playerChoice);
            Gameboard.markCell(playerChoice, playerTwo.marker);
        }

        isPatternMatch();

        if (isGameEnd === false) {
            showCurrentTurn();
        }
    }

    function startGame() {
        DisplayController.displayGameboard();
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

const DisplayController = (() => {
    function displayGameboard() {
        for (let i = 0; i < Gameboard.getLength(); i++) {
            const cellDiv = document.createElement('div');
            const cellNumber = document.createElement('p');

            cellNumber.textContent = i;

            cellDiv.appendChild(cellNumber);
            gameboardDiv.appendChild(cellDiv);

            cellDiv.addEventListener('click', () => GameController.play(cellNumber.textContent));
        }
    }

    return {
        displayGameboard,
    }
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