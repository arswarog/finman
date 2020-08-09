import React from 'react';

import styles from './Header.module.scss';
import { Icon } from '../ui-kit/Icon';

interface IParams {
    title: string;
}

export const Header = ({title}: IParams) => {
    return (
        <div className="appHeader">
            <div className="left">
                <a href="javascript:;" className="headerButton goBack">
                    <Icon name="chevron-back-outline" role="img" className="md hydrated"
                          aria-label="chevron back outline"/>
                </a>
            </div>
            <div className="pageTitle">{title}</div>
            <div className="right">
            </div>
        </div>
    );
};

export const HeaderOld = ({title}: IParams) => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
        </header>
    );
};
