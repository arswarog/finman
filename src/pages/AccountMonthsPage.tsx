import React, { useCallback, useEffect } from 'react';
import { useAction, useAtom } from '@reatom/react';
import { useHistory, useRouteMatch } from 'react-router';
import { MonthDate } from '../models/common/date.types';
import { loadMonths } from '../atoms/months/months.actions';
import { IMonthBrief } from '../models/month/month-legacy.types';
import { MonthViewHeadWidget } from '../widgets/MonthViewWidget';
import { Header } from '../components/Header';
import { paths } from '../routes';
import styles from './AccountMonthsPage.module.scss';
import { MonthTxList } from '../widgets/MonthTxList';
import { SwipeItemWidget, SwipeWidget } from '../widgets/SwipeWidget';
import { AccountGrips } from '../atoms/account-grips/account-grips.atom';
import { MonthGrips } from '../atoms/month-grips/month-grips.atom';
import { IMonthGripBrief } from '../models/abstract-grip/grip.types';
import { IAccount } from '../models/account-dto/account.types';
import { AccountGrip } from '../models/account-grip/grip.class';
import { Main } from '../ui-kit/Main';

interface IParams {
    account: string;
    month?: MonthDate;
}

export const AccountMonthsPage = () => {
    // prepare
    const {params} = useRouteMatch<IParams>();
    const account = useAtom(AccountGrips, ({accounts}) => accounts.get(params.account), [params.account]);
    const months = useAtom(MonthGrips);
    const history = useHistory();

    // create months list
    const monthsList = [...account ? account.months : []];
    monthsList.reverse();

    // create handlers
    const changeMonth = useCallback((newMonthNum) => {
        history.replace(paths.account.month(account.id, newMonthNum));
    }, [account, history]);

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

    return <AccountMonthsPageDisplay account={account}
                                     month={params.month || account.lastMonthDate}/>;
};

interface IPropsDisplay {
    account: AccountGrip;
    month: MonthDate;
}

export const AccountMonthsPageDisplay = ({account, month}: IPropsDisplay) => {
    // prepare
    const months = useAtom(MonthGrips);
    const history = useHistory();

    // create months list
    const monthsList = [...account ? account.months : []];
    monthsList.reverse();

    // create handlers
    const changeMonth = useCallback((newMonthNum) => {
        history.replace(paths.account.month(account.id, newMonthNum));
    }, [account, history]);

    const loadMonth = useAction(id => id ? loadMonths([id]) : null, []);

    // get months
    let monthIndex = account.months.findIndex(item => item.month === month);
    if (monthIndex === -1)
        monthIndex = 0;
    const monthBrief: IMonthGripBrief = account.months[monthIndex];
    const prevMonth = account.months[monthIndex + 1];
    const nextMonth = account.months[monthIndex - 1];

    // load months
    useEffect(() => {
        if (monthBrief && !months.has(monthBrief.id))
            loadMonth(monthBrief.id);
        if (prevMonth && !months.has(prevMonth.id))
            loadMonth(prevMonth.id);
        if (nextMonth && !months.has(nextMonth.id))
            loadMonth(nextMonth.id);
    }, [prevMonth, nextMonth, monthBrief]);
    const currentMonth = months.get(monthBrief?.id);

    // render
    return (
        <>
            <Header back title={`Account ${account.name}`}/>
            <Main className={styles.main + ' noselect'}>
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
                <MonthTxList month={currentMonth} reverse/>
            </Main>
        </>
    );
};
