import React, { useState } from 'react';
import { ITransactionForm, TransactionType } from '../../models/transaction/transaction.types';
import { store } from '../../store/store';
import { addTransaction } from '../../models/transaction/transaction.actions';
import { useHistory, useLocation } from 'react-router';
import { Header } from '../../components/Header';
import { TransactionForm } from '../../widgets/TransactionForm';
import { Section } from '../../ui-kit/Section';
import { Card } from '../../ui-kit/Card';
import { Main } from '../../ui-kit/Main';
import { useAtom } from '../../store/reatom';
import { AccountGrips } from '../../atoms/account-grips/account-grips.atom';
import { Accounts } from '../../atoms/accounts/accounts.atom';
import { getDayDate } from '../../models/dates';
import { categoriesMapToList } from '../../sagas/utils/categories';

export const TransactionAddPage = () => {
    const params = new URLSearchParams(useLocation().search);
    const history = useHistory();

    const {current: currentAccount} = useAtom(AccountGrips);
    const {accounts} = useAtom(Accounts);
    const categories = categoriesMapToList(currentAccount?.categories);

    if (!accounts || !categories)
        return (
            <>
                <Header title="Add transaction"
                        back/>
                <Main>
                    <Section full title="Add transaction">
                        <Card>
                            Loading...
                        </Card>
                    </Section>
                </Main>
            </>
        );

    const data: ITransactionForm = {
        title: '',
        type: params.get('type')
            ? params.get('type') in TransactionType
                ? TransactionType[params.get('type')]
                : TransactionType.Expense
            : TransactionType.Expense,
        amount: params.get('amount') || '', // todo use Money
        date: params.get('date') || getDayDate(),
        account: params.get('account') || currentAccount?.id || '',
        category: params.get('category') || 'default',
    };

    const submitHandler = (data: ITransactionForm) => {
        console.log(data);
        store.dispatch(addTransaction({
            ...data,
            account: currentAccount.id,
        }));
        history.goBack();
    };

    function validate(data: ITransactionForm) {
        const errors: Partial<{ [key in keyof ITransactionForm]: string }> = {};
        // if (!data.account)
        //     errors.account = 'Required';
        console.log(data);
        console.log(errors);
        return errors;
    }

    return (
        <>
            <Header title="Add transaction"
                    back/>
            <Main>
                <Section full title="Add transaction">
                    <Card>
                        <TransactionForm value={data}
                                         onSubmit={submitHandler}
                                         validate={validate}
                                         accounts={Array.from(accounts.values())}
                                         categories={categories}
                        />
                    </Card>
                </Section>
            </Main>
        </>
    );
};
