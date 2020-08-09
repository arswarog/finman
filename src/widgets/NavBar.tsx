import React from 'react';
import { paths, NavLink } from '../routes';
import { Icon, Icons } from '../ui-kit/Icon';

interface INavLink {
    path: string;
    exact?: boolean;
    icon: string;
    label: string;
}

const links: INavLink[] = [
    {
        path: paths.home(),
        exact: true,
        icon: Icons.walletOutline,
        label: 'Wallets',
    },
    // {
    //     path: paths.home(),
    //     exact: true,
    //     icon: Icons.cardOutline,
    //     label: 'Wallets',
    // },
    {
        path: paths.transactions.add(),
        icon: Icons.addCircleOutline,
        label: 'New item',
    },
    {
        path: paths.menu(),
        icon: Icons.ellipsisHorizontalOutline,
        label: 'Menu',
    },
];

export const NavBar = () => {
    return (
        <div className="appBottomMenu">
            {links.map(link => (
                <NavLink to={link.path} exact={link.exact} className="item">
                    <div className="col">
                        <Icon icon={link.icon} role="img" className="md hydrated"
                              aria-label="pie chart outline"/>
                        <strong>{link.label}</strong>
                    </div>
                </NavLink>
            ))}
        </div>
    );
};
