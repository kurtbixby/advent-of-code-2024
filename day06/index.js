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
    const sum = part1({startState, grid});
    console.log(sum);
}

function part1({startState, grid}) {
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
    }

    let state = startState;
    while(true) {
        console.log("State: " + state);
        console.log("X Count: " + xCount);
        switch (state.direction) {
            case "^":
                {
                    const obstacles = grid.obstacles.columnOrder[state.location.column];
                    let closest = obstacles === undefined ? -1 : obstacles.reduce((closest, o) => o > closest && o < state.location.row ? o : closest, -1);
                    if (closest === state.location.row) { // There are no more obstacles
                        closest = -1;
                    }
                    for (let i = state.location.row; i > closest; --i) {
                        addXPosition(i, state.location.column);
                    }
                    if (closest === -1) {
                        return xCount;
                    }
                    state.location.row = closest + 1;
                    state.direction = ">";
                    break;
                }
            case "v":
                {
                    const obstacles = grid.obstacles.columnOrder[state.location.column];
                    let closest = obstacles === undefined ? grid.dimensions.rows :  obstacles.reduce((closest, o) => o < closest && o > state.location.row ? o : closest, grid.dimensions.rows);
                    if (closest === state.location.row) { // There are no more obstacles
                        closest = grid.dimensions.rows;
                    }
                    for (let i = state.location.row; i < closest; ++i) {
                        addXPosition(i, state.location.column);
                    }
                    if (closest === grid.dimensions.rows) {
                        return xCount;
                    }
                    state.location.row = closest - 1;
                    state.direction = "<";
                    break;
                }
            case "<":
                {
                    const obstacles = grid.obstacles.rowOrder[state.location.row];
                    let closest = obstacles === undefined ? -1 : obstacles.reduce((closest, o) => o > closest && o < state.location.column ? o : closest, -1);
                    if (closest === state.location.column) { // There are no more obstacles
                        closest = -1;
                    }
                    for (let i = state.location.column; i > closest; --i) {
                        addXPosition(state.location.row, i);
                    }
                    if (closest === -1) {
                        return xCount;
                    }
                    state.location.column = closest + 1;
                    state.direction = "^";
                    break;
                }
            case ">":
                {
                    const obstacles = grid.obstacles.rowOrder[state.location.row];
                    let closest = obstacles === undefined ? grid.dimensions.columns : obstacles.reduce((closest, o) => o < closest && o > state.location.column ? o : closest, grid.dimensions.columns);
                    if (closest === state.location.column) { // There are no more obstacles
                        closest = grid.dimensions.columns;
                    }
                    for (let i = state.location.column; i < closest; ++i) {
                        addXPosition(state.location.row, i);
                    }
                    if (closest === grid.dimensions.columns) {
                        return xCount;
                    }
                    state.location.column = closest - 1;
                    state.direction = "v";
                    break;
                }
            
        }
    }
}

setup();