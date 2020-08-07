import React from 'react';
import { paths, NavLink } from '../routes';
import styles from './NavBar.module.scss';
import { Icon, Icons } from '../components/Icon';

export const NavBar = () => {
    return (
        <div className="appBottomMenu">
            <NavLink to={paths.home()} exact className="item">
                <div className="col">
                    <Icon icon={Icons.walletOutline} role="img" className="md hydrated"
                          aria-label="pie chart outline"/>
                    <strong>Overview</strong>
                </div>
            </NavLink>
            <NavLink to={paths.home()} exact className="item">
                <div className="col">
                    <Icon icon={Icons.cardOutline} role="img" className="md hydrated"
                          aria-label="document text outline"/>
                    <strong>Pages</strong>
                </div>
            </NavLink>
            <NavLink to={paths.transactions.add()} className="item">
                <div className="col">
                    <Icon icon={Icons.addCircleOutline} role="img" className="md hydrated"
                          aria-label="apps outline"/>
                    <strong>Components</strong>
                </div>
            </NavLink>
            <NavLink to={paths.home()} className="item">
                <div className="col">
                    <Icon icon={Icons.globeOutline} role="img" className="md hydrated"
                          aria-label="card outline"/>
                    <strong>My Cards</strong>
                </div>
            </NavLink>
            <NavLink to={paths.licenses()} className="item">
                <div className="col">
                    <Icon icon={Icons.appsOutline} role="img" className="md hydrated"
                          aria-label="settings outline"/>
                    <strong>Settings</strong>
                </div>
            </NavLink>
        </div>
    );
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
