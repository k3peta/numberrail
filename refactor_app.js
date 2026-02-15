
import fs from 'fs';

const appPath = 'src/App.jsx';
let content = fs.readFileSync(appPath, 'utf-8');

// 1. Add import
if (!content.includes("import { levels } from './levels';")) {
    content = content.replace(
        "import './App.css';",
        "import './App.css';\nimport { levels } from './levels';"
    );
}

// 2. Remove levels definition
// Pattern matches "const levels = [" ... "];" including newlines
const regex = /\/\/ Manual Levels Definition directly in App\s+const levels = \[[\s\S]*?\];/;

if (regex.test(content)) {
    content = content.replace(regex, '');
    // Clean up excessive newlines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    fs.writeFileSync(appPath, content);
    console.log("Successfully removed levels definition and added import.");
} else {
    // Try without the comment line
    const regex2 = /const levels = \[[\s\S]*?\];/;
    if (regex2.test(content)) {
        content = content.replace(regex2, '');
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        fs.writeFileSync(appPath, content);
        console.log("Successfully removed levels definition (no comment found) and added import.");
    } else {
        console.error("Could not find levels definition pattern.");
    }
}
