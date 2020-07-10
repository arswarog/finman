import { DecoderSymbol, EncoderSymbol, FieldRule, Fields, IPacker, Type } from './packable.types';
import { Packer } from './packable';

const FieldsSymbol = Symbol('Fields symbol');

export function PackableClass<T>(afterDecode: (data: Fields<T>) => T) {
    return (constructor: Type<T>) => {
        const target = constructor['prototype'];
        const fields = target[FieldsSymbol];
        if (!fields)
            throw new Error(`To use @PackableClass you need declare @Packable`);

        delete target[FieldsSymbol];

        const packer = Packer.forClass<any>(fields, afterDecode);

        target[DecoderSymbol] = packer.decode;
        target[EncoderSymbol] = packer.encode;
    };
}

export function SelfPackableClass<T>(init: (target: Type<T>) => IPacker<T>) {
    return (target: Type<T>) => {
        const initResult = init(target);
        if (!initResult)
            throw new Error(`Init function must return IPacker`);
        const packer = Packer.for(initResult);

        target[DecoderSymbol] = packer.decode;
        target[EncoderSymbol] = packer.encode;
    };
}

export function Packable(rule: FieldRule<any>) {
    if (rule === null || rule === void 0)
        throw new Error(`Rule must be defined`);

    return (target: Type<any>, field: string) => {
        if (FieldsSymbol in target)
            target[FieldsSymbol][field] = rule;
        else
            target[FieldsSymbol] = {[field]: rule};
    };
}
