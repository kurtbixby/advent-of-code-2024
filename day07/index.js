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
    const result1 = calibrations.reduce((sum, cal) => sum + findPossibleCalibrationsRecursive(cal, ["+", "*"]), 0);
    console.log("Part 1: " + result1);
    const result2 = calibrations.reduce((sum, cal) => sum + findPossibleCalibrationsRecursive(cal, ["+", "*", "||"]), 0);
    console.log("Part 2: " + result2);
}

function findPossibleCalibrationsRecursive(calibration, ops) {
    const count = solveRecursive(calibration.total, calibration.nums[0], calibration.nums.slice(1), ops);
    return count > 0 ? calibration.total : 0;
}

function findPossibleCalibrations(calibration, ops) {
    const count = solveQueue(calibration.total, calibration.nums, ops);
    return count > 0 ? calibration.total : 0;
}

function solveRecursive(goal, sum, nums, ops) {
    if (nums.length === 0) {
        return goal === sum ? 1 : 0;
    }

    let count = 0;
    const num = nums[0];
    for (const op of ops) {
        if (op === "+") {
            count += solveRecursive(goal, sum + num, nums.slice(1), ops);
        } else if (op === "*") {
            count += solveRecursive(goal, sum * num, nums.slice(1), ops);
        } else if (op === "||") {
            count += solveRecursive(goal, parseInt(String(sum).concat(num)), nums.slice(1), ops);
        }
    }
    return count;
}

function solveQueue(goal, nums, ops) {
    let q = [];
    let count = 0;

    q.push({sum: 0, nums: nums});
    while (q.length !== 0) {
        let {sum, nums} = q.pop();
        if (nums.length === 0) {
            count += (goal === sum ? 1 : 0);
            continue;
        }
        const num = nums[0];
        for (const op of ops) {
            let opSum = 0;
            if (op === "+") {
                opSum = sum + num;
            } else if (op === "*") {
                opSum = sum * num;
            } else if (op === "||") {
                opSum = parseInt(String(sum).concat(num));
            }
            q.push({sum: opSum, nums: nums.slice(1)});
        }
    }

    return count;
}

setup();