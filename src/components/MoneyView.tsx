import React from 'react';
import { Money } from '../finances/money.class';

import styles from './MoneyView.module.scss';

interface IProps {
    money: Money;
}


export const MoneyView = ({money}: IProps) => {
    return (
        <div className={styles.moneyView}>
            <span className={styles.entire}>{money.getEntire()}</span>
            <span className={styles.fractional}>{money.getFractional()}</span>
            <span className={styles.currency}>{money.getSymbol()}</span>
        </div>
    );
};
