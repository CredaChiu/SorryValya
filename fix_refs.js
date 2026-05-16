// Fix image references in index.html after compression
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

const imagesDir = path.join(__dirname, 'images');
const actualFiles = fs.readdirSync(imagesDir);

// Build a map of lowercase basename -> actual filename
const fileMap = {};
actualFiles.forEach(f => {
    const base = path.basename(f, path.extname(f)).toLowerCase();
    fileMap[base] = f;
});

// Find all image references
const regex = /images\/([^"']+)/g;
let match;
const replacements = [];

while ((match = regex.exec(html)) !== null) {
    const ref = match[1];
    const refBase = path.basename(ref, path.extname(ref)).toLowerCase();
    const actual = fileMap[refBase];
    if (actual && actual !== ref) {
        replacements.push({ from: 'images/' + ref, to: 'images/' + actual });
    }
}

replacements.forEach(r => {
    html = html.split(r.from).join(r.to);
    console.log(`${r.from} -> ${r.to}`);
});

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log(`\nDone! Fixed ${replacements.length} references.`);

