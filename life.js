document.addEventListener('DOMContentLoaded', () => {
  
  const cellSize = 5;
  const aliveChance = 0.1;
  const intervalDuration = 30;

  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  document.body.style.height = `${containerHeight}px`;
  document.body.style.width = `${containerWidth}px`;

  const numRows = Math.floor(containerHeight / cellSize);
  const numCols = Math.floor(containerWidth / cellSize);

  const canvas = document.createElement('canvas');
  canvas.width = containerWidth;
  canvas.height = containerHeight;
  document.body.prepend(canvas);

  let state = [...Array(numRows)].map(() => Array(numCols).fill(null));
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      state[y][x] = +(Math.random() < aliveChance);
    }
  }

  setInterval(() => {
    window.requestAnimationFrame(() => {
      const nextState = getNextState(state);
      paintCanvas(canvas, cellSize, state, nextState);
      state = nextState;
    });
  }, intervalDuration)
});

function getNextState(state) {
  const nextState = JSON.parse(JSON.stringify(state));
  for (let y = 0; y < state.length; y++) {
    for (let x = 0; x < state[0].length; x++) {
      const numAliveNeighbors = getNumAliveNeighbors(state, x, y);
      if (numAliveNeighbors === 2) {
        nextState[y][x] = (state[y][x] === 2) ? 0 : state[y][x];
      } else if (numAliveNeighbors === 3) {
        nextState[y][x] = 1;
      } else {
        nextState[y][x] = (state[y][x] === 1) ? 2 : 0;
      }
    }
  }
  return nextState;
}

function getNumAliveNeighbors(state, x, y) {
  let numAliveNeighbors = 0;
  for (let k = y - 1; k <= y + 1; k++) {
    for (let j = x - 1; j <= x + 1; j++) {
      if (
        (j < 0 || j >= state[0].length || k < 0 || k >= state.length)
        || (j === x && k === y)
      ) continue;
      if (state[k][j] === 1) numAliveNeighbors++;
    }
  }
  return numAliveNeighbors;
}

function paintCanvas(canvas, cellSize, oldState, newState) {
  const context = canvas.getContext('2d');
  for (let y = 0; y < newState.length; y++) {
    for (let x = 0; x < newState[0].length; x++) {
      if (oldState[y][x] === newState[y][x]) continue;
      if (newState[y][x] === 0) context.fillStyle = '#fff';
      if (newState[y][x] === 1) context.fillStyle = '#0095ff';
      if (newState[y][x] === 2) context.fillStyle = '#bee3fe';

      // rounded rect
      // const cell = new Path2D();
      // cell.roundRect(x * cellSize, y * cellSize, cellSize, cellSize, [cellSize / 2]);
      // context.fill(cell);

      // rect
      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}
