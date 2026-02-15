
import fs from 'fs';
const appPath = 'src/App.jsx';
let content = fs.readFileSync(appPath, 'utf-8');

// Check if formatTime is missing
if (!content.includes("const formatTime =")) {
    // Insert before analyzePath
    const marker = "const analyzePath =";
    const idx = content.indexOf(marker);

    if (idx !== -1) {
        const insertion = `const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return \`\${min}:\${sec.toString().padStart(2, '0')}\`;
};

`;
        content = content.substring(0, idx) + insertion + content.substring(idx);
        fs.writeFileSync(appPath, content);
        console.log("Restored formatTime function.");
    } else {
        console.error("Could not find analyzePath to use as anchor.");
    }
} else {
    console.log("formatTime already exists.");
}
