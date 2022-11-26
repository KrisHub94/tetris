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
            shapeElement.appendChild(gridItem);
        }
    }
    
    GAMEBOARD.appendChild(shapeElement);
}

function getBackgroundBlocks(currentShape) {
    let backgroundBlocks = [];
    for(block of currentShape.childNodes) {
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

function makeStatic(currentShape) {
    const backgroundBlocks = getBackgroundBlocks(currentShape);
    let blockColor;
    for(color of Object.values(BLOCK_COLORS)) {
        if(currentShape.childNodes[0].classList.contains(color)) {
            console.log(color);
            blockColor = color;
        }
    }
    for(x of backgroundBlocks) {
        x.classList.add("staticBlock", blockColor);
    }
    currentShape.remove();
    createShape("O");
}

function moveDown(currentShape) {
    if(checkAllCollisionDown(currentShape)) {
        makeStatic(currentShape);
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

function update() {
    const shape = document.querySelector(".currentShape");
    moveDown(shape);
}

const mainInterval = setInterval(update, 1000);
function main() {
    createShape("O");
    addControls();
}
main();