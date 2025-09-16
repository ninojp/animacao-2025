'use client';
import { useState } from "react";
import styles from "./FormularioDeBusca.module.css";

//input controlado, até o react 18 usava-se o evento ChangeEvent
export default function FormularioDeBusca() {
    const [consulta, setConsulta] = useState("");
    function aoSubmeter(evento: React.FormEvent) {
        evento.preventDefault();
        console.log(`Você pesquisou por: ${consulta}`);
        // alert(`Você pesquisou por: ${consulta}`);
    }
    return (
        <form className={styles.divCampoBuscar} onSubmit={aoSubmeter}>
            <input
                className={styles.inputCampoBuscar}
                type="search"
                placeholder="Digite o que procura"
                value={consulta} onChange={(e) => setConsulta(e.target.value)}
            />
            <button type="submit">Buscar</button>
        </form>
    );
}
