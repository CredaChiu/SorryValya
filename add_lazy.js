const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
h = h.replace(/<img src=/g, '<img loading="lazy" src=');
h = h.replace(/<video src=/g, '<video loading="lazy" preload="none" src=');
fs.writeFileSync('index.html', h);
console.log('Added lazy loading');

