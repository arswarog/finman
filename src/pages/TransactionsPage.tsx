import React from 'react';

import styles from './TransactionsPage.module.scss';
import { Header } from '../components/Header';
import { TxList } from '../components/TxList';
import { ITransaction } from '../finances/transaction.types';

export const TransactionsPage = () => {
    const month = '2020-05';

    const transactions: ITransaction[] = [
        {id: 1},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
        {id: 2},
    ] as any;

    return (
        <div className={styles.page}>
            <Header title={`Transactions of ${month}`}/>
            <main>
                <div className={styles.filter}>
                    <button>Все</button>
                    <button>Траты</button>
                    <button>Приход</button>
                </div>
                <TxList list={transactions}/>
            </main>
        </div>
    );
};
