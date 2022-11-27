//Functions to get block element/coordinates

function getGridRow(block) {
    return Number(getComputedStyle(block).gridRowStart);
}

function getGridColumn(block) {
    return Number(getComputedStyle(block).gridColumnStart);
}

function getBlockElement(row, col) {
    for(block of BOARD_BLOCKS){
        if(getGridRow(block) === row &&
        getGridColumn(block) === col){
            return block;
        }
    }
}

function getBlockColor(block) {
    for(color of Object.values(BLOCK_COLORS)){
        if(block.classList.contains(color)){
            return color;
        }
        
    }
}

//Function to create new piece

function getShape(shape) {
    for (item of SHAPES) {
        if(item = shape) {
            return item[0];
        }
    }
}

function checkEmptyBlock(row, column, currentShape) {
    if(currentShape.hasOwnProperty("emptyBlocks")) {
        for(item of currentShape.emptyBlocks) {
            if(item[0] === row && item[1] === column) {
                return true;
            }
            else {
                continue;
            }
        }
    }
    else {
        return false;
    }
}

function createShape(shape) {
    const currentShape = getShape(shape);
    const shapeElement = document.createElement("div");
    shapeElement.classList.add("currentShape");
    let colPlacement
    if(currentShape.colSpan < 3) {
        colPlacement = "5";
    }
    else {
        colPlacement = "4";
    }
    shapeElement.style = `grid: ${"1fr ".repeat(currentShape.rowSpan)} / ${"1fr ".repeat(currentShape.colSpan)};
        grid-area: 1/ ${colPlacement}/ span ${currentShape.rowSpan}/ span ${currentShape.colSpan}`;
    for(let i = 1; i <= (currentShape.colSpan); i++) {
        for(let j = 1; j <= currentShape.rowSpan; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("gridItem", `${currentShape.color}`);
            gridItem.style.gridColumnStart = i;
            gridItem.style.gridRowStart = j;
            if(checkEmptyBlock(j, i, currentShape)) {
                gridItem.classList.add("emptyBlock");
            }
            shapeElement.appendChild(gridItem);
        }
    }
    
    GAMEBOARD.appendChild(shapeElement);
}

//Function to get an array with blocks of board that are in the same position as the piece to turn into background blocks(used in makestatic)

function getBackgroundBlocks(currentShape) {
    let backgroundBlocks = [];
    for(block of currentShape.childNodes) {
        if(block.classList.contains("emptyBlock")) {
            continue;
        }
        const blockRow = Number(currentShape.style.gridRowStart) + (Number(block.style.gridRowStart) - 1);
        const blockColumn = Number(currentShape.style.gridColumnStart) + (Number(block.style.gridColumnStart) - 1);
        backgroundBlocks.push(getBlockElement(blockRow, blockColumn));
    }
    return backgroundBlocks;
}

function getSortedRows(blocks) {
    let rows = [];
    for(block of blocks) {
        rows.push(getGridRow(block));
    }
    rows.sort(function(a, b){return b - a});
    sortedRows = new Set(rows);
    return sortedRows;
}

//Functions for collision checks

function checkCollisionDown(block, currentShape) {
    if(block.classList.contains("emptyBlock")) {
        return false;
    }
    else {
        const blockRow = Number(currentShape.style.gridRowStart) + (Number(block.style.gridRowStart) - 1);
        const blockColumn = Number(currentShape.style.gridColumnStart) + (Number(block.style.gridColumnStart) - 1);
        if(blockRow === GAME_ROWS) {
            return true;
        }
        else {
            const lowerBlock = getBlockElement(blockRow + 1, blockColumn);
            return lowerBlock.classList.contains("staticBlock");
        }    
    }   
}

function checkAllCollisionDown(currentShape) {
    for(block of currentShape.childNodes) {
        if(!block.classList.contains("emptyBlock")) {
            if(checkCollisionDown(block, currentShape)) {
                return true;
            }
            else {
                continue;
            }
        }
    }
    return false;
}

function checkCollisionRight(block, currentShape) {
    if(block.classList.contains("emptyBlock")) {
        return false;
    }
    else {
        const blockRow = Number(currentShape.style.gridRowStart) + (Number(block.style.gridRowStart) - 1);
        const blockColumn = Number(currentShape.style.gridColumnStart) + (Number(block.style.gridColumnStart) - 1);
        if(blockColumn === GAME_COLUMNS) {
            return true;
        }
        else {
            const rightBlock = getBlockElement(blockRow, blockColumn + 1);
            return rightBlock.classList.contains("staticBlock");
        }    
    }
}

function checkAllCollisionRight(currentShape) {
    for(block of currentShape.childNodes) {
        if(!block.classList.contains("emptyBlock")) {
            if(checkCollisionRight(block, currentShape)) {
                return true;
            }
            else {
                continue;
            }
        }
    }
    return false;
}

function checkCollisionLeft(block, currentShape) {
    if(block.classList.contains("emptyBlock")) {
        return false;
    }
    else {
        const blockRow = Number(currentShape.style.gridRowStart) + (Number(block.style.gridRowStart) - 1);
        const blockColumn = Number(currentShape.style.gridColumnStart) + (Number(block.style.gridColumnStart) - 1);
        if(blockColumn === 1) {
            return true;
        }
        else {
            const rightBlock = getBlockElement(blockRow, blockColumn - 1);
            return rightBlock.classList.contains("staticBlock");
        }    
    }
}

function checkAllCollisionLeft(currentShape) {
    for(block of currentShape.childNodes) {
        if(!block.classList.contains("emptyBlock")) {
            if(checkCollisionLeft(block, currentShape)) {
                return true;
            }
            else {
                continue;
            }
        }
    }
    return false;
}

//function to turn current piece into static background blocks

function makeStatic(currentShape) {
    const backgroundBlocks = getBackgroundBlocks(currentShape);
    let blockColor = getBlockColor(currentShape.childNodes[0]);
    for(x of backgroundBlocks) {
        x.classList.add("staticBlock", blockColor);
    }
    currentShape.remove();
    createShape(SHAPE_S);
}

//Function to check if the piece is in the top center of the board (used after piece is placed)

function checkLoseCondition(currentShape) {
    let lowestColumn;
    let highestColumn;
    switch(currentShape.style.gridColumnEnd) {
        case "span 2":
            lowestColumn = 4;
            highestColumn = 6;
            break;
    }
    if(Number(currentShape.style.gridRowStart) <= 1 &&
    Number(currentShape.style.gridColumnStart) <= highestColumn &&
    Number(currentShape.style.gridColumnStart) >= lowestColumn) {
        alert("YOU LOST");
    }
}

//Functions to remove an entire row and check if a row is full of static blocks TODO: add function to realign remaining rows

function removeRow(number) {
    for(let i = 1; i <= GAME_COLUMNS; i++) {
        const currentBlock = getBlockElement(number, i);
        currentBlock.classList.remove(getBlockColor(currentBlock));
        currentBlock.classList.remove("staticBlock");
    }
}

function moveStaticBlockDown(block) {
    const lowerBlock = getBlockElement(getGridRow(block) + 1, getGridColumn(block));
    const blockColor = getBlockColor(block);
    block.classList.remove("staticBlock", blockColor);
    lowerBlock.classList.add("staticBlock", blockColor);
}

function moveRowDown(row) {
    for(let j = 1; j <= GAME_COLUMNS; j++) {
        const currentBlock = getBlockElement(row, j);
        if(currentBlock.classList.contains("staticBlock")) {
            moveStaticBlockDown(currentBlock);
        }
    }
}

function realignRows(lowestRow) {
    for(let i = lowestRow; i >= 1; i--) {
        moveRowDown(i);
    }
}

function checkRows() {
    for(let i = GAME_ROWS; i >= 1; i--) {
        let isRowFull = true;
        for(let j = 1; j <= GAME_COLUMNS; j++) {
            const checkedBlock = getBlockElement(i, j);
            if(checkedBlock.classList.contains("staticBlock")) {
                continue;
            }
            else {
                isRowFull = false;
            }
        }
        if(isRowFull) {
            removeRow(i);
            realignRows(i - 1);
            checkRows();
        }
        else {
            continue;
        }
    }
}

//Functions for movement and input event listener

function moveDown(currentShape) {
    if(checkAllCollisionDown(currentShape)) {
        checkLoseCondition(currentShape);
        makeStatic(currentShape);
        checkRows();
    }
    else {
        currentShape.style.gridRowStart++;
    }
}

function addControls(){
    document.addEventListener("keydown", function() {
        const currentShape = document.querySelector(".currentShape");
    switch(event.key) {
        case "d":  
        case "ArrowRight":
            if(!checkAllCollisionRight(currentShape)) {
            currentShape.style.gridColumnStart++;
            }
            break;
        case "s":
        case "ArrowDown":
            moveDown(currentShape);
            break;
        case "a":
        case "ArrowLeft":
            if(!checkAllCollisionLeft(currentShape)) {
            currentShape.style.gridColumnStart--;
            }
            break;
    }
})
};

//Update function which moves piece down and main function

function update() {
    const shape = document.querySelector(".currentShape");
    moveDown(shape);
}

const mainInterval = setInterval(update, 1000);
function main() {
    console.log(SHAPES[1][0].emptyBlocks[0][0]);
    createShape(SHAPE_S);
    addControls();
}
main();