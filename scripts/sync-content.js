const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), '.agents', 'content');
const outputDir = path.join(process.cwd(), 'src', 'lib');
const outputFile = path.join(outputDir, 'siteContent.json');

function parseMarkdownToObj(content) {
    const lines = content.split(/\r?\n/);
    const result = {};
    let currentHeader = 'base';
    let currentBody = [];

    lines.forEach(line => {
        if (line.startsWith('# ')) {
            if (currentHeader !== 'base' || currentBody.length > 0) {
                result[currentHeader] = currentBody.join('\n').trim();
            }
            currentHeader = line.substring(2).trim();
            currentBody = [];
        } else if (!line.startsWith('---') && !line.startsWith('component:') && !line.startsWith('status:') && !line.startsWith('last_updated:')) {
            currentBody.push(line);
        }
    });
    if (currentHeader !== 'base' || currentBody.length > 0) {
        result[currentHeader] = currentBody.join('\n').trim();
    }
    return result;
}

function traverseDir(dir, data) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            data[file] = {};
            traverseDir(fullPath, data[file]);
        } else if (file.endsWith('.md')) {
            const raw = fs.readFileSync(fullPath, 'utf8');
            const parsed = parseMarkdownToObj(raw);
            const key = file.replace('.md', '');
            data[key] = parsed;
        }
    });
}

try {
    console.log("Initiating Markdown compilation...");
    const siteData = {};
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    traverseDir(contentDir, siteData);
    fs.writeFileSync(outputFile, JSON.stringify(siteData, null, 2));
    console.log(`Success -> Compiled ${Object.keys(siteData).length} directories to ${outputFile}`);
} catch (error) {
    console.error("Content Sync Failed:", error);
    process.exit(1);
}
