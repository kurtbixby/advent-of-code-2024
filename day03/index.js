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
    const enabledResult = lines.reduce((acc, v) => calculateEnabledMuls(v, acc), {sum: 0, isEnabled: true});
    console.log("Sum of enabled muls: " + enabledResult.sum);
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

function calculateEnabledMuls(line, state) {
    let {sum, isEnabled} = state;
    const matches = [...line.matchAll(/(do)\(\)|(don't)\(\)|(mul)\((\d+),(\d+)\)/g)];
    matches.forEach(m => {
        if (m[1] !== undefined) {
            isEnabled = true;
        } else if (m[2] !== undefined) {
            isEnabled = false;
        } else if (m[3] !== undefined) {
            if (isEnabled) {
                sum += (m[4] * m[5]);
            }
        }
    })
    return {sum: sum, isEnabled: isEnabled};
}

setup();