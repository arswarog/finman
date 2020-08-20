import React from 'react';
import { useAction } from '@reatom/react';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { Header } from '../components/Header';
import { SwipeItemWidget, SwipeWidget } from '../widgets/SwipeWidget';
import { useAtom } from '../store/reatom';
import { Main } from '../ui-kit/Main';
import { GripQuickDetails } from '../widgets/GripQuickDetails';
import { QuickCategories } from '../widgets/QuickCategories';
import { AccountWidget } from '../widgets/AccountWidget';
import { AccountGrips } from '../atoms/account-grips/account-grips.atom';
import { chooseAccountGrip } from '../atoms/account-grips/account-grips.actions';
import { LastMonthsList } from '../widgets/LastMonthsList';
import { CategoriesList } from '../widgets/CategoriesList';

export const AccountsPage = () => {
    const {current, accounts} = useAtom(AccountGrips);
    const chooseAccountHandler = useAction(id => id === 'create' ? null : chooseAccountGrip(id));
    const list = Array.from(accounts.values());

    if (!accounts.size)
        return (
            <>
                <Header title={`Wallets`}/>
                Loading...
            </>
        );

    return (
        <>
            <Header title={`Wallets`}/>
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
                <GripQuickDetails grip={current}/>
                <QuickCategories grip={current}/>
                <LastMonthsList grip={current}/>
            </Main>
        </>
    );
};
