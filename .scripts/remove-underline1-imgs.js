// Script para renomear arquivos *_1.jpg removendo apenas o _1 do nome
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../public/imgs/animacoes');
const arquivos = fs.readdirSync(dir);
let alterados = 0;

for (const nome of arquivos) {
  if (/^(.*)_1\.jpg$/i.test(nome)) {
    const novoNome = nome.replace(/_1\.jpg$/i, '.jpg');
    const origem = path.join(dir, nome);
    const destino = path.join(dir, novoNome);
    if (!fs.existsSync(destino)) {
      fs.renameSync(origem, destino);
      console.log(`Renomeado: ${nome} -> ${novoNome}`);
      alterados++;
    } else {
      console.warn(`Já existe: ${novoNome}, não renomeado ${nome}`);
    }
  }
}

if (alterados === 0) {
  console.log('Nenhum arquivo renomeado.');
} else {
  console.log(`Total de arquivos renomeados: ${alterados}`);
}
