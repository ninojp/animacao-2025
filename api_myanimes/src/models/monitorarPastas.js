'use strict';
import fs from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';

// Liste aqui as pastas específicas que deseja monitorar
const pastasParaMonitorar = [
    'F:\\A', 'F:\\B', 'F:\\C', 'F:\\D', 'F:\\E', 'F:\\F', 'F:\\G', 'F:\\H', 'F:\\I', 'F:\\J',
    'F:\\K', 'F:\\L', 'F:\\M', 'F:\\N', 'F:\\O', 'F:\\P', 'F:\\Q', 'F:\\R', 'H:\\S', 'H:\\T', 'H:\\U', 'H:\\V', 'H:\\W', 'H:\\X', 'H:\\Y', 'H:\\Z'
];

// Caminho do arquivo JSON a ser atualizado
const arquivoSaida = path.resolve('API_AnimeNetBr/DB_Local/animacoes.json');
const diretorioArquivoSaida = path.dirname(arquivoSaida);
if (!fs.existsSync(diretorioArquivoSaida))
    throw new Error(`Diretório do arquivo de saída não existe: ${diretorioArquivoSaida}`);

// Função principal para gerar a estrutura personalizada
function gerarEstruturaPersonalizada(pastasParaMonitorar) {
    let idGlobal = 1;
    return pastasParaMonitorar.flatMap(pastaRaiz => {
        let itensRaiz;
        try {
            itensRaiz = fs.readdirSync(pastaRaiz, { withFileTypes: true });
        } catch (erro) {
            console.warn(`Não foi possível ler ${pastaRaiz}: ${erro.message}`);
            return [];
        }
        // Apenas pastas do segundo nível
        return itensRaiz
            .filter(item => item.isDirectory())
            .map(item => {
                const fullPath = path.join(pastaRaiz, item.name);
                // Lê as subpastas do segundo nível
                let subpastas = [];
                try {
                    subpastas = fs.readdirSync(fullPath, { withFileTypes: true })
                        .filter(subitem => subitem.isDirectory())
                        .map(subitem => {
                            const subFullPath = path.join(fullPath, subitem.name);
                            // Lê arquivos e subpastas da subpasta
                            let conteudo = [];
                            try {
                                conteudo = fs.readdirSync(subFullPath, { withFileTypes: true })
                                    .map(f => {
                                        if (f.isDirectory()) {
                                            return {
                                                nome: f.name,
                                                tipo: 'pasta'
                                            };
                                        } else {
                                            return {
                                                nome: f.name,
                                                tipo: 'arquivo'
                                            };
                                        }
                                    });
                            } catch (erro) {
                                console.warn(`Não foi possível ler ${subFullPath}: ${erro.message}`);
                            }
                            // Procura arquivo .jpg com nome numérico
                            const jpg = conteudo.find(arq => arq.tipo === 'arquivo' && /^\d+\.jpg$/.test(arq.nome));
                            const idSubpasta = jpg ? parseInt(jpg.nome) : null;
                            return {
                                id: idSubpasta,
                                nome: subitem.name,
                                arquivos: conteudo // inclui tudo: arquivos e subpastas
                            };
                        });
                } catch (erro) {
                    console.warn(`Não foi possível ler subpastas de ${fullPath}: ${erro.message}`);
                }
                return {
                    id: idGlobal++,
                    nome: item.name,
                    subpastas: subpastas
                };
            });
    });
}

// Debounce para evitar execuções múltiplas
let timeout;
function atualizarAnimacoesDebounced() {
    clearTimeout(timeout);
    timeout = setTimeout(atualizarAnimacoes, 1000);
}

// Função para atualizar o JSON com a estrutura de todas as pastas monitoradas
function atualizarAnimacoes() {
    const estrutura = gerarEstruturaPersonalizada(pastasParaMonitorar);
    let jsonAtual = {};
    try {
        if (fs.existsSync(arquivoSaida)) {
            jsonAtual = JSON.parse(fs.readFileSync(arquivoSaida, 'utf-8'));
        }
        jsonAtual.objAnimacoes = estrutura;
        jsonAtual.ultimaAtualizacao = new Date().toISOString();
        fs.writeFileSync(arquivoSaida, JSON.stringify(jsonAtual, null, 2));
        console.log(`Arquivo ${arquivoSaida} atualizado com sucesso!`);
    } catch (erro) {
        console.error('Erro ao atualizar animacoes.json:', erro.message);
    }
}

// Inicializa o watcher para monitorar mudanças em tempo real nas pastas específicas
const watcher = chokidar.watch(pastasParaMonitorar, {
    ignoreInitial: false,
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
