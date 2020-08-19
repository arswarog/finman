import React from 'react';
import { BaseInput, IBaseInputProps } from './BaseInput';
import { SelectField } from './SelectField';
import { IAccount } from '../../models/account/account.types';

interface IAccountFieldProps extends IBaseInputProps {
    accounts: IAccount[];
}

export const AccountField = ({accounts, ...props}: IAccountFieldProps) => {
    const options = accounts.map(acc => ({
        value: acc.id,
        label: acc.name,
    }));

    return <SelectField  {...props} options={options}/>;
};
