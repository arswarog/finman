import React from 'react';
import { Form } from 'react-final-form';
import { ICategory, ICategoryForm } from '../../models/category/category.types';
import { TxTypeField } from '../../components/inputs/TxTypeField';
import { TransactionType } from '../../models/transaction/transaction.types';
import { TextField } from '../../components/inputs/TextField';
import { SelectField } from '../../components/inputs/SelectField';

interface IProps {
    value: ICategoryForm;
    categories: ICategory[];
    onSubmit: (value: ICategoryForm) => void;
    onCancel?: () => void;
    validate: (value: ICategoryForm) => Partial<{ [key in keyof ICategoryForm]: string }>;
}

const categoryIcons = [
    'default',
    'essentials-01',
    'essentials-02',
    'essentials-03',
    'essentials-04',
    'essentials-05',
    'essentials-06',
    'essentials-07',
    'essentials-08',
    'essentials-09',
];

export const CategoryForm = ({onSubmit, value, validate, categories}: IProps) => {
    const icons = categoryIcons.map(item => ({value: item, label: item}));
    const parents = categories.filter(item => !item.parent)
                              .map(item => ({value: item.id, label: item.name}));
    return (
        <Form
            onSubmit={onSubmit}
            initialValues={value}
            validate={validate}
            render={({handleSubmit, form, submitting, pristine, values}) => (
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <TextField name="name"
                               label="Name"
                               placeholder="Category name"
                    />
                    <TxTypeField name="defaultTxType"
                                 label=""
                                 types={[
                                     TransactionType.Income,
                                     TransactionType.Expense,
                                 ]}
                    />
                    <SelectField name="image"
                                 label="Icon"
                                 options={icons}
                    />
                    <SelectField name="parent"
                                 label="Parent category"
                                 options={parents}
                    />
                    <button type="submit" className="btn btn-primary rounded mr-1">Save</button>
                </form>
            )}
        />
    );
};
