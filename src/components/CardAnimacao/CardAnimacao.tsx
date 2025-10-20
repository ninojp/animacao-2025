'use client';
import Image from 'next/image'
import styles from './CardAnimacao.module.css';
import { useEffect, useState } from 'react';
import http from '@/api/conectAPI';

type Animacao = {
    id: string | number;
    nome: string;
    imgSrc?: string;
    slug?: string;
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
    return (
        <div className={styles.containerListaCardAnimacaoDiv}>
            {animacoes.map((animacao, index) => (
                <article key={String(animacao.id)} className={styles.animacaoCardArticle}>
                    <h3>{animacao.nome}</h3>
                    <figure className={styles.figureImagemAnimacao}>
                        <Image
                            className={styles.imgAnimacao}
                            // imagens públicas em 'public/imgs/animacoes' são servidas em '/imgs/animacoes/...'
                            src={animacao.imgSrc ? `/imgs/animacoes/${encodeURIComponent(String(animacao.imgSrc))}` : '/icone-editar.png'}
                            alt={animacao.nome}
                            width={300}
                            height={200}
                            unoptimized={true}
                            // marcar como priority quando for o primeiro item (possível LCP)
                            priority={index === 0}
                        />
                    </figure>
                    <p>{animacao.id}</p>
                </article>
            ))}
        </div>
    );
};
