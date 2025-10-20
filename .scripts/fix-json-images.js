const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve('.');
const publicDir = path.join(projectRoot, 'public', 'imgs', 'animacoes');
const dbPath = path.join(projectRoot, 'api_myanimes', 'db', 'animacoes.json');

if (!fs.existsSync(publicDir)) { console.error('public dir not found', publicDir); process.exit(1); }
if (!fs.existsSync(dbPath)) { console.error('db not found', dbPath); process.exit(1); }

const files = fs.readdirSync(publicDir);
const filesLower = files.reduce((acc, f) => { acc[f.toLowerCase()] = f; return acc; }, {});

function normalizeFilename(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let s = base.normalize('NFKD').replace(/\p{M}/gu, '');
  s = s.toLowerCase();
  s = s.replace(/[^a-z0-9.\-]+/g, '_');
  s = s.replace(/^_+|_+$/g, '');
  if (!s) s = 'file';
  return s + (ext ? ext.toLowerCase() : '');
}

const raw = fs.readFileSync(dbPath, 'utf8');
const data = JSON.parse(raw);
const arr = data.animacoes ?? data.objAnimacoes ?? [];

const backup = dbPath + '.bak.fixjson.' + new Date().toISOString().replace(/[.:]/g,'-');
fs.copyFileSync(dbPath, backup);

let updates = 0;
for (const item of arr) {
  const current = item.imgSrc ?? item.imgNome ?? null;
  if (!current) continue;
  const currentPath = path.join(publicDir, current);
  if (fs.existsSync(currentPath)) continue; // ok
  // try case-insensitive
  const alt = filesLower[current.toLowerCase()];
  if (alt) {
    // update to exact filename found
    item.imgSrc = alt;
    updates++;
    continue;
  }
  // try normalized
  const norm = normalizeFilename(current);
  const normAlt = files.find(f => normalizeFilename(f) === norm);
  if (normAlt) {
    item.imgSrc = normAlt;
    updates++;
    continue;
  }
  // try other heuristics: replace + and = with _
  const replaced = current.replace(/[+=]/g, '_');
  const alt2 = filesLower[replaced.toLowerCase()];
  if (alt2) { item.imgSrc = alt2; updates++; continue; }
}

if (updates > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Updated JSON entries:', updates);
  console.log('Backup at', backup);
} else {
  console.log('No updates needed.');
}
