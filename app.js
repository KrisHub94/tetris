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

function getFirstShape(shape) {
    for (item of SHAPES) {
        if(item = shape) {
            return item[0];
        }
    }
}

//Function to check if a block needs to be empty upon creation

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

function compareWithEmptyBlocks(row, column, currentShape) {
    for(item of currentShape.emptyBlocks) {
        if(item[0] === row && item[1] === column) {
            return true;
        }
        else {
            continue;
        }
    }
    return false;
}

//Function to check if there are static blocks in the places where new piece would spawn

function checkLoseCondition(currentShape, colPlacement) {
    const rowEnd = currentShape.rowSpan;
    const colStart = colPlacement;
    const colEnd = colStart + (currentShape.colSpan - 1);
    let checkedBlocks = []
    const modifier = colPlacement - 1;
    for(let i = 1; i <= rowEnd; i++) {
        for(let j = colPlacement; j <= colEnd; j++) {
            if(compareWithEmptyBlocks(i, j - modifier, currentShape)) {
                continue;
            }
            else {
                const block = getBlockElement(i, j);
                checkedBlocks.push(block);
            }
        }
    }
    for(block of checkedBlocks) {
        if(block.classList.contains("staticBlock")) {
            alert("YOU LOSE");
        }
        else {
            continue;
        }
    }
}

function createShape(currentShape) {
    const shapeElement = document.createElement("div");
    shapeElement.classList.add(currentShape.shape);
    shapeElement.classList.add("currentShape");
    let colPlacement;
    if(currentShape.colSpan < 3) {
        colPlacement = "5";
    }
    else {
        colPlacement = "4";
    }
    checkLoseCondition(currentShape, Number(colPlacement));
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

function spawnRandomShape() {
    const randomNumber = Math.floor(Math.random() * 3);
    createShape(SHAPES[randomNumber][0]);
}

function getNextShape(currentShape) {
    switch (currentShape.classList[0]) {
        case "S0": return SHAPE_S[1];
        case "S1": return SHAPE_S[2];
        case "S2": return SHAPE_S[3];
        case "S3": return SHAPE_S[0];
        case "Z0": return SHAPE_Z[1];
        case "Z1": return SHAPE_Z[2];
        case "Z2": return SHAPE_Z[3];
        case "Z3": return SHAPE_Z[0];
    }
}

function checkTurnCollision(shape, row, column) {
    const endRow = row + (shape.rowSpan - 1);
    const endColumn = column + (shape.colSpan - 1);
    const rowModifier = row - 1;
    const colModifier = column - 1;
    let checkedBlocks = [];
    for(let i = row; i <= endRow; i++) {
        for(let j = column; j <= endColumn; j++) {
            if(compareWithEmptyBlocks(i - rowModifier, j - colModifier, shape)) {
                continue;
            }
            else {
                const block = getBlockElement(i, j);
                checkedBlocks.push(block);
            }
        }
    }
    for(block of checkedBlocks) {
        if(block.classList.contains("staticBlock")) {
            return true;
        }
        else {
            continue;
        }
    }
    return false;
}

function turnShape(shape) {
    if(shape.classList.contains("O")) {
        return;
    }
    const nextShape = getNextShape(shape);
    const currentRow = Number(shape.style.gridRowStart);
    const currentColumn = Number(shape.style.gridColumnStart);
    let nextRow;
    if(currentRow === 1) {
        nextRow = 1;
    }
    else {
        nextRow = currentRow + nextShape.turnRowColumn[0];
    }
    let nextColumn;
    if(currentColumn === 1) {
        nextColumn = 1;
    }
    
    else if((currentColumn + nextShape.turnRowColumn[1] + (nextShape.colSpan - 1)) > GAME_COLUMNS) {
        nextColumn = (GAME_COLUMNS - nextShape.colSpan) + 1;
    }
    else {
        nextColumn = currentColumn + nextShape.turnRowColumn[1];
    }
    let turnIndex = Number(shape.classList[0][1] + 1);
    if(checkTurnCollision(nextShape, nextRow, nextColumn)) {
        return;
    }
    else {
        shape.remove();
        createShape(nextShape);
        const currentShape = document.querySelector(".currentShape");
        currentShape.style.gridRowStart = nextRow;
        currentShape.style.gridColumnStart = nextColumn;
    }
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

//function to turn current piece into static background blocks

function makeStatic(currentShape) {
    const backgroundBlocks = getBackgroundBlocks(currentShape);
    let blockColor = getBlockColor(currentShape.childNodes[0]);
    for(x of backgroundBlocks) {
        x.classList.add("staticBlock", blockColor);
    }
    currentShape.remove();
    spawnRandomShape();
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
        case " ": turnShape(currentShape);
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
    createShape(SHAPE_Z[0]);
    addControls();
}
main();