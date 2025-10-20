import styles from "./page.module.css";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import FooterPage from "@/components/FooterPage/FooterPage";
import CampoBuscar from "@/components/CampoBuscar/CampoBuscar";
import Section from "@/components/Section/Section";
import CardAnimacao from "@/components/CardAnimacao/CardAnimacao";
// import FormularioDeBusca from "@/components/FormularioDeBusca/FormularioDeBusca";

export default function Home() {
  return (
    <div>
      <HeaderPage />
      <main className={styles.mainPageContainer}>
        <Section>
          <div className={styles.containerFlex}>
            <h2>Bem vindo ao MyAnimes</h2>
            <p>Minha idéia principal com este projeto é usa-lo para praticar todo meu conhecimento adquirido nos cursos, formações e agora a Carreira React. Para reformular meu projeto pessoal, minha coleção de animes.</p>
          </div>
          <CampoBuscar />
        </Section>
        <Section>
          <div className={styles.containerFlex}>
            <h2>Lista de Meus Animes</h2>
            <p>Esta é uma seção para listar por ordem alfabetica todos as minhas animações.</p>
          </div>
          <CardAnimacao />
        </Section>
      </main>
      <FooterPage />
    </div>
  );
};
