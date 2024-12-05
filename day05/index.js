const assert = require("node:assert");
const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    let rules = {};
    let updates = [];

    let stage = 1
    rl.on("line", (line) => {
        if (line === "") {
            // switch mode
            stage = 2;
        } else {
            if (stage === 1) {
                let [page, restriction] = line.split("|");
                if (!(page in rules)) {
                    rules[page] = {[restriction]: true};
                } else {
                    rules[page][restriction] = true;
                }
            } else if (stage === 2) {
                updates.push(line.split(","));
            }
        }
    });

    rl.once("close", () => main({rules, updates}));
}

function main({rules, updates}) {
    const sum = part1(updates, rules);
    console.log("Safe reports middle sum: ", sum);
    const reordered_sum = part2(updates, rules);
    console.log("Reordered unsafe reports middle sum: ", reordered_sum);
}

function part1(updates, rules) {
    return updates.filter(update => isPrintSafe(update, rules)).reduce((acc, update) => acc + parseInt(update[Math.floor(update.length / 2)]), 0);
}

function part2(updates, rules) {
    const unsafeUpdates = updates.filter(update => !isPrintSafe(update, rules));
    const customSort = createSpecialSort(rules);
    return unsafeUpdates.reduce((acc, u) => acc + parseInt(u.sort(customSort)[Math.floor(u.length / 2)]), 0);
}

function createSpecialSort(rules) {
    return (a, b) => {
        const restrictions = rules[a];
        if (b in restrictions) {
            return -1;
        } else if (a === b) {
            return 0;
        } else {
            return 1;
        }
    }
}

function isPrintSafe(update, rules) {
    // console.log(rules);
    let printedPages = {};
    for (let i = 0; i < update.length; i++) {
        let page = update[i];
        let restrictions = rules[page];
        if (Object.keys(restrictions).map(restriction => restriction in printedPages).some(val => val)) {
            return false;
        }
        printedPages[page] = true;
    }

    return true;;
}
// return parseInt(update[Math.floor(update.length / 2)]);

// function part2()

setup();