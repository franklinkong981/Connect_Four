/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; //Whose turn it currently is, player 1 or player 2.
let board = []; 
const endgameResult = document.getElementById("endgame-result");

function makeBoard() { //Create board structure in JavaScript, board = array of row arrays (board[row][column])
  for (let y = 0; y < HEIGHT; y++) {
    //Creates a 2-D array with "HEIGHT" number of subarrays of length WIDTH.
    board.push(Array.from({ length: WIDTH })); 
  }
}

function makeHtmlBoard() { //Make Connect 4 table to display on page along with top row of clickable cells to drop a piece.
  const board = document.getElementById('connect4-board');

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr'); //table row
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    //id of each cell in top clickable row = its 0-indexed x-position. Ex. 3rd cell to left --> id = "2"
    headCell.setAttribute('id', x); 
    top.append(headCell);
  }

  board.append(top);

  // make main part of board (cells where a piece can go).
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      //id of each cell in table = yposition-xposition. Ex. 2nd row, 4th column --> id = "1-3"
      cell.setAttribute('id', `${y}-${x}`); 
      row.append(cell);
    }

    board.append(row);
  }
}

function findSpotForCol(x) { //Given zero-indexed column x, return zero-indexed y-position for lowest empty cell (null if filled)
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null; 
}

function placeInTable(y, x) { //update DOM to include new piece in HTML board.
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

function endGame(msg) { //announce winner of game or DRAW below the game board.
  endgameResult.innerText = msg;
}

function handleClick(event) { //Handle user clicking on a clickable slot in the top row to insert a piece into the board.
  const x = event.target.id;
  const y = findSpotForCol(x); //next piece will go in row y, column x (zero-indexed from top-left to bottom-right).
  if (y === null) {
    return;
  }

  board[y][x] = currPlayer; //In board, corresponding place in board array next piece goes =current player (1 or 2).
  placeInTable(y, x); //reflect this on game board
  
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
  
  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }
    
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

function checkForWin() { 
  //check board cell-by-cell with the inner _win function to determine if someone has won. AKA does a win start at [y,x]?
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates AND all match currPlayer

    return cells.every(
      ([y, x]) => //[y,x] = every 2-length subarray in the "cells" array passed into _win.
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // list out each of the 4 ways to win.
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
