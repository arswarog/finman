import {
    Decoder, DecoderSymbol,
    Encoder,
    EncoderSymbol,
    FieldRule,
    Fields,
    FieldsRules,
    FieldTypePrimitive,
    IPacker,
} from './packable.types';

export class Packer<T> implements IPacker<T> {
    private static getSafe(target: any): Packer<any> {
        if (target === null || target === void 0)
            return null;

        if (EncoderSymbol in target && typeof target[EncoderSymbol] === 'function' &&
            DecoderSymbol in target && typeof target[DecoderSymbol] === 'function')
            return new Packer(target[DecoderSymbol], target[EncoderSymbol]);

        if ('prototype' in target &&
            EncoderSymbol in target.prototype && typeof target.prototype[EncoderSymbol] === 'function' &&
            DecoderSymbol in target.prototype && typeof target.prototype[DecoderSymbol] === 'function')
            return new Packer(target.prototype[DecoderSymbol], target.prototype[EncoderSymbol]);

        return null;
    }

    static get(target: any): Packer<any> {
        const packer = Packer.getSafe(target);

        if (packer)
            return packer;

        throw new Error(`Target not a Packer`);
    }

    static for<T>(rule: FieldRule<T>): Packer<T> {
        if (rule === null || rule === void 0)
            throw new Error(`Rule not defined`);

        if (rule instanceof Packer)
            return rule;

        const packer = Packer.getSafe(rule);
        if (packer)
            return packer;

        if (rule === String || rule === Number || rule === Boolean)
            return Packer.forPrimitive(rule) as any;

        if (Array.isArray(rule))
            return Packer.forArray(rule[0]) as any;

        throw new Error(`Invalid rule`);
    }

    static forPrimitive<T extends FieldTypePrimitive>(type: T): Packer<ReturnType<T>> {
        if (type === String)
            return new Packer(
                raw => typeof raw === 'string'
                    ? '' + raw
                    : null,
                value => typeof value === 'string'
                    ? value
                    : null,
            ) as any;
        if (type === Number)
            return new Packer(raw => +raw, value => +value) as any;
        if (type === Boolean)
            return new Packer(raw => !!raw, value => !!value) as any;
        throw new Error(`Invalid type`);
    }

    static forObject<T extends object>(fields: FieldsRules<T>) {
        const list: [string, Packer<any>][] = Object
            .entries(fields)
            .map(([field, rule]) => [field, Packer.for(rule as FieldRule<any>)]);

        const encoder = obj => list
            .reduce(
                (data, [field, packer]) => {
                    data[field] = packer.encode(obj[field]);
                    return data;
                },
                {},
            );

        const decoder = data => list
            .reduce(
                (obj, [field, packer]) => {
                    obj[field] = packer.decode(data[field]);
                    return obj;
                },
                {},
            );

        return new Packer(decoder, encoder);
    }

    static forClass<T extends object>(fields: FieldsRules<T>, afterDecode: (data: Fields<T>) => T) {
        const packer = Packer.forObject(fields);

        return new Packer(
            data => afterDecode(packer.decode(data) as any),
            packer.encode,
        );
    }

    static forArray<T extends object>(rule: FieldRule<T>) {
        const packer = Packer.for<any>(rule);

        const encoder = value => value.map(packer.encode);
        const decoder = data => data.map(packer.decode);

        return new Packer<T[]>(decoder, encoder);
    }

    static maybe<T>(packer: Packer<T>): Packer<T | null> {
        const encoder: Encoder<T | null> = obj => obj === null || obj === undefined ? null : packer.encode(obj);
        const decoder: Decoder<T | null> = val => val === null || val === undefined ? null : packer.decode(val);
        return new Packer<T | null>(decoder, encoder);
    }

    public [DecoderSymbol]: Decoder<T>;
    public [EncoderSymbol]: Encoder<T>;
    public decode: Decoder<T>;
    public encode: Encoder<T>;

    constructor(decoder: Decoder<T>, encoder: Encoder<T>) {
        if (!encoder || typeof encoder !== 'function') throw new Error(`Encoder must be a function`);
        if (!decoder || typeof decoder !== 'function') throw new Error(`Decoder must be a function`);

        this[EncoderSymbol] = encoder;
        this[DecoderSymbol] = decoder;
        this.encode = encoder;
        this.decode = decoder;
    }
}
