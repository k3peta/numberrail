
const level = {
    id: 27,
    size: 9,
    hints: [
        { r: 0, c: 0, val: 50 }, { r: 0, c: 6, val: 51 },
        { r: 1, c: 1, val: 62 }, { r: 1, c: 4, val: 51 },
        { r: 3, c: 1, val: 62 }, { r: 3, c: 8, val: 40 },
        { r: 4, c: 3, val: 40 }, { r: 4, c: 4, val: 52 }, { r: 4, c: 5, val: 61 }, { r: 4, c: 7, val: 20 },
        { r: 5, c: 0, val: 51 }, { r: 5, c: 7, val: 61 }, { r: 5, c: 8, val: 71 },
        { r: 6, c: 4, val: 63 }, // Added 63 at (6,4)
        { r: 7, c: 1, val: 52 },
        { r: 8, c: 8, val: 40 }
    ]
};

const gridSize = level.size;
let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
let paths = level.hints.map((h, i) => ({
    id: i,
    targetLen: Math.floor(h.val / 10),
    targetTurns: h.val % 10,
    cells: [{ r: h.r, c: h.c }]
}));

// Mark starts
level.hints.forEach((h, i) => {
    grid[h.r][h.c] = i;
});

function countTurns(cells) {
    if (cells.length < 3) return 0;
    let turns = 0;
    for (let i = 2; i < cells.length; i++) {
        const prev = cells[i - 2];
        const curr = cells[i - 1];
        const next = cells[i];
        if (prev.r !== next.r && prev.c !== next.c) {
            turns++;
        }
    }
    return turns;
}

function solveRecursive(pathIdx) {
    if (pathIdx >= paths.length) {
        // Full check
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === null) return false;
            }
        }
        return true;
    }

    const path = paths[pathIdx];
    const currentLen = path.cells.length;

    if (currentLen === path.targetLen) {
        if (countTurns(path.cells) === path.targetTurns) {
            return solveRecursive(pathIdx + 1);
        } else {
            return false;
        }
    }

    const head = path.cells[currentLen - 1];
    const siblings = [
        { r: head.r - 1, c: head.c },
        { r: head.r + 1, c: head.c },
        { r: head.r, c: head.c - 1 },
        { r: head.r, c: head.c + 1 }
    ];

    for (const next of siblings) {
        if (next.r < 0 || next.r >= gridSize || next.c < 0 || next.c >= gridSize) continue;
        if (grid[next.r][next.c] !== null) continue;

        const potentialPath = [...path.cells, next];
        if (countTurns(potentialPath) > path.targetTurns) continue;

        // Grid occupancy for current path
        grid[next.r][next.c] = path.id;
        path.cells.push(next);

        if (solveRecursive(pathIdx)) return true;

        path.cells.pop();
        grid[next.r][next.c] = null;
    }
    return false;
}

console.log("Solving Q27 3rd modified...");
const start = Date.now();
if (solveRecursive(0)) {
    console.log("Solvable!");
} else {
    console.log("Unsolvable");
}
console.log("Time:", Date.now() - start, "ms");
