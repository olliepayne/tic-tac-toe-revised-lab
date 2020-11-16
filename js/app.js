const gridContainerEl = document.getElementById('grid-container');
const cachedCellEls = gridContainerEl.querySelectorAll('div');
function addCellEventListeners() {
  for(let i = 0; i < cachedCellEls.length; i++) {
    cachedCellEls[i].addEventListener('click', function() {
      player.playTurn(i);
    });
  }
}

const game = {
  running: false,
  winner: '',
  init: function() {
    this.running = true;

    addCellEventListeners();

    grid.drawGrid(3, 3);
  },
  idOwner: function(pieceType) {
    if(pieceType === player.pieceType) {
      return 'player';
    } else if(pieceType === enemy.pieceType) {
      return 'enemy';
    }
  },
  endGame: function(name) {
    this.winner = name;
    console.log(this.winner);
  },
}

const turnHandler = {

}

const grid = {
  width: 0,
  height: 0,
  cells: [],
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
        const cellDownRight = i + this.width + 1;
        const cellDownLeft = i + this.width - 1;
         
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
        } else if(this.isOnGrid(cellDownRight) && this.cells[cellDownRight] === pieceType) {
          const winningCell = cellDownRight + this.width + 1;
          if(this.isOnGrid(winningCell) && this.cells[winningCell] === pieceType) {
            game.endGame(game.idOwner(pieceType));
          }
        } else if(this.isOnGrid(cellDownLeft) && this.cells[cellDownLeft] === pieceType) {
          const winningCell = cellDownLeft + this.width - 1;
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
}

const player = {
  pieceType: 'x',
  turn: true,
  playTurn: function(i) {
    if(this.turn && game.running) {
      if(grid.cells[i] === '') {
        grid.setCellValue(i, player.pieceType);
        grid.renderNewCellValue(i, player.pieceType);
        grid.checkNeighbors(this.pieceType);
      }
    }
  },
}

const enemy = {
  pieceType: '',
  turn: false,
  playTurn: function() {
    if(this.turn && game.running) {

    }
  },
}

game.init();