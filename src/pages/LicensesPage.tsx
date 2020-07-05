import React from 'react';
import styles from './LicensesPage.module.scss';
import { Header } from '../widgets/Header';

export const LicensesPage = () => {
    return (
        <>
            <Header title="Licenses"/>
            <main className={styles.licenses}>
                <ol>
                    <li>
                        <p className={styles.name}>Icons "Dripicons" Version 2.0</p>
                        <p className={styles.author}>Author <a href="http://amitjakhu.com">Amit Jakhu</a></p>
                        <p className={styles.license}>
                            License <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
                        </p>
                        <div className="icon dripicons-wifi"/>
                    </li>
                </ol>
            </main>
        </>
    );
};
