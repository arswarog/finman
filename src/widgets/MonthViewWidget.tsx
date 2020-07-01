import { IMonthsState, MonthsMap } from '../atoms/months/months.types';
import { IMonthBrief } from '../models/month/month.types';
import React from 'react';
import { Link, paths } from '../routes';
import { MoneyView } from '../components/MoneyView';
import { MonthTxList } from './MonthTxList';
import { Account } from '../models/account/account.class';
import { UUID } from '../models/common/common.types';

interface IProps {
    months: MonthsMap;
    account?: Account;
    brief?: IMonthBrief;
    prev?: IMonthBrief;
    next?: IMonthBrief;
}

export const MonthWidget = ({months, account, brief, prev, next}: IProps) => {
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
            <div>
                <div>
                    {prev && <Link to={paths.account.months(account.id, prev.month)}>{prev.month}</Link>}
                    {next && <Link to={paths.account.months(account.id, next.month)}>{next.month}</Link>}
                </div>
                <h3>Month {month.month}</h3>
                <h4><MoneyView money={month.summary.balance}/></h4>
                <div>+<MoneyView money={month.summary.income}/></div>
                <div>-<MoneyView money={month.summary.expense}/></div>
            </div>
            <MonthTxList month={month}/>
        </>
    );
};
