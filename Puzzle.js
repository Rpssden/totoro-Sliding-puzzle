var rows = 3;
var columns = 3;

var selectedTile = null;
var turns = 0;
var imgOrder;

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
      
      // Use BOTH click and touch events
      tile.addEventListener("click", handleTile);
      tile.addEventListener("touchstart", handleTileTouch, { passive: true });

      board.append(tile);
    }
  }

  turns = 0;
  document.getElementById("turns").innerText = turns;
  document.getElementById("congratsMessage").style.display = "none";
  selectedTile = null;
}

function handleTile(e) {
  e.preventDefault();
  processTile(this);
}

function handleTileTouch(e) {
  e.preventDefault();
  processTile(this);
}

function processTile(tile) {
  // If no tile is selected, select this one
  if (selectedTile === null) {
    // Clear any previous selection first
    clearHighlight();
    
    // Select this tile
    selectedTile = tile;
    tile.style.outline = "3px solid yellow";
    tile.style.outlineOffset = "-3px";
    return;
  }

  // If clicking the SAME tile, deselect it
  if (selectedTile === tile) {
    clearHighlight();
    selectedTile = null;
    return;
  }

  // If clicking a DIFFERENT tile, swap them
  let firstImg = selectedTile.src;
  let secondImg = tile.src;
  
  selectedTile.src = secondImg;
  tile.src = firstImg;

  // Clear highlight
  clearHighlight();
  selectedTile = null;

  // Count the turn
  turns += 1;
  document.getElementById("turns").innerText = turns;

  checkWin();
}

function clearHighlight() {
  if (selectedTile) {
    selectedTile.style.outline = "none";
    selectedTile.style.border = "1px solid rgb(255, 205, 144)";
  }
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

function resetGame() {
  selectedTile = null;
  createBoard();
}
