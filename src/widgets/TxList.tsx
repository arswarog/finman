import React from 'react';
import { ITransaction } from '../models/transaction/transaction.types';

import styles from './TxList.module.scss';
import { makeTxList } from './TxList.utils';
import { MoneyView } from '../components/MoneyView';
import { DayDate } from '../models/common/date.types';
import { TransactionGrip } from '../models/abstract-grip/transaction-grip.class';

interface IProps {
    list: TransactionGrip[];
    dayDate: DayDate;
}

export const TxList = React.memo(({list, dayDate}: IProps) => {
    const txList = makeTxList(list);

    return (
        <ul className={styles.txList}>
            {txList.map((tx, index) => (
                <li key={index} className={styles.txItem}>
                    <div className={styles.txItem__left}>
                        <div className={styles.txItem__first}>
                            {tx.first
                                ? tx.first
                                : <span className={styles.empty}>Без заголовка</span>
                            }
                        </div>
                        <div className={styles.txItem__second}>
                            {tx.second
                                ? tx.second
                                : <span className={styles.empty}>Без заголовка</span>
                            }
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
});
