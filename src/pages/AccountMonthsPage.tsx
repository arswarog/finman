import React, { useCallback, useState } from 'react';
import { useAction, useAtom } from '@reatom/react';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { match, useHistory, useParams, useRouteMatch, withRouter } from 'react-router';
import { MonthDate } from '../models/common/date.types';
import { Months } from '../atoms/months/months.atom';
import { loadMonths } from '../atoms/months/months.actions';
import { IMonthBrief } from '../models/month/month.types';
import { MonthViewHeadWidget, MonthViewWidget } from '../widgets/MonthViewWidget';
import { Header } from '../widgets/Header';
import { paths } from '../routes';
import styles from './AccountMonthsPage.module.scss';
import { MonthTxList } from '../widgets/MonthTxList';
import { SwipeItemWidget, SwipeWidget } from '../widgets/SwipeWidget';

interface IParams {
    account: string;
    month?: MonthDate;
}

export const AccountMonthsPage = () => {
    // prepare
    const {params} = useRouteMatch<IParams>();
    const account = useAtom(Accounts, ({accounts}) => accounts.get(params.account), [params.account]);
    const months = useAtom(Months);
    const history = useHistory();

    // create months list
    const monthsList = [...account ? account.months : []];
    monthsList.reverse();

    // create handlers
    const changeMonth = useCallback((newMonthNum) => {
        history.replace(paths.account.months(account.id, newMonthNum));
    }, [account]);

    const loadMonth = useAction(id => id ? loadMonths([id]) : null, []);

    // check before render
    if (!account)
        return (
            <div>No account</div>
        );

    if (!account.months.length)
        return (
            <div>No months in this account</div>
        );

    // get months
    let monthIndex = account.months.findIndex(item => item.month === params.month);
    if (monthIndex === -1)
        monthIndex = 0;
    const monthBrief: IMonthBrief = account.months[monthIndex];
    const prevMonth = account.months[monthIndex + 1];
    const nextMonth = account.months[monthIndex - 1];

    // load months
    if (monthBrief && !months.has(monthBrief.id))
        loadMonth(monthBrief.id);
    if (prevMonth && !months.has(prevMonth.id))
        loadMonth(prevMonth.id);
    if (nextMonth && !months.has(nextMonth.id))
        loadMonth(nextMonth.id);

    const currentMonth = months.get(monthBrief?.id);

    // render
    return (
        <>
            <Header title={`Account ${account.name}`}/>
            <main className={styles.main + ' noselect'}>
                <SwipeWidget onChange={changeMonth}
                             current={monthBrief.month}
                             showButtons>
                    {monthsList.map(item => (
                        <SwipeItemWidget key={item.month}>
                            <MonthViewHeadWidget months={months}
                                                 brief={item}
                            />
                        </SwipeItemWidget>
                    ))}
                </SwipeWidget>
                <MonthTxList month={currentMonth}/>
            </main>
        </>
    );
};
