import { currencies, Money } from './money.class';

describe('Money class', () => {
    describe('create', () => {
        describe('from string', () => {
            it('0 RUB', () => {
                const money = new Money('0 RUB');
                expect(money.amount).toBe('0.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(0);
            });
            it('93 RUB', () => {
                const money = new Money('93 RUB');
                expect(money.amount).toBe('93.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(9300);
            });
            it('123.1 RUB', () => {
                const money = new Money('123.1 RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
            it('123.101 RUB', () => {
                const money = new Money('123.101 RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
        });
        describe('from number and code', () => {
            it('0, RUB', () => {
                const money = new Money(0, 'RUB');
                expect(money.amount).toBe('0.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(0);
            });
            it('93, RUB', () => {
                const money = new Money(93, 'RUB');
                expect(money.amount).toBe('93.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(9300);
            });
            it('123.1, RUB', () => {
                const money = new Money(123.1, 'RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
            it('123.101, RUB', () => {
                const money = new Money(123.101, 'RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
        });
        describe('from string and code', () => {
            it('"0", RUB', () => {
                const money = new Money('0', 'RUB');
                expect(money.amount).toBe('0.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(0);
            });
            it('"", RUB', () => {
                const money = new Money('0 RUB');
                expect(money.amount).toBe('0.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(0);
            });
            it('"93", RUB', () => {
                const money = new Money('93', 'RUB');
                expect(money.amount).toBe('93.00');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(9300);
            });
            it('"123.1", RUB', () => {
                const money = new Money('123.1', 'RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
            it('"123.101", RUB', () => {
                const money = new Money('123.101', 'RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
        });
        describe('from money', () => {
            it('123.1 RUB', () => {
                const money = new Money('123.1 RUB');
                expect(money.amount).toBe('123.10');
                expect(money.currency).toEqual(currencies['RUB']);
                expect(money.subunits).toBe(12310);
            });
        });
        describe('incorrect', () => {
            it('invalid string', () => {
                expect(() => {
                    new Money('invalid');
                }).toThrow();
            });
            it('invalid currency', () => {
                expect(() => {
                    new Money('0 INVALID');
                }).toThrow();
            });
            it('invalid number (with currency)', () => {
                expect(() => {
                    new Money('124f', 'RUB');
                }).toThrow();
            });
            it('invalid number (in string)', () => {
                expect(() => {
                    new Money('124f RUB');
                }).toThrow();
            });
            it('invalid number (without currency)', () => {
                expect(() => {
                    new Money(12 as any);
                }).toThrow();
            });
            it('invalid object', () => {
                expect(() => {
                    new Money({} as any);
                }).toThrow();
            });
        });
    });

    describe('serialize', () => {
        describe('toJSON', () => {
            it('0 RUB', () => {
                const money = new Money('0 RUB');
                expect('' + money).toBe('0 ₽');
                expect(JSON.parse(JSON.stringify({
                    balance: money,
                }))).toEqual({
                    balance: '0 RUB',
                });
            });
            it('123.12 RUB', () => {
                const money = new Money('123.12 RUB');
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
                const x = new Money('0 RUB');
                const y = new Money('0.01 RUB');
                expect(x.add(y)).toEqual(new Money(y));
            });
            it('1000200 RUB + 15.01 RUB', () => {
                const x = new Money('1000200 RUB');
                const y = new Money('15.01 RUB');
                expect(x.add(y)).toEqual(new Money('1000215.01 RUB'));
            });
        });
        describe('sub', () => {
            it('1 RUB - 1.01 RUB', () => {
                const x = new Money('1 RUB');
                const y = new Money('1.01 RUB');
                expect(x.sub(y)).toEqual(new Money('-0.01 RUB'));
            });
            it('1000 RUB - 15.01 RUB', () => {
                const x = new Money('1000 RUB');
                const y = new Money('15.01 RUB');
                expect(x.sub(y)).toEqual(new Money('984.99 RUB'));
            });
        });
    });
});
