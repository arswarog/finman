import React from 'react';
import { Form, Field } from 'react-final-form';
import { MoneyField } from '../components/inputs/MoneyField';
import { IAddTransactionForm } from '../models/transaction/transaction.types';
import { TxTypeField } from '../components/inputs/TxTypeField';

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
                    <MoneyField id="form-tx-add-amount"
                                name="amount"
                                label="Amount"
                                variant="outlined"
                                startAdornment="$"
                                validators={[
                                    // required,
                                    // mustBeNumber,
                                ]}
                    />
                    <Field name="date">
                        {({input, meta}) => (
                            <div>
                                <label>Date</label>
                                <input {...input} type="text" placeholder="Date"/>
                                {meta.error && meta.touched && <span>{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <TxTypeField name="type"/>

                    <Field name="category">
                        {({input, meta}) => (
                            <div>
                                <label>Category</label>
                                <input {...input} type="text" placeholder="Category"/>
                                {meta.error && meta.touched && <span>{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <Field name="account">
                        {({input, meta}) => (
                            <div>
                                <label>Account</label>
                                <input {...input} type="text" placeholder="Account"/>
                                {meta.error && meta.touched && <span>{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <button type="submit">Submit</button>
                    <pre>{JSON.stringify(values, null, 2)}</pre>
                </form>
            )}
        />
    );
};
