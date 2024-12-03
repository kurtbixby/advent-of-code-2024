function calculateReportSafetyWithDampener(report) {
    let isSafe = true;
    assert(report.length >= 3);
    // const deltas = [];
    let problemCount = 0;

    for (let i = 0; i < report.length - 1; i++) {
        const cur = report[i];
        const next = report[i+1];

        if (Math.abs(next - cur) < 1 || Math.abs(next - cur) > 3) {
            // Peak ahead to try removing
            if (i < report.length - 2) {
                const peak = report[i+2];
                const peakedDiff = Math.abs(peak - cur);
                if (peakedDiff >= 1 && peakedDiff <= 3) {
                    problemCount++;
                }
            } else {
                // At end
                problemCount++;
            }
        }
        if (problemCount > 1) {
            isSafe = false;
            break;
        }
        // deltas.push(next - cur);
    }

    // for (let i = 0; i < deltas.length; i++) {

    // }

    return isSafe;
}

function calculateReportSafetyWithDampener3(report) {
    const deltas = [];
    const counts = {pos: 0, neg: 0, eq: 0};
    const anomalies = [];
    const removed = -1;

    for (let i = 0; i < report.length-1; i++) {
        const cur = report[i];
        const next = report[i+1];

        const delta = next - cur;
        deltas.push(next - cur);
        if (delta > 0) {
            counts.pos++;
        } else if (delta < 0) {
            counts.neg++;
        } else {
            counts.eq++;
        }

        if (Math.abs(delta > 3) || Math.abs(delta < 1)) {
            anomalies.push({location: i, amount: delta});
        }
    }

    if (counts.eg > 1) {
        return false;
    }
    if (Math.min(counts.pos, counts.neg) > 1) {
        return false;
    }
    if (anomalies.length > 2) {
        return false;
    }

    // case 1 opposite tonicity
        // Find the location and check okay if removed
    if (Math.min(counts.pos, counts.neg) === 1) {
        if (counts.pos > counts.neg) {
            // increasing
        } else if (counts.pos > counts.neg) {
            // decreasing
        }

    }

    if (anomalies.length === 1) {
        if (anomalies[0].location !== 0 && anomalies[0].location !== report.length - 2) {
            // Check if okay when removed
            const removedDelta = report[anomalies[1].location + 1] - report[anomalies[0].location];
            if (Math.abs(removedDelta > 3) || Math.abs(removedDelta < 1)) {
                return false;
            } else {
                removed = anomalies[0].location + 1;
            }
        }
    }
    if (anomalies.length === 2) {
        // Are the big jumps next to each other
        if (anomalies[0].location + 1 !== anomalies[1].location) {
            return false;
        }
        // Check all right if removed
        const removedDelta = report[anomalies[1].location + 1] - report[anomalies[0].location];
        if (Math.abs(removedDelta > 3) || Math.abs(removedDelta < 1)) {
            return false;
        } else {
            removed = anomalies[0].location + 1;
        }
    }

    // 1 3 5 5 10 12
    // 1 3 5 11 11
    // case 1 anomaly
        // beginning/end
            // okay
        // large jump
            // check okay if removed
        // flat value
            // check okay if removed
    // case 2 anomalies
        // disconnected
            // not okay
        // connected
            // check okay if removed

    return true;
}

function calculateReportSafetyWithDampenerAlt(report) {
    let isSafe = true;
    assert(report.length >= 3);
    // const deltas = [];
    let problemCount = 0;

    let prev = report[0];

    for (let i = 1; i < report.length - 1; i++) {
        const cur = report[i];
        const next = report[i+1];

        if (sign(cur - prev) !== sign(next - cur)) {

        }
        if (Math.abs(cur - prev) < 1 || Math.abs(cur - prev) > 3) {
            // Potential problem
            if (Math.abs(next - prev) >= 1 && Math.abs(next - prev) <= 3) {
                problemCount++;
            }
        }
        // deltas.push(next - cur);
        prev = cur;
    }

    // for (let i = 0; i < deltas.length; i++) {

    // }
    if (problemCount > 1) {
        isSafe = false;
    }

    return isSafe;
}