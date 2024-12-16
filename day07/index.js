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
    const result1 = calibrations.reduce((sum, cal) => sum + findPossibleCalibrations(cal, ["+", "*"]), 0);
    console.log("Part 1: " + result1);
    const result2 = calibrations.reduce((sum, cal) => sum + findPossibleCalibrations(cal, ["+", "*", "||"]), 0);
    console.log("Part 2: " + result2);
}

function findPossibleCalibrations(calibration, ops) {
    // console.log(calibration);
    const count = solveRecursive(calibration.total, calibration.nums[0], calibration.nums.slice(1), ops);
    // if (count > 0) {
    //     console.log(calibration.total);
    // }
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
        if (op === "+") {
            count += solveRecursive(goal, sum + num, nums.slice(1), ops);
        } else if (op === "*") {
            count += solveRecursive(goal, sum * num, nums.slice(1), ops);
        } else if (op === "||") {
            count += solveRecursive(goal, parseInt(String(sum).concat(num)), nums.slice(1), ops);
            // const prefixMatch = String(goal).startsWith(sum);
            // if (prefixMatch) {
            //     const subGoal = String(goal).substring(String(sum).length);
            //     console.log("Goal: " + goal);
            //     console.log("Subgoal: " + subGoal);
            //     count += solveRecursive(subGoal, num, nums.slice(1), ops)
            // }
        }
    }
    return count;
}

setup();