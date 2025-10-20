// Script para corrigir os nomes das imagens em animacoes.json para igualar aos arquivos existentes em public/imgs/animacoes
// Salva backup antes de alterar

const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api_myanimes/db/animacoes.json');
const imgsDir = path.resolve(__dirname, '../public/imgs/animacoes');
const backupPath = jsonPath + '.bak';

// Lê JSON
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const animacoes = json.animacoes || json.objAnimacoes || [];

// Lê arquivos da pasta de imagens
const arquivosImgs = fs.readdirSync(imgsDir);

// Cria um mapa para busca rápida (case-insensitive)
const arquivosMap = {};
for (const nome of arquivosImgs) {
  arquivosMap[nome.toLowerCase()] = nome;
}

let alterados = 0;
for (const anim of animacoes) {
  if (!anim.imgNome) continue;
  const nomeAtual = anim.imgNome;
  // Busca exata (case-insensitive)
  const encontrado = arquivosMap[nomeAtual.toLowerCase()];
  if (!encontrado) {
    // Tenta encontrar por aproximação (ignorando extensão)
    const base = path.parse(nomeAtual).name.toLowerCase();
    const similar = Object.keys(arquivosMap).find(k => path.parse(k).name === base);
    if (similar) {
      anim.imgNome = arquivosMap[similar];
      alterados++;
    } else {
      // Tenta encontrar por slug do nome
      const slug = nomeAtual.replace(/\s+/g, '_').replace(/[^a-z0-9._-]+/gi, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
      const slugged = Object.keys(arquivosMap).find(k => k.startsWith(slug));
      if (slugged) {
        anim.imgNome = arquivosMap[slugged];
        alterados++;
      }
    }
  } else if (encontrado !== nomeAtual) {
    anim.imgNome = encontrado;
    alterados++;
  }
}

if (alterados > 0) {
  // Salva backup
  fs.copyFileSync(jsonPath, backupPath);
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  console.log(`Corrigido: ${alterados} nomes de imagens. Backup salvo em ${backupPath}`);
} else {
  console.log('Nenhuma alteração necessária.');
}
