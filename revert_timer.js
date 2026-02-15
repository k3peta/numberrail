
import fs from 'fs';
const appPath = 'src/App.jsx';
let content = fs.readFileSync(appPath, 'utf-8');

// We look for the start of the block we added in refactor_timer.js
const startMarker = "// Level Initialization";
// And the end of the second useEffect we added
const endMarker = "}, [timerEnabled, isMenu]);";

const startIdx = content.indexOf(startMarker);
// Find the end marker AFTER the start marker
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    console.log("Found block to revert.");

    // This reverts to a single useEffect that handles both level init and timer reset.
    // Using [levelIndex, timerEnabled, isMenu] dependency to ensure variables are fresh,
    // but we will try to make the logic robust.
    const newBlock = `    // Level Initialization & Timer Logic
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
        setAllCorrect(false);
        setActiveHintIndex(null);
        setIsDragging(false);

        // Timer Reset
        if (timerEnabled) {
            // Only reset time left if we are actually starting a level (or toggling)
            // But to be safe and avoid "unplayable" state, we enforce reset.
            setTimeLeft(180);
            setIsTimeUp(false);
            setIsTimerRunning(!isMenu);
        } else {
            setIsTimeUp(false);
            setIsTimerRunning(false);
        }
    }, [levelIndex, timerEnabled, isMenu]);`;

    // Replace the range
    const newContent = content.substring(0, startIdx) + newBlock + content.substring(endIdx + endMarker.length);
    fs.writeFileSync(appPath, newContent);
    console.log("Reverted to safe timer logic (single useEffect).");
} else {
    console.error("Markers not found. Could not revert.");
    // Debug info
    console.log("Start marker index:", startIdx);
    console.log("End marker index:", endIdx);
}
