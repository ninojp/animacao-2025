import React from 'react';
import styles from './Section.module.css';

export default function Section({ children }: { children: React.ReactNode }) {
    return (
        <section className={styles.containerFlex}>
            {children}
        </section>
    );
};
