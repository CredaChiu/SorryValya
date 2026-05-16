const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
// Remove loading="lazy" from video tags (it prevents autoplay on mobile)
h = h.replace(/<video loading="lazy" autoplay/g, '<video autoplay');
fs.writeFileSync('index.html', h);
console.log('done');

