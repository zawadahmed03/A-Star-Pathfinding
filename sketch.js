function removeFromArray(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  let d = abs(a.i - b.i) + abs(a.j - b.j)
  return d;
}

const cols = 50;
const rows = 50;
const grid = new Array(cols);

let openSet = [];
let closedSet = [];

let path = [];

let start;
let end;

let w, h;

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;

  this.show = function (color) {
    fill(color);
    stroke(0);
    rect(this.i * w, this.j * h, w, h);
  };

  this.addNeigbors = function () {
    let i = this.i;
    let j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
  };
}

function setup() {
  createCanvas(innerHeight, innerHeight);

  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeigbors();
    }
  }

  start = grid[0][0];
  end = grid[cols-1][0];

  openSet.push(start);
}

function draw() {
  end.show(0);

  let current;

  if (openSet.length > 0) {
    let winner = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner.f]) {
        winner = i;
      }
    }

    current = openSet[winner];

    if (current === end) {
      noLoop();
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        let tempG = current.g + 1;

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.h + neighbor.g;
        neighbor.previous = current;
      }
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] != end) grid[i][j].show(230);
    }
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 230, 0));
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(230, 0, 0));
  }

  let temp = current;
  path = [];
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 230));
  }
}
