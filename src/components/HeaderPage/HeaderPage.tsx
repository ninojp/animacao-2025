import Link from 'next/link';
import sytles from './HeaderPage.module.css';
import Image from 'next/image';

export default function HeaderPage() {
    return (
        <header className={sytles.linearGradiente}>
            <div>
                <Link href="/">
                    <Image 
                        src="/Logo_Dtudo_2022-300p.png" 
                        width={300} 
                        height={100} 
                        alt='Logo Dtudo-Animação'
                        priority
                    />
                </Link>
            </div>
            <div>
                <hr />
                <p className={sytles.pTexto}>Nova versão do meu site (animes.net.br)<br /> Sobre minha coleção de animes<br /> Agora é MyAnimes</p>
                <hr />
            </div>
            <div>
                <Link href="/">
                    <h1>MyAnimes</h1>(v3.0.0 2025, React Next.js TypeScript)
                </Link>
            </div>
        </header>
    );
};
