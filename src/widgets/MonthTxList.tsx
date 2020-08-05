import React from 'react';

import styles from './MonthTxList.module.scss';
import { Month } from '../models/month/month.class';
import { TxList } from './TxList';
import { DayDate } from '../models/common/date.types';
import format from 'date-fns/format';
import { AbstractMonthGrip } from '../models/abstract-grip/month-grip.class';

interface IProps {
    month: AbstractMonthGrip;
}

export const MonthTxList = React.memo(({month}: IProps) => {
    if (!month)
        return (
            <div>No data</div>
        );

    const days = month.days;

    return (
        <ul className={styles.days}>
            {days.map(day => (
                <li key={day.date} className={styles.day}>
                    <div className={styles.title}>
                        {formatDayDate(day.date)}
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


function formatDayDate(date: DayDate): string {
    return format(new Date(date), 'do LLLL');
}
