const GAMEBOARD = document.querySelector("#game");
const GAME_ROWS = 20;
const GAME_COLUMNS = 10;

const BLOCK_COLORS = {
    red: "redBlock",
    blue: "blueBlock",
    green: "greenBlock",
};

const SHAPE_O = [
    {
        shape: "O",
        rowSpan: 2,
        colSpan: 2,
        color: BLOCK_COLORS.red,
        emptyBlocks: [],
    }
]

const SHAPE_S = [
    {
        shape: "S0",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.blue,
        emptyBlocks: [[1, 1],[2, 3]],
        turnRowColumn: [1, 0],
    },
    {
        shape: "S1",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.blue,
        emptyBlocks: [[1, 2],[3, 1]],
        turnRowColumn: [-1, 1],
    },
    {
        shape: "S2",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.blue,
        emptyBlocks: [[1, 1],[2, 3]],
        turnRowColumn: [0, -1],
    },
    {
        shape: "S3",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.blue,
        emptyBlocks: [[1, 2],[3, 1]],
        turnRowColumn: [0, 0],
    },
]

const SHAPE_Z = [
    {
        shape: "Z0",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.green,
        emptyBlocks: [[1, 3],[2, 1]],
        turnRowColumn: [1, 0],
    },
    {
        shape: "Z1",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.green,
        emptyBlocks: [[1, 1],[3, 2]],
        turnRowColumn: [-1, 1],
    },
    {
        shape: "Z2",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.green,
        emptyBlocks: [[1, 3],[2, 1]],
        turnRowColumn: [0, -1],
    },
    {
        shape: "Z3",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.green,
        emptyBlocks: [[1, 1],[3, 2]],
        turnRowColumn: [0, 0],
    },
]

const SHAPES = [SHAPE_O, SHAPE_S, SHAPE_Z];

//creating board in this file bc its above app.js in html
//by declaring ALL_BLOCKS with queryselector here i can use it in function
//definitions in app.js (otherwise items with .gridItem arent created yet when running querysel)

function createBoard() {
    GAMEBOARD.style = `grid: ${"1fr ".repeat(GAME_ROWS)} / ${"1fr ".repeat(GAME_COLUMNS)}`;
    for(let i = 1; i <= (GAME_COLUMNS); i++) {
        for(let j = 1; j <= GAME_ROWS; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("gridItem");
            gridItem.style.gridColumnStart = i;
            gridItem.style.gridRowStart = j;
            GAMEBOARD.appendChild(gridItem);
        }
    }
}
createBoard();
const BOARD_BLOCKS = document.querySelectorAll(".gridItem");
