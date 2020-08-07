import React, { FormEvent, useState } from 'react';
import { IAddTransactionForm, TransactionType } from '../models/transaction/transaction.types';
import { store } from '../store/store';
import { addTransaction } from '../models/transaction/transaction.actions';
import { useLocation } from 'react-router';
import { Header } from '../components/Header';
import { TransactionForm } from '../widgets/TransactionForm';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Main } from '../components/Main';

export const TransactionAddPage = () => {
    const params = new URLSearchParams(useLocation().search);

    const [data, setData] = useState({
        type: TransactionType.Income,
        amount: '100000',
        date: '2020-06-01',
        account: params.get('account') || '',
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
            <Header title="Add transaction"/>
            <Main>
                <Section title="Add transaction">
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
