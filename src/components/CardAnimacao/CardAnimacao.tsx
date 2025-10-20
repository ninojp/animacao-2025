'use client';
import Image from 'next/image'
import styles from './CardAnimacao.module.css';
import { useEffect, useState } from 'react';
import http from '@/api/conectAPI';

type Animacao = {
    id: string | number;
    nome: string;
    imgNome?: string;
    descricao?: string;
    // outros campos possivelmente presentes na API
    [key: string]: unknown;
}

export default function CardAnimacao() {
    const [animacoes, setAnimacoes] = useState<Animacao[]>([]);
    useEffect(() => {
        http.get('/objAnimacoes')
            .then((response) => {
                console.log(response);                
                // json-server com chave "animacoes" retorna a lista em response.data
                // se o endpoint devolver um objeto { animacoes: [...] } adaptamos abaixo
                const data = response.data?.animacoes ?? response.data ?? [];
                setAnimacoes(data);
            })
            .catch((error) => {
                console.error('Erro ao buscar animações:', error);
            });
    }, []);

    const getImagemSrc = (imgNome?: string) => {
        if (!imgNome) return '/icone-editar.png'; // fallback público
        // se imgNome já for uma URL completa, retorna-a
        if (/^https?:\/\//i.test(imgNome)) return imgNome;
        // caso padrão, espere que as imagens estejam em /public/imagens/
        return `/imgs/animacoes/${imgNome}`;
    }

    return (
        <div className={styles.containerListaCardAnimacaoDiv}>
            {animacoes.map((animacao) => (
                <article key={String(animacao.id)} className={styles.animacaoCardArticle}>
                    <h3>{animacao.nome}</h3>
                    <figure className={styles.figureImagemAnimacao}>
                        <Image
                            className={styles.imgAnimacao}
                            src={getImagemSrc(animacao.imgNome)}
                            alt={animacao.nome}
                            width={300}
                            height={200}
                            unoptimized={true}
                        />
                    </figure>
                    <p>{animacao.id}</p>
                </article>
            ))}
        </div>
    );
};
