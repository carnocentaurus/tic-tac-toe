function createGrid() {
    const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const row1 = grid.filter(item => item < 3);
    const row2 = grid.filter(item => item > 2 && item < 6);
    const row3 = grid.filter(item => item > 5);

    console.log(grid[0], grid[1], grid[2]);
    console.log(grid[3], grid[4], grid[5]);
    console.log(grid[6], grid[7], grid[8]);
}

createGrid();