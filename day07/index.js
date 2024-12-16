const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    let calibrations = [];

    rl.on("line", (line) => {
        let [total, rest] = line.split(":");
        let nums = rest.split(" ");
        const calibration = {total: parseInt(total), nums: nums.slice(1).map(n => parseInt(n))};
        calibrations.push(calibration);
    });

    rl.once("close", () => main(calibrations));
}

function main(calibrations) {
    const result = calibrations.reduce((sum, cal) => sum + findPossibleCalibrations(cal), 0);
    console.log(result);
}

function findPossibleCalibrations(calibration) {
    // console.log(calibration);
    const count = solveRecursive(calibration.total, calibration.nums[0], calibration.nums.slice(1), ["+", "*"]);
    // console.log(count);
    return count > 0 ? calibration.total : 0;
}

function solveRecursive(goal, sum, nums, ops) {
    // console.log("~~ RECURSIVE ~~")
    // console.log("Sum: " + sum);
    // console.log("Nums: " + nums);
    if (nums.length === 0) {
        return goal === sum ? 1 : 0;
    }

    let count = 0;
    const num = nums[0];
    for (const op of ops) {
        let opSum = sum;
        if (op === "+") {
            opSum += num;
        } else if (op === "*") {
            opSum *= num;
        }
        count += solveRecursive(goal, opSum, nums.slice(1), ops);
    }
    return count;
}

setup();