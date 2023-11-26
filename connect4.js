/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(colorValue) {
    this.colorValue = colorValue;
  }
}

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.currPlayer = 1;
    this.board = [];
    this.isGameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  restartGame() {
    
  }

  makeBoard() { //Create board structure in JavaScript, this.board = array of row arrays (this.board[row][column])
    for (let y = 0; y < this.height; y++) {
      //Creates a 2-D array with "this.height" number of subarrays of length this.width, each value in each subarray initialized to undefined.
      this.board.push(Array.from({ length: this.width })); //push an array of length this.width, each value = undefined, to this.board.
    }
  }

  makeHtmlBoard() { //Make Connect 4 table to display on page along with top row of clickable cells to drop a piece.
    const gameBoard = document.getElementById('connect4-board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr'); //table row
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
    
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      //id of each cell in top clickable row = its 0-indexed x-position. Ex. 3rd cell to left --> id = "2"
      headCell.setAttribute('id', x); 
      top.append(headCell);
    }
    gameBoard.append(top);
    // make main part of board (cells where a piece can go).
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        //id of each cell in table = yposition-xposition. Ex. 2nd row, 4th column --> id = "1-3"
        cell.setAttribute('id', `${y}-${x}`); 
        row.append(cell);
      }
  
      gameBoard.append(row);
    }
  }

  findSpotForCol(x) { //Given zero-indexed column x, return zero-indexed y-position for lowest empty cell (null if filled)
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null; 
  }

  placeInTable(y, x) { //update DOM to include new piece in HTML board.
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  announceWinner(msg) { //announce winner of game or DRAW below the game board.
    endgameResult.innerText = msg;
  }

  handleClick(event) { //Handle user clicking on a clickable slot in the top row to insert a piece into the board.
    if (!this.isGameOver) {
      const x = event.target.id;
      const y = this.findSpotForCol(x); //next piece will go in row y, column x (zero-indexed from top-left to bottom-right).
      if (y === null) {
        return;
      }
    
      this.board[y][x] = this.currPlayer; //In this.board, corresponding place in board array next piece goes =current player (1 or 2).
      this.placeInTable(y, x); //reflect this on game board
      
      if (this.checkForWin()) {
        this.isGameOver = true;
        return this.announceWinner(`Player ${this.currPlayer} won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        this.isGameOver = true;
        return this.announceWinner('It is a Tie!');
      }
        
      // switch players
      this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }
  }

  checkForWin() { 
    //check board cell-by-cell with the inner _win function to determine if someone has won. AKA does a win start at [y,x]?
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates AND all match currPlayer
  
      return cells.every(
        ([y, x]) => //[y,x] = every 2-length subarray in the "cells" array passed into _win.
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    const win = _win.bind(this); //bind the value of "this" in the_win function to the Game class.
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // list out each of the 4 ways to win.
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
          return true;
        }
      }
    }

  }
}

const playerColorsForm = document.querySelector("#player-colors-form");
const player1Color = document.querySelector("#player-1-color");
const player2Color = document.querySelector("#player-2-color");
const formSubmitButton = document.querySelector("#form-submit-button");
const endgameResult = document.getElementById("endgame-result");

playerColorsForm.addEventListener("submit", (event) => { 
  event.preventDefault();
  formSubmitButton.value = "Start New Game";
  endgameResult.innerText = "";

  //initialize players and the colors of the game pieces from the form input.
  const player1 = new Player(player1Color.value);
  const player2 = new Player(player2Color.value); 

  const gameBoard = document.getElementById('connect4-board'); 
  for (let i = gameBoard.children.length-1; i >= 0; i--) { //reset the game by deleting the current board so you can recreate an empty one.
    gameBoard.children[i].remove();
  }
  new Game(10,10);
});

/* If I wanted to have multiple Connect Four games at the same time on the screen, I'd add methods to the Game class
that would add form element, button element, and endgameResult element to the DOM each time a new Game is instantiated,
but in this project I want to just focus on one game with these elements already in the HTML */
