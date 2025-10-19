'use strict';
import fs from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';
//=====================================================

// Liste aqui as pastas específicas que deseja monitorar
//gostaria de acessar diretamente o conteudo destas pastas, sem precisar acessar o conteudo de cada subpasta
//e também gostaria de monitorar as alterações em tempo real, para atualizar o arquivo JSON automaticamente
const pastasParaMonitorar = [
    'F:\\A', 'F:\\B', 'F:\\C', 'F:\\D', 'F:\\E', 'F:\\F', 'F:\\G', 'F:\\H', 'F:\\I', 'F:\\J',
    'F:\\K', 'F:\\L', 'F:\\M', 'F:\\N', 'F:\\O', 'F:\\P', 'F:\\Q', 'F:\\R', 'H:\\S', 'H:\\T', 'H:\\U', 'H:\\V', 'H:\\W', 'H:\\X', 'H:\\Y', 'H:\\Z'
];
//=================================================================================

// Caminho do arquivo JSON a ser atualizado
const arquivoSaida = path.resolve('API_AnimeNetBr/DB_Local/animacoes.json');
const diretorioArquivoSaida = path.dirname(arquivoSaida);
if (!fs.existsSync(diretorioArquivoSaida))
    throw new Error(`Diretório do arquivo de saída não existe: ${diretorioArquivoSaida}`);
//=================================================================================

// Função para ler a estrutura de uma pasta
function lerEstrutura(dir) {
    let itens;
    try {
        itens = fs.readdirSync(dir, { withFileTypes: true });
    } catch (erro) {
        console.warn(`Não foi possível ler ${dir}: ${erro.message}`);
        return [];
    };
    return itens.map(item => {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            return {
                nome: item.name,
                tipo: 'pasta',
                conteudo: lerEstrutura(fullPath)
            };
        } else {
            return {
                nome: item.name,
                tipo: 'arquivo'
            };
        };
    });
}
//=================================================================================

// Debounce para evitar execuções múltiplas
let timeout;
function atualizarAnimacoesDebounced() {
    clearTimeout(timeout);
    timeout = setTimeout(atualizarAnimacoes, 1000);
}
//=================================================================================

// Função para atualizar o JSON com a estrutura de todas as pastas monitoradas
function atualizarAnimacoes() {
    const estrutura = pastasParaMonitorar.map(pasta => ({
        nome: path.basename(pasta),
        tipo: 'pasta',
        conteudo: lerEstrutura(pasta)
    }));
    let jsonAtual = {};
    try {
        if (fs.existsSync(arquivoSaida)) {
            jsonAtual = JSON.parse(fs.readFileSync(arquivoSaida, 'utf-8'));
        }
        jsonAtual.objAnimacoes = estrutura;
        jsonAtual.ultimaAtualizacao = new Date().toISOString();
        fs.mkdirSync(path.dirname(arquivoSaida), { recursive: true });
        fs.writeFileSync(arquivoSaida, JSON.stringify(jsonAtual, null, 2));
        console.log(`Arquivo ${arquivoSaida} atualizado com sucesso!`);
    } catch (erro) {
        console.error('Erro ao atualizar animacoes.json:', erro.message);
    }
}
//=================================================================================

// Inicializa o watcher para monitorar mudanças em tempo real nas pastas específicas
const watcher = chokidar.watch(pastasParaMonitorar, {
    ignoreInitial: false, //era TRUE!  serve para ignorar eventos iniciais, que são gerados quando o watcher é iniciado
    persistent: true,
    depth: 2
});
watcher.on('error', error => {
    console.warn('Erro ao monitorar:', error.message);
});
watcher.on('add', atualizarAnimacoesDebounced)
       .on('change', atualizarAnimacoesDebounced)
       .on('unlink', atualizarAnimacoesDebounced)
       .on('addDir', atualizarAnimacoesDebounced)
       .on('unlinkDir', atualizarAnimacoesDebounced);
console.log('Monitorando alterações em:', pastasParaMonitorar.join(', '));
