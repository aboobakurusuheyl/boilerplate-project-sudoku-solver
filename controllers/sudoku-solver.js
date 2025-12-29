class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { valid: false, error: "Required field missing" };
    }

    if (puzzleString.length !== 81) {
      return { valid: false, error: "Expected puzzle to be 81 characters long" };
    }

    const validChars = /^[1-9.]+$/;
    if (!validChars.test(puzzleString)) {
      return { valid: false, error: "Invalid characters in puzzle" };
    }

    return { valid: true };
  }

  // Convert puzzle string to 2D array
  stringToBoard(puzzleString) {
    const board = [];
    for (let i = 0; i < 9; i++) {
      board[i] = [];
      for (let j = 0; j < 9; j++) {
        const char = puzzleString[i * 9 + j];
        board[i][j] = char === "." ? 0 : parseInt(char);
      }
    }
    return board;
  }

  // Convert 2D array to puzzle string
  boardToString(board) {
    return board
      .flat()
      .map((cell) => (cell === 0 ? "." : cell.toString()))
      .join("");
  }

  // Convert row letter (A-I) to index (0-8)
  rowToIndex(row) {
    return row.charCodeAt(0) - "A".charCodeAt(0);
  }

  // Convert column number (1-9) to index (0-8)
  colToIndex(column) {
    return parseInt(column) - 1;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.stringToBoard(puzzleString);
    const rowIndex = this.rowToIndex(row);
    const colIndex = this.colToIndex(column);
    const valueNum = parseInt(value);

    // If cell already has a value, can't place a new value
    if (board[rowIndex][colIndex] !== 0) {
      return false;
    }

    // Check if value already exists in the row
    for (let j = 0; j < 9; j++) {
      if (board[rowIndex][j] === valueNum) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this.stringToBoard(puzzleString);
    const rowIndex = this.rowToIndex(row);
    const colIndex = this.colToIndex(column);
    const valueNum = parseInt(value);

    // If cell already has a value, can't place a new value
    if (board[rowIndex][colIndex] !== 0) {
      return false;
    }

    // Check if value already exists in the column
    for (let i = 0; i < 9; i++) {
      if (board[i][colIndex] === valueNum) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this.stringToBoard(puzzleString);
    const rowIndex = this.rowToIndex(row);
    const colIndex = this.colToIndex(column);
    const valueNum = parseInt(value);

    // If cell already has a value, can't place a new value
    if (board[rowIndex][colIndex] !== 0) {
      return false;
    }

    // Find the top-left corner of the 3x3 region
    const regionRow = Math.floor(rowIndex / 3) * 3;
    const regionCol = Math.floor(colIndex / 3) * 3;

    // Check if value already exists in the region
    for (let i = regionRow; i < regionRow + 3; i++) {
      for (let j = regionCol; j < regionCol + 3; j++) {
        if (board[i][j] === valueNum) {
          return false;
        }
      }
    }
    return true;
  }

  // Check if a value can be placed at a position
  isValidPlacement(board, row, col, value) {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === value) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === value) {
        return false;
      }
    }

    // Check region
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(col / 3) * 3;
    for (let i = regionRow; i < regionRow + 3; i++) {
      for (let j = regionCol; j < regionCol + 3; j++) {
        if (board[i][j] === value) {
          return false;
        }
      }
    }

    return true;
  }

  // Solve using backtracking
  solveHelper(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let value = 1; value <= 9; value++) {
            if (this.isValidPlacement(board, row, col, value)) {
              board[row][col] = value;
              if (this.solveHelper(board)) {
                return true;
              }
              board[row][col] = 0; // Backtrack
            }
          }
          return false; // No valid value found
        }
      }
    }
    return true; // Board is filled
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return { error: validation.error };
    }

    const board = this.stringToBoard(puzzleString);

    // Check if the initial puzzle is valid (no conflicts)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) {
          const value = board[row][col];
          board[row][col] = 0; // Temporarily remove to check
          if (!this.isValidPlacement(board, row, col, value)) {
            return { error: "Puzzle cannot be solved" };
          }
          board[row][col] = value; // Restore
        }
      }
    }

    if (this.solveHelper(board)) {
      return { solution: this.boardToString(board) };
    } else {
      return { error: "Puzzle cannot be solved" };
    }
  }
}

module.exports = SudokuSolver;
