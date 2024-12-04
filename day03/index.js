const assert = require("node:assert");
const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    let lines = [];
    rl.on("line", (input) => {
        lines.push(input);
    });

    rl.once("close", () => main({lines}));
}

function main({lines}) {
    const result = lines.map(l => calculateMuls(l)).reduce((acc, v) => acc + v, 0);
    console.log("Sum of muls: " + result);
}

function calculateMuls(line) {
    const matches = [...line.matchAll(/mul\((\d+),(\d+)\)/g)];
    let sum = 0;
    matches.forEach(m => {
        for (let i = 1; i < m.length - 1; i += 2) {
            sum += (m[i] * m[i+1]);
        }
    })
    return sum;
}

setup();