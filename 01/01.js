const assert = require("node:assert");
const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    let left = [];
    let right = [];
    rl.on("line", (input) => {
        let [l, r] = input.split(/\s+/);
        left.push(l);
        right.push(r);
    });

    rl.once("close", () => main([left, right]));
}

function main(args) {
    let [left, right] = args;

    const dist = calculateDistance(left, right);
    const similarity = calculateSimilarity(left, right);
    console.log("List Distance: " + dist);
    console.log("List Similarity: " + similarity);
}

function calculateDistance(left, right) {
    left.sort();
    right.sort();
    let distance = 0;
    assert.equal(left.length, right.length);
    for (let i = 0; i < left.length; i++) {
        distance += (Math.abs(left[i] - right[i]))
    }

    return distance;
}

function calculateSimilarity(left, right) {
    const freq = right.reduce((freqDict, cur) => {
        if (cur in freqDict) {
            freqDict[cur]++;
        } else {
            freqDict[cur] = 1;
        }
        return freqDict;
    }, {});
    const similarity = left.reduce((sum, cur) => {
        if (cur in freq) {
            sum += cur * freq[cur];
        }

        return sum;
    }, 0);

    return similarity;
}

setup();