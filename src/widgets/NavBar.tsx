import React from 'react';
import { paths, NavLink } from '../routes';
import styles from './NavBar.module.scss';

export const NavBar = () => {
    return (
        <nav className={styles.bottomNavigation}>
            <ul>
                <li>
                    <NavLink to={paths.home()} exact>
                        <div className="icon dripicons-home"/>
                        <span>Home</span>
                    </NavLink>
                </li>
                {/*<li>*/}
                {/*    <NavLink to={paths.account.list()}>*/}
                {/*        <div className="icon dripicons-wallet"/>*/}
                {/*        <span>Wallets</span>*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <NavLink to={paths.licenses()}>*/}
                {/*        <div className="icon dripicons-graph-pie"/>*/}
                {/*        <span>Statistics</span>*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <NavLink to={paths.licenses()}>*/}
                {/*        <div className="icon dripicons-tags"/>*/}
                {/*        <span>Categories</span>*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <NavLink to={paths.home()}>*/}
                {/*        <div className="icon dripicons-menu"/>*/}
                {/*        <span>Menu</span>*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                <li>
                    <NavLink to={paths.transactions.add()}>
                        <div className="icon dripicons-plus"/>
                        <span>Add</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={paths.licenses()}>
                        <div className="icon dripicons-document"/>
                        <span>Licenses</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};
