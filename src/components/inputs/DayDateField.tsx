import React from 'react';
import { BaseInput, IBaseInputProps } from './BaseInput';

export const DayDateField = (props: IBaseInputProps) => (
    <BaseInput {...props}>
        {({input, meta}) => (
            <input {...input} className="form-control" type="date" placeholder="Date"/>
        )}
    </BaseInput>
);
