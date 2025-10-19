'use strict';
import fs from 'node:fs';
import path from 'node:path';

// Arquivo criado pela IA, para ler e salvar a estrutura de pastas e arquivos em um arquivo JSON
// Importante: Certifique-se de que o diretório existe e que você tem permissão para ler os arquivos nele
// Caso contrário, o código lançará um erro ao tentar ler o diretório ou escrever o arquivo de saída.
// Este código é útil para criar uma representação JSON da estrutura de diretórios, que pode ser
// utilizada em aplicações web ou para fins de documentação.

// Altere o caminho do diretório e do arquivo de saída conforme necessário
const diretorio = 'F:\\';
const arquivoSaida = 'listaDePastas.json';

// Pastas do sistema a serem ignoradas
const ignorarPastas = ['$RECYCLE.BIN', 'System Volume Information'];

function lerEstrutura(dir) {
    let itens;
    try {
        itens = fs.readdirSync(dir, { withFileTypes: true });
    } catch (erro) {
        // Não tem permissão para ler este diretório
        return [];
    }
    return itens
        .filter(item => !ignorarPastas.includes(item.name))
        .map(item => {
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
            }
        });
}

const estrutura = lerEstrutura(diretorio);
fs.writeFileSync(arquivoSaida, JSON.stringify({ pastas: estrutura }, null, 2));
console.log(`Arquivo ${arquivoSaida} salvo com sucesso!`);

// json-server --watch pastas.json --port 3001
// Sua API estará disponível em http://localhost:3001/pastas.

