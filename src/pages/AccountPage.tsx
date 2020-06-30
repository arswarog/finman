import React from 'react';
import styles from './AccountsPage.module.scss';
import { MoneyView } from '../components/MoneyView';
import { useAtom } from '@reatom/react';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

export const AccountPage = () => {
    const accounts = useAtom(Accounts);
    const match = useRouteMatch<{ account: string }>();

    const account = accounts.accounts.get(match.params.account);
    if (!account)
        return (
            <div>No account</div>
        );

    return (
        <div>
            AccountMonthsPage
            <div>
                <h3>{account.name}</h3>
                <h4><MoneyView money={account.balance}/></h4>
                <div>+<MoneyView money={account.income}/></div>
                <div>-<MoneyView money={account.expense}/></div>
                <Link to={`/finman/account/${account.id}/months`}>Show history</Link>
            </div>
        </div>
    );
};
