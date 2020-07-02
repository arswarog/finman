import React, { FormEvent, useState } from 'react';
import { IAddTransactionForm, TransactionType } from '../models/transaction/transaction.types';
import { store } from '../store/store';
import { addTransaction } from '../models/transaction/transaction.actions';
import { useLocation } from 'react-router';

export const TransactionAddPage = () => {
    const params = new URLSearchParams(useLocation().search);

    const [amount, setAmount] = useState('123');
    const [date, setDate] = useState('2020-06-12');
    const [type, setType] = useState(TransactionType.Expense);
    const [account, setAccount] = useState(params.get('account') || '');

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        const formData: IAddTransactionForm = {
            account,
            amount,
            date,
            category: '',
            title: '',
            type,
        };
        console.log(formData);
        store.dispatch(addTransaction(formData));
    };

    const amountChangeHandler = (event) => {
        setAmount(event.target.value);
    };

    const dateChangeHandler = (event) => {
        setDate(event.target.value);
    };

    const typeChangeHandler = (event) => {
        setType(+event.target.value);
    };

    const accountChangeHandler = (event) => {
        setAccount(event.target.value);
    };

    return (
        <div>
            add transaction
            <form onSubmit={submitHandler}>
                <div>
                    Amount:
                    <input type="number" value={amount} onChange={amountChangeHandler}/>
                </div>

                <div>
                    Date:
                    <input type="date" value={date} onChange={dateChangeHandler}
                           list="datalist"/>
                    <datalist id="datalist">
                        <option value="2020-06-12" label="Today"/>
                        <option value="2020-06-11" label="Yesterday"/>
                    </datalist>
                </div>

                <div>
                    Type:
                    <input type="radio" id="type-income"
                           onChange={typeChangeHandler}
                           checked={type === TransactionType.Income}
                           name="type" value={TransactionType.Income}/>
                    <label htmlFor="type-income">Income</label>

                    <input type="radio" id="type-expense"
                           checked={type === TransactionType.Expense}
                           onChange={typeChangeHandler}
                           name="type" value={TransactionType.Expense}/>
                    <label htmlFor="type-expense">Expense</label>
                </div>

                <div>
                    Account:
                    <input type="text" value={account} onChange={accountChangeHandler}/>
                </div>

                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
            <pre>amount: {amount}</pre>
            <pre>date: {date}</pre>
            <pre>type: {type}</pre>
        </div>
    );
};
