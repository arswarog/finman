export type Encoder<T> = (obj: T) => any;
export type Decoder<T> = (value: unknown) => T;

export const EncoderSymbol = Symbol('Packable encoder');
export const DecoderSymbol = Symbol('Packable decoder');

export interface IPacker<T> {
    [DecoderSymbol]: Decoder<T>;
    [EncoderSymbol]: Encoder<T>;
}

export type Fields<T> = { [key in keyof T]: T[key] }

export type FieldTypePrimitive = StringConstructor | NumberConstructor | BooleanConstructor;

export type FieldTypeArray<T> = any
export type FieldRule<T> = IPacker<T> | FieldTypePrimitive | Array<FieldTypeArray<T>>;

export type FieldsRules<T> = {
    [key in keyof T]: FieldRule<T[key]>;
}
