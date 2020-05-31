import React from 'react';

import styles from './Header.module.scss';

interface IParams {
    title: string;
}

export const Header = ({title}: IParams) => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
        </header>
    );
};
