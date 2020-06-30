import React from 'react';

import styles from './TransactionsPage.module.scss';
import { Header } from '../widgets/Header';
import { TxList } from '../widgets/TxList';
import { ITransaction } from '../models/transaction/transaction.types';

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
export const TransactionsPage = () => {
    const month = '2020-05';


    return (
        <div className={styles.page}>
            <Header title={`Transactions of ${month}`}/>
            <main>
                <div className={styles.filter}>
                    <button className={styles.active}>Все</button>
                    <button>Траты</button>
                    <button>Приход</button>
                </div>
                <TxList list={transactions} dayDate="2020-05-05"/>
            </main>
        </div>
    );
};
