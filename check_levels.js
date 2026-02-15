
import { generateAllLevels } from './src/levelGenerator.js';

try {
    const levels = generateAllLevels();
    console.log("Total levels generated:", levels.length);

    // Check levels 8, 9, 10 (indices 7, 8, 9)
    for (let i = 7; i <= 9; i++) {
        const lv = levels[i];
        console.log(`Checking Level ${i + 1}:`);
        if (!lv) {
            console.error(`Level ${i + 1} is undefined!`);
            continue;
        }
        console.log(`  Size: ${lv.size}`);
        console.log(`  Hints: ${lv.hints.length}`);
        lv.hints.forEach(h => {
            console.log(`    r:${h.r}, c:${h.c}, val:${h.val}`);
            if (h.val >= 100) console.error("    INVALID VALUE >= 100");
        });
    }
} catch (e) {
    console.error("Error generating levels:", e);
}
