import React from 'react';

import styles from './MonthTxList.module.scss';
import { Month } from '../models/month/month.class';
import { TxList } from './TxList';

interface IProps {
    month: Month;
}

export const MonthTxList = React.memo(({month}: IProps) => {
    const days = month.days;

    return (
        <ul className={styles.days}>
            {days.map(day => (
                <li key={day.date} className={styles.day}>
                    <div>
                        {day.date}
                        {/*<div className={styles.txItem__first}>*/}
                        {/*    {tx.first*/}
                        {/*        ? tx.first*/}
                        {/*        : <span className={styles.empty}>Без заголовка</span>*/}
                        {/*    }*/}
                        {/*</div>*/}
                        {/*<div className={styles.txItem__second}>*/}
                        {/*    {tx.second*/}
                        {/*        ? tx.second*/}
                        {/*        : <span className={styles.empty}>Без заголовка</span>*/}
                        {/*    }*/}
                        {/*</div>*/}
                    </div>
                    <TxList list={day.transactions} dayDate={day.date}/>
                </li>
            ))}
        </ul>
    );
});
