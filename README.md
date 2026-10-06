# Tic Tac Toe (Console Edition)

A two-player Tic Tac Toe game written in vanilla JavaScript that is played entirely from the browser's developer console. No HTML, CSS, build tools, or dependencies are required beyond the script itself.

## Features

- Two-player, turn-based gameplay (Player 1 is `x`, Player 2 is `o`)
- Plays entirely in the browser console
- Custom player names, with automatic fallback to `Player 1` / `Player 2`
- Name sanitization (strips control and zero-width characters, trims whitespace, truncates long names to 30 characters)
- Win detection across all 8 winning patterns (3 rows, 3 columns, 2 diagonals)
- Tie detection
- Prevents replaying already-marked cells
- Prevents moves after the game ends
- Input validation for non-numeric, non-integer, and out-of-range values
- Modular design using the module pattern (IIFEs) and a `Player` factory function

## Requirements

- Any modern web browser with a developer console (Chrome, Edge, Firefox, Safari, Brave, etc.)
- A way to run the script on a page, such as:
  - An HTML file that includes the script, or
  - The browser console itself (paste the code directly)

## Getting Started

### Option 1: Include in an HTML page

1. Save the game code as `script.js`.
2. Create an `index.html` in the same folder:

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Tic Tac Toe (Console Edition)</title>
   </head>
   <body>
       <h1>Tic Tac Toe (Console Edition)</h1>
       <p>Open the developer console to play.</p>
       <script src="script.js"></script>
   </body>
   </html>
   ```

3. Open `index.html` in your browser.
4. Open the console (see below) if it is not already open.

### Option 2: Paste into the console

1. Open any web page and open the developer console.
2. Paste the entire contents of `script.js` and press Enter.

> Note: some browsers require you to type `allow pasting` in the console before pasting is permitted.

### Opening the Console

- **Windows/Linux:** `Ctrl + Shift + J` (Chrome/Edge) or `Ctrl + Shift + K` (Firefox)
- **macOS:** `Cmd + Option + J` (Chrome) or `Cmd + Option + K` (Firefox)
- **Any browser:** right-click the page, choose **Inspect**, then open the **Console** tab

## How to Play

1. When the page loads, an alert reminds you how to open the console.
2. Two prompts ask for the player names. Press **Cancel** or leave blank to use the defaults (`Player 1`, `Player 2`).
3. The empty board is printed to the console along with the current turn.
4. Players alternate by calling `GameController.play(number)`, where `number` is the cell index (0-8).
5. The game ends when a player completes a row, column, or diagonal, or when all 9 cells are filled (tie).
6. Call `GameController.reset()` to start a new game.

Player 1 (`x`) always goes first.

## Commands

| Command | Description |
| --- | --- |
| `GameController.play(n)` | Marks cell `n` (0-8) for the current player |
| `GameController.showCurrentTurn()` | Prints whose turn it is |
| `GameController.reset()` | Reloads the page to start a fresh game |

`GameController.startGame()` is also exposed and is called automatically at load time. You do not need to call it manually.

## Board Layout

Cells are numbered 0-8, left to right, top to bottom:

```
0 1 2
3 4 5
6 7 8
```

Unmarked cells display their index. Marked cells display `x` or `o`.

**Winning patterns:**

| Type | Cells |
| --- | --- |
| Rows | `0 1 2`, `3 4 5`, `6 7 8` |
| Columns | `0 3 6`, `1 4 7`, `2 5 8` |
| Diagonals | `0 4 8`, `2 4 6` |

## Example Session

```
> GameController.play(4)

0 1 2
3 x 5
6 7 8
Bob's turn (Player 2)

> GameController.play(0)

o 1 2
3 x 5
6 7 8
Alice's turn (Player 1)

> GameController.play(2)
> GameController.play(1)
> GameController.play(6)

o o x
3 x 5
x 7 8

Game over! Player 1 (Alice) wins!
Type 'GameController.reset()' and hit enter to start a new game
```

## Project Structure

```
.
├── index.html   # Optional host page that loads the script
├── script.js    # The full game logic
└── README.md
```

## Architecture

The code is organized into three parts, each with a distinct responsibility.

### `Gameboard` (module / IIFE)

Owns the board state and board-related logic.

- `board`: array of 9 values. Starts as `[0..8]` so unmarked cells show their index when printed.
- `patterns`: the 8 winning combinations.
- `showGameboard()`: prints the board as three rows.
- `markCell(cell, marker)`: places a marker on a cell.
- `hasWinningPattern(playerCells)`: returns `true` if the given cells contain at least one complete winning pattern.

### `GameController` (module / IIFE)

Owns game flow, turn order, and end-of-game handling.

- `play(playerChoice)`: validates input, applies the move, prints the board, checks for a win/tie, and announces the next turn.
- `showCurrentTurn()`: determines the current player from the total number of moves (even = Player 1, odd = Player 2).
- `startGame()`: prints the initial board and first turn.
- `reset()`: reloads the page (`location.reload()`).
- Internal helpers: `endGame`, `handleGameEnd`, `handleRepeatedCellInputs`, `isPatternMatch`.

### `Player` (factory function)

Creates a player object that tracks its own name, marker, and claimed cells.

- `name`: sanitized display name
- `marker`: `'x'` or `'o'`
- `addCell(cell)`, `hasCell(cell)`, `getCellCount()`, `getCells()` (returns a copy to protect internal state)

### Turn logic

No explicit "current player" variable is stored. The turn is derived from the combined move count of both players: an even count means Player 1 moves, an odd count means Player 2.

### Win and tie logic

After each move, `isPatternMatch()` checks both players against every winning pattern. Player 1 is checked first. If neither has won and 9 moves have been made, the game is a tie.

## Input Validation and Error Handling

| Input | Behavior |
| --- | --- |
| Non-number (e.g. `'4'`, `null`) | `console.error`: "Enter a valid whole number from 0 to 8!" |
| `NaN` or non-integer (e.g. `2.5`) | Same error as above |
| Number below 0 | `console.error`: "0 is the minimum input!" |
| Number above 8 | `console.error`: "8 is the maximum input!" |
| Already-marked cell | Throws `Error`: "Cell #n is already marked!" |
| Play after game ends | `console.error`: "Game has already ended!" |

### Player name sanitization

- Cancelled prompt (`null`) becomes `Player 1` or `Player 2`
- Control characters and zero-width characters are replaced with spaces
- Leading and trailing whitespace is trimmed
- Empty results fall back to the default name
- Names longer than 30 characters are truncated and suffixed with `...` (counted by Unicode characters, so emoji are handled correctly)

## License

Free to use and modify for learning and personal projects.