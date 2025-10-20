const fs = require('fs');
const path = require('path');

// Paths
const projectRoot = path.resolve('.');
const publicDir = path.join(projectRoot, 'public', 'imgs', 'animacoes');
const dbPath = path.join(projectRoot, 'api_myanimes', 'db', 'animacoes.json');

if (!fs.existsSync(publicDir)) {
  console.error('Diretório de imagens não encontrado:', publicDir);
  process.exit(1);
}
if (!fs.existsSync(dbPath)) {
  console.error('Arquivo animacoes.json não encontrado em:', dbPath);
  process.exit(1);
}

// Helpers
function removeDiacritics(str) {
  // Normalize and remove combining marks
  return str.normalize('NFKD').replace(/\p{M}/gu, '');
}

function normalizeFilename(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let s = removeDiacritics(base);
  s = s.toLowerCase();
  // Replace sequences of non-alphanumeric, dot, dash with underscore
  s = s.replace(/[^a-z0-9.\-]+/g, '_');
  // Trim underscores
  s = s.replace(/^_+|_+$/g, '');
  // ensure not empty
  if (!s) s = 'file';
  return s + (ext ? ext.toLowerCase() : '');
}

// Backups
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupJson = dbPath + '.bak.' + timestamp;
const backupImgsDir = path.join(projectRoot, '.backup_imgs_' + timestamp);
fs.copyFileSync(dbPath, backupJson);
fs.mkdirSync(backupImgsDir, { recursive: true });

const files = fs.readdirSync(publicDir);
for (const f of files) {
  const src = path.join(publicDir, f);
  const dst = path.join(backupImgsDir, f);
  try { fs.copyFileSync(src, dst); } catch (e) { console.warn('backup copy failed for', f, e.message); }
}
console.log('Backups criados:');
console.log(' - JSON backup:', backupJson);
console.log(' - Imagens backup dir:', backupImgsDir);

// Build mapping and rename files safely (avoid collisions)
const mapping = {}; // old -> new
const used = new Set();
for (const f of files) {
  const newNameBase = normalizeFilename(f);
  let newName = newNameBase;
  let i = 1;
  while (used.has(newName) || fs.existsSync(path.join(publicDir, newName)) && newName !== f) {
    // if same as original file, allow
    newName = newNameBase.replace(/(\.[^.]+$)/, (m) => `_${i}${m}`);
    i++;
  }
  used.add(newName);
  mapping[f] = newName;
}

// Perform renames
for (const [oldName, newName] of Object.entries(mapping)) {
  if (oldName === newName) continue;
  const oldPath = path.join(publicDir, oldName);
  const newPath = path.join(publicDir, newName);
  try {
    fs.renameSync(oldPath, newPath);
    console.log(`Renomeado: ${oldName} -> ${newName}`);
  } catch (e) {
    console.error(`Falha ao renomear ${oldName} -> ${newName}:`, e.message);
  }
}

// Update JSON
const raw = fs.readFileSync(dbPath, 'utf8');
const data = JSON.parse(raw);
const arr = data.animacoes ?? data.objAnimacoes ?? [];

function findMapped(name) {
  if (!name) return name;
  if (mapping[name]) return mapping[name];
  // try case-insensitive match
  const lower = name.toLowerCase();
  for (const [old, neu] of Object.entries(mapping)) {
    if (old.toLowerCase() === lower) return neu;
  }
  // try normalized match
  const norm = normalizeFilename(name);
  for (const neu of Object.values(mapping)) {
    if (neu === norm) return neu;
  }
  return null;
}

let updates = 0;
for (const item of arr) {
  // try imgSrc then imgNome
  const current = item.imgSrc ?? item.imgNome ?? null;
  if (!current) continue;
  const mapped = findMapped(current);
  if (mapped && mapped !== current) {
    // prefer imgSrc if exists
    if (item.imgSrc !== undefined) {
      item.imgSrc = mapped;
    } else if (item.imgNome !== undefined) {
      item.imgNome = mapped;
    }
    updates++;
  }
}

if (updates > 0) {
  const backupJson2 = dbPath + '.bak_after_rename.' + timestamp;
  fs.copyFileSync(dbPath, backupJson2);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`JSON atualizado. Entradas modificadas: ${updates}`);
  console.log('Backup JSON original antes da escrita:', backupJson2);
} else {
  console.log('Nenhuma entrada do JSON precisou ser atualizada.');
}

console.log('Feito.');
