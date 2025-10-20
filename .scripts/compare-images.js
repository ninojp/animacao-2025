import fs from 'fs';
import path from 'path';

const jsonPath = path.resolve('api_myanimes/db/animacoes.json');
const publicDir = path.resolve('public/imgs/animacoes');

if (!fs.existsSync(jsonPath)) {
  console.error('animacoes.json não encontrado em', jsonPath);
  process.exit(1);
}
if (!fs.existsSync(publicDir)) {
  console.error('Diretório público não encontrado em', publicDir);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const arr = data.animacoes ?? data.objAnimacoes ?? [];

const publicFiles = new Set(fs.readdirSync(publicDir));

let missing = [];
let found = [];

for (const item of arr) {
  const candidate = item.imgSrc ?? item.imgNome ?? null;
  if (!candidate) continue;
  // compare case-insensitive and a few variants
  const variants = [candidate, candidate.toLowerCase(), candidate.replace(/[+=]/g, '_')];
  const match = variants.find(v => publicFiles.has(v) || publicFiles.has(v.toLowerCase()));
  if (match) {
    found.push({ id: item.id, nome: item.nome, expected: candidate, matched: match });
  } else {
    missing.push({ id: item.id, nome: item.nome, expected: candidate });
  }
}

console.log('Total items:', arr.length);
console.log('Found images:', found.length);
console.log('Missing images:', missing.length);
console.log('\nExemplos de faltantes:');
console.log(missing.slice(0, 20));
console.log('\nExemplos de encontrados:');
console.log(found.slice(0, 20));
