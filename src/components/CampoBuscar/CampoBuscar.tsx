'use client';
import { useState } from "react";
import styles from "./CampoBuscar.module.css";

export default function CampoBuscar() {
    const [valor, setValor] = useState("");
    console.log(valor);
    
    return (
        <div className={styles.divCampoBuscar}>
            <input
                className={styles.inputCampoBuscar}
                type="search"
                placeholder="Digite o que procura"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
            />
        </div>
    );
};
