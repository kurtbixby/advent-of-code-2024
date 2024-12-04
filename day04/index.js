const assert = require("node:assert");
const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    let grid = [];
    rl.on("line", (input) => {
        grid.push(input.toUpperCase().split(""));
    });

    rl.once("close", () => main({grid}));
}

function main({grid}) {
    const count = part1(grid);
    console.log(count);
    const crossCount = part2(grid);
    console.log(crossCount);
}

function part1(letterGrid) {
    let xmasCount = 0;
    for (let i = 0; i < letterGrid.length; i++) {
        for (let j = 0; j < letterGrid.length; j++) {
            if (letterGrid[i][j] !== "X") {
                continue;
            }
            xmasCount += findXmas(letterGrid, {row: i, column: j});
        }
    }

    return xmasCount;
}

function findXmas(letterGrid, startLocation) {
    let xmasCount = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            if (checkXmasInDir(letterGrid, startLocation, {vDir: i, hDir: j})) {
                xmasCount++;
            }
        }
    }

    return xmasCount;
}

function checkXmasInDir(letterGrid, {row, column}, {vDir, hDir}) {
    const search = ["X", "M", "A", "S"];
    for (let i = 0; i < search.length; i++) {
        if (row + (i*vDir) >= letterGrid.length || row + (i*vDir) < 0 || column + (i*hDir) >= letterGrid[0].length || column + (i*hDir) < 0) {
            return false;
        }
        if (letterGrid[row + (i*vDir)][column + (i*hDir)] !== search[i]) {
            return false;
        }
    }

    return true;
}

function part2(letterGrid) {
    let count = 0;
    for (let i = 0; i < letterGrid.length; i++) {
        for (let j = 0; j < letterGrid.length; j++) {
            if (letterGrid[i][j] !== "A") {
                continue;
            }
            if (findCrossMas(letterGrid, {row: i, column: j})) {
                count++;
            }
        }
    }

    return count;
}

function findCrossMas(letterGrid, {row, column}) {
    if (row + 1 >= letterGrid.length || row - 1 < 0 || column + 1 >= letterGrid[0].length || column - 1 < 0) {
        return false;
    }
    //check TLBR
    const tl = letterGrid[row-1][column-1];
    const br = letterGrid[row+1][column+1];
    const tlbr = (tl === "M" && br === "S") || (tl === "S" && br === "M");

    //check TRBL
    const tr = letterGrid[row-1][column+1];
    const bl = letterGrid[row+1][column-1];
    const trbl = (tr === "M" && bl === "S") || (tr === "S" && bl === "M");

    return tlbr && trbl;
}

setup();