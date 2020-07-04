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

interface IParams {
    account?: string;
}

export const AccountsPage = () => {
    const history = useHistory();
    const current = useAtom(Accounts, state => state.current, []);
    const accounts = useAtom(Accounts, state => state.accounts, []);
    const chooseAccountHandler = useAction(id => id === 'create' ? null : chooseAccount(id));
    const list = Array.from(accounts.values());

    // const [acc, setAcc] = useState(current);
    // if (current !== acc)
    //     setAcc(current);

    console.log('---------', accounts.size, current?.id);

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
                    <SwipeItemWidget key="create">
                        Create account
                    </SwipeItemWidget>
                </SwipeWidget>
                <DetailsMain.List cover>
                    <DetailsMain.Button title="Расходы за месяц"
                                        amount={Money.create(102, 'RUB')}/>
                    <DetailsMain.Button title="Расходы за месяц"
                                        amount={Money.create(153, 'RUB')}
                                        percent={1.53} moreIsBetter/>
                    <DetailsMain.Button title="Доходы за месяц"
                                        amount={Money.create(83, 'RUB')}
                                        percent={0.83} moreIsBetter/>
                    <DetailsMain.Button title="Доходы за месяц"
                                        amount={Money.create(99, 'RUB')}
                                        percent={0.99} moreIsBetter/>
                </DetailsMain.List>
                <DetailsMain.List>
                    <DetailsMain.Button title="Расходы за месяц"
                                        amount={Money.create(102, 'RUB')}
                                        percent={1.02} lessIsBetter/>
                    <DetailsMain.Button title="Расходы за месяц"
                                        amount={Money.create(130, 'RUB')}
                                        percent={1.3} lessIsBetter/>
                    <DetailsMain.Button title="Доходы за месяц"
                                        amount={Money.create(40, 'RUB')}
                                        percent={0.4} lessIsBetter/>
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
