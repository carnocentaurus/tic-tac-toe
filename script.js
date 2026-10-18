const playerNameInputModal = document.querySelector('.player-name-input-modal');
const playerOneNameInput = document.querySelector('#player-one-name-input');
const playerTwoNameInput = document.querySelector('#player-two-name-input');
const playerNameConfirmButton = document.querySelector('.player-name-confirm-button');
const gameboardDiv = document.querySelector('.gameboard-div');
const errorModal = document.querySelector('.error-modal');
const errorDisplay = document.querySelector('.error-display');
const errorModalButton = document.querySelector('.error-modal-button');
const messageDisplay = document.querySelector('.message-display');
const resetText = document.querySelector('.reset-text');

document.addEventListener('DOMContentLoaded', () => {
    DisplayController.displayPlayerNameInputModal();
});

playerNameConfirmButton.addEventListener('click', () => {
    GameController.initializePlayers(
        playerOneNameInput.value,
        playerTwoNameInput.value
    );

    DisplayController.closePlayerNameInputModal();
    GameController.startGame();
});

errorModalButton.addEventListener('click', () => {
    DisplayController.closeErrorModal();
});

resetText.addEventListener('click', () => {
    DisplayController.hideResetText();
    GameController.resetGame();
});

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

    function getBoard() {
        return [...board];
    }

    // restoring each value clears the marks while preserving the board's original representation
    function reset() {
        for (let i = 0; i < board.length; i++) {
            board[i] = i;
        }
    }

    return {
        markCell,
        hasWinningPattern,
        getLength,
        getBoard,
        reset,
    };
})();

const GameController = (() => {
    let isGameEnd = false;
  
    let playerOne;
    let playerTwo;

    function initializePlayers(playerOneName, playerTwoName) {
        playerOne = Player(playerOneName, 1, 'x');
        playerTwo = Player(playerTwoName, 2, 'o');
    }

    function endGame() {
        isGameEnd = true;
    }

    function handleGameEnd(gameResult, winningPlayer) {
        endGame();
        DisplayController.displayResetText();

        if (gameResult === 'hasWinner') {
            messageDisplay.textContent = `Game over! ${winningPlayer} wins!`;
        }
        else if (gameResult === 'tie') {
            messageDisplay.textContent = 'Game over! Its a tie!';
        }
    }

    function handleRepeatedCellInputs(playerChoice) {
        if (playerOne.hasCell(playerChoice) || playerTwo.hasCell(playerChoice)) {
            errorDisplay.textContent = `Cell is already marked!`;
            DisplayController.displayErrorModal();
            return true;
        }

        return false;
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
            errorDisplay.textContent = 'Game has already ended!';
            DisplayController.displayErrorModal();
            return;
        }

        const totalMoves = playerOne.getCellCount() + playerTwo.getCellCount();

        if (totalMoves % 2 === 0) {
            messageDisplay.textContent = `${playerOne.name}'s turn (Player 1)`;
        }
        else {
            messageDisplay.textContent = `${playerTwo.name}'s turn (Player 2)`;
        }
    }

    function play(playerChoice) {
        if (isGameEnd === true) {
            errorDisplay.textContent = 'Game has already ended!';
            DisplayController.displayErrorModal();
            return;
        }

        playerChoice = Number(playerChoice);

        if (handleRepeatedCellInputs(playerChoice)) {
            return;
        }

        const totalMoves = playerOne.getCellCount() + playerTwo.getCellCount();

        if (totalMoves % 2 === 0) {
            playerOne.addCell(playerChoice);

            Gameboard.markCell(playerChoice, playerOne.marker);
            DisplayController.displayMarks();
        }
        else {
            playerTwo.addCell(playerChoice);

            Gameboard.markCell(playerChoice, playerTwo.marker);
            DisplayController.displayMarks();
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

    function resetGame() {
        isGameEnd = false;
        DisplayController.displayPlayerNameInputModal();
    }

    return {
        initializePlayers,
        showCurrentTurn,
        play,
        startGame,
        resetGame,
    };
})();

const DisplayController = (() => {
    function displayPlayerNameInputModal() {
        playerNameInputModal.showModal();
    }

    function closePlayerNameInputModal() {
        playerNameInputModal.close();
    }

    function displayErrorModal() {
        errorModal.showModal();
    }

    function closeErrorModal() {
        errorModal.close();
    }

    function displayGameboard() {
        gameboardDiv.innerHTML = '';

        for (let i = 0; i < Gameboard.getLength(); i++) {
            const cellDiv = document.createElement('div');
            const cellNumber = document.createElement('p');

            cellNumber.className = 'cell-number';
            cellNumber.textContent = i;

            cellDiv.appendChild(cellNumber);
            gameboardDiv.appendChild(cellDiv);

            cellDiv.addEventListener('click', () => GameController.play(i));
        }
    }

    function displayMarks() {
        const board = Gameboard.getBoard();
        
        const cellNumbers = document.querySelectorAll('.cell-number');

        for (let i = 0; i < board.length; i++) {
            if (board[i] === 'x' || board[i] === 'o') {
                cellNumbers[i].textContent = board[i];
                cellNumbers[i].style.visibility = 'visible';
            }
        }
    }

    function displayResetText() {
        resetText.style.visibility = 'visible';
    }

    function hideResetText() {
        resetText.style.visibility = 'hidden';
    }

    return {
        displayPlayerNameInputModal,
        closePlayerNameInputModal,
        displayErrorModal,
        closeErrorModal,
        displayGameboard,
        displayMarks,
        displayResetText,
        hideResetText,
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