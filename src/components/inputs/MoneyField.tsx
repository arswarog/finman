import NumberFormat from 'react-number-format';
import React from 'react';
import { BaseInput, IBaseInputProps } from './BaseInput';

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

interface IProps extends IBaseInputProps {

}

export const MoneyField = (props: IProps) => (
    <BaseInput {...props}>
        {({input, meta}) => (
            <NumberFormatCustom {...input} className="form-control" type="text" placeholder="Amount"/>
        )}
    </BaseInput>
);
