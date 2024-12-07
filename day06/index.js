// return number of Xs

const assert = require("node:assert");
const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    let startState = {location: {row: NaN, column: NaN}, direction: ""};
    let obstacles = {rowOrder: {}, columnOrder: {}};
    let gridDimensions = {rows: 0, columns: 0};
    let lineNum = 0;
    rl.on("line", (line) => {
        const cells = line.split("");
        gridDimensions.columns = cells.length;
        cells.forEach((c, idx) => {
            switch (c) {
                case "^":
                case ">":
                case "v":
                case "<":
                    startState.location.row = lineNum;
                    startState.location.column = idx;
                    startState.direction = c;
                    break;
                case "#":
                    if (!(lineNum in obstacles.rowOrder)) {
                        obstacles.rowOrder[lineNum] = [];
                    }
                    obstacles.rowOrder[lineNum].push(idx);

                    if (!(idx in obstacles.columnOrder)) {
                        obstacles.columnOrder[idx] = [];
                    }
                    obstacles.columnOrder[idx].push(lineNum);
                    // obstacles.columnOrder.push({column: lineNum, column: idx});
                    break;
            }
        });
        lineNum++;
        gridDimensions.rows++;
    });

    rl.once("close", () => main({startState, grid: {obstacles, dimensions: gridDimensions}}));
}

function main({startState, grid}) {
    const sum = part1({location: {...startState.location}, direction: startState.direction}, grid);
    console.log("X Count: " + sum);
    let start = Date.now();
    const locationCount = part2({location: {...startState.location}, direction: startState.direction}, grid);
    let bruteForceTime = (Date.now() - start) / 1000;
    console.log("Loop locations count: " + locationCount);
    console.log("Brute force time(s): " + bruteForceTime);
}

function part2(startState, grid) {
    let foundLoopCount = 0;
    for (let i = 0; i < grid.dimensions.rows; ++i) {
        let addedRow = false;
        if (!(i in grid.obstacles.rowOrder)) {
            grid.obstacles.rowOrder[i] = [];
            addedRow = true;
        }
        for (let j = 0; j < grid.dimensions.columns; ++j) {

            if (grid.obstacles.rowOrder[i].includes(j) || (i === startState.location.row && j === startState.location.column)) {
                continue;
            }

            // Add the obstacle to the row lookup
            grid.obstacles.rowOrder[i].push(j);

            let addedColumn = false;
            if (!(j in grid.obstacles.columnOrder)) {
                grid.obstacles.columnOrder[j] = [];
                addedColumn = true;
            }
            grid.obstacles.columnOrder[j].push(i);

            let visitedPositions = {};
            let stateCopy = {location: {row: startState.location.row, column: startState.location.column}, direction: startState.direction};
            let foundLoop = simulateWalk(stateCopy, grid, (row, col, dir) => {return !isLoopPosition(visitedPositions, row, col, dir)});
            if (foundLoop) {
                foundLoopCount++;
            }

            grid.obstacles.columnOrder[j].pop();

            if (addedColumn) {
                delete grid.obstacles.columnOrder[j];
            }

            grid.obstacles.rowOrder[i].pop();
        }
        if (addedRow) {
            delete grid.obstacles.rowOrder[i];
        }
    }

    return foundLoopCount;
}

function isLoopPosition(positions, row, col, dir) {
    if (!(row in positions)) {
        positions[row] = {};
    }
    if (!(col in positions[row])) {
        positions[row][col] = new Set();
    }

    if (positions[row][col].has(dir)) {
        return true;
    } else {
        positions[row][col].add(dir);
    }
    return false;
}

function part1(startState, grid) {
    let xCount = 0;
    let xPositions = {};
    
    function addXPosition(row, col) {
        if (!(row in xPositions)) {
            xPositions[row] = new Set();
        }
        if (!xPositions[row].has(col)) {
            xPositions[row].add(col);
            xCount++;
        }
        return true;
    }

    simulateWalk({...startState}, grid, addXPosition);

    return xCount;
}

function findClosestObstacle(obstacles, outOfRange, currentPosition, comparator) {
    let closest = obstacles === undefined ? outOfRange : obstacles.reduce((closest, o) => comparator(closest, o) && comparator(o, currentPosition) ? o : closest, outOfRange);
    if (closest === currentPosition) { // There are no more obstacles
        closest = outOfRange;
    }

    return closest;
}

function simulateWalk(state, grid, addFunction) {
    let shouldContinue = true;
    while(shouldContinue) {
        switch (state.direction) {
            case "^":
                {
                    const obstacles = grid.obstacles.columnOrder[state.location.column];
                    let closest = findClosestObstacle(obstacles, -1, state.location.row, (a, b) => a < b);
                    for (let i = state.location.row; i > closest; --i) {
                        shouldContinue = addFunction(i, state.location.column, state.direction);
                    }
                    if (closest === -1) {
                        return false;
                    }
                    state.location.row = closest + 1;
                    state.direction = ">";
                    break;
                }
            case "v":
                {
                    const obstacles = grid.obstacles.columnOrder[state.location.column];
                    let closest = findClosestObstacle(obstacles, grid.dimensions.rows, state.location.row, (a, b) => a > b);
                    for (let i = state.location.row; i < closest; ++i) {
                        shouldContinue = addFunction(i, state.location.column, state.direction);
                    }
                    if (closest === grid.dimensions.rows) {
                        return false;
                    }
                    state.location.row = closest - 1;
                    state.direction = "<";
                    break;
                }
            case "<":
                {
                    const obstacles = grid.obstacles.rowOrder[state.location.row];
                    let closest = findClosestObstacle(obstacles, -1, state.location.column, (a, b) => a < b);
                    for (let i = state.location.column; i > closest; --i) {
                        shouldContinue = addFunction(state.location.row, i, state.direction);
                    }
                    if (closest === -1) {
                        return false;
                    }
                    state.location.column = closest + 1;
                    state.direction = "^";
                    break;
                }
            case ">":
                {
                    const obstacles = grid.obstacles.rowOrder[state.location.row];
                    let closest = findClosestObstacle(obstacles, grid.dimensions.columns, state.location.column, (a, b) => a > b);
                    for (let i = state.location.column; i < closest; ++i) {
                        shouldContinue = addFunction(state.location.row, i, state.direction);
                    }
                    if (closest === grid.dimensions.columns) {
                        return false;
                    }
                    state.location.column = closest - 1;
                    state.direction = "v";
                    break;
                }
            
        }
    }
    return true;
}

setup();