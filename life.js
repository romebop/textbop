document.addEventListener('DOMContentLoaded', () => {

  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  document.body.style.height = `${containerHeight}px`;
  document.body.style.width = `${containerWidth}px`;

  const pixelSize = 8;
  const numRows = Math.floor(containerHeight / pixelSize);
  const numCols = Math.floor(containerWidth / pixelSize);

  const canvas = document.createElement('canvas');
  canvas.width = containerWidth;
  canvas.height = containerHeight;
  document.body.prepend(canvas);
  
  new Game(canvas, numRows, numCols);
});

class Cell {

  constructor(context, x, y) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.alive = Math.random() < 0.4;
    this.lastAlive = false;
  }

  draw() {
    const square = new Path2D();
    const sideLen = 8;
    square.roundRect(this.x * sideLen, this.y * sideLen, sideLen, sideLen, [sideLen / 2]);
    this.context.fillStyle = this.alive
      ? '#0095ff'
      : this.lastAlive
        ? '#0095ff40'
        : '#fff';
    this.context.fill(square);
  }
}

class Game {

  constructor(canvas, numRows, numCols) {
    this.canvas = canvas;
    this.numRows = numRows;
    this.numCols = numCols;
    this.context = this.canvas.getContext('2d');
    this.cells = [];
    this.createGrid();
    window.requestAnimationFrame(() => this.step());
  }

  createGrid() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        this.cells.push(new Cell(this.context, x, y));
      }
    }
  }

  isAlive(x, y) {
    if (x < 0 || x >= this.numCols || y < 0 || y >= this.numRows) return false;
    return this.cells[this.gridToIndex(x, y)].alive ? 1 : 0;
  }

  gridToIndex(x, y) {
    return x + (y * this.numCols);
  }

  // 1. Any live cell with two or three live neighbours survives.
  // 2. Any dead cell with three live neighbours becomes a live cell.
  // 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
  checkNeighbors() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        const numAlive = this.isAlive(x - 1, y - 1) + this.isAlive(x, y - 1) + this.isAlive(x + 1, y - 1) + this.isAlive(x - 1, y) + this.isAlive(x + 1, y) + this.isAlive(x - 1, y + 1) + this.isAlive(x, y + 1) + this.isAlive(x + 1, y + 1);
        const centerIndex = this.gridToIndex(x, y);
        if (numAlive === 2) {
          this.cells[centerIndex].nextAlive = this.cells[centerIndex].alive;
        } else if (numAlive === 3) {
          this.cells[centerIndex].nextAlive = true;
        } else {
          this.cells[centerIndex].nextAlive = false;
        }
      }
    }
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].lastAlive = this.cells[i].alive;
      this.cells[i].alive = this.cells[i].nextAlive;
    }
  }

  step() {
    this.checkNeighbors();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
    setTimeout(() => {
      window.requestAnimationFrame(() => this.step());
    }, 100)
  }
}