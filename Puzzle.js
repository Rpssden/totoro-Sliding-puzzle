var rows = 3;
var columns = 3;

var selectedTile = null;
var turns = 0;
var imgOrder;
var isTouchDevice = false;

window.onload = function() {
  // Check if this is a touch device
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
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
      
      // For touch devices, ONLY use touch events
      if (isTouchDevice) {
        tile.addEventListener("touchstart", handleTouchStart, { passive: false });
        tile.addEventListener("touchend", handleTouchEnd, { passive: false });
        tile.addEventListener("touchcancel", handleTouchCancel, { passive: false });
      } else {
        // For desktop, use click
        tile.addEventListener("click", handleClick);
      }

      board.append(tile);
    }
  }

  turns = 0;
  document.getElementById("turns").innerText = turns;
  document.getElementById("congratsMessage").style.display = "none";
  selectedTile = null;
}

// ============ DESKTOP VERSION ============
function handleClick(e) {
  e.preventDefault();
  processTile(this);
}

// ============ MOBILE VERSION ============
var touchTile = null;
var touchTimer = null;

function handleTouchStart(e) {
  e.preventDefault();
  touchTile = this;
  
  // Small delay to detect if it's a tap or drag
  touchTimer = setTimeout(function() {
    // If timer fires, it's a tap
    if (touchTile) {
      processTile(touchTile);
      touchTile = null;
    }
  }, 100);
}

function handleTouchEnd(e) {
  e.preventDefault();
  // Clear the timer if finger was lifted before timer fires
  if (touchTimer) {
    clearTimeout(touchTimer);
    touchTimer = null;
  }
  
  // If we didn't process it yet, process it now
  if (touchTile) {
    processTile(touchTile);
    touchTile = null;
  }
}

function handleTouchCancel(e) {
  e.preventDefault();
  // Cancel everything
  if (touchTimer) {
    clearTimeout(touchTimer);
    touchTimer = null;
  }
  touchTile = null;
}

// ============ MAIN GAME LOGIC ============
function processTile(tile) {
  // If no tile is selected, select this one
  if (selectedTile === null) {
    // Clear any previous selection first
    clearHighlight();
    
    // Select this tile
    selectedTile = tile;
    tile.style.outline = "3px solid yellow";
    tile.style.outlineOffset = "-3px";
    
    // Vibrate on mobile (optional - works on iPhone)
    if (isTouchDevice && navigator.vibrate) {
      navigator.vibrate(10);
    }
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

  // Vibrate on mobile on swap (optional)
  if (isTouchDevice && navigator.vibrate) {
    navigator.vibrate(5);
  }

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
    // Vibrate on win!
    if (isTouchDevice && navigator.vibrate) {
      navigator.vibrate([50, 50, 50, 50, 50]);
    }
  } else {
    document.getElementById("congratsMessage").style.display = "none";
  }
}

function resetGame() {
  selectedTile = null;
  createBoard();
}
