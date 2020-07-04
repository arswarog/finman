import React, { Reducer, useContext, useEffect, useReducer, useState } from 'react';
import { context, useAction } from '@reatom/react';
import { MoneyView } from '../components/MoneyView';
import styles from './AccountsPage.module.scss';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { useHistory, useRouteMatch } from 'react-router';
import { paths } from '../routes';
import { Header } from '../widgets/Header';
import { SwipeItemWidget, SwipeWidget } from '../widgets/SwipeWidget';
import { Account } from '../models/account/account.class';
import { chooseAccount } from '../atoms/accounts/accounts.actions';
import { useAtom } from '../store/reatom';
import { DetailsMain } from '../components/DetailsMainButton';
import { Money } from '../models/money/money.class';
import format from 'date-fns/format';
import { getMonthName } from '../models/dates';

interface IParams {
    account?: string;
}

export const AccountsPage = () => {
    const history = useHistory();
    const current = useAtom(Accounts, state => state.current, []);
    const accounts = useAtom(Accounts, state => state.accounts, []);
    const chooseAccountHandler = useAction(id => id === 'create' ? null : chooseAccount(id));
    const list = Array.from(accounts.values());

    if (!accounts.size)
        return (
            <>
                <Header title={`Accounts`}/>
                Loading...
            </>
        );

    return (
        <>
            <Header title={`Accounts`}/>
            <main className={styles.accountPage}>
                <SwipeWidget current={current?.id || ''}
                             showButtons
                             onChange={chooseAccountHandler as ((key: any) => void)}>
                    {list.map(account => (
                        <SwipeItemWidget key={account.id}>
                            <AccountWidget account={account}/>
                        </SwipeItemWidget>
                    ))}
                    {/*<SwipeItemWidget key="create"> FIXME*/}
                    {/*    Create account*/}
                    {/*</SwipeItemWidget>*/}
                </SwipeWidget>
                <DetailsMain.List cover>
                    <DetailsMain.Button title={`Expenses in ${getMonthName(current.head?.month)}`}
                                        link={paths.account.monthsList(current.id)}
                                        amount={current.head?.summary.expense}/>
                    <DetailsMain.Button title={`Incomes in ${getMonthName(current.head?.month)}`}
                                        link={paths.account.monthsList(current.id)}
                                        amount={current.head?.summary.income}/>
                </DetailsMain.List>
            </main>
        </>
    );
};


export const AccountWidget = ({account}: { account: Account }) => {
    const history = useHistory();

    function addTx() {
        history.push(paths.transactions.add({account: account.id}));
    }

    return (
        <div className={styles.accountWidget + ' ' + styles.accountStyle_blue}>
            <div className={styles.name}>{account.name}</div>
            <div className={styles.balance}>
                <h5>Balance:</h5>
                <MoneyView money={account.balance}/>
            </div>
            <button className={styles.addTx}
                    onClick={addTx}>+
            </button>
        </div>
    );
};
