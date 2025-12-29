const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  suiteSetup(() => {
    solver = new Solver();
  });

  suite('validate', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.validate(puzzle);
      assert.isTrue(result.valid);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a';
      const result = solver.validate(puzzle);
      assert.isFalse(result.valid);
      assert.equal(result.error, 'Invalid characters in puzzle');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
      const result = solver.validate(puzzle);
      assert.isFalse(result.valid);
      assert.equal(result.error, 'Expected puzzle to be 81 characters long');
    });
  });

  suite('checkRowPlacement', () => {
    test('Logic handles a valid row placement', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkRowPlacement(puzzle, 'A', '2', '3');
      assert.isTrue(result);
    });

    test('Logic handles an invalid row placement', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkRowPlacement(puzzle, 'A', '1', '1');
      assert.isFalse(result);
    });
  });

  suite('checkColPlacement', () => {
    test('Logic handles a valid column placement', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkColPlacement(puzzle, 'A', '2', '3');
      assert.isTrue(result);
    });

    test('Logic handles an invalid column placement', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkColPlacement(puzzle, 'A', '1', '1');
      assert.isFalse(result);
    });
  });

  suite('checkRegionPlacement', () => {
    test('Logic handles a valid region (3x3 grid) placement', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkRegionPlacement(puzzle, 'A', '2', '3');
      assert.isTrue(result);
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.checkRegionPlacement(puzzle, 'A', '2', '1');
      assert.isFalse(result);
    });
  });

  suite('solve', () => {
    test('Valid puzzle strings pass the solver', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const result = solver.solve(puzzle);
      assert.property(result, 'solution');
      assert.isString(result.solution);
      assert.lengthOf(result.solution, 81);
    });

    test('Invalid puzzle strings fail the solver', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a';
      const result = solver.solve(puzzle);
      assert.property(result, 'error');
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
      const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const expected = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
      const result = solver.solve(puzzle);
      assert.property(result, 'solution');
      assert.equal(result.solution, expected);
    });
  });
});
