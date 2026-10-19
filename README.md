# Tic-Tac-Toe

A two-player, browser-based Tic-Tac-Toe game built with vanilla JavaScript. Players enter their names, take turns clicking cells on a 3×3 board, and the game announces a winner or a tie. Modal dialogs handle name entry, error messages, and reset confirmation.

### Live Demo
[Tic Tac Toe](https://carnocentaurus.github.io/tic-tac-toe/)


## Features

- **Two-player local play** on a single device. Player 1 is `x` and always moves first; Player 2 is `o`.
- **Custom player names** collected in a modal at startup, with sanitization and sensible defaults.
- **Turn indicator** showing whose turn it is and which player number they are.
- **Win and tie detection** across all 8 winning lines (3 rows, 3 columns, 2 diagonals).
- **Invalid move handling** with an error modal for clicking an occupied cell or clicking after the game has ended.
- **Two reset options** once a game ends:
  - *Keep names*: start a fresh board with the same players.
  - *Complete reset*: clear the names and return to the name-entry modal.
- **Unicode-aware name handling** using `Intl.Segmenter`, so emoji and combined characters count as one character.
- **Escape key disabled** on all modals, so dialogs can only be dismissed through their own buttons.

## Tech Stack

- HTML (including the native `<dialog>` element)
- CSS
- Vanilla JavaScript (ES6+), no dependencies or build step

## Project Structure

The provided source is a single JavaScript file organized into modules using the IIFE module pattern, plus a factory function:

| Unit | Type | Responsibility |
| --- | --- | --- |
| `Gameboard` | IIFE module | Owns board state and the winning patterns; answers questions about the board. |
| `GameController` | IIFE module | Game flow: players, turns, validation, win/tie handling, resets. |
| `DisplayController` | IIFE module | All DOM rendering: modals, the board, marks, reset text. |
| `Player` | Factory function | Creates a player object with a sanitized name and a marker. |

Project layout:

```
tic-tac-toe/
├── index.html
├── style.css
├── script.js
└── README.md
```

### Browser Requirements

The code relies on features available in current versions of Chrome, Edge, Firefox, and Safari:

- `<dialog>` with `showModal()` / `close()`
- `Intl.Segmenter` (Firefox support arrived in version 125)

## How to Play

1. On load, a modal asks for both player names. Leaving a name blank defaults it to `Player 1` or `Player 2`.
2. Click **Start**. The board appears and the message area shows whose turn it is.
3. Players alternate clicking cells. Player 1 places `x`; Player 2 places `o`.
4. The game ends when a player completes a row, column, or diagonal, or when all nine cells are filled.
5. After the game ends, click the reset text to open the reset modal and choose **Keep names** or **Complete reset**.

## Board Layout

Cells are indexed 0–8, left to right and top to bottom:

```
 0 | 1 | 2
---+---+---
 3 | 4 | 5
---+---+---
 6 | 7 | 8
```

Winning patterns:

```
Rows:      [0,1,2]  [3,4,5]  [6,7,8]
Columns:   [0,3,6]  [1,4,7]  [2,5,8]
Diagonals: [0,4,8]  [2,4,6]
```

## Architecture and Design Notes

### Gameboard

The board is an array initialized to `[0, 1, 2, 3, 4, 5, 6, 7, 8]`. Each slot holds its own index until it is marked with `'x'` or `'o'`. This means `reset()` simply restores each value to its index, preserving the original representation.

| Method | Description |
| --- | --- |
| `markCell(cell, marker)` | Places a marker at the given index. |
| `isCellOccupied(cell)` | Returns `true` if the cell holds `'x'` or `'o'`. |
| `isFull()` | Returns `true` if every cell is marked. |
| `hasWinningPattern(marker)` | Returns `true` if the marker occupies any complete winning line. |
| `getLength()` | Returns the number of cells (9). |
| `getBoard()` | Returns a **copy** of the board array, protecting internal state. |
| `getMoveCount()` | Returns the number of marked cells. |
| `reset()` | Restores the board to its initial state. |

### GameController

Tracks whether the game has ended (`isGameEnd`) and holds both player objects. **Turn order is derived from the move count**: an even number of moves means it is Player 1's turn, odd means Player 2's. There is no separate "current player" variable to fall out of sync.

| Method | Description |
| --- | --- |
| `initializePlayers(nameOne, nameTwo)` | Creates both `Player` objects (`x` and `o`). |
| `startGame()` | Renders the board and shows the first turn message. |
| `play(playerChoice)` | Handles a move: validates, marks the cell, checks for a result, updates the turn message. |
| `showCurrentTurn()` | Updates the message display with the current player's turn. |
| `resetGameKeepNames()` | Clears the board and state, keeping the existing players. |
| `resetGameCompletely()` | Clears the board and state, empties name inputs, and reopens the name modal. |

Move flow inside `play()`:

1. If the game already ended, show the "Game has already ended!" error and return.
2. Convert the choice to a number.
3. If the cell is occupied, show "Cell is already marked!" and return.
4. Mark the cell for the current player and re-render the marks.
5. Check for a winner or tie. If the game continues, update the turn message.

### DisplayController

Contains all direct DOM manipulation: opening and closing the three modals, building the board, rendering marks, and showing or hiding the reset text. The game logic modules never build elements themselves, apart from setting message text on the shared display elements.

### Player and Name Sanitization

`Player(nameInput, playerNumber, marker)` returns `{ name, marker }`. Names are sanitized as follows:

1. Control characters and invisible characters (zero-width space, zero-width non-joiner, word joiner, byte-order mark, and C0/DEL controls) are replaced with spaces.
2. The result is trimmed.
3. An empty result falls back to `Player <number>`.
4. The name is split into **grapheme clusters** with `Intl.Segmenter`. If it exceeds 30 graphemes, it is truncated to 30 and `...` is appended.

Counting graphemes rather than UTF-16 code units prevents emoji and accented characters from being cut in half.

Display text is assigned with `textContent`, so names are never interpreted as HTML.

### Modal Behavior

All three `<dialog>` elements have their `cancel` event prevented, which disables closing via the Escape key. Each modal must be closed with its own button, which keeps the game from landing in an inconsistent state (for example, a missing player setup).

Currently working on the proper style/aesthetic of the project.