var rows = 3;
var columns = 3;

var turns = 0;
var imgOrder;
var emptyRow = 2;
var emptyCol = 2;

window.onload = function() {
  createBoard();
  document.getElementById("retryButton").addEventListener("click", resetGame);
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
  emptyRow = 2;
  emptyCol = 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.id = r + "-" + c;
      let imgSrc = imgOrder.shift();
      tile.src = imgSrc + ".png";
      
      // Remove all drag events - use click/tap instead
      tile.addEventListener("click", tileClick);
      tile.addEventListener("touchstart", tileTouch, { passive: true });

      board.append(tile);
    }
  }

  turns = 0;
  document.getElementById("turns").innerText = turns;
  document.getElementById("congratsMessage").style.display = "none";
}

function resetGame() {
  createBoard();
}

function tileClick(e) {
  handleTileClick(this);
}

function tileTouch(e) {
  // Prevent any default touch behavior
  e.preventDefault();
  handleTileClick(this);
}

function handleTileClick(tile) {
  let coords = tile.id.split("-");
  let row = parseInt(coords[0]);
  let col = parseInt(coords[1]);

  // Check if this tile is adjacent to the empty space
  let isAdjacent = false;
  
  // Check up
  if (row === emptyRow - 1 && col === emptyCol) isAdjacent = true;
  // Check down
  if (row === emptyRow + 1 && col === emptyCol) isAdjacent = true;
  // Check left
  if (row === emptyRow && col === emptyCol - 1) isAdjacent = true;
  // Check right
  if (row === emptyRow && col === emptyCol + 1) isAdjacent = true;

  if (!isAdjacent) return;

  // Find the empty tile
  let emptyTile = document.getElementById(emptyRow + "-" + emptyCol);
  
  // Swap the images
  let tileImg = tile.src;
  let emptyImg = emptyTile.src;
  
  tile.src = emptyImg;
  emptyTile.src = tileImg;

  // Update empty position
  emptyRow = row;
  emptyCol = col;

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
