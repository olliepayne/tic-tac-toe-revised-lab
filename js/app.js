// ---CACHED DOM ELEMENTS---
const gridContainerEl = document.getElementById('grid-container');
const cachedCellEls = gridContainerEl.querySelectorAll('div');
function addCellEventListeners() {
  for(let i = 0; i < cachedCellEls.length; i++) {
    cachedCellEls[i].addEventListener('mouseover', function() {
      cachedCellEls[i].style.opacity = 0.8;
    });
    cachedCellEls[i].addEventListener('mouseleave', function() {
      cachedCellEls[i].style.opacity = 1;
    });
    cachedCellEls[i].addEventListener('click', function() {
      player.playTurn(i);
    });
  }
}
addCellEventListeners();

const xoButtonContainerEl = document.getElementById('xo-button-container');
const xButtonEl = document.getElementById('x-button');
xButtonEl.addEventListener('click', function() {
  player.pieceType = 'x';
  enemy.pieceType = 'o';

  xoButtonContainerEl.style.visibility = 'hidden';
});
const oButtonEl = document.getElementById('o-button');
oButtonEl.addEventListener('click', function() {
  player.pieceType = 'o';
  enemy.pieceType = 'x';

  xoButtonContainerEl.style.visibility = 'hidden';
});

const scoreEl = document.getElementById('score');

// ---GAME---

const game = {
  running: false,
  score: [
    {playerScore: 0},
    {enemyScore: 0},
  ],
  init: function() {
    // game is now running
    this.running = true;

    // reset the scoreboard
    this.score['playerScore'] = 0;
    this.score['enemyScore'] = 0;
    this.renderScore(`Score X: 0 // O: 0`);

    // hide the x o choice buttons
    xoButtonContainerEl.style.visibility = 'hidden';

    // reset grid array, then fill with empty cells
    grid.reset();
    grid.drawGrid(3, 3);

    // game is nearly ready to play, decide who goes first
    turnHandler.decideInitialTurn();
  },
  idOwner: function(pieceType) {
    if(pieceType === player.pieceType) {
      return 'player';
    } else if(pieceType === enemy.pieceType) {
      return 'enemy';
    }
  },
  endGame: function(winner) {
    turnHandler.stop();

    if(winner === 'player') {
      this.score['playerScore']++;
      console.log(this.score['playerScore']);
    } else if(winner === 'enemy') {
      this.score['enemyScore']++;
    }

    // display new score on the page
    if(player.pieceType === 'x') {
      this.renderScore(`Score X: ${this.score['playerScore']} // O: ${this.score['enemyScore']}`);
    } else {
      this.renderScore(`Score X: ${this.score['enemyScore']} // O: ${this.score['playerScore']}`);
    }

    game.init();
  },
  renderScore: function(str) {
    scoreEl.innerHTML = str;
  },
}

const turnHandler = {
  decideInitialTurn: function() {
    if(Math.random() < 0.5) {
      player.choosePiece();
      this.turnSequencer('playerTurn');
    } else {
      enemy.choosePiece();
      this.turnSequencer('enemyTurn');
    }
  },
  turnSequencer: function(event) {
    switch(event) {
      case 'playerTurn':
        enemy.turn = false; 
        player.turn = true;
      break;

      case 'enemyTurn':
        player.turn = false;    
        enemy.turn = true; 
        enemy.playTurn();
      break;
    }
  },
  stop: function() {
    player.turn = false;
    enemy.turn = false;
  },
}

const grid = {
  width: 0,
  height: 0,
  cells: [],
  reset: function() {
    this.cells = [];
    this.width = 0;
    this.height = 0;
  },
  drawGrid: function(w, h) {
    for(let i = 0; i < w * h; i++) {
      this.cells.push('');
    }

    this.width = w;
    this.height = h;
  },
  setCellValue: function(i, pieceType) {
    this.cells[i] = pieceType;
  },
  renderNewCellValue: function(i, pieceType) {
    cachedCellEls[i].querySelector('p').innerText = pieceType;
  },
  checkNeighbors: function(pieceType) {
    for(let i = 0; i < this.cells.length; i++) {
      // check for a win condition
      if(this.cells[i] === pieceType) {
        const cellRight = i + 1;
        const cellDown = i + this.width;
        const cellDownLeft = i + this.width - 1;
        const cellDownRight = i + this.width + 1;

        if(this.isOnGrid(cellRight) && this.cells[cellRight] === pieceType) {
          const winningCell = cellRight + 1;
          if(this.isOnGrid(winningCell) && this.cells[winningCell] === pieceType) {
            game.endGame(game.idOwner(pieceType));
          }
        } else if(this.isOnGrid(cellDown) && this.cells[cellDown] === pieceType) {
          const winningCell = cellDown + this.width;
          if(this.isOnGrid(winningCell) && this.cells[winningCell] === pieceType) {
            game.endGame(game.idOwner(pieceType));
          }
        } else if(this.isOnGrid(cellDownLeft) && this.cells[cellDownLeft] === pieceType) {
          const winningCell = cellDownLeft + this.width - 1;
          if(this.isOnGrid(winningCell) && this.cells[winningCell] === pieceType) {
            console.log('test');
            game.endGame(game.idOwner(pieceType));
          }
        } else if(this.isOnGrid(cellDownRight) && this.cells[cellDownRight] === pieceType) {
          const winningCell = cellDownRight + this.width + 1;
          if(this.isOnGrid(winningCell) && this.cells[winningCell] === pieceType) {
            game.endGame(game.idOwner(pieceType));
          }
        } 
      }
    }
  },
  isOnGrid: function(cellIdx) {
    if(cellIdx >= 0 && cellIdx < this.width * this.height) {
      return true;
    } else {
      return false;
    }
  },
  isEmptyCell: function(i) {
    if(this.cells[i] === '') {
      return true;
    } else {
      return false;
    }
  },
}

const player = {
  pieceType: '',
  choosePiece: function() {
    xoButtonContainerEl.style.visibility = 'visible';
  },
  turn: false,
  playTurn: function(i) {
    if(this.pieceType !== '') {
      if(this.turn && game.running) {
        if(grid.isEmptyCell(i)) {
          grid.setCellValue(i, this.pieceType);
          grid.renderNewCellValue(i, this.pieceType);
          grid.checkNeighbors(this.pieceType);
  
          turnHandler.turnSequencer('enemyTurn');
        }
      }
    }
  },
}

const enemy = {
  pieceType: '',
  choosePiece: function() {
    if(Math.random() < 0.5) {
      this.pieceType = 'x';
      player.pieceType = 'o';
    } else {
      this.pieceType = 'o';
      player.pieceType = 'x';
    }
  },
  turn: false,
  playTurn: function() {
    if(this.pieceType !== '') {
      if(this.turn && game.running) {
        let randomCell = Math.floor(Math.random() * grid.cells.length);
        while(!grid.isEmptyCell(randomCell)) {
          randomCell = Math.floor(Math.random() * grid.cells.length);
        }
        grid.setCellValue(randomCell, this.pieceType);
        grid.renderNewCellValue(randomCell, this.pieceType);
        grid.checkNeighbors(this.pieceType);
  
        turnHandler.turnSequencer('playerTurn');
      }
    }
  },
}

game.init();