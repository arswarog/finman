import React, { FormEvent, useState } from 'react';
import { IAddTransactionForm, TransactionType } from '../models/transaction/transaction.types';
import { store } from '../store/store';
import { addTransaction } from '../models/transaction/transaction.actions';
import { useLocation } from 'react-router';
import { Header } from '../widgets/Header';
import { TransactionForm } from '../widgets/TransactionForm';

export const TransactionAddPage = () => {
    const params = new URLSearchParams(useLocation().search);

    const [data, setData] = useState({
        type: TransactionType.Income + '' as any,
        amount: '100000',
        date: '2020-06-01',
        account: params.get('account') || '',
    } as IAddTransactionForm);


    const [amount, setAmount] = useState('123');
    const [date, setDate] = useState('2020-06-12');
    const [category, setCategory] = useState('default');
    const [type, setType] = useState(TransactionType.Expense);
    const [account, setAccount] = useState(params.get('account') || '');

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        const formData: IAddTransactionForm = {
            account,
            amount,
            date,
            category,
            title: '',
            type,
        };
        console.log(formData);
        store.dispatch(addTransaction(formData));
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
            <main>
                <TransactionForm value={data}
                                 onSubmit={data => {
                                     data.type = +data.type;
                                     console.log(data);
                                     setData(data);
                                     store.dispatch(addTransaction(data));
                                 }}
                                 validate={validate}
                />
            </main>
        </>
    );
};
