import Link from 'next/link';
import sytles from './HeaderPage.module.css';
import Image from 'next/image';

export default function HeaderPage() {
    return (
        <header className={sytles.linearGradiente}>
            <div>
                <Link href="/">
                    <Image className={sytles.imgResponsive} src="/Logo_Dtudo_2022-300p.png" width={300} height={100} alt='Logo Dtudo-Animação' priority/>
                </Link>
            </div>
            <div>
                <a href="./animacao.html" target="_blank" rel="noopener noreferrer">
                    <button className="btnNovaAnimacao">Animações</button>
                </a>
            </div>
            <div>
                <Link href="/">
                    <h1>MyAnimes</h1>(v3.0.0 2025, React Next.js TypeScript)
                </Link>
            </div>
        </header>
    );
};
