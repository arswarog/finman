import { MonthsMap } from '../atoms/months/months.types';
import { IMonthBrief } from '../models/month/month.types';
import React from 'react';
import { MoneyView } from '../components/MoneyView';
import { MonthTxList } from './MonthTxList';
import styles from './MonthViewWidget.module.scss';
import format from 'date-fns/format';
import { IMonthGripBrief } from '../models/abstract-grip/grip.types';
import { MonthGripsMap } from '../atoms/month-grips/month-grips.types';

interface IProps {
    months: MonthGripsMap;
    brief?: IMonthGripBrief;
    prev?: IMonthGripBrief;
    next?: IMonthGripBrief;
    moveToPrev?: () => void;
    moveToNext?: () => void;
}

export const MonthViewHeadWidget = ({brief}: IProps) => {
    if (!brief)
        return <div>No month</div>;

    const circumference = 452;
    const totalSum = brief.income.subunits + brief.expense.subunits;
    const incomePercent = brief.income.subunits / totalSum * circumference;
    const expensePercent = brief.expense.subunits / totalSum * circumference;

    return (
        <div className="section">
            <div className="card">
                <div className="card-header">
                    {format(new Date(brief.month), 'MMMM yyyy')}
                </div>
                <div className="card-body">
                    <div className={styles.head}>
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
                                            strokeDasharray={[0, incomePercent, expensePercent, circumference].join(' ')}/>
                                </svg>
                                <h4 className={styles.balance}><MoneyView money={brief.balance}/></h4>
                                <div>+<MoneyView money={brief.income}/></div>
                                <div>-<MoneyView money={brief.expense}/></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.head}>
            {/*<h3 className={styles.title}>{format(new Date(brief.month), 'MMMM yyyy')}</h3>*/}
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
    const totalSum = month.income.subunits + month.expense.subunits;
    const incomePercent = month.income.subunits / totalSum * circumference;
    const expensePercent = month.expense.subunits / totalSum * circumference;

    return (
        <>
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
                        <h4 className={styles.balance}><MoneyView money={month.balance}/></h4>
                        <div>+<MoneyView money={month.income}/></div>
                        <div>-<MoneyView money={month.expense}/></div>
                    </div>
                </div>
            </div>
            <MonthTxList month={month}/>
        </>
    );
};
