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
            {/*<NavLink to="123" exact className="item">*/}
            {/*    <div className="col">*/}
            {/*        <Icon icon={Icons.cardOutline} role="img" className="md hydrated"*/}
            {/*              aria-label="document text outline"/>*/}
            {/*        <strong>Pages</strong>*/}
            {/*    </div>*/}
            {/*</NavLink>*/}
            <NavLink to={paths.transactions.add()} className="item">
                <div className="col">
                    <Icon icon={Icons.addCircleOutline} role="img" className="md hydrated"
                          aria-label="apps outline"/>
                    <strong>Components</strong>
                </div>
            </NavLink>
            {/*<NavLink to="123" className="item">*/}
            {/*    <div className="col">*/}
            {/*        <Icon icon={Icons.globeOutline} role="img" className="md hydrated"*/}
            {/*              aria-label="card outline"/>*/}
            {/*        <strong>My Cards</strong>*/}
            {/*    </div>*/}
            {/*</NavLink>*/}
            <NavLink to={paths.menu()} className="item">
                <div className="col">
                    <Icon icon={Icons.ellipsisHorizontalOutline} role="img" className="md hydrated"
                          aria-label="settings outline"/>
                    <strong>Settings</strong>
                </div>
            </NavLink>
        </div>
    );
};
