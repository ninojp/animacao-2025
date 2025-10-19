import styles from "./page.module.css";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import FooterPage from "@/components/FooterPage/FooterPage";
import CampoBuscar from "@/components/CampoBuscar/CampoBuscar";
// import FormularioDeBusca from "@/components/FormularioDeBusca/FormularioDeBusca";

export default function Home() {
  return (
    <div>
      <HeaderPage />
      <main className={styles.mainPageContainer}>
        <CampoBuscar />
        {/* <FormularioDeBusca /> */}
      </main>
      <FooterPage />
    </div>
  );
};
