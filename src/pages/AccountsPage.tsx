import React from 'react';
import { useAction } from '@reatom/react';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { Header } from '../components/Header';
import { SwipeItemWidget, SwipeWidget } from '../widgets/SwipeWidget';
import { chooseAccount } from '../atoms/accounts/accounts.actions';
import { useAtom } from '../store/reatom';
import { Main } from '../ui-kit/Main';
import { GripQuickDetails } from '../widgets/GripQuickDetails';
import { CategoriesList } from '../widgets/CategoriesList';
import { QuickCategories } from '../widgets/QuickCategories';
import { AccountWidget } from '../widgets/AccountWidget';

export const AccountsPage = () => {
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
            <Main>
                <SwipeWidget current={current?.id || ''}
                             showButtons
                             onChange={chooseAccountHandler as ((key: any) => void)}>
                    {list.map(account => (
                        <SwipeItemWidget key={account.id}>
                            <AccountWidget account={account}/>
                        </SwipeItemWidget>
                    ))}
                    {/*<SwipeItemWidget key="create">*/}
                    {/*    <CreateAccountWidget/>*/}
                    {/*</SwipeItemWidget>*/}
                </SwipeWidget>
                <GripQuickDetails/>
                <QuickCategories account={current}/>
                <CategoriesList/>
            </Main>
        </>
    );
};
