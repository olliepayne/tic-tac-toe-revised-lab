// get input from the user and print a value onto the grid
// store the values
// cache html elements
// have a win condition
// initialize AND reset the grid
// keep track of who wins each game

// ---CACHED DOM ELEMENTS---
const cellEls = document.getElementById('grid-container').querySelectorAll('div');
for(let i = 0; i < cellEls.length; i++) {
  cellEls[i].addEventListener('click', function() {
    clickedCell(i);
  });

  // visual feedback when hovering over a cell
  cellEls[i].addEventListener('mouseover', function() {
    cellEls[i].style.opacity = 0.8;
  });
  cellEls[i].addEventListener('mouseleave', function() {
    cellEls[i].style.opacity = 1;
  });
}

const scoreEl = document.getElementById('score');
scoreEl.innerHTML = 'Score X: 0 // O: 0';

const gameMessageEl = document.getElementById('game-message');

// ---GLOBAL VARIABLES---
let running = false;
let turn = 1;
let grid = [];

let playerPiece = 'x';
let playerScore = 0;
let computerPiece = 'o';
let computerScore = 0;

// ---GAME---
function init() {
  // game is now running
  running = true;

  // clear the visual grid
  for(let i = 0; i < cellEls.length; i++) {
    cellEls[i].querySelector('p').innerHTML = '';
  }

  // clear the grid values
  grid = [];
  drawGrid();

  // game is ready
  turn = 1;
}

function drawGrid(w, h) {
  for(let i = 0; i < 9; i++) {
    grid.push('');
  }
}

function clickedCell(cellIndex) {
  if(turn % 2 === 1 && running) {
    if(grid[cellIndex] === '') {
      fillCell(cellIndex, playerPiece);

      // play next turn if fill cell didnt trigger end game condition
      if(running) {
        turn++;
        computerTurn();
      }
    }
  }
}

function fillCell(i, type) {
  grid[i] = type;
  cellEls[i].querySelector('p').innerHTML = type;
  checkNeighbors(type);
}

function checkNeighbors(type) {
  for(let i = 0; i < grid.length; i++) {
    if(grid[i] === type) {
      if(grid[i + 1] === type && grid[i + 2] === type) {  // horiz logic
        endGame(type);
      } else if(grid[i + 3] === type && grid[i + 6] === type) { // vert logic
        endGame(type);
      } else if(grid[i + 4] === type && grid[i + 8] === type) { // down-right logic
        endGame(type);
      } else if(grid[i + 2] === type && grid[i +4] === type) {  // down-left logic
        endGame(type);
      }
    }
  }
}

function computerTurn() {
  if(turn % 2 === 0 && turn !== 10 && running) {
    let randomCellIndex = Math.floor(Math.random() * grid.length);
    while(grid[randomCellIndex] !== '') {
      randomCellIndex = Math.floor(Math.random() * grid.length);
    }
    fillCell(randomCellIndex, computerPiece);

    // play next turn if fill cell didnt trigger end game condition
    if(running) {
      turn++;
    }
  } else if(turn === 10) {
    init();
  }
}

function endGame(winningType) {
  running = false;

  if(winningType === playerPiece) {
    playerScore++;
  } else if(winningType === computerPiece) {
    computerScore++;
  }

  if(playerPiece === 'x') {
    scoreEl.innerHTML = `Score X: ${playerScore} // O: ${computerScore}`;
  } else if(playerPiece === 'o'){
    scoreEl.innerHTML = `Score X: ${computerScore} // O: ${playerScore}`;
  }

  init();
}

init();