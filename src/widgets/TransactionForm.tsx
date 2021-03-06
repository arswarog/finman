import React from 'react';
import { Form } from 'react-final-form';
import { MoneyField } from '../components/inputs/MoneyField';
import { ITransactionForm, TransactionType } from '../models/transaction/transaction.types';
import { TxTypeField } from '../components/inputs/TxTypeField';
import { TextField } from '../components/inputs/TextField';
import { DayDateField } from '../components/inputs/DayDateField';
import { AccountField } from '../components/inputs/AccountField';
import { IAccount } from '../models/account-dto/account.types';
import { CategoryField } from '../components/inputs/CategoryField';
import { ICategory } from '../models/category/category.types';

interface IProps {
    accounts: IAccount[];
    categories: ICategory[];
    value: ITransactionForm;
    onSubmit: (value: ITransactionForm) => void;
    validate: (value: ITransactionForm) => Partial<{ [key in keyof ITransactionForm]: string }>;
}

export const TransactionForm = ({accounts, categories, onSubmit, value, validate}: IProps) => {
    return (
        <Form
            onSubmit={onSubmit}
            initialValues={value}
            validate={validate}
            render={({handleSubmit, form, submitting, pristine, values}) => (
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <MoneyField name="amount"
                                label="Amount"
                                hint="This is amount"
                                placeholder="Enter amount"
                    />
                    <CategoryField name="category"
                                   label="Category"
                                   categories={categories}
                    />
                    <TxTypeField name="type"
                                 label=""
                                 types={[
                                     TransactionType.Income,
                                     TransactionType.Expense,
                                 ]}
                    />
                    <TextField name="title"
                               label="Title"
                    />
                    <DayDateField name="date"
                                  label="Date"
                                  component="input"/>
                    <AccountField name="account"
                                  label="Account"
                                  accounts={accounts}
                    />
                    <button type="submit" className="btn btn-primary rounded mr-1">Save</button>
                </form>
            )}
        />
    );
};
