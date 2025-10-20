const fs = require('fs');
const path = require('path');
const dir = path.resolve('public/imgs/animacoes');
const files = fs.readdirSync(dir);
console.log(files.filter(f => f.startsWith('1')).join('\n'));
