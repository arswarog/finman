import { currencies, Money } from './money.class';

describe('Money class', () => {
    describe('create', () => {
        describe('from string', () => {
            it('0 RUB', () => {
                const money = Money.fromJSON('0 RUB');
                expect(money.amount).toBe('0.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(0);
            });
            it('0.01 RUB', () => {
                const money = Money.fromJSON('0.01 RUB');
                expect(money.amount).toBe('0.01');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(1);
            });
            it('93 RUB', () => {
                const money = Money.fromJSON('93 RUB');
                expect(money.amount).toBe('93.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(9300);
            });
            it('123.1 RUB', () => {
                const money = Money.fromJSON('123.1 RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
            it('123.101 RUB', () => {
                const money = Money.fromJSON('123.101 RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
        });
        describe('clone', () => {
            it('123.01 RUB', () => {
                const x = Money.create(123.01, 'RUB');
                const y = x.clone();
                expect(x.toString()).toEqual(y.toString());
                expect(x === y).toBeFalsy();
            });
            it('0.01 RUB', () => {
                const x = Money.create(0.01, 'RUB');
                const y = x.clone();
                expect(x.toString()).toEqual(y.toString());
                expect(x === y).toBeFalsy();
            });
        });
        describe('from number and code', () => {
            it('0, RUB', () => {
                const money = Money.create(0, 'RUB');
                expect(money.amount).toBe('0.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(0);
            });
            it('0.01, RUB', () => {
                const money = Money.create(0.01, 'RUB');
                expect(money.amount).toBe('0.01');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(1);
            });
            it('93, RUB', () => {
                const money = Money.create(93, 'RUB');
                expect(money.amount).toBe('93.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(9300);
            });
            it('123.1, RUB', () => {
                const money = Money.create(123.1, 'RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
            it('123.101, RUB', () => {
                const money = Money.create(123.101, 'RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
        });
        describe('from string and code', () => {
            it('"0", RUB', () => {
                const money = Money.create('0', 'RUB');
                expect(money.amount).toBe('0.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(0);
            });
            it('"", RUB', () => {
                const money = Money.create('0', 'RUB');
                expect(money.amount).toBe('0.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(0);
            });
            it('"93", RUB', () => {
                const money = Money.create('93', 'RUB');
                expect(money.amount).toBe('93.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(9300);
            });
            it('"123.1", RUB', () => {
                const money = Money.create('123.1', 'RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
            it('"123.101", RUB', () => {
                const money = Money.create('123.101', 'RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
        });
        describe('from()', () => {
            it('money', () => {
                const add = Money.create(1, 'RUB');
                const money = Money.from(add);
                expect(money.toJSON()).toEqual(add.toJSON());
                expect(money === add).toBeFalsy();
            });
            it('string', () => {
                const add = Money.create(1, 'RUB');
                const money = Money.from(add.toJSON());
                expect(money.toJSON()).toEqual(add.toJSON());
                expect(money === add).toBeFalsy();
            });
        });
        describe('incorrect', () => {
            it('invalid string', () => {
                expect(() => {
                    Money.fromJSON('invalid');
                }).toThrow();
            });
            it('invalid currency', () => {
                expect(() => {
                    Money.fromJSON('0 INVALID');
                }).toThrow();
            });
            it('invalid number (with currency)', () => {
                expect(() => {
                    Money.create('124f', 'RUB');
                }).toThrow();
            });
            it('invalid number (in string)', () => {
                expect(() => {
                    Money.fromJSON('124f RUB');
                }).toThrow();
            });
            it('invalid number (without currency)', () => {
                expect(() => {
                    Money.fromJSON(12 as any);
                }).toThrow();
            });
            it('invalid object', () => {
                expect(() => {
                    Money.fromJSON({} as any);
                }).toThrow();
            });
            it('invalid number (without currency)', () => {
                expect(() => {
                    Money.create(12 as any, 'h' as any);
                }).toThrow();
            });
            it('invalid object', () => {
                expect(() => {
                    Money.create({} as any, 'h' as any);
                }).toThrow();
            });
        });
    });

    describe('serialize', () => {
        describe('toJSON', () => {
            it('0 RUB', () => {
                const money = Money.fromJSON('0 RUB');
                expect('' + money).toBe('0 ₽');
                expect(JSON.parse(JSON.stringify({
                    balance: money,
                }))).toEqual({
                    balance: '0 RUB',
                });
            });
            it('123.12 RUB', () => {
                const money = Money.fromJSON('123.12 RUB');
                expect('' + money).toBe('123.12 ₽');
                expect(JSON.parse(JSON.stringify({
                    balance: money,
                }))).toEqual({
                    balance: '123.12 RUB',
                });
            });
        });
    });

    describe('operations', () => {
        describe('add', () => {
            it('0 RUB + 0.01 RUB', () => {
                const x = Money.fromJSON('0 RUB');
                const y = Money.fromJSON('0.01 RUB');
                expect(x.add(y)).toEqual(y.clone());
            });
            it('1000200 RUB + 15.01 RUB', () => {
                const x = Money.fromJSON('1000200 RUB');
                const y = Money.fromJSON('15.01 RUB');
                expect(x.add(y)).toEqual(Money.fromJSON('1000215.01 RUB'));
            });
        });
        describe('sub', () => {
            it('1 RUB - 1.01 RUB', () => {
                const x = Money.fromJSON('1 RUB');
                const y = Money.fromJSON('1.01 RUB');
                expect(x.sub(y)).toEqual(Money.fromJSON('-0.01 RUB'));
            });
            it('1000 RUB - 15.01 RUB', () => {
                const x = Money.fromJSON('1000 RUB');
                const y = Money.fromJSON('15.01 RUB');
                expect(x.sub(y)).toEqual(Money.fromJSON('984.99 RUB'));
            });
        });
    });

    describe('parts', () => {
        it('0 RUB', () => {
            const money = Money.fromJSON('0 RUB');
            expect('' + money).toBe('0 ₽');
            expect(money.getEntire()).toEqual('0');
            expect(money.getFractional()).toEqual('00');
        });
        it('123.12 RUB', () => {
            const money = Money.fromJSON('123.45 RUB');
            expect('' + money).toBe('123.45 ₽');
            expect(money.getEntire()).toEqual('123');
            expect(money.getFractional()).toEqual('45');
        });
    });
});
