
const size = 6;
// Update hints based on USER request:
// (r:0, c:0) 30 -> 40
// (r:0, c:5) 40 -> 53
const hints = [
    { r: 0, c: 0, val: 40 },
    { r: 0, c: 5, val: 53 },
    { r: 1, c: 1, val: 74 },
    { r: 3, c: 0, val: 52 },
    { r: 4, c: 3, val: 52 },
    { r: 4, c: 5, val: 93 },
    { r: 5, c: 3, val: 30 }
];

// Grid initialization
let grid = Array(size).fill().map(() => Array(size).fill(null));
let paths = hints.map((h, i) => ({
    id: i,
    targetLen: Math.floor(h.val / 10),
    targetTurns: h.val % 10,
    cells: [{ r: h.r, c: h.c }]
}));

// Mark start positions
hints.forEach((h, i) => {
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

function solve(pathIdx) {
    if (pathIdx >= paths.length) {
        return true;
    }

    const path = paths[pathIdx];
    const currentLen = path.cells.length;

    // Check if finished
    if (currentLen === path.targetLen) {
        if (countTurns(path.cells) === path.targetTurns) {
            return solve(pathIdx + 1);
        } else {
            return false;
        }
    }

    // Try to extend
    const head = path.cells[currentLen - 1];
    const siblings = [
        { r: head.r - 1, c: head.c },
        { r: head.r + 1, c: head.c },
        { r: head.r, c: head.c - 1 },
        { r: head.r, c: head.c + 1 }
    ];

    for (const next of siblings) {
        // Bounds check
        if (next.r < 0 || next.r >= size || next.c < 0 || next.c >= size) continue;

        // Occupancy check
        if (grid[next.r][next.c] !== null) continue;

        // Turn pruning
        const potentialPath = [...path.cells, next];
        const currentTurns = countTurns(potentialPath);
        if (currentTurns > path.targetTurns) continue;

        // Do move
        grid[next.r][next.c] = path.id;
        path.cells.push(next);

        if (solve(pathIdx)) return true;

        // Undo move
        path.cells.pop();
        grid[next.r][next.c] = null;
    }

    return false;
}

console.log("Solving Q9 with 40/53...");
const start = Date.now();
if (solve(0)) {
    console.log("Solvable!");
} else {
    console.log("Unsolvable.");
}
console.log("Time:", Date.now() - start, "ms");
