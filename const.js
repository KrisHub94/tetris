const GAMEBOARD = document.querySelector("#game");
const GAME_ROWS = 20;
const GAME_COLUMNS = 10;

const START_SCREEN = document.querySelector("#startScreen");
const NEXT_PIECE_DISPLAY = document.querySelector("#nextPiece");
const STORED_PIECE_DISPLAY = document.querySelector("#storedPiece");
const SCORE_DISPLAY = document.querySelector("#score");
const LEVEL_DISPLAY = document.querySelector("#levelDisplay");
const LINES_CLEAR_DISPLAY = document.querySelector("#linesCleared");
const LOSE_SCREEN = document.querySelector("#loseScreen");

const TURN_SOUND = "./sounds/turn-sound.mp3";
const ROW_CLEAR_SOUND = "./sounds/row-clear-sound.mp3";
const GAME_OVER_SOUND = "./sounds/you-lose-sound.mp3";
const MAKE_STATIC_SOUND = "./sounds/make-static-sound.mp3";
const NEXT_LEVEL_SOUND = "./sounds/next-level-sound.mp3";

const BLOCK_COLORS = {
    red: "redBlock",
    blue: "blueBlock",
    green: "greenBlock",
    purple: "purpleBlock",
    orange: "orangeBlock",
    yellow: "yellowBlock",
    darkBlue: "darkBlueBlock",
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
        color: BLOCK_COLORS.yellow,
        emptyBlocks: [[1, 1],[2, 3]],
        turnRowColumn: [1, 0],
    },
    {
        shape: "S1",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.yellow,
        emptyBlocks: [[1, 2],[3, 1]],
        turnRowColumn: [-1, 1],
    },
    {
        shape: "S2",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.yellow,
        emptyBlocks: [[1, 1],[2, 3]],
        turnRowColumn: [0, -1],
    },
    {
        shape: "S3",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.yellow,
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

const SHAPE_I = [
    {
        shape: "I0",
        rowSpan: 1,
        colSpan: 4,
        color: BLOCK_COLORS.blue,
        emptyBlocks: [],
        turnRowColumn: [1, 0],
    },
    {
        shape: "I1",
        rowSpan: 4,
        colSpan: 1,
        color: BLOCK_COLORS.blue,
        emptyBlocks: [],
        turnRowColumn: [-1, 1],
    },
    {
        shape: "I2",
        rowSpan: 1,
        colSpan: 4,
        color: BLOCK_COLORS.blue,
        emptyBlocks: [],
        turnRowColumn: [0, -1],
    },
    {
        shape: "I3",
        rowSpan: 4,
        colSpan: 1,
        color: BLOCK_COLORS.blue,
        emptyBlocks: [],
        turnRowColumn: [0, 0],
    },
]

const SHAPE_T = [
    {
        shape: "T0",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.purple,
        emptyBlocks: [[1, 1], [1, 3]],
        turnRowColumn: [1, 0],
    },
    {
        shape: "T1",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.purple,
        emptyBlocks: [[1, 1], [3, 1]],
        turnRowColumn: [-1, 1],
    },
    {
        shape: "T2",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.purple,
        emptyBlocks: [[2, 1], [2, 3]],
        turnRowColumn: [0, -1],
    },
    {
        shape: "T3",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.purple,
        emptyBlocks: [[1, 2], [3, 2]],
        turnRowColumn: [0, 0],
    },
]

const SHAPE_L = [
    {
        shape: "L0",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.orange,
        emptyBlocks: [[1, 1], [1, 2]],
        turnRowColumn: [1, 0],
    },
    {
        shape: "L1",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.orange,
        emptyBlocks: [[2, 1], [3, 1]],
        turnRowColumn: [-1, 1],
    },
    {
        shape: "L2",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.orange,
        emptyBlocks: [[2, 2], [2, 3]],
        turnRowColumn: [0, -1],
    },
    {
        shape: "L3",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.orange,
        emptyBlocks: [[1, 2], [2, 2]],
        turnRowColumn: [0, 0],
    },
]

const SHAPE_J = [
    {
        shape: "J0",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.darkBlue,
        emptyBlocks: [[1, 2], [1, 3]],
        turnRowColumn: [1, 0],
    },
    {
        shape: "J1",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.darkBlue,
        emptyBlocks: [[1, 1], [2, 1]],
        turnRowColumn: [-1, 1],
    },
    {
        shape: "J2",
        rowSpan: 2,
        colSpan: 3,
        color: BLOCK_COLORS.darkBlue,
        emptyBlocks: [[2, 1], [2, 2]],
        turnRowColumn: [0, -1],
    },
    {
        shape: "J3",
        rowSpan: 3,
        colSpan: 2,
        color: BLOCK_COLORS.darkBlue,
        emptyBlocks: [[2, 2], [3, 2]],
        turnRowColumn: [0, 0],
    },
]

const SHAPES = [SHAPE_O, SHAPE_S, SHAPE_Z, SHAPE_I, SHAPE_T, SHAPE_L, SHAPE_J];

//creating board in this file bc its above app.js in html
//by declaring ALL_BLOCKS with queryselector here i can use it in function
//definitions in app.js (otherwise items with .gridItem arent created yet when running querysel)

function createBoard() {
    GAMEBOARD.style = `grid: ${"1fr ".repeat(GAME_ROWS)} / ${"1fr ".repeat(GAME_COLUMNS)}`;
    for(let i = 1; i <= GAME_COLUMNS; i++) {
        for(let j = 1; j <= GAME_ROWS; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("gridItem");
            gridItem.style.gridColumnStart = i;
            gridItem.style.gridRowStart = j;
            GAMEBOARD.appendChild(gridItem);
        }
    }
}

function createDisplay(element, size) {
    element.style = `grid: ${"1fr ".repeat(size)} / ${"1fr ".repeat(size)}`;
    for(let i = 1; i <= size; i++) {
        for(let j = 1; j <= size; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("displayGridItem");
            gridItem.style.gridColumnStart = i;
            gridItem.style.gridRowStart = j;
            element.appendChild(gridItem);
        }
    }
}

const staticSound = new Audio(MAKE_STATIC_SOUND);