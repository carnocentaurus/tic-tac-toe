const playerNameInputModal = document.querySelector('.player-name-input-modal');
const playerOneNameInput = document.querySelector('#player-one-name-input');
const playerTwoNameInput = document.querySelector('#player-two-name-input');
const playerNameConfirmButton = document.querySelector('.player-name-confirm-button');

const errorModal = document.querySelector('.error-modal');
const errorDisplay = document.querySelector('.error-display');
const errorModalButton = document.querySelector('.error-modal-button');

const confirmResetModal = document.querySelector('.confirm-reset-modal');
const keepNamesButton = document.querySelector('.keep-names-button');
const completeResetButton = document.querySelector('.complete-reset-button');

const gameboardDiv = document.querySelector('.gameboard-div');
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

keepNamesButton.addEventListener('click', () => {
    GameController.resetGameKeepNames();
    DisplayController.closeConfirmResetModal();
});

completeResetButton.addEventListener('click', () => {
    GameController.resetGameCompletely();
    DisplayController.closeConfirmResetModal();
});

resetText.addEventListener('click', () => {
    DisplayController.displayConfirmResetModal();
});

playerNameInputModal.addEventListener('cancel', (event) => {
    event.preventDefault();
});

errorModal.addEventListener('cancel', (event) => {
    event.preventDefault();
});

confirmResetModal.addEventListener('cancel', (event) => {
    event.preventDefault();
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

    function isCellOccupied(cell) {
        return board[cell] === 'x' || board[cell] === 'o';
    }

    function isFull() {
        return board.every(cell => cell === 'x' || cell === 'o');
    }

    function hasWinningPattern(marker) {
        return patterns.some(pattern => {
            return pattern.every(cell => board[cell] === marker);
        });
    }

    function getLength() {
        return board.length;
    }

    function getBoard() {
        return [...board];
    }

    function getMoveCount() {
        return board.filter(cell => cell === 'x' || cell === 'o').length;
    }

    // restoring each value clears the marks while preserving the board's original representation
    function reset() {
        for (let i = 0; i < board.length; i++) {
            board[i] = i;
        }
    }

    return {
        markCell,
        isCellOccupied,
        isFull,
        hasWinningPattern,
        getLength,
        getBoard,
        getMoveCount,
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
        if (Gameboard.isCellOccupied(playerChoice)) {
            errorDisplay.textContent = `Cell is already marked!`;
            DisplayController.displayErrorModal();
            return true;
        }

        return false;
    }

    function isPatternMatch() {
        const isPlayerOnePatternMatch = Gameboard.hasWinningPattern(playerOne.marker);
        const isPlayerTwoPatternMatch = Gameboard.hasWinningPattern(playerTwo.marker);

        if (isPlayerOnePatternMatch === true) {
            handleGameEnd('hasWinner', `Player 1 (${playerOne.name})`);
        }
        else if (isPlayerTwoPatternMatch === true) {
            handleGameEnd('hasWinner', `Player 2 (${playerTwo.name})`);
        }
        else if (
            Gameboard.isFull() && 
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

        const totalMoves = Gameboard.getMoveCount();

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
            Gameboard.markCell(playerChoice, playerOne.marker);
            DisplayController.displayMarks();
        }
        else {
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

    function resetGameKeepNames() {
        Gameboard.reset();

        isGameEnd = false;

        DisplayController.hideResetText();
        DisplayController.displayGameboard();
        messageDisplay.textContent = '';

        showCurrentTurn();
    }

    function resetGameCompletely() {
        Gameboard.reset();

        isGameEnd = false;

        DisplayController.hideResetText();
        DisplayController.displayGameboard();
        messageDisplay.textContent = '';

        playerOneNameInput.value = '';
        playerTwoNameInput.value = '';

        DisplayController.displayPlayerNameInputModal();
    }

    return {
        initializePlayers,
        showCurrentTurn,
        play,
        startGame,
        resetGameKeepNames,
        resetGameCompletely,
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

    function displayConfirmResetModal() {
        confirmResetModal.showModal();
    }

    function closeConfirmResetModal() {
        confirmResetModal.close();
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
        displayConfirmResetModal,
        closeConfirmResetModal,
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
            .replace(/[\x00-\x1F\x7F\u200B\u200C\u2060\uFEFF]/g, ' ')
            .trim();

        if (sanitizedPlayerName === '') {
            sanitizedPlayerName = `Player ${playerNumber}`;
        }

        const segmenter = new Intl.Segmenter(undefined, {
            granularity: 'grapheme',
        });

        const playerNameCharacters = [
            ...segmenter.segment(sanitizedPlayerName),
        ].map(segment => segment.segment);

        if (playerNameCharacters.length > 30) {
            sanitizedPlayerName = playerNameCharacters.slice(0, 30).join('') + '...';
        }

        return sanitizedPlayerName;
    }

    const name = sanitizePlayerName(nameInput, playerNumber);

    return {
        name,
        marker,
    };
}