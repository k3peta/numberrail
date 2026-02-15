
import fs from 'fs';
const appPath = 'src/App.jsx';
let content = fs.readFileSync(appPath, 'utf-8');

// 1. Remove setAllCorrect(false); which is causing the crash
// This is the primary fix.
if (content.includes("setAllCorrect(false);")) {
    content = content.replace(/\s*setAllCorrect\(false\);/g, "");
    console.log("Removed invalid setAllCorrect(false) calls.");
}

// 2. Restore timer logic if it appears commented out (from debug_disable_timer.js)
// Look for the disabled block signature
if (content.includes("Timer Logic Temporarily Disabled")) {
    console.log("Restoring timer logic...");

    // We want to replace the whole useEffect block to be clean and correct
    // Identify the block by the comment we added
    const startMarker = "// Level Initialization (Timer Logic Disabled for Debug)";
    const startIdx = content.indexOf(startMarker);

    // And the end
    const endMarker = "}, [levelIndex]); // Dependencies simplified";
    const endIdx = content.indexOf(endMarker, startIdx);

    if (startIdx !== -1 && endIdx !== -1) {
        const correctBlock = `    // Level Initialization & Timer Logic
    useEffect(() => {
        const currentLevel = levels[levelIndex];
        if (!currentLevel) return;

        // Path Reset
        const initialPaths = {};
        if (currentLevel.hints) {
            currentLevel.hints.forEach((h, i) => {
                initialPaths[i] = [{ r: h.r, c: h.c }];
            });
        }
        setPaths(initialPaths);
        setActiveHintIndex(null);
        setIsDragging(false);

        // Timer Reset
        if (timerEnabled) {
            setTimeLeft(180);
            setIsTimeUp(false);
            setIsTimerRunning(!isMenu);
        } else {
            setIsTimeUp(false);
            setIsTimerRunning(false);
        }
    }, [levelIndex, timerEnabled, isMenu]);`; // Added Correct Dependencies

        content = content.substring(0, startIdx) + correctBlock + content.substring(endIdx + endMarker.length);
        console.log("Timer logic block restored.");
    }
}

fs.writeFileSync(appPath, content);
console.log("App.jsx fix complete.");
