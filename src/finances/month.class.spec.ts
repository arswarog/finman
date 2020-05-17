import { Month } from './month.class';
import { EmptyExtendSummary, EmptySummary, IExtendSummary, ISummary } from './common.types';
import { Day } from './day.class';
import { ITransaction, TransactionType } from './transaction.types';
import { Money } from './money.class';

describe('Month class', () => {
    const wallet = '0-1-0-0';
    describe('static create', () => {
        it('May, 2020', () => {
            const month = Month.create(wallet, '2020-05');
            expect(month.month).toBe('2020-05');
            expect(month.wallet).toBe(wallet);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(31);
        });
        it('February, 2020', () => {
            const month = Month.create(wallet, '2020-02');
            expect(month.month).toBe('2020-02');
            expect(month.wallet).toBe(wallet);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(29);
        });
        it('February, 2022', () => {
            const month = Month.create(wallet, '2022-02');
            expect(month.month).toBe('2022-02');
            expect(month.wallet).toBe(wallet);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(28);
        });
    });
    describe('createDay', () => {
        const month = Month.create(wallet, '2022-02');
        it('1 (valid)', () => {
            const day = month.createDay(1);
            expect(day).toEqual(Day.create('2022-02-01'));
        });
        it('31 (valid because february)', () => {
            expect(() => month.createDay(31))
                .toThrowError('Invalid month in "2022-02-31"');
        });
    });
    describe('updateDay', () => {
        it('add first day', () => {
            const tx: ITransaction = {
                id: '0-0-0-0',
                category: '',
                title: '',
                type: TransactionType.Income,
                amount: Money.fromJSON('1 RUB'),
            };

            const month1 = Month.create(wallet, '2020-05');

            const day = month1.createDay(5)
                              .addTransaction(tx);

            const month = month1.updateDay(day);

            expect(month.summary).toEqual(<IExtendSummary>{
                balance: Money.fromJSON('1 RUB'),
                expense: Money.empty,
                income: Money.fromJSON('1 RUB'),
                balanceOnStart: Money.empty,
                balanceOnEnd: Money.fromJSON('1 RUB'),
            });
            expect(month.days).toEqual([day]);
        });
    });
    describe('recalculateWithNewStartBalance', () => {
        let month: Month;
        beforeEach(() => {
            const tx: ITransaction = {
                id: '0-0-0-0',
                category: '',
                title: '',
                type: TransactionType.Income,
                amount: Money.fromJSON('1 RUB'),
            };
            const month1 = Month.create(wallet, '2020-05');

            const day = month1.createDay(5)
                              .addTransaction(tx);

            month = month1.updateDay(day);

            expect(month.summary).toEqual(<IExtendSummary>{
                balance: Money.fromJSON('1 RUB'),
                expense: Money.empty,
                income: Money.fromJSON('1 RUB'),
                balanceOnStart: Money.empty,
                balanceOnEnd: Money.fromJSON('1 RUB'),
            });
        });

        it('add first day', () => {
            const month1 = month.recalculateWithNewStartBalance(new Money('5 RUB'));
            expect(month1.summary).toEqual(<IExtendSummary>{
                balance: Money.fromJSON('1 RUB'),
                expense: Money.empty,
                income: Money.fromJSON('1 RUB'),
                balanceOnStart: Money.fromJSON('5 RUB'),
                balanceOnEnd: Money.fromJSON('6 RUB'),
            });
        });
    });
});
