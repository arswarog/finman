import React from 'react';
import { ITransaction } from '../finances/transaction.types';

import styles from './TxList.module.scss';
import { Link } from 'react-router-dom';
import { makeTxList } from './TxList.utils';
import { MoneyView } from './MoneyView';

interface IProps {
    list: ITransaction[];
}

export const TxList = ({list}: IProps) => {
    console.log('render');

    const txList = makeTxList(list);

    return (
        <ul className={styles.txList}>
            {txList.map((tx, index) => (
                <li key={index} className={styles.txItem}>
                    <div className={styles.txItem__left}>
                        <div className={styles.txItem__first}>
                            {tx.first}
                        </div>
                        <div className={styles.txItem__second}>
                            {tx.second}
                        </div>
                    </div>
                    <div className={styles.txItem__right}>
                        <div className={styles.txItem__amount}>
                            <MoneyView money={tx.amount}/>
                        </div>
                        <div className={styles.txItem__date}>
                            {tx.date}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

