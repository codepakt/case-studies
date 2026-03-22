const gridSize = 20;
const TICK_RATE = 150;

const DIRECTION_DELTAS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const KEY_MAP = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  a: "left",
  A: "left",
  s: "down",
  S: "down",
  d: "right",
  D: "right",
};

let snake = [];
let direction = "right";
let nextDirection = "right";
let food = null;
let score = 0;
let gameOver = false;
let gameInterval = null;

const boardElement = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const statusMessageElement = document.getElementById("status-message");
const restartButton = document.getElementById("restart-button");

function createStartingSnake() {
  return [
    { x: 2, y: 10 },
    { x: 1, y: 10 },
    { x: 0, y: 10 },
  ];
}

function getRandomEmptyCell() {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const emptyCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        emptyCells.push({ x, y });
      }
    }
  }

  if (emptyCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

function renderBoard() {
  boardElement.innerHTML = "";
  const snakeLookup = new Map(
    snake.map((segment, index) => [`${segment.x},${segment.y}`, index])
  );
  const foodKey = food ? `${food.x},${food.y}` : "";

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const cell = document.createElement("div");
      const key = `${x},${y}`;

      cell.className = "cell";

      if (snakeLookup.has(key)) {
        cell.classList.add("snake");
        if (snakeLookup.get(key) === 0) {
          cell.classList.add("snake-head");
        }
      } else if (key === foodKey) {
        cell.classList.add("food");
      }

      boardElement.appendChild(cell);
    }
  }
}

function updateHud() {
  scoreElement.textContent = String(score);
  if (gameOver) {
    statusMessageElement.textContent = `Game over. Final score: ${score}.`;
  } else {
    statusMessageElement.textContent = "";
  }
}

function spawnFood() {
  food = getRandomEmptyCell();
}

function checkCollision(pos) {
  if (pos.x < 0 || pos.x >= gridSize || pos.y < 0 || pos.y >= gridSize) {
    return true;
  }
  if (snake.some(function (seg) { return seg.x === pos.x && seg.y === pos.y; })) {
    return true;
  }
  return false;
}

function gameTick() {
  if (gameOver) return;

  direction = nextDirection;

  var head = snake[0];
  var delta = DIRECTION_DELTAS[direction];
  var newHead = { x: head.x + delta.x, y: head.y + delta.y };

  if (checkCollision(newHead)) {
    gameOver = true;
    clearInterval(gameInterval);
    gameInterval = null;
    updateHud();
    renderBoard();
    return;
  }

  snake.unshift(newHead);

  if (food && newHead.x === food.x && newHead.y === food.y) {
    score += 1;
    spawnFood();
  } else {
    snake.pop();
  }

  renderBoard();
  updateHud();
}

function startGame() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
  gameInterval = setInterval(gameTick, TICK_RATE);
}

function initGame() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }

  snake = createStartingSnake();
  direction = "right";
  nextDirection = "right";
  score = 0;
  gameOver = false;
  food = getRandomEmptyCell();

  updateHud();
  renderBoard();
  startGame();
}

document.addEventListener("keydown", function (e) {
  var newDir = KEY_MAP[e.key];
  if (!newDir) return;
  if (newDir === OPPOSITES[nextDirection]) return;
  e.preventDefault();
  nextDirection = newDir;
});

restartButton.addEventListener("click", initGame);

initGame();
