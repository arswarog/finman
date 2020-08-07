import React from 'react';
import { Field, Form } from 'react-final-form';
import { MoneyField } from '../components/inputs/MoneyField';
import { IAddTransactionForm, TransactionType } from '../models/transaction/transaction.types';
import { TxTypeField } from '../components/inputs/TxTypeField';
import { BaseInput } from '../components/inputs/BaseInput';
import { TextField } from '../components/inputs/TextField';

interface IProps {
    value: IAddTransactionForm;
    onSubmit: (value: IAddTransactionForm) => void;
    validate: (value: IAddTransactionForm) => Partial<{ [key in keyof IAddTransactionForm]: string }>;
}

export const TransactionForm = ({onSubmit, value, validate}: IProps) => {
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
                    <TextField name="category"
                               label="Category"
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
                    <BaseInput name="date"
                               label="Date"
                               component="input"/>
                    <TextField name="account"
                               label="Account"
                    />
                    <button type="submit" className="btn btn-primary rounded mr-1">Save</button>
                </form>
            )}
        />
    );
};
