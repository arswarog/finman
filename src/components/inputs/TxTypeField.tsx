import { Field } from 'react-final-form';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { BaseInput, IBaseInputProps } from './BaseInput';
import { TransactionType } from '../../models/transaction/transaction.types';

interface ITxTypeButtonProps {
    type: TransactionType;
    value?: TransactionType;
    disabled?: boolean;
    onChange?: (type: TransactionType) => void;
}

const TxTypeButton = ({type, value, disabled, onChange}: ITxTypeButtonProps) => {
    const label = TransactionType[type];

    const active = value === type;

    const onClick = useCallback(() => onChange(type), [onChange, type]);

    const classNames = [
        'btn',
        'rounded',
        'mr-1',
        'mb-1',
        active
            ? 'btn-primary '
            : 'btn-outline-primary ',
    ];

    if (disabled)
        return (
            <button type="button"
                    className={classNames.join(' ')}
                    disabled
            >{label}</button>
        );
    else
        return (
            <button type="button"
                    className={classNames.join(' ')}
                    onClick={onClick}
            >{label}</button>
        );
};

const CheckboxWrapper = styled.div`
    display: inline-block;
    padding: 5px 10px;
    cursor: pointer;
    user-select: none;
`;

const TxTypeCheckbox = ({type, value, disabled, onChange}: ITxTypeButtonProps) => {
    const label = TransactionType[type];

    const active = value === type;

    const onClick = useCallback(() => onChange(type), [onChange, type]);

    if (disabled)
        return (
            <CheckboxWrapper>
                <div className="custom-control custom-checkbox d-inline">
                    <input type="checkbox" className="custom-control-input" id="customCheck2"
                           checked={active}/>
                    <label className="custom-control-label p-0" htmlFor="customCheck2"/>
                </div>
                {label}
            </CheckboxWrapper>
        );
    else
        return (
            <CheckboxWrapper onClick={onClick}>
                <div className="custom-control custom-checkbox d-inline">
                    <input type="checkbox" className="custom-control-input" id="customCheck2"
                           value={type}
                           checked={active}/>
                    <label className="custom-control-label p-0" htmlFor="customCheck2"/>
                </div>
                {label}
            </CheckboxWrapper>
        );
};


interface IProps extends IBaseInputProps {
    types: TransactionType[];
}

export const TxTypeField = ({types, ...props}: IProps) => {
    return (
        <BaseInput {...props} clearable={false}>
            {({input}) => types.map(type => <TxTypeCheckbox
                type={type}
                value={input.value}
                onChange={input.onChange}
            />)}
        </BaseInput>
    );
};
