var rows = 3;
var columns = 3;

var currTile;
var otherTile; // the tile being swapped with
var turns = 0;

var imgOrder; // We'll reinitialize this every time to allow resetting

window.onload = function() {
  createBoard();

  // Add retry button listener
  document.getElementById("retryButton").addEventListener("click", resetGame);
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = ""; // Clear existing tiles

  // Reset tile order
  imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.id = r + "-" + c;
      tile.src = imgOrder.shift() + ".png";

      // Add drag functionality
      tile.addEventListener("dragstart", dragStart);
      tile.addEventListener("dragover", dragOver);
      tile.addEventListener("dragenter", dragEnter);
      tile.addEventListener("dragleave", dragLeave);
      tile.addEventListener("drop", dragDrop);
      tile.addEventListener("dragend", dragEnd);

      board.append(tile);
    }
  }

  // Reset turn counter
  turns = 0;
  document.getElementById("turns").innerText = turns;

  // Hide congratulations message on reset
  document.getElementById("congratsMessage").style.display = "none";
}

function resetGame() {
  createBoard();
}

function dragStart() {
  currTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  otherTile = this;
}

function dragEnd() {
  if (!otherTile || !currTile) return;

  // Prevent swapping if not adjacent
  let currCoords = currTile.id.split("-");
  let r = parseInt(currCoords[0]);
  let c = parseInt(currCoords[1]);

  let otherCoords = otherTile.id.split("-");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = r == r2 && c2 == c - 1;
  let moveRight = r == r2 && c2 == c + 1;
  let moveUp = c == c2 && r2 == r - 1;
  let moveDown = c == c2 && r2 == r + 1;

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (!isAdjacent) return;

  // Swap images
  let currImg = currTile.src;
  let otherImg = otherTile.src;

  currTile.src = otherImg;
  otherTile.src = currImg;

  turns += 1;
  document.getElementById("turns").innerText = turns;

  // Check if solved after each move
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