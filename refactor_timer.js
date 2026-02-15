
import fs from 'fs';

const appPath = 'src/App.jsx';
let content = fs.readFileSync(appPath, 'utf-8');

// The problematic useEffect block dependency string
// Based on Step 1104 output
const oldDependency = "[levelIndex, timerEnabled, isMenu]); // Changed dependency to levelIndex instead of level";

const depIndex = content.indexOf(oldDependency);

if (depIndex !== -1) {
    // Find the matching "useEffect" before this
    // We search backwards from depIndex
    const startSearch = content.lastIndexOf("useEffect(() => {", depIndex);

    if (startSearch !== -1) {
        // Verify it looks like what we expect
        const oldBlock = content.substring(startSearch, depIndex + oldDependency.length);
        console.log("Replacing block starting at index " + startSearch);

        const newBlock = `// Level Initialization
    useEffect(() => {
        const currentLevel = levels[levelIndex];
        if (!currentLevel) return;

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

        if (timerEnabled) {
            setTimeLeft(180);
            setIsTimeUp(false);
            setIsTimerRunning(!isMenu);
        }
    }, [levelIndex]);

    // Timer Control
    useEffect(() => {
        if (!timerEnabled) {
            setIsTimeUp(false);
            setIsTimerRunning(false);
            return;
        }

        if (isMenu) {
            setIsTimerRunning(false);
        } else {
            if (!isTimeUp) setIsTimerRunning(true);
        }
    }, [timerEnabled, isMenu]);`;

        const newContent = content.substring(0, startSearch) + newBlock + content.substring(depIndex + oldDependency.length);
        fs.writeFileSync(appPath, newContent);
        console.log("Timer logic refactored.");
    } else {
        console.error("Could not find start of useEffect.");
    }
} else {
    console.error("Could not find useEffect dependency string. Check exact match.");
}
