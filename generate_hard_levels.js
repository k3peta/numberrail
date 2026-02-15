// Number Rail - Hard Level Generator (Optimized)
// Usage: node generate_hard_levels.js
// Strategy: Generate valid partitions, verify with fast solver, rate difficulty

const DIRS = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function countTurns(path) {
    let turns = 0;
    for (let i = 1; i < path.length - 1; i++) {
        const d1r = path[i].r - path[i - 1].r, d1c = path[i].c - path[i - 1].c;
        const d2r = path[i + 1].r - path[i].r, d2c = path[i + 1].c - path[i].c;
        if (d1r !== d2r || d1c !== d2c) turns++;
    }
    return turns;
}

function countEmpty(grid, r, c, size) {
    let n = 0;
    for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === -1) n++;
    }
    return n;
}

// Generate a random partition ensuring all paths have length >= 2
function randomPartition(size, minLen, maxLen) {
    const grid = Array.from({ length: size }, () => Array(size).fill(-1));
    const paths = [];
    let empty = size * size;

    while (empty > 0) {
        const cells = [];
        for (let r = 0; r < size; r++)
            for (let c = 0; c < size; c++)
                if (grid[r][c] === -1) cells.push({ r, c });

        if (cells.length === 0) break;

        // Prefer cells with fewer empty neighbors (avoid isolation)
        cells.sort((a, b) => countEmpty(grid, a.r, a.c, size) - countEmpty(grid, b.r, b.c, size));
        const range = Math.min(3, cells.length);
        const start = cells[Math.floor(Math.random() * range)];

        const idx = paths.length;
        const path = [{ r: start.r, c: start.c }];
        grid[start.r][start.c] = idx;
        empty--;

        while (path.length < maxLen) {
            const tip = path[path.length - 1];
            const nbrs = [];
            for (const [dr, dc] of DIRS) {
                const nr = tip.r + dr, nc = tip.c + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === -1)
                    nbrs.push({ r: nr, c: nc });
            }
            if (nbrs.length === 0) break;
            if (path.length >= minLen && Math.random() < 0.2) break;

            // Warnsdorff: prefer cells with fewer free neighbors
            nbrs.sort((a, b) => countEmpty(grid, a.r, a.c, size) - countEmpty(grid, b.r, b.c, size));
            const next = nbrs[Math.random() < 0.65 ? 0 : Math.floor(Math.random() * nbrs.length)];
            path.push({ r: next.r, c: next.c });
            grid[next.r][next.c] = idx;
            empty--;
        }
        paths.push(path);
    }

    if (empty > 0 || paths.some(p => p.length < 2)) return null;
    return paths;
}

// Fast solver with timeout
function findPaths(size, sr, sc, tLen, tTurns, grid, limit = 100) {
    const results = [];
    const vis = Array.from({ length: size }, () => Array(size).fill(false));
    vis[sr][sc] = true;

    function dfs(path, turns) {
        if (results.length >= limit) return;
        if (path.length === tLen) {
            if (turns === tTurns) results.push(path.map(p => ({ ...p })));
            return;
        }
        if (turns > tTurns) return;
        if (tTurns - turns >= tLen - path.length) return;

        const tip = path[path.length - 1];
        for (const [dr, dc] of DIRS) {
            const nr = tip.r + dr, nc = tip.c + dc;
            if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
            if (vis[nr][nc] || grid[nr][nc] !== -1) continue;

            let nt = turns;
            if (path.length >= 2) {
                const prev = path[path.length - 2];
                if (dr !== tip.r - prev.r || dc !== tip.c - prev.c) nt++;
            }
            if (nt > tTurns) continue;

            vis[nr][nc] = true;
            path.push({ r: nr, c: nc });
            dfs(path, nt);
            path.pop();
            vis[nr][nc] = false;
        }
    }

    dfs([{ r: sr, c: sc }], 0);
    return results;
}

function solve(size, hints, maxSol = 2, timeoutMs = 3000) {
    const grid = Array.from({ length: size }, () => Array(size).fill(-1));
    let solCount = 0, bt = 0;
    const start = Date.now();

    function backtrack(idx) {
        if (solCount >= maxSol || Date.now() - start > timeoutMs) return;
        if (idx >= hints.length) {
            for (let r = 0; r < size; r++)
                for (let c = 0; c < size; c++)
                    if (grid[r][c] === -1) return;
            solCount++;
            return;
        }

        const h = hints[idx];
        if (grid[h.r][h.c] !== -1) return;
        const paths = findPaths(size, h.r, h.c, Math.floor(h.val / 10), h.val % 10, grid, 50);

        for (const path of paths) {
            if (solCount >= maxSol || Date.now() - start > timeoutMs) return;
            let ok = true;
            for (const c of path) { if (c.r === h.r && c.c === h.c) continue; if (grid[c.r][c.c] !== -1) { ok = false; break; } }
            if (!ok) continue;

            for (const c of path) grid[c.r][c.c] = idx;
            backtrack(idx + 1);
            for (const c of path) grid[c.r][c.c] = -1;
            bt++;
        }
    }

    // Sort hints: place most constrained first (shorter paths first)
    const order = hints.map((h, i) => ({ h, i, len: Math.floor(h.val / 10) }))
        .sort((a, b) => a.len - b.len).map(x => x.i);
    const sortedHints = order.map(i => hints[i]);

    // Re-solve with sorted order
    const grid2 = Array.from({ length: size }, () => Array(size).fill(-1));
    let sol2 = 0;
    function bt2(idx) {
        if (sol2 >= maxSol || Date.now() - start > timeoutMs) return;
        if (idx >= sortedHints.length) {
            for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (grid2[r][c] === -1) return;
            sol2++;
            return;
        }
        const h = sortedHints[idx];
        if (grid2[h.r][h.c] !== -1) return;
        const paths = findPaths(size, h.r, h.c, Math.floor(h.val / 10), h.val % 10, grid2, 30);
        for (const path of paths) {
            if (sol2 >= maxSol || Date.now() - start > timeoutMs) return;
            let ok = true;
            for (const c of path) { if (c.r === h.r && c.c === h.c) continue; if (grid2[c.r][c.c] !== -1) { ok = false; break; } }
            if (!ok) continue;
            for (const c of path) grid2[c.r][c.c] = idx;
            bt2(idx + 1);
            for (const c of path) grid2[c.r][c.c] = -1;
        }
    }
    bt2(0);

    return { solutionCount: sol2, backtracks: bt, timedOut: Date.now() - start > timeoutMs };
}

// Count average branching (difficulty metric)
function branchFactor(size, hints) {
    const grid = Array.from({ length: size }, () => Array(size).fill(-1));
    let total = 0;
    for (const h of hints) {
        const paths = findPaths(size, h.r, h.c, Math.floor(h.val / 10), h.val % 10, grid, 200);
        total += paths.length;
    }
    return total / hints.length;
}

function generateLevel(size, minLen, maxLen, minBranch, timeoutMs) {
    for (let att = 0; att < 1000; att++) {
        const paths = randomPartition(size, minLen, maxLen);
        if (!paths) continue;

        const hints = paths.map(p => ({
            r: p[0].r, c: p[0].c,
            val: p.length * 10 + countTurns(p)
        }));

        // Quick branch factor check
        const bf = branchFactor(size, hints);
        if (bf < minBranch) continue;

        // Verify unique solution
        const result = solve(size, hints, 2, timeoutMs);
        if (result.timedOut) continue;
        if (result.solutionCount !== 1) continue;

        return { size, hints, difficulty: bf, pathCount: paths.length };
    }
    return null;
}

function main() {
    console.log("=== Number Rail Hard Level Generator ===\n");
    const all = [];

    // 6x6 Hard: fewer long paths → more decisions
    console.log("Generating 6x6 Hard levels...");
    for (let i = 0; i < 10;) {
        const level = generateLevel(6, 4, 10, 5, 2000);
        if (level) {
            level.id = `H${i + 1}`;
            all.push(level);
            console.log(`  H${i + 1}: ${level.hints.length} hints, branch=${level.difficulty.toFixed(1)}`);
            i++;
        }
    }

    // 9x9 Hard: shorter paths for solver feasibility
    console.log("\nGenerating 9x9 Hard levels...");
    for (let i = 0; i < 5;) {
        const level = generateLevel(9, 3, 7, 2, 8000);
        if (level) {
            level.id = `X${i + 1}`;
            all.push(level);
            console.log(`  X${i + 1}: ${level.hints.length} hints, branch=${level.difficulty.toFixed(1)}`);
            i++;
        }
    }

    // Sort by size then difficulty
    const h6 = all.filter(l => l.size === 6).sort((a, b) => a.difficulty - b.difficulty);
    const h9 = all.filter(l => l.size === 9).sort((a, b) => a.difficulty - b.difficulty);

    // Output Swift format
    console.log("\n// === Swift format (for LevelData.swift) ===");
    console.log("        // MARK: - Hard 6x6");
    for (const l of h6) {
        const hs = l.hints.map(h => `Hint(r: ${h.r}, c: ${h.c}, val: ${h.val})`).join(", ");
        console.log(`        Level(id: "${l.id}", size: ${l.size}, hints: [${hs}]),`);
    }
    console.log("        // MARK: - Hard 9x9");
    for (const l of h9) {
        const hs = l.hints.map(h => `Hint(r: ${h.r}, c: ${h.c}, val: ${h.val})`).join(", ");
        console.log(`        Level(id: "${l.id}", size: ${l.size}, hints: [${hs}]),`);
    }

    // Output JS format
    console.log("\n// === JavaScript format (for levels.js) ===");
    for (const l of [...h6, ...h9]) {
        const hs = l.hints.map(h => `{ "r": ${h.r}, "c": ${h.c}, "val": ${h.val} }`).join(",\n            ");
        console.log(`    { "id": "${l.id}", "size": ${l.size}, "hints": [\n            ${hs}\n        ] },`);
    }
}

main();
