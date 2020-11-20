let rootElement = document.getElementById("root");
let gameContainer = document.createElement("div");
let score = 0;
let gameOver = false;
let scoreEle = document.createElement("div");
rootElement.appendChild(scoreEle);
gameContainer.setAttribute("id", "game");
let bombLocations = [];
let allIds = [];
let hintsGiven = [];
let hintsToBeGiven = 0;
let m = 15;
let n = 15;
const getId = (i, j) => i.toString() + j.toString();

const startGame = () => {
  scoreEle.innerHTML = `Score: ${score}`;
  for (let i = 0; i < m; i++) {
    let gridRow = document.createElement("div");
    gridRow.className = "row";
    for (let j = 0; j < n; j++) {
      let gridCell = document.createElement("div");
      let cellId = getId(i, j);
      allIds.push(cellId);
      gridCell.setAttribute("id", cellId);
      gridCell.addEventListener("click", () => handleClick(cellId));
      gridCell.className = "box";
      gridRow.appendChild(gridCell);
    }
    gameContainer.appendChild(gridRow);
  }
  rootElement.appendChild(gameContainer);
  let numOfCells = allIds.length;
  let numOfBombCells = Math.floor(numOfCells / 3);
  hintsToBeGiven = Math.floor(numOfBombCells / 4);
  while (numOfBombCells > 0) {
    let index = Math.floor(Math.random() * numOfCells);
    if (bombLocations.indexOf(allIds[index]) === -1) {
      bombLocations.push(allIds[index]);
      numOfBombCells--;
    }
  }
  bombLocations.sort();
  while (hintsToBeGiven > 0) {
    let index = Math.floor(Math.random() * bombLocations.length) - 1;
    if (hintsGiven.indexOf(bombLocations[index]) === -1) {
      hintsGiven.push(bombLocations[index]);
      hintsToBeGiven--;
    }
  }

  hintsToBeGiven = Math.floor(Math.floor(numOfCells / 3) / 4);
  let hintButton = document.createElement("button");
  hintButton.addEventListener("click", () => giveHint());
  hintButton.innerHTML = "Hint";
  rootElement.appendChild(hintButton);
};

startGame();

const giveHint = () => {
  if(gameOver) {
    return;
  }
  if (hintsToBeGiven === 0) {
    alert("Out of Hints");
    return;
  }
  let hintEle = document.getElementById(hintsGiven[hintsToBeGiven - 1]);
  hintEle.classList.add("hint");
  --hintsToBeGiven;
};
const handleClick = (id) => {
  if (gameOver) {
    return;
  }
  let currEle = document.getElementById(id);
  if (bombLocations.indexOf(id) !== -1) {
    gameOver = true;
    revealBombs();
    setTimeout(() => {
      alert("Game Over");
    }, 1000);
  } else {
    currEle.classList.add("no-bomb");
    updateScore();
    let surroundingBombs = checkForBombs(id);
    if (surroundingBombs < 2) {
      currEle.classList.add("safe");
    } else if (surroundingBombs === 2 || surroundingBombs === 3) {
      currEle.classList.add("moderate");
    } else {
      currEle.classList.add("harm");
    }
    currEle.innerHTML = surroundingBombs;
  }
};
const checkForBombs = (id) => {
  let i = +id.substring(0, 1);
  let j = +id.substring(1, 2);
  let count = 0;
  let xCount = 0;
  let x = j - 1;
  while (xCount < 3) {
    if (x < 0 || x >= n) {
      ++x;
      ++xCount;
      continue;
    }
    let yCount = 0;
    let y = i - 1;
    while (yCount < 3) {
      if (y < 0 || y >= m) {
        ++y;
        ++yCount;
        continue;
      }
      if (bombLocations.indexOf(getId(y, x)) !== -1) {
        ++count;
      }
      ++y;
      ++yCount;
    }
    ++x;
    ++xCount;
  }
  return count;
};
const revealBombs = () => {
  for (let i = 0; i < bombLocations.length; i++) {
    let bombEle = document.getElementById(bombLocations[i]);
    if(bombEle.classList.contains("hint")) {
      bombEle.classList.remove("hint");
    }
    bombEle.classList.add("bomb");
  }
};

const updateScore = () => {
  score++;
  scoreEle.innerHTML = `Score: ${score}`;
  if (score === (m * n) - ((Math.floor((m * n) / 3)))) {
    setTimeout(() => {
      alert("Won the Game");
    }, 500);
  }
  
};
