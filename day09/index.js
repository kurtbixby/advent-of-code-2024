const readline = require("node:readline");

function setup() {
    let rl = readline.createInterface(process.stdin);
    let drive;
    
    rl.on("line", (line) => {
        drive = buildStructure(line);
    });

    rl.once("close", () => main(drive));
}

function main(driveStructure) {
    compactDrive(driveStructure);
    const hash = calculateHash(driveStructure);
    console.log("Hash: " + hash);
}

function buildStructure(driveLine) {
    let structure = [];
    let fileId = 0;
    for (let i = 0; i < driveLine.length; i++) {
        const size = parseInt(driveLine.at(i));
        const id = i % 2 === 0 ? fileId++ : NaN;
        structure.push({size: size, file: id});
    }

    return structure;
}

function compactDrive(structure) {
    let dst = 0;
    while (!isNaN(structure[dst].file)) {
        dst++;
    }
    let src = -1;
    while (isNaN(structure.at(src).file)) {
        src--;
    }

    while (dst < structure.length + src) {
        // console.log("dst: " + dst);
        // console.log("src: " + src);
        if (structure[dst].size === structure.at(src).size) {
            // exact space remaining
            structure[dst].file = structure.at(src).file;
            structure.at(src).file = NaN;
            dst = findNextOpen(structure, dst + 1);
            src = findNextFile(structure, src - 1);
        } else if (structure[dst].size > structure.at(src).size) {
            // extra space remaining
            let replacement = {size: structure.at(src).size, file: structure.at(src).file};
            let added = {size: structure[dst].size - replacement.size, file: NaN};
            structure.at(src).file = NaN;
            structure[dst] = replacement;
            structure.splice(dst + 1, 0, added);
            dst = dst + 1;
            src = findNextFile(structure, src - 1);
        } else if (structure[dst].size < structure.at(src).size) {
            // less space remaining
            structure[dst].file = structure.at(src).file;
            const replacement = {size: structure[dst].size, file: NaN};
            if (src === -1) {
                structure.push(replacement);
            } else {
                structure.splice(src + 1, 0, replacement);
            }
            src--;
            structure.at(src).size -= structure[dst].size;
            dst = findNextOpen(structure, dst + 1);
        } else {
            console.error("YOU DONE MESSED UP A-ARON");
        }
    }
}

function findNextOpen(structure, startIndex) {
    let index = startIndex;
    while (!isNaN(structure[index].file)) {
        index++;
    }
    return index;
}

function findNextFile(structure, startIndex) {
    let index = startIndex;
    while (isNaN(structure.at(index).file)) {
        index--;
    }
    return index;
}

function printDrive(structure) {
    let string = "";
    for (let i = 0; i < structure.length; i++) {
        const block = structure.at(i);
        for (let j = 0; j < block.size; j++) {
            if (isNaN(block.file)) {
                string += ".";
            } else {
                string += block.file;
            }
        }
    }
    console.log(string);
    return string;
}

function calculateHash(structure) {
    let blockNum = 0;
    let sum = 0;
    for (const chunk of structure) {
        if (isNaN(chunk.file)) {
            continue;
        }
        for (let i = 0; i < chunk.size; i++) {
            sum += (chunk.file * (blockNum + i));
        }
        blockNum += chunk.size;
    }

    return sum;
}

setup();