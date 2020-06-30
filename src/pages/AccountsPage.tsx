import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import { MoneyView } from '../components/MoneyView';

import styles from './AccountsPage.module.scss';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { useHistory } from 'react-router';
import { paths } from '../routes';

export const AccountsPage = () => {
    const history = useHistory();
    const accounts = useAtom(Accounts);
    const list = Array.from(accounts.accounts.values());
    const chooseAccountHandler = useAction(accountId => {
        history.push(paths.account.view(accountId));
    }, []);

    function addTx() {
        if (accounts.current)
            history.push(paths.transactions.add({account: accounts.current.id}));
    }

    return (
        <div>
            Страница с информацией обо всех аккаунтах (кошельках)

            {list.map(item => (
                <div className={item === accounts.current ? styles.currentAccount : ''}
                     key={item.id}
                     onClick={() => chooseAccountHandler(item.id)}>
                    <h3>{item.name}</h3>
                    <h4><MoneyView money={item.balance}/></h4>
                </div>
            ))}

            <button onClick={addTx}>Add</button>
        </div>
    );
};
