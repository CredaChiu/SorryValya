const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
// Remove inline style from video tags
h = h.replace(/ style="max-width:100%;max-height:300px;border-radius:12px;"/g, '');
fs.writeFileSync('index.html', h);
console.log('done');

