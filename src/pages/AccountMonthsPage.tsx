import React from 'react';
import { MoneyView } from '../components/MoneyView';
import { useAction, useAtom } from '@reatom/react';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { useRouteMatch } from 'react-router';
import { MonthDate } from '../models/common/date.types';
import { Link } from 'react-router-dom';
import { MonthTxList } from '../widgets/MonthTxList';
import { Months } from '../atoms/months/months.atom';
import { Month } from '../models/month/month.class';
import { paths } from '../routes';
import { loadMonths } from '../atoms/months/months.actions';
import { IMonthBrief } from '../models/month/month.types';
import { useStore } from '../store/store';
import { UUID } from '../models/common/common.types';
import { MonthViewWidget } from '../widgets/MonthViewWidget';
import { Header } from '../widgets/Header';

export const AccountMonthsPage = () => {
    const {params} = useRouteMatch<{ account: string, month?: MonthDate }>();
    const account = useAtom(Accounts, ({accounts}) => accounts.get(params.account), [params.account]);
    const months = useAtom(Months);

    const loadMonth = useAction(id => id ? loadMonths([id]) : null, []);

    const monthDate = params.month || account?.head.month || '';

    if (!account)
        return (
            <div>No account</div>
        );

    if (!account.months.length)
        return (
            <div>No months in this account</div>
        );

    let monthIndex = account.months.findIndex(item => item.month === monthDate);

    if (monthIndex === -1)
        monthIndex = 0;

    const monthBrief: IMonthBrief = account?.months[monthIndex];
    const prevMonth = account.months[monthIndex + 1];
    const nextMonth = account.months[monthIndex - 1];

    if (monthBrief && !months.has(monthBrief.id))
        loadMonth(monthBrief.id);
    if (prevMonth && !months.has(prevMonth.id))
        loadMonth(prevMonth.id);
    if (nextMonth && !months.has(nextMonth.id))
        loadMonth(nextMonth.id);

    return (
        <>
            <Header title={`Account ${account.name}`}/>
            <main>
                <MonthViewWidget months={months}
                                 account={account}
                                 brief={monthBrief}
                                 prev={prevMonth}
                                 next={nextMonth}
                />
            </main>
        </>
    );
};
