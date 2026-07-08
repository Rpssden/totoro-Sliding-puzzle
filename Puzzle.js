var rows = 3;
var columns = 3;

var firstTile = null;
var secondTile = null;
var turns = 0;
var imgOrder;
var isWaitingForSecond = false;

window.onload = function() {
  createBoard();
  document.getElementById("retryButton").addEventListener("click", resetGame);
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.id = r + "-" + c;
      tile.src = imgOrder.shift() + ".png";
      tile.draggable = false;
      
      // Click/tap to select and swap ANY two tiles
      tile.addEventListener("click", tileClick);
      tile.addEventListener("touchstart", tileTouch, { passive: true });

      board.append(tile);
    }
  }

  turns = 0;
  document.getElementById("turns").innerText = turns;
  document.getElementById("congratsMessage").style.display = "none";
  firstTile = null;
  secondTile = null;
  isWaitingForSecond = false;
}

function resetGame() {
  createBoard();
}

function tileClick(e) {
  handleTileClick(this);
}

function tileTouch(e) {
  e.preventDefault();
  handleTileClick(this);
}

function handleTileClick(tile) {
  // If no tile is selected yet, select this one
  if (!isWaitingForSecond) {
    // Deselect previous selection
    if (firstTile) {
      firstTile.style.outline = "none";
      firstTile.style.border = "1px solid rgb(255, 205, 144)";
    }
    
    firstTile = tile;
    firstTile.style.outline = "3px solid yellow";
    firstTile.style.outlineOffset = "-3px";
    isWaitingForSecond = true;
    return;
  }

  // Second tile selected - swap them!
  secondTile = tile;
  
  // Don't swap with itself
  if (firstTile === secondTile) {
    firstTile.style.outline = "none";
    firstTile.style.border = "1px solid rgb(255, 205, 144)";
    firstTile = null;
    isWaitingForSecond = false;
    return;
  }

  // Swap the images
  let firstImg = firstTile.src;
  let secondImg = secondTile.src;
  
  firstTile.src = secondImg;
  secondTile.src = firstImg;

  // Reset selection
  firstTile.style.outline = "none";
  firstTile.style.border = "1px solid rgb(255, 205, 144)";
  firstTile = null;
  secondTile = null;
  isWaitingForSecond = false;

  turns += 1;
  document.getElementById("turns").innerText = turns;

  checkWin();
}

function checkWin() {
  let isSolved = true;

  let correctOrder = [
    "1.png", "2.png", "3.png",
    "4.png", "5.png", "6.png",
    "7.png", "8.png", "9.png"
  ];

  let tiles = document.querySelectorAll("#board img");

  tiles.forEach((tile, index) => {
    let src = tile.src;
    if (!src.includes(correctOrder[index])) {
      isSolved = false;
    }
  });

  if (isSolved) {
    document.getElementById("congratsMessage").style.display = "block";
  } else {
    document.getElementById("congratsMessage").style.display = "none";
  }
}
