function getGridRow(block) {
    return Number(getComputedStyle(block).gridRowStart);
}

function getGridColumn(block) {
    return Number(getComputedStyle(block).gridColumnStart);
}

function getBlockElement(row, col) {
    for(block of ALL_BLOCKS){
        if(getGridRow(block) === row &&
        getGridColumn(block) === col){
            return block;
        }
    }
}

function changeBlock(block, color) {
    block.classList.add(color);
}

function getBlockColor(block) {
    for(color of Object.values(BLOCK_COLORS)){
        if(block.classList.contains(color)){
            return color;
        }
        
    }
}

function createShape(shape) {
    const currentShape = SHAPES.find(x => x.shape === shape);
    const shapeBlocks = [getBlockElement(currentShape.firstBlock[0], currentShape.firstBlock[1]), 
        getBlockElement(currentShape.secondBlock[0], currentShape.secondBlock[1]), 
        getBlockElement(currentShape.thirdBlock[0], currentShape.thirdBlock[1]),
        getBlockElement(currentShape.fourthBlock[0], currentShape.fourthBlock[1])];
    for(block of shapeBlocks){
        changeBlock(block, currentShape.color);
        block.classList.add("controlledBlock");
    }
}

function getControlledBlocks() {
    let controlledBlocks = [];
    for(block of ALL_BLOCKS) {
        if(block.classList.contains("controlledBlock")) {
            controlledBlocks.push(block);
        }
    }
    return controlledBlocks;
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

function getSortedColumnsRight(blocks) {
    let cols = [];
    for(block of blocks) {
        cols.push(getGridColumn(block));
    }
    cols.sort(function(a, b){return b - a});
    sortedCols = new Set(cols);
    return sortedCols;
}

function getSortedColumnsLeft(blocks) {
    let cols = [];
    for(block of blocks) {
        cols.push(getGridColumn(block));
    }
    cols.sort(function(a, b){return a - b});
    sortedCols = new Set(cols);
    return sortedCols;
}

function moveBlockDown(block) {
    const currentColor = getBlockColor(block);
    block.classList.remove(currentColor);
    block.classList.remove("controlledBlock");
    block = getBlockElement(getGridRow(block) + 1, getGridColumn(block));
    changeBlock(block, currentColor);
    block.classList.add("controlledBlock");
}

function moveControlledBlocksDown() {
    const controlledBlocks = getControlledBlocks();
    const sortedRows = getSortedRows(controlledBlocks);
    for(row of sortedRows) {
        for(let i = 1; i <= GAME_COLUMNS; i++) {
            let checkedBlock = getBlockElement(row, i);
            if(checkedBlock.classList.contains("controlledBlock")){
                moveBlockDown(checkedBlock);
            }
        }
    }
}

function moveBlockRight(block) {
    const currentColor = getBlockColor(block);
    block.classList.remove(currentColor);
    block.classList.remove("controlledBlock");
    block = getBlockElement(getGridRow(block), getGridColumn(block) + 1);
    changeBlock(block, currentColor);
    block.classList.add("controlledBlock");
}

function moveControlledBlocksRight() {
    const controlledBlocks = getControlledBlocks();
    const sortedCols = getSortedColumnsRight(controlledBlocks);
    for(col of sortedCols) {
        for(let i = 1; i <= GAME_COLUMNS; i++) {
            let checkedBlock = getBlockElement(i, col);
            if(checkedBlock.classList.contains("controlledBlock")){
                moveBlockRight(checkedBlock);
            }
        }
    }
}

function moveBlockLeft(block) {
    const currentColor = getBlockColor(block);
    block.classList.remove(currentColor);
    block.classList.remove("controlledBlock");
    block = getBlockElement(getGridRow(block), getGridColumn(block) - 1);
    changeBlock(block, currentColor);
    block.classList.add("controlledBlock");
}

function moveControlledBlocksLeft() {
    const controlledBlocks = getControlledBlocks();
    const sortedCols = getSortedColumnsLeft(controlledBlocks);
    for(col of sortedCols) {
        for(let i = 1; i <= GAME_COLUMNS; i++) {
            let checkedBlock = getBlockElement(i, col);
            if(checkedBlock.classList.contains("controlledBlock")){
                moveBlockLeft(checkedBlock);
            }
        }
    }
}

function checkCollisionDown(block) {
    if(getGridRow(block) === GAME_ROWS) {
        return true;
    }
    else {
        const lowerBlock = getBlockElement(getGridRow(block) + 1, getGridColumn(block));
        if(lowerBlock.classList.contains("staticBlock")) {
            return true;
        }
        else {
            return false;
        }
    }
}

function checkAllCollisionDown() {
    const controlledBlocks = getControlledBlocks();
    for(block of controlledBlocks) {
        if(checkCollisionDown(block)) {
            return true;
        }
        else {continue};
    }
    return false;
}

function checkCollisionRight(block) {
    if(getGridColumn(block) === GAME_COLUMNS) {
        return true;
    }
    else {
        const rightBlock = getBlockElement(getGridRow(block), getGridColumn(block) + 1);
        if(rightBlock.classList.contains("staticBlock")) {
            return true;
        }
        else {
            return false;
        }
    }
}

function checkAllCollisionRight() {
    const controlledBlocks = getControlledBlocks();
    for(block of controlledBlocks) {
        if(checkCollisionRight(block)) {
           return true; 
        }
        else {continue};
    }
    return false;
}

function checkCollisionLeft(block) {
    if(getGridColumn(block) === 1) {
        return true;
    }
    else {
        const leftBlock = getBlockElement(getGridRow(block), getGridColumn(block) - 1);
        if(leftBlock.classList.contains("staticBlock")) {
            return true;
        }
        else {
            return false;
        }
    }
}

function checkAllCollisionLeft() {
    const controlledBlocks = getControlledBlocks();
    for(block of controlledBlocks) {
        if(checkCollisionLeft(block)) {
           return true; 
        }
        else {continue};
    }
    return false;
}

function makeStatic() {
    const controlledBlocks = getControlledBlocks();
    for(x of controlledBlocks) {
        x.classList.add("staticBlock");
        x.classList.remove("controlledBlock");
    }
    createShape("O");
}

document.addEventListener("keypress", function(e) {
    if(e.repeat) return;
    switch(event.key) {
        case "d":  
        case "ArrowRight":
            if(!checkAllCollisionRight()){
            moveControlledBlocksRight();
            }
            break;
        case "s":
        case "ArrowDown":
            
            if(checkAllCollisionDown()) {
                makeStatic();
            }
            else {
                moveControlledBlocksDown();
            }
            break;
        case "a":
        case "ArrowLeft":
            if(!checkAllCollisionLeft()){
            moveControlledBlocksLeft();
            }
            break;
    }
})

function update() {
    if(checkAllCollisionDown()) {
        makeStatic();
    }
    else {
        moveControlledBlocksDown();
    }
}

const mainInterval = setInterval(update, 1000);
function main() {
    createShape("O");
}
main();