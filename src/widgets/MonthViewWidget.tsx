import { IMonthsState, MonthsMap } from '../atoms/months/months.types';
import { IMonthBrief } from '../models/month/month.types';
import React from 'react';
import { Link, paths } from '../routes';
import { MoneyView } from '../components/MoneyView';
import { MonthTxList } from './MonthTxList';
import { Account } from '../models/account/account.class';
import { UUID } from '../models/common/common.types';
import styles from './MonthViewWidget.module.scss';
import format from 'date-fns/format';

interface IProps {
    months: MonthsMap;
    account?: Account;
    brief?: IMonthBrief;
    prev?: IMonthBrief;
    next?: IMonthBrief;
}

export const MonthViewWidget = ({months, account, brief, prev, next}: IProps) => {
    if (!brief)
        return <div>No month</div>;

    if (!months.has(brief.id)) {
        return <div>Loading month</div>;
    }

    const month = months.get(brief.id);

    if (!month)
        return <div>Loading month</div>;

    return (
        <>
            <div className={styles.head}>
                <h3 className={styles.title}>{format(new Date(month.month), 'MMMM yyyy')}</h3>
                <div className={styles.info}>
                    {prev && <Link className={styles.prev}
                                   to={paths.account.months(account.id, prev.month)}>
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                             clip-rule="evenodd">
                            <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z"/>
                        </svg>
                    </Link>}
                    {next && <Link className={styles.next}
                                   to={paths.account.months(account.id, next.month)}>
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                             clip-rule="evenodd">
                            <path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z"/>
                        </svg>
                    </Link>}
                    <div className={styles.circle}>
                        {/*<svg width="160" height="160">*/}
                        {/*    <circle transform="rotate(-90)" r="72" cx="-80" cy="80"/>*/}
                        {/*    <circle transform="rotate(-90)" r="72" cx="-80" cy="80"/>*/}
                        {/*</svg>*/}
                        <h4 className={styles.balance}><MoneyView money={month.summary.balance}/></h4>
                        <div>+<MoneyView money={month.summary.income}/></div>
                        <div>-<MoneyView money={month.summary.expense}/></div>
                    </div>
                </div>
            </div>
            <MonthTxList month={month}/>
        </>
    );
};
