import NumberFormat from 'react-number-format';
import React, { ElementType, ReactNode } from 'react';
import { Field } from 'react-final-form';
import { FieldValidator } from 'final-form';

export interface IInputFieldProps {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    helperText?: string;
    validators?: FieldValidator<any>[];
    variant?: 'standard' | 'filled' | 'outlined';
    startAdornment?: ReactNode;
    disabled?: boolean;
    component?: ElementType<any>;
}

interface IProps extends IInputFieldProps {
}

function NumberFormatCustom(props) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            prefix="$"
            thousandSeparator=" "
            isNumericString
        />
    );
}

export const MoneyField = (props: IProps) => {
    return (
        <Field name="amount">
            {({input, meta}) => (
                <div>
                    <label>Amount</label>
                    <NumberFormatCustom {...input} type="text" placeholder="Amount"/>
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
            )}
        </Field>
        // <NumberFormatCustom {...props}
        // label="react-number-format"
        // value={values.numberformat}
        // onChange={handleChange}
        // name="numberformat"
        // id="formatted-numberformat-input"
        // InputProps={{
        //     inputComponent: NumberFormatCustom,
        // }}
        // />
        // <TextField
        // onChange={handleChange}
        // />
    );
};
