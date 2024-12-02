const assert = require("node:assert");
const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    let reports = [];
    rl.on("line", (input) => {
        const report = input.split(/\s+/);
        reports.push(report);
    });

    rl.once("close", () => main({reports: reports}));
}

function main({reports}) {
    const safeReports = reports.map(r => calculateReportSafety(r)).reduce((acc, isSafe) => acc + (isSafe ? 1 : 0), 0);

    console.log(`# of safe reports: ${safeReports}`);
}

function calculateReportSafety(report) {
    let isSafe = true;

    assert(report.length >= 2);
    let monotonicSign = sign(report[1] - report[0]);

    for (let i = 0; i < report.length - 1; i++) {
        const cur = report[i];
        const next = report[i+1];

        const diff = Math.abs(cur - next);
        if (diff < 1 || diff > 3 || sign(next - cur) !== monotonicSign) {
            isSafe = false;
            break;
        }
    }

    return isSafe;
}

function sign(number) {
    return number < 0 ? -1 : 1;
}

function clamp(number, min, max) {
    return Math.min(max, Math.max(min, number));
}

setup();