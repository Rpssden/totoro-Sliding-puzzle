var rows = 3;
var columns = 3;

var selectedTile = null;
var turns = 0;
var imgOrder;

window.onload = function () {
    createBoard();
    document.getElementById("retryButton").addEventListener("click", resetGame);
};

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
            tile.ondragstart = () => false;
            tile.style.cursor = "pointer";

            // ONE event for mouse + touch
            tile.addEventListener("pointerdown", function (e) {
                e.preventDefault();
                handleTile(this);
            });

            board.appendChild(tile);
        }
    }

    turns = 0;
    document.getElementById("turns").innerText = turns;
    document.getElementById("congratsMessage").style.display = "none";

    selectedTile = null;
}

function handleTile(tile) {

    // First selection
    if (selectedTile === null) {

        clearHighlight();

        selectedTile = tile;

        tile.style.outline = "3px solid yellow";
        tile.style.outlineOffset = "-3px";

        return;
    }

    // Tap same tile again = deselect
    if (selectedTile === tile) {

        clearHighlight();
        selectedTile = null;

        return;
    }

    // Swap images
    let first = selectedTile.src;
    let second = tile.src;

    selectedTile.src = second;
    tile.src = first;

    clearHighlight();
    selectedTile = null;

    turns++;
    document.getElementById("turns").innerText = turns;

    checkWin();
}

function clearHighlight() {

    if (!selectedTile) return;

    selectedTile.style.outline = "";
    selectedTile.style.outlineOffset = "";
}

function checkWin() {

    const correctOrder = [
        "1.png",
        "2.png",
        "3.png",
        "4.png",
        "5.png",
        "6.png",
        "7.png",
        "8.png",
        "9.png"
    ];

    let solved = true;

    const tiles = document.querySelectorAll("#board img");

    tiles.forEach(function (tile, index) {

        let file = tile.src.split("/").pop();

        if (file !== correctOrder[index]) {
            solved = false;
        }

    });

    document.getElementById("congratsMessage").style.display =
        solved ? "block" : "none";
}

function resetGame() {

    selectedTile = null;

    createBoard();
}
