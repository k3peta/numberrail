
import fs from 'fs';
const appPath = 'src/App.jsx';
let content = fs.readFileSync(appPath, 'utf-8');

const startMarker = "// Level Initialization";
const endMarker = "}, [levelIndex, timerEnabled, isMenu]);";

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const safeBlock = `    // Level Initialization (Timer Logic Disabled for Debug)
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

        // Timer Logic Temporarily Disabled
        // We force timer states to false to check if rendering works
        setIsTimeUp(false);
        setIsTimerRunning(false);

    }, [levelIndex]); // Dependencies simplified`;

    const newContent = content.substring(0, startIdx) + safeBlock + content.substring(endIdx + endMarker.length);
    fs.writeFileSync(appPath, newContent);
    console.log("Timer logic disabled for debugging.");
} else {
    console.error("Could not find markers to disable timer.");
}
