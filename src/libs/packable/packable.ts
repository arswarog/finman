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
    static for<T>(rule: FieldRule<T>) {
        if (rule instanceof Packer)
            return rule;

        if (EncoderSymbol in rule && typeof rule[EncoderSymbol] === 'function' &&
            DecoderSymbol in rule && typeof rule[DecoderSymbol] === 'function')
            return new Packer(rule[DecoderSymbol], rule[EncoderSymbol]);

        if (rule === String || rule === Number || rule === Boolean)
            return Packer.forPrimitive(rule);

        if (Array.isArray(rule))
            return Packer.forArray(rule[0]);

        throw new Error(`Invalid rule`);
    }

    static forPrimitive<T extends FieldTypePrimitive>(type: T): Packer<ReturnType<T>> {
        if (type === String)
            return new Packer(raw => '' + raw, value => '' + value) as any;
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

    public [DecoderSymbol]: Decoder<T>;
    public [EncoderSymbol]: Encoder<T>;
    public decode: Decoder<T>;
    public encode: Encoder<T>;

    constructor(decoder: Decoder<T>, encoder: Encoder<T>) {
        this[EncoderSymbol] = encoder;
        this[DecoderSymbol] = decoder;
        this.encode = encoder;
        this.decode = decoder;
    }
}
