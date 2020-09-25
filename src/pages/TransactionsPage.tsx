import React from 'react';

import styles from './TransactionsPage.module.scss';
import { Header } from '../components/Header';
import { TxList } from '../widgets/TxList';
import { TransactionGrip } from '../models/abstract-grip/transaction-grip.class';
import { MonthDate } from '../models/common/date.types';
import { Main } from '../ui-kit/Main';

interface IProps {
    month: MonthDate;
    transactions: TransactionGrip[];
}

export const TransactionsPage = ({month, transactions}: IProps) => {
    transactions = transactions || [];
    return (
        <div className={styles.page}>
            <Header title={`Transactions of ${month}`}/>
            <Main>
                <div className={styles.filter}>
                    <button className={styles.active}>Все</button>
                    <button>Траты</button>
                    <button>Приход</button>
                </div>
                <TxList list={transactions}/>
            </Main>
        </div>
    );
};
