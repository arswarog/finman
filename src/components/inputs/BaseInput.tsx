import { Icon } from '../../ui-kit/Icon';
import React, { MutableRefObject, ReactHTMLElement, useCallback, useEffect, useRef, useState } from 'react';
import { Field, RenderableProps, useField, UseFieldConfig } from 'react-final-form';

// UseFieldConfig<FieldValue>,

export interface IBaseInputProps extends RenderableProps<any> {
    name: string;
    label: string;
    clearable?: boolean;
    placeholder?: string;
    hint?: string;
}

export const BaseInput = ({
                              name, label, clearable, placeholder, hint, component, children, render,
                          }: IBaseInputProps) => {
    const field = useField(name);

    const input: MutableRefObject<HTMLInputElement> = useRef();
    const [active, setActive] = useState(false);

    const onFocus = useCallback(() => setActive(true), [setActive]);
    const onBlur = useCallback(() => setActive(false), [setActive]);
    const onClearInput = useCallback(() => {
        input.current.focus();
        field.input.onChange('');
    }, [input]);

    return (
        <div className="form-group basic">
            <div className={['input-wrapper', active ? 'active' : '', 'not-empty'].join(' ')}>
                <label className="label" htmlFor={`form-input-${name}`}>{label}</label>
                <Field id={`form-input-${name}`}
                       name={name}
                       className="form-control"
                       ref={input}
                       onFocus={onFocus} onBlur={onBlur}
                       placeholder={placeholder}
                       component={component} render={render}>{children}</Field>
                {clearable &&
                <i className="clear-input" onClick={onClearInput}>
                    <Icon name="close-circle" role="img" className="md hydrated"
                          aria-label="close circle"/>
                </i>
                }
            </div>
            <div className="input-info">{hint}</div>
        </div>
    );
};
