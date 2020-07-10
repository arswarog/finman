import { Packer } from './packable';
import { DecoderSymbol, EncoderSymbol, Fields } from './packable.types';

describe('Packable', () => {
    describe('core', () => {
        describe('encoder/decoder', () => {
            it('base', () => {
                const packer = new Packer(value => +value, obj => '' + obj);

                expect(packer.decode('1')).toBe(1);
                expect(packer.encode(1)).toBe('1');
            });
        });
        describe('forPrimitive', () => {
            it('string', () => {
                const packer = Packer.forPrimitive(String);

                expect(packer.decode(1)).toBe('1');
                expect(packer.encode('1')).toBe('1');
            });
            it('number', () => {
                const packer = Packer.forPrimitive(Number);

                expect(packer.decode('1')).toBe(1);
                expect(packer.encode(1)).toBe(1);
            });
            it('boolean', () => {
                const packer = Packer.forPrimitive(Boolean);

                expect(packer.decode(0)).toBe(false);
                expect(packer.encode(true)).toBe(true);
            });
        });
        describe('forObject', () => {
            it('base', () => {
                interface IData {
                    num: number;
                    num2: number;
                    str: string;
                    non: boolean;
                    sub: {
                        x: number;
                        y: number;
                    }
                }

                const packer = Packer.forObject({
                    num: Number,
                    str: Packer.forPrimitive(String),
                    num2: {
                        [DecoderSymbol]: raw => +raw,
                        [EncoderSymbol]: value => +value,
                    },
                    sub: Packer.forObject({
                        x: Number,
                        y: Number,
                    }),
                });

                const data: IData = {
                    num: 1,
                    str: '0',
                    non: false,
                    num2: 5,
                    sub: {
                        x: 5,
                        y: 10,
                    },
                };

                const packed = packer.encode(data);
                expect(packed).toEqual({
                    num: 1,
                    str: '0',
                    num2: 5,
                    sub: {
                        x: 5,
                        y: 10,
                    },
                });
                expect(Object.keys(packed)).toEqual([
                    'num', 'str', 'num2', 'sub',
                ]);
                const restored = packer.decode(packed);
                expect(restored).toStrictEqual({
                    num: 1,
                    str: '0',
                    num2: 5,
                    sub: {
                        x: 5,
                        y: 10,
                    },
                });
            });
        });
        describe('forClass', () => {
            it('base', () => {
                class Pos {
                    x: number;
                    y: number;

                    constructor(data: Fields<Pos>) {
                        Object.assign(this, data);
                    }
                }

                class Data {
                    name: string;
                    pos: Pos;
                    non: boolean = false;

                    constructor(data: Fields<Data>) {
                        Object.assign(this, data);
                    }
                }

                const posPacker = Packer.forClass({
                    x: Number,
                    y: Number,
                }, data => new Pos(data as any));
                const packer = Packer.forClass({
                    name: String,
                    pos: posPacker,
                }, data => new Data(data as any));

                const pos = new Pos({x: 5, y: 10});
                const data = new Data({
                    name: '123',
                    pos,
                    non: false,
                });

                const packed = packer.encode(data);
                expect(packed).toEqual({
                    name: '123',
                    pos: {
                        x: 5,
                        y: 10,
                    },
                });
                expect(Object.keys(packed)).toEqual([
                    'name', 'pos',
                ]);
                const restored = packer.decode(packed);
                expect(restored).toStrictEqual(data);
            });
        });
        describe('forArray', () => {
            it('base', () => {
                class Pos {
                    x: number;
                    y: number;

                    constructor(data: Fields<Pos>) {
                        Object.assign(this, data);
                    }
                }

                class Data {
                    name: string;
                    positions: Pos[];
                    positions2: Pos[];
                    non: boolean = false;

                    constructor(data: Fields<Data>) {
                        Object.assign(this, data);
                    }
                }

                const posPacker = Packer.forClass({
                    x: Number,
                    y: Number,
                }, data => new Pos(data as any));

                const packer = Packer.forClass({
                    name: String,
                    positions: Packer.forArray(posPacker),
                    positions2: [posPacker],
                }, data => new Data(data as any));

                const positions = [
                    new Pos({x: 5, y: 10}),
                    new Pos({x: 0, y: 0}),
                    new Pos({x: 50, y: 10}),
                ];

                const data = new Data({
                    name: '123',
                    positions,
                    positions2: positions,
                    non: false,
                });

                const packed = packer.encode(data);
                expect(packed).toEqual({
                    name: '123',
                    positions: [
                        {x: 5, y: 10},
                        {x: 0, y: 0},
                        {x: 50, y: 10},
                    ],
                    positions2: [
                        {x: 5, y: 10},
                        {x: 0, y: 0},
                        {x: 50, y: 10},
                    ],
                });
                expect(Object.keys(packed)).toEqual([
                    'name', 'positions', 'positions2',
                ]);
                const restored = packer.decode(packed);
                expect(restored).toStrictEqual(data);
            });
        });
    });
});
