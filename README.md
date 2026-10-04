# Tic Tac Toe (Console Edition)

A two-player Tic Tac Toe game that runs entirely in your browser's developer console. No HTML UI, no dependencies, no build step: just JavaScript.

> ## Project Status: Initial Console Version
>
> This is the **initial console version** of the project. The code works, but it is intentionally a first pass.
>
> **Planned improvements** (code organization and quality):
>
> - Using **factory functions** to create players, the gameboard, and the game itself
> - Using **IIFEs / module pattern** to encapsulate state and logic
> - Reducing **global code** and global state as much as possible
> - General cleanup and separation of concerns
>
> **This README will not be updated until the code refactoring is done.** Until then, details here describe the current (pre-refactor) implementation and may differ from the final structure.

---

## Features

- Two-player, hot-seat gameplay in the browser console
- Custom player names via prompts (with sensible defaults)
- Player name sanitization (strips control and invisible characters, trims whitespace, truncates long names)
- Turn tracking and a `showCurrentTurn()` helper
- Win detection across all 8 winning lines (3 rows, 3 columns, 2 diagonals)
- Tie detection
- Input validation with clear error messages
- Quick reset with `reset()`

---

## How to Play

1. Player 1 plays as **x** and always goes first. Player 2 plays as **o**.
2. On your turn, type `play(number)` in the console, where `number` is the cell you want to mark.
3. Cells that are already marked cannot be played again.
4. The first player to mark three cells in a row (horizontally, vertically, or diagonally) wins.
5. If all 9 cells are filled and nobody has won, the game is a tie.
6. When the game ends, type `reset()` to start a new one.

**Example:**

```js
play(4)   // Player 1 marks the center
play(0)   // Player 2 marks the top-left
play(8)   // Player 1 marks the bottom-right
```

## Console Commands

| Command              | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `play(number)`       | Marks the cell at `number` (0-8) for the current player            |
| `showCurrentTurn()`  | Prints whose turn it is (or that the game has already ended)       |
| `reset()`            | Resets the game by reloading the page                              |

## Gameboard Layout

Cells are numbered 0 to 8, left to right, top to bottom:

```
0 1 2
3 4 5
6 7 8
```

After each move, the board is printed to the console. Unmarked cells show their number; marked cells show `x` or `o`. For example, after `play(4)` then `play(0)`:

```
o 1 2
3 x 5
6 7 8
```

---

## Input Handling and Validation

**`play(number)`** rejects:

- Non-numbers, `NaN`, and non-integers (e.g. `play('4')`, `play(2.5)`)
- Numbers below 0 or above 8
- Cells that are already marked
- Any move after the game has ended

**Player names** (from the prompts) are sanitized:

- Cancelling a prompt falls back to `Player 1` / `Player 2`
- Control characters and zero-width/invisible characters are replaced with spaces
- Leading and trailing whitespace is trimmed
- Empty results fall back to the default name
- Names longer than 30 characters are truncated and end with `...` (counted by Unicode characters, so emoji and similar characters are not split)

*This README reflects the initial console version only and will not be updated until code refactoring is complete.*