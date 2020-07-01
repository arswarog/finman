import React from 'react';
import { Link } from 'react-router-dom';
import { paths } from '../routes';
import styles from './NavBar.module.scss';

export const NavBar = () => {
    return (
        <nav className={styles.bottomNavigation}>
            <ul>
                <li>
                    <Link to={paths.home()}>Home</Link>
                </li>
                <li>
                    <Link to={paths.transactions.list}>Transactions</Link>
                </li>
            </ul>
        </nav>
    );
};
