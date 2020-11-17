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
const resetButtonEl = document.getElementById('reset-button');
resetButtonEl.addEventListener('click', function() {
  init();
});

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

  gameMessageEl.innerHTML = '';

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

      turn++;
      computerTurn();
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
      if(i === 0 || i % 3 === 0) {  // horiz
        if(grid[i + 1] === type && grid[i + 2] === type) {
          endGame(type);
        }
      }
      
      if(i < 3) { // vert
        if(grid[i + 3] === type && grid[i + 6] === type) {
          endGame(type);
        }
      }

      if(i === 2) { // down left
        if(grid[i + 2] === type && grid[i + 4] === type) {
          endGame(type);
        }
      }

      if(i === 0) { // down right
        if(grid[i + 4] === type && grid[i + 8] === type) {
          endGame(type);
        }
      }
    }
  }
}

function computerTurn() {
  if(turn % 2 === 0 && turn < 10 && running) {
    let randomCellIndex = Math.floor(Math.random() * grid.length);
    while(grid[randomCellIndex] !== '') {
      randomCellIndex = Math.floor(Math.random() * grid.length);
    }
    fillCell(randomCellIndex, computerPiece);
    turn++;
  } else if(turn === 10) {
    gameMessageEl.innerHTML = `It's a tie!`;
  }
}

function endGame(winningType) {
  running = false;

  if(turn < 10) {
    if(winningType === playerPiece) {
      playerScore++;
      gameMessageEl.innerHTML = 'X Wins!';
    } else if(winningType === computerPiece) {
      computerScore++;
      gameMessageEl.innerHTML = 'O Wins!';
    }
  }

  if(playerPiece === 'x') {
    scoreEl.innerHTML = `Score X: ${playerScore} // O: ${computerScore}`;
  } else if(playerPiece === 'o'){
    scoreEl.innerHTML = `Score X: ${computerScore} // O: ${playerScore}`;
  }
}

init();