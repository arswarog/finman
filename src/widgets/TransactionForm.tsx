import React from 'react';
import { Field, Form } from 'react-final-form';
import { MoneyField } from '../components/inputs/MoneyField';
import { IAddTransactionForm, TransactionType } from '../models/transaction/transaction.types';
import { TxTypeField } from '../components/inputs/TxTypeField';
import { BaseInput } from '../components/inputs/BaseInput';
import { TextField } from '../components/inputs/TextField';
import { DayDateField } from '../components/inputs/DayDateField';
import { AccountField } from '../components/inputs/AccountField';
import { IAccount } from '../models/account/account.types';
import { CategoryField } from '../components/inputs/CategoryField';
import { ICategory } from '../models/category/category.types';

interface IProps {
    accounts: IAccount[];
    categories: ICategory[];
    value: IAddTransactionForm;
    onSubmit: (value: IAddTransactionForm) => void;
    validate: (value: IAddTransactionForm) => Partial<{ [key in keyof IAddTransactionForm]: string }>;
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
