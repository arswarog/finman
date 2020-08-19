import React from 'react';
import { BaseInput, IBaseInputProps } from './BaseInput';

export interface ISelectInputProps extends IBaseInputProps {
    options: Array<{ value: string, label: string }>
}

export const SelectField = ({options, ...props}: ISelectInputProps) => (
    <BaseInput {...props}>
        {({input, meta}) => (
            <select {...input} className="form-control custom-select">
                {options.map(({value, label}) =>
                    <option value={value}>{label}</option>,
                )}
            </select>
        )}
    </BaseInput>
);
