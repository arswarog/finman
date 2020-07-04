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

interface IParams {
    account?: string;
}

export const AccountsPage = () => {
    const history = useHistory();
    const current = useAtom(Accounts, state => state.current, []);
    const accounts = useAtom(Accounts, state => state.accounts, []);
    const chooseAccountHandler = useAction(chooseAccount);
    const list = Array.from(accounts.values());

    // const [acc, setAcc] = useState(current);
    // if (current !== acc)
    //     setAcc(current);

    console.log('---------', accounts.size, current?.id);

    function addTx() {
        if (current)
            history.push(paths.transactions.add({account: current.id}));
    }

    window['chooseAccountHandler'] = chooseAccountHandler;

    return (
        <>
            <Header title={`Accounts`}/>
            <SwipeWidget current={current?.id || ''}
                         onChange={chooseAccountHandler as ((key: any) => void)}>
                {list.map(account => (
                    <SwipeItemWidget key={account.id}>
                        <AccountWidget account={account}/>
                    </SwipeItemWidget>
                ))}
                <SwipeItemWidget key="create">
                    Create account
                </SwipeItemWidget>
            </SwipeWidget>
        </>
    );
};


export const AccountWidget = ({account}: { account: Account }) => {
    return (
        <div style={{height: '200px'}}>
            <h3>{account.name}</h3>
            <h4><MoneyView money={account.balance}/></h4>
        </div>
    );
};
