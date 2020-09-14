import React from 'react';
import { BaseInput, IBaseInputProps } from './BaseInput';
import { SelectField } from './SelectField';
import { IAccount } from '../../models/account-dto/account.types';
import { ICategory } from '../../models/category/category.types';

interface ICategoryFieldProps extends IBaseInputProps {
    categories: ICategory[];
}

export const CategoryField = ({categories, ...props}: ICategoryFieldProps) => {
    const options = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    return <SelectField  {...props} options={options}/>;
};
