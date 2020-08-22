import React from 'react';
import { ITransaction } from '../models/transaction/transaction.types';

import styles from './TxList.module.scss';
import { makeTxList } from './TxList.utils';
import { MoneyView } from '../components/MoneyView';
import { DayDate } from '../models/common/date.types';
import { TransactionGrip } from '../models/abstract-grip/transaction-grip.class';
import { CategoryIcon } from '../components/CategoryIcon';
import { Link, paths } from '../routes';
import { dayDateToMonth } from '../models/common/date.utils';

interface IProps {
    list: TransactionGrip[];
    dayDate: DayDate;
}

export const TxList = React.memo(({list, dayDate}: IProps) => {
    const txList = makeTxList(list);

    return (
        <ul className="listview image-listview inset">
            {txList.map((tx, index) => (
                <li>
                    <Link to={paths.transactions.view(tx.account.id, tx.date, tx.id)} className="item">
                        <div className="icon-box">
                            <CategoryIcon category={tx.category}/>
                        </div>
                        <div className="in">
                            <div>
                                {tx.first
                                    ? tx.first
                                    : <span className={styles.empty}>Без заголовка</span>
                                }
                                <footer>{tx.second
                                    ? tx.second
                                    : <span className={styles.empty}>Без заголовка</span>
                                }</footer>
                            </div>
                            <span><MoneyView money={tx.amount}/></span>
                        </div>
                        {/*<CategoryIcon category={tx.category}/>*/}
                        {/*<img src="assets/img/sample/avatar/avatar1.jpg" alt="image" className="image"/>*/}
                        {/*<div className="in">*/}
                        {/*    <div>*/}
                        {/*        {tx.first*/}
                        {/*            ? tx.first*/}
                        {/*            : <span className={styles.empty}>Без заголовка</span>*/}
                        {/*        }*/}
                        {/*        <footer>{tx.second*/}
                        {/*            ? tx.second*/}
                        {/*            : <span className={styles.empty}>Без заголовка</span>*/}
                        {/*        }</footer>*/}
                        {/*    </div>*/}
                        {/*    <span className="text-muted">*/}
                        {/*        <MoneyView money={tx.amount}/>*/}
                        {/*    </span>*/}
                        {/*</div>*/}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <ul className={styles.txList}>
            {txList.map((tx, index) => (
                <li key={index} className={styles.txItem}>
                    <div className={styles.txItem__left}>
                        <div className={styles.txItem__first}>

                        </div>
                        <div className={styles.txItem__second}>

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
