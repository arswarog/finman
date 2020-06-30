import React from 'react';
import { MoneyView } from '../components/MoneyView';
import { useAtom } from '@reatom/react';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { useRouteMatch } from 'react-router';
import { MonthDate } from '../models/common/date.types';
import { Link } from 'react-router-dom';
import { MonthTxList } from '../widgets/MonthTxList';
import { Months } from '../atoms/months/months.atom';
import { Month } from '../models/month/month.class';
import { paths } from '../routes';

export const AccountMonthsPage = () => {
    const accounts = useAtom(Accounts);
    const months = useAtom(Months);
    const {params} = useRouteMatch<{ account: string, month?: MonthDate }>();

    const account = accounts.accounts.get(params.account);
    if (!account)
        return (
            <div>No account</div>
        );

    if (!account.months.length)
        return (
            <div>No months in this account</div>
        );

    console.log(params);
    const monthDate = params.month || account.head.month;
    let monthIndex = account.months.findIndex(item => item.month === monthDate);

    if (monthIndex === -1)
        monthIndex = 0;

    const month: Month = months.get(account.months[monthIndex].id);
    const prevMonth = account.months[monthIndex + 1];
    const nextMonth = account.months[monthIndex - 1];

    if (!month)
        return (
            <div>Loading month</div>
        );

    return (
        <div>
            AccountMonthsPage
            <h3>{account.name}</h3>
            <div>
                <div>
                    {prevMonth &&
                    <Link to={paths.account.months(account.id, prevMonth.month)}>{prevMonth.month}</Link>
                    }
                    {nextMonth &&
                    <Link to={paths.account.months(account.id, nextMonth.month)}>{nextMonth.month}</Link>
                    }
                </div>
                <h3>Month {month.month}</h3>
                <h4><MoneyView money={month.summary.balance}/></h4>
                <div>+<MoneyView money={month.summary.income}/></div>
                <div>-<MoneyView money={month.summary.expense}/></div>
            </div>
            <MonthTxList month={month}/>
        </div>
    );
};
