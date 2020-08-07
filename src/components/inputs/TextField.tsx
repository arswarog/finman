import React from 'react';
import { BaseInput, IBaseInputProps } from './BaseInput';

export const TextField = (props: IBaseInputProps) => (
    <BaseInput {...props} component="input"/>
);
