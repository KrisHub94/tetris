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

function getFirstShape(letter) {
    switch (letter) {
        case "S": return SHAPE_S[0];
            break;
        case "Z": return SHAPE_Z[0];
            break;
        case "I": return SHAPE_I[0];
            break;
        case "T": return SHAPE_T[0];
            break;
        case "L": return SHAPE_L[0];
            break;
        case "J": return SHAPE_J[0];
            break;
        case "O": return SHAPE_O[0];
            break;
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

function playGameOverSound() {
    const sound = new Audio(GAME_OVER_SOUND);
    sound.play();
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
           return true;
        }
        else {
            continue;
        }
    }
}

function restartGame() {
    if(event.key === "Enter") {
        LOSE_SCREEN.style.visibility = "hidden";
        for(let j = 1; j <= GAME_ROWS; j++) {
            for(let i = 1; i <= GAME_COLUMNS; i++) {
                const currentBlock = getBlockElement(j, i);
                currentBlock.classList.remove(getBlockColor(currentBlock));
                currentBlock.classList.remove("staticBlock");
            }
        }
        currentQueue = getRandomQueue();
        nextQueue = getRandomQueue();
        score = 0;
        linesCleared = 0;
        level = 1;
        levelUpLines = 5;
        LEVEL_DISPLAY.innerText = `LEVEL 1`;
        document.querySelector(".displayedStoredPiece").remove();
        updateStats();
        main();
        window.removeEventListener("keydown", restartGame);
    }
}

function endGame() {
    document.removeEventListener("keydown", checkInputs);
    playGameOverSound();
    clearInterval(mainInterval);
    LOSE_SCREEN.style.visibility = "visible";
    window.addEventListener("keydown", restartGame);
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
    if(checkLoseCondition(currentShape, Number(colPlacement))) {
        endGame();
        return;
    };
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

function getRandomQueue() {
    let length = SHAPES.length;
    let indices = [];
    for(let i = 0; i < length; i++)  {
        indices.push(i);
    }
    const shuffledIndices = indices.sort(function () {
        return Math.random() - 0.5;
    })  
    return shuffledIndices;
}

function spawnRandomShape() {
    const randomNumber = Math.floor(Math.random() * SHAPES.length);
    createShape(SHAPES[randomNumber][0]);
}

function displayNextPiece() {
    if(document.querySelector(".displayedNextPiece")) {
        document.querySelector(".displayedNextPiece").remove();
    }
    const nextShape = SHAPES[currentQueue[0]][0];
    const nextPiece = document.createElement("div");
    let rowPlacement = 5 - nextShape.rowSpan, colPlacement
    if(nextShape.colSpan > 2) {
        colPlacement = 2;
    }
    else {
        colPlacement = 3;
    }
    nextPiece.classList.add("displayedNextPiece");
    nextPiece.style = `grid: ${"1fr ".repeat(nextShape.rowSpan)} / ${"1fr ".repeat(nextShape.colSpan)};
    grid-area: ${rowPlacement}/ ${colPlacement}/ span ${nextShape.rowSpan}/ span ${nextShape.colSpan}`;
    for(let i = 1; i <= (nextShape.colSpan); i++) {
        for(let j = 1; j <= nextShape.rowSpan; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("displayGridItem", `${nextShape.color}`);
            gridItem.style.gridColumnStart = i;
            gridItem.style.gridRowStart = j;
            if(checkEmptyBlock(j, i, nextShape)) {
                gridItem.classList.add("emptyBlock");
            }
            nextPiece.appendChild(gridItem);
        }
    }
    NEXT_PIECE_DISPLAY.appendChild(nextPiece);
}

function spawnNextShape() {
    createShape(SHAPES[currentQueue[0]][0]);
    currentQueue.splice(0, 1);
    if(currentQueue.length === 0) {
        currentQueue = nextQueue;
        nextQueue = getRandomQueue();
    }
    displayNextPiece();
}

function getNextShape(currentShape) {
    const letter = currentShape.classList[0][0];
    const nextNumber = (Number(currentShape.classList[0][1]) + 1) % 4;
    switch (letter) {
        case "S": return SHAPE_S[nextNumber];
            break;
        case "Z": return SHAPE_Z[nextNumber];
            break;
        case "I": return SHAPE_I[nextNumber];
            break;
        case "T": return SHAPE_T[nextNumber];
            break;
        case "L": return SHAPE_L[nextNumber];
            break;
        case "J": return SHAPE_J[nextNumber];
            break;
    }
    
}

function putInStored(shape) {
    const storedPiece = document.createElement("div");
    let rowPlacement = 5 - shape.rowSpan, colPlacement
    if(shape.colSpan > 2) {
        colPlacement = 2;
    }
    else {
        colPlacement = 3;
    }
    storedPiece.classList.add(shape.shape);
    storedPiece.classList.add("displayedStoredPiece");
    storedPiece.style = `grid: ${"1fr ".repeat(shape.rowSpan)} / ${"1fr ".repeat(shape.colSpan)};
    grid-area: ${rowPlacement}/ ${colPlacement}/ span ${shape.rowSpan}/ span ${shape.colSpan}`;
    for(let i = 1; i <= (shape.colSpan); i++) {
        for(let j = 1; j <= shape.rowSpan; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("displayGridItem", `${shape.color}`);
            gridItem.style.gridColumnStart = i;
            gridItem.style.gridRowStart = j;
            if(checkEmptyBlock(j, i, shape)) {
                gridItem.classList.add("emptyBlock");
            }
            storedPiece.appendChild(gridItem);
        }
    }
    STORED_PIECE_DISPLAY.appendChild(storedPiece);
}

function appendStored() {
    const displayedPiece = document.querySelector(".displayedStoredPiece");
    displayedPiece.style.gridRowStart = 1;
    if(displayedPiece.style.gridColumnEnd === "span 2") {
        displayedPiece.style.gridColumnStart = 5;
    }
    else {
        displayedPiece.style.gridColumnStart = 4;
    }
    for(block of displayedPiece.childNodes) {
        block.classList.remove("displayGridItem");
        block.classList.add("gridItem");
    }
    GAMEBOARD.appendChild(STORED_PIECE_DISPLAY.removeChild(displayedPiece));
    displayedPiece.classList.remove("displayedStoredPiece");
    displayedPiece.classList.add("currentShape");
}

function storePiece(currentShape) {
    if(hasUsedStore) {
        return;
    }
    const shapeLetter = currentShape.classList[0][0];
    const storedShape = getFirstShape(shapeLetter);
    currentShape.remove();
    if(document.querySelector(".displayedStoredPiece")) {
        appendStored();
        putInStored(storedShape);
    }
    else {
        putInStored(storedShape);
        spawnNextShape();
    }
    hasUsedStore = true;
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

function playTurnSound() {
    const turnSound = new Audio(TURN_SOUND);
    turnSound.play();
}

function turnShape(shape) {
    if(shape.classList.contains("O")) {
        playTurnSound();
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
    if(checkTurnCollision(nextShape, nextRow, nextColumn)) {
        return;
    }
    else {
        shape.remove();
        createShape(nextShape);
        const currentShape = document.querySelector(".currentShape");
        currentShape.style.gridRowStart = nextRow;
        currentShape.style.gridColumnStart = nextColumn;
        playTurnSound();
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

function playStaticSound() {
    const sound = new Audio(MAKE_STATIC_SOUND);
    sound.play();
}

//function to turn current piece into static background blocks

function makeStatic(currentShape) {
    const backgroundBlocks = getBackgroundBlocks(currentShape);
    let blockColor = getBlockColor(currentShape.childNodes[0]);
    for(x of backgroundBlocks) {
        x.classList.add("staticBlock", blockColor);
    }
    playStaticSound();
    currentShape.remove();
    hasUsedStore = false;
    spawnNextShape();
}

function playRowClear() {
    const sound = new Audio(ROW_CLEAR_SOUND);
    sound.play();
}

//Functions to remove an entire row and check if a row is full of static blocks TODO: add function to realign remaining rows

function removeRow(number) {
    for(let i = 1; i <= GAME_COLUMNS; i++) {
        const currentBlock = getBlockElement(number, i);
        currentBlock.classList.remove(getBlockColor(currentBlock));
        currentBlock.classList.remove("staticBlock");
    }
    playRowClear();
    linesCleared++;
    clearCount++;
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

function updateStats() {
    let addedScore = 50*clearCount*level;
    score += addedScore;
    clearCount = 0;
    SCORE_DISPLAY.innerText = score;
    LINES_CLEAR_DISPLAY.innerText = linesCleared;
    if(linesCleared >= levelUpLines) {
        level++
        LEVEL_DISPLAY.innerText = `LEVEL ${level}`;
        levelUpLines += 10;
        clearInterval(mainInterval);
        mainInterval = setInterval(update, 1000/(level - 0.5));
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
    if(clearCount > 0) {
        updateStats();
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

function checkInputs() {
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
    case "q": storePiece(currentShape);
        break;
}
}

function addControls(){
    document.addEventListener("keydown", checkInputs);
}

//Update function which moves piece down and main function

function update() {
    const shape = document.querySelector(".currentShape");
    moveDown(shape);
}

let currentQueue = getRandomQueue();
let nextQueue = getRandomQueue();
let hasUsedStore = false;
let score = 0;
let linesCleared = 0;
let clearCount = 0;
let level = 1;
let levelUpLines = 5;
let mainInterval;
function main() {
    window.removeEventListener("keydown", startGame);
    mainInterval = setInterval(update, 1000);
    spawnNextShape();
    addControls();
}

function startGame() {
    if(event.key === "Enter") {
        START_SCREEN.remove();
        main();
    }
}
window.addEventListener("keydown", startGame);
