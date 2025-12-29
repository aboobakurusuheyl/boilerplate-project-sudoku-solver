"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Check for missing fields
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    // Validate puzzle string
    const validation = solver.validate(puzzle);
    if (!validation.valid) {
      return res.json({ error: validation.error });
    }

    // Validate coordinate format (A1-I9)
    const coordinateRegex = /^[A-I][1-9]$/;
    if (!coordinateRegex.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }

    // Validate value (1-9)
    const valueNum = parseInt(value);
    if (isNaN(valueNum) || valueNum < 1 || valueNum > 9) {
      return res.json({ error: "Invalid value" });
    }

    const row = coordinate[0];
    const column = coordinate[1];

    // Check if the placement conflicts with existing value
    const board = solver.stringToBoard(puzzle);
    const rowIndex = solver.rowToIndex(row);
    const colIndex = solver.colToIndex(column);

    // If cell already has this value, check if it's conflicting
    // Requirement 9: If value is already placed and not conflicting, return valid: true
    if (board[rowIndex][colIndex] === valueNum) {
      // Temporarily remove the value to check for conflicts
      board[rowIndex][colIndex] = 0;

      const conflicts = [];

      // Check row for conflicts
      for (let j = 0; j < 9; j++) {
        if (board[rowIndex][j] === valueNum) {
          conflicts.push("row");
          break;
        }
      }

      // Check column for conflicts
      for (let i = 0; i < 9; i++) {
        if (board[i][colIndex] === valueNum) {
          conflicts.push("column");
          break;
        }
      }

      // Check region for conflicts
      const regionRow = Math.floor(rowIndex / 3) * 3;
      const regionCol = Math.floor(colIndex / 3) * 3;
      for (let i = regionRow; i < regionRow + 3; i++) {
        for (let j = regionCol; j < regionCol + 3; j++) {
          if (board[i][j] === valueNum) {
            conflicts.push("region");
            i = regionRow + 3; // break outer loop
            break;
          }
        }
      }

      // If no conflicts, return valid: true (requirement 9)
      // If there are conflicts, return valid: false with the conflicts
      if (conflicts.length === 0) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict: conflicts });
      }
    }

    // Check all three constraints
    const conflicts = [];
    const rowValid = solver.checkRowPlacement(puzzle, row, column, value);
    const colValid = solver.checkColPlacement(puzzle, row, column, value);
    const regionValid = solver.checkRegionPlacement(puzzle, row, column, value);

    if (!rowValid) conflicts.push("row");
    if (!colValid) conflicts.push("column");
    if (!regionValid) conflicts.push("region");

    // If multiple conflicts but they're all from the same cell, only report one
    if (conflicts.length > 1) {
      const board = solver.stringToBoard(puzzle);
      const rowIndex = solver.rowToIndex(row);
      const colIndex = solver.colToIndex(column);
      board[rowIndex][colIndex] = 0;

      // Find which cells have the conflicting value
      const conflictCells = [];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === valueNum) {
            // Check if this cell is in the same row, column, or region as the target
            const inRow = i === rowIndex;
            const inCol = j === colIndex;
            const inRegion =
              Math.floor(i / 3) === Math.floor(rowIndex / 3) &&
              Math.floor(j / 3) === Math.floor(colIndex / 3);

            if (inRow || inCol || inRegion) {
              conflictCells.push({ row: i, col: j, inRow, inCol, inRegion });
            }
          }
        }
      }

      // If all conflicts are from the same cell, only report one
      if (conflictCells.length === 1) {
        conflicts.splice(1); // Keep only the first conflict
      }
    }

    if (conflicts.length === 0) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    const result = solver.solve(puzzle);
    return res.json(result);
  });
};
