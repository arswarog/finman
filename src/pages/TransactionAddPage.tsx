import React, { useState } from 'react';
import { IAddTransactionForm, TransactionType } from '../models/transaction/transaction.types';
import { store } from '../store/store';
import { addTransaction } from '../models/transaction/transaction.actions';
import { useLocation } from 'react-router';
import { Header } from '../components/Header';
import { TransactionForm } from '../widgets/TransactionForm';
import { Section } from '../ui-kit/Section';
import { Card } from '../ui-kit/Card';
import { Main } from '../ui-kit/Main';
import { useAtom } from '../store/reatom';
import { AccountGrips } from '../atoms/account-grips/account-grips.atom';
import { paths } from '../routes';

export const TransactionAddPage = () => {
    const params = new URLSearchParams(useLocation().search);

    const {current: currentAccount} = useAtom(AccountGrips);

    const [data, setData] = useState({
        type: params.get('type')
            ? params.get('type') in TransactionType
                ? TransactionType[params.get('type')]
                : TransactionType.Expense
            : TransactionType.Expense,
        amount: params.get('amount') || '', // todo use Money
        date: params.get('date') || '2020-06-01', // todo use today
        account: params.get('account') || currentAccount?.id || '',
        category: params.get('category') || 'default',
    } as IAddTransactionForm);

    const submitHandler = (data: IAddTransactionForm) => {
        console.log(data);
        setData(data);
        store.dispatch(addTransaction(data));
    };

    function validate(data: IAddTransactionForm) {
        const errors: Partial<{ [key in keyof IAddTransactionForm]: string }> = {};
        if (!data.account)
            errors.account = 'Required';
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
                        />
                    </Card>
                </Section>
            </Main>
        </>
    );
};
