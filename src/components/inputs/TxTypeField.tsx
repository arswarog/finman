import { Field } from 'react-final-form';
import React from 'react';

interface IProps {
    name:string;
}

export const TxTypeField = ({name}: IProps) => {
    return (
        <>
            <br/>
            <label>
                <Field
                    name={name}
                    component="input"
                    type="radio"
                    value="1"
                />
                Income
            </label>
            <label>
                <Field
                    name={name}
                    component="input"
                    type="radio"
                    value="2"
                />
                Expense
            </label>
            <br/>
        </>
    );
};
