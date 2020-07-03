import React from 'react';
import { Money } from '../models/money/money.class';

import styles from './MoneyView.module.scss';

interface IProps {
    money: Money;
}

export const MoneyView = ({money}: IProps) => {
    if (!(money instanceof Money))
        throw new Error(`money must be instance of Money, but get ${typeof money} ${JSON.stringify(money)}"`);
    return (
        <div className={styles.moneyView}>
            <span className={styles.entire}>{money.getEntire()}</span>
            <span className={styles.fractional}>{money.getFractional()}</span>
            <span className={styles.currency}>{money.getSymbol()}</span>
        </div>
    );
};
