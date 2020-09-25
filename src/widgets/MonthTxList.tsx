import React from 'react';

import styles from './MonthTxList.module.scss';
import { MonthLegacy } from '../models/month/month-legacy.class';
import { TxList } from './TxList';
import { DayDate } from '../models/common/date.types';
import format from 'date-fns/format';
import { AbstractMonthGrip } from '../models/abstract-grip/month-grip.class';
import { Section } from '../ui-kit/Section';

interface IProps {
    month: AbstractMonthGrip;
    reverse?: boolean;
}

export const MonthTxList = React.memo(({month, reverse}: IProps) => {
    if (!month)
        return (
            <div>No data</div>
        );

    const days = [...month.days];
    if (reverse)
        days.reverse();

    return (
        <>
            {days.map(day => (
                <Section full title={formatDayDate(day.date)}>
                    <TxList list={day.transactions} reverse={reverse}/>
                </Section>
            ))}
        </>
    );
});


function formatDayDate(date: DayDate): string {
    return format(new Date(date), 'do LLLL');
}
