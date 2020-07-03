import { MonthsMap } from '../atoms/months/months.types';
import { IMonthBrief } from '../models/month/month.types';
import React from 'react';
import { Swipeable } from 'react-swipeable';
import { MoneyView } from '../components/MoneyView';
import { MonthTxList } from './MonthTxList';
import { Account } from '../models/account/account.class';
import styles from './MonthViewWidget.module.scss';
import format from 'date-fns/format';

interface IProps {
    months: MonthsMap;
    brief?: IMonthBrief;
    prev?: IMonthBrief;
    next?: IMonthBrief;
    moveToPrev?: () => void;
    moveToNext?: () => void;
}

export const MonthViewHeadWidget = ({months, brief, prev, next, moveToPrev, moveToNext}: IProps) => {
    // moveToPrev = moveToPrev || (() => null);
    // moveToNext = moveToNext || (() => null);

    if (!brief)
        return <div>No month</div>;

    // if (!months.has(brief.id)) {
    //     return <div>Loading month</div>;
    // }

    // const month = months.get(brief.id);
    //
    // if (!month)
    //     return <div>Loading month</div>;

    const circumference = 452;
    const totalSum = brief.summary.income.subunits + brief.summary.expense.subunits;
    const incomePercent = brief.summary.income.subunits / totalSum * circumference;
    const expensePercent = brief.summary.expense.subunits / totalSum * circumference;

    return (
        <div className={styles.head}>
            <h3 className={styles.title}>{format(new Date(brief.month), 'MMMM yyyy')}</h3>
            <div className={styles.info}>
                <div className={styles.circle}>
                    <svg width="160" height="160">
                        <circle transform="rotate(-90)"
                                r="72" cx="-80" cy="80"/>
                        <circle className="income"
                                transform="rotate(-90)"
                                r="72" cx="-80" cy="80"
                                stroke="30bae7"
                                strokeDasharray={[incomePercent, circumference].join(' ')}/>
                        <circle className="expense"
                                transform="rotate(-90)"
                                r="72" cx="-80" cy="80"
                                strokeDashoffset={incomePercent}
                                strokeDasharray={[expensePercent, circumference].join(' ')}/>
                    </svg>
                    <h4 className={styles.balance}><MoneyView money={brief.summary.balance}/></h4>
                    <div>+<MoneyView money={brief.summary.income}/></div>
                    <div>-<MoneyView money={brief.summary.expense}/></div>
                </div>
            </div>
        </div>
    );
};


export const MonthViewWidget = ({months, brief, prev, next, moveToPrev, moveToNext}: IProps) => {
    moveToPrev = moveToPrev || (() => null);
    moveToNext = moveToNext || (() => null);

    if (!brief)
        return <div>No month</div>;

    if (!months.has(brief.id)) {
        return <div>Loading month</div>;
    }

    const month = months.get(brief.id);

    if (!month)
        return <div>Loading month</div>;

    const circumference = 452;
    const totalSum = month.summary.income.subunits + month.summary.expense.subunits;
    const incomePercent = month.summary.income.subunits / totalSum * circumference;
    const expensePercent = month.summary.expense.subunits / totalSum * circumference;

    return (
        <>
            {/*<Swipeable*/}
            {/*    trackMouse*/}
            {/*    preventDefaultTouchmoveEvent*/}
            {/*    onSwipedRight={moveToPrev}*/}
            {/*    onSwipedLeft={moveToNext}*/}
            {/*>*/}
            <div className={styles.head}>
                <h3 className={styles.title}>{format(new Date(month.month), 'MMMM yyyy')}</h3>
                <div className={styles.info}>
                    {prev && <div className={styles.prev}
                                  onClick={moveToPrev}>
                        <svg width="24" height="24"
                             xmlns="http://www.w3.org/2000/svg"
                             fillRule="evenodd"
                             clipRule="evenodd">
                            <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z"/>
                        </svg>
                    </div>}
                    {next && <div className={styles.next}
                                  onClick={moveToNext}>
                        <svg width="24" height="24"
                             xmlns="http://www.w3.org/2000/svg"
                             fillRule="evenodd"
                             clipRule="evenodd">
                            <path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z"/>
                        </svg>
                    </div>}
                    <div className={styles.circle}>
                        <svg width="160" height="160">
                            <circle transform="rotate(-90)"
                                    r="72" cx="-80" cy="80"/>
                            <circle className="income"
                                    transform="rotate(-90)"
                                    r="72" cx="-80" cy="80"
                                    stroke="30bae7"
                                    strokeDasharray={[incomePercent, circumference].join(' ')}/>
                            <circle className="expense"
                                    transform="rotate(-90)"
                                    r="72" cx="-80" cy="80"
                                    strokeDashoffset={incomePercent}
                                    strokeDasharray={[expensePercent, circumference].join(' ')}/>
                        </svg>
                        <h4 className={styles.balance}><MoneyView money={month.summary.balance}/></h4>
                        <div>+<MoneyView money={month.summary.income}/></div>
                        <div>-<MoneyView money={month.summary.expense}/></div>
                    </div>
                </div>
            </div>
            {/*</Swipeable>*/}
            <MonthTxList month={month}/>
        </>
    );
};
