'use strict';
import fs from 'node:fs';
import quebraEmParagrafo from '../controllers/quebraTextoContaPalavra.js';
import criaObjAnime from '../controllers/criaObjAnime.js';

//v3 da função, refatorada pela Luri
async function lerArquivo(link) {
    try {
        const texto = await fs.promises.readFile(link, 'utf-8');
        const arrrayParagrafos = quebraEmParagrafo(texto);
        const arrayObjsAnimacao = criaObjAnime(arrrayParagrafos);
        return arrayObjsAnimacao;
    } catch (error) {
        console.error('Erro na função lerArquivo: ', error);
        throw error; // Lança o erro novamente para que possa ser tratado onde a função for chamada
    }
}
//==============================================================================================
// Função para ler o arquivo.txt
// function lerArquivo(link) {//v1, estava funcionando
//     return new Promise((resolve, reject) => {
//         fs.readFile(link, 'utf-8', (erro, texto) => {
//             if (erro) {
//                 reject(erro);
//             } else {
//                 const arrrayParagrafos = quebraEmParagrafo(texto);
//                 const arrayObjsAnimacao = criaObjAnime(arrrayParagrafos);
//                 resolve(arrayObjsAnimacao);
//             }
//         });
//     });
// };
//==================================================================================

//v1 da função, refatorada pela Luri
// Função para salvar o array em um arquivo JSON
async function salvarArquivoJSON(nomeArquivo, dados) {
    const dadosJSON = JSON.stringify(dados, null, 2);
    try {
        await fs.promises.writeFile(nomeArquivo, dadosJSON);
        return `Arquivo ${nomeArquivo} salvo com sucesso!`;
    } catch (erro) {
        console.error('Erro ao salvar o arquivo: ', erro);
        throw erro;//Também interrompe a execução da função em caso de erro.
    }
}
//==============================================================================================
//original q estava funcionando
// function salvarArquivoJSON(nomeArquivo, dados) {
//     const dadosJSON = JSON.stringify(dados, null, 2);
//     return new Promise((resolve, reject) => {
//         fs.writeFile(nomeArquivo, dadosJSON, (erro) => {
//             if (erro) {
//                 reject(erro);
//             } else {
//                 resolve(`Arquivo ${nomeArquivo} salvo com sucesso!`);
//             };
//         });
//     });
// };
// Função principal que usa async/await
async function main() {
    const link = './listaPastas.txt';
    try {
        const arrayObjsAnimes = await lerArquivo(link);
        // console.log(arrayObjsAnimes, typeof arrayObjsAnimes);
        const mensagem = await salvarArquivoJSON('animacoes.json', arrayObjsAnimes);
        console.log(mensagem);
        // Aqui você pode usar arrayObjsAnimes em outras funções se precisar
        return arrayObjsAnimes;//ou retornar pra FORA o arrayObjsAnimes
    } catch (erro) {
        console.error('Erro:', erro);
        throw erro;
    };
};
const testRetorno = await main();
console.log(testRetorno);
//==========================================================================================================

// PRIMEIRO EU FIZ O CÓDIGO ASSIM...
// //node lerArquivoTxt.js ./AnimesA-B.txt
// // const caminhoArquivo = process.argv;// Usado para passar via CLI, o endereço do arquivo a ser lido
// // const link = caminhoArquivo[2];
// const link = './listAnimes.txt';
// fs.readFile(link, 'utf-8', (erro, texto) => {
//     if (erro) throw erro;
//     // console.log(texto, typeof texto);
//     // if (erro) { console.error(erro); return; };
//     const arrrayParagrafos = quebraEmParagrafo(texto);
//     // console.log(arrrayParagrafos);
//     const arrayObjsAnimes = criaObjAnime(arrrayParagrafos);
//     console.log(arrayObjsAnimes, typeof arrayObjsAnimes);
// });
