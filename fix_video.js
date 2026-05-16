const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
// Replace all video tags: add autoplay loop, remove preload="none"
h = h.replace(/<video loading="lazy" preload="none"/g, '<video loading="lazy" autoplay loop');
// Also handle any that already have controls playsinline muted - remove controls, keep playsinline muted
h = h.replace(/controls playsinline muted/g, 'playsinline muted');
fs.writeFileSync('index.html', h);
console.log('done');

