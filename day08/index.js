const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    
    let antennas = new Map();
    let width = 0;
    let lineNum = 0;
    rl.on("line", (line) => {
        let chars = line.split("");
        width = chars.length;
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            if (char === ".") {
                continue;
            }

            if (!antennas.has(char)) {
                antennas.set(char, []);
            }
            antennas.get(char).push({row: lineNum, col: i});
        }
        lineNum++;
    });

    rl.once("close", () => main(antennas, {rows: lineNum, cols: width}));
}

function main(antennas, dims) {
    const antinodes = new Set();
    antennas.forEach((frequency, key, map) => findAntinodes(frequency, dims, antinodes));
    const count = antinodes.size;
    console.log("Unique Antinodes: " + count);
}

function findAntinodes(antennas, dims, antinodes) {
    for (let i = 0; i < antennas.length; i++) {
        const baseLocation = antennas[i];
        for (let j = i + 1; j < antennas.length; j++) {
            const location = antennas[j];
            const rowDiff = location.row - baseLocation.row;
            const colDiff = location.col - baseLocation.col;

            const [behindRow, behindCol] = [baseLocation.row - rowDiff, baseLocation.col - colDiff];
            if ((behindRow >= 0 && behindRow < dims.rows) && (behindCol >= 0 && behindCol < dims.cols)) {
                antinodes.add(`${behindRow}:${behindCol}`);
            }
            const [afterRow, afterCol] = [location.row + rowDiff, location.col + colDiff];
            if ((afterRow >= 0 && afterRow < dims.rows) && (afterCol >= 0 && afterCol < dims.cols)) {
                antinodes.add(`${afterRow}:${afterCol}`);
            }
        }
    }
}

setup();

// [a-zA-Z0-9]
// make list of antennas for each frequency
// n^2 comparison check for antinodes
    // get vector
    // check behind and after
    // add each antinode to list
// create list of antinode locations