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
    // compactDrive(driveStructure);
    compactDrive_wholeFiles(driveStructure);
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

function compactDrive_wholeFiles(structure) {
    let l = 0;
    let r = findNextFile(structure, structure.length - 1);
    let set = new Set();

    for (let i = structure.length - 1; i >= 0; i--) {
        let chunk = structure[i];
        if (isNaN(chunk.file)) {
            continue;
        }
        let dst = findFirstOpenSize(structure, chunk.size, i);
        if (isNaN(dst) || set.has(chunk.file)) {
            continue;
        }
        set.add(chunk.file);
        
        if (structure[dst].size > chunk.size) {
            const replacement = {size: structure[dst].size - chunk.size, file: NaN};
            structure[dst].size = chunk.size;
            structure[dst].file = chunk.file;
            structure.splice(dst + 1, 0, replacement);
            chunk.file = NaN;
        } else if (structure[dst].size === chunk.size) {
            structure[dst].file = chunk.file;
            chunk.file = NaN;
        } else {
            console.error("YOU MESSED UP");
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

function findFirstOpenSize(structure, size, end) {
    for (let i = 0; i < Math.min(structure.length, end); i++) {
        if (isNaN(structure[i].file) && structure[i].size >= size) {
            return i;
        }
    }

    return NaN;
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
        if (!isNaN(chunk.file)) {
            for (let i = 0; i < chunk.size; i++) {
                sum += (chunk.file * (blockNum + i));
            }
        }
        blockNum += chunk.size;
    }

    return sum;
}

setup();