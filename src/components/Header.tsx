import React, { useCallback } from 'react';

import styles from './Header.module.scss';
import { Icon } from '../ui-kit/Icon';
import { Link } from '../routes';
import { useHistory } from 'react-router';

interface IParams {
    title: string;
    back?: string | boolean;
}

export const Header = ({title, back}: IParams) => {
    const history = useHistory();

    const onClick = useCallback(() => {
        if (!back)
            return;
        if (back === true)
            return history.goBack();
        history.replace(back);
    }, [history, back]);

    return (
        <div className="appHeader">
            {back &&
            <div className="left">
                <span onClick={onClick} className="headerButton goBack">
                    <Icon name="chevron-back-outline" role="img" className="md hydrated"
                          aria-label="chevron back outline"/>
                </span>
            </div>
            }
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
