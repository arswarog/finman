import { Day } from './day.class';
import { EmptySummary, ISummary } from '../common/common.types';
import { ITransaction, TransactionType } from '../transaction/transaction.types';
import { Money } from '../money/money.class';
import { Transaction } from '../transaction/transaction.class';

describe('Day class', () => {
    describe('static create', () => {
        it('default', () => {
            const day = Day.create('2020-05-08');
            expect(day.date).toBe('2020-05-08');
            expect(day.dateTime).toEqual(new Date(2020, 4, 8, 12, 0, 0));
            expect(day.summary).toEqual(EmptySummary);
            expect(day.transactions).toEqual([]);
        });
    });
    describe('addTransaction', () => {
        it('add income 1 RUB tx', () => {
            const tx: ITransaction = {
                id: '0-0-0-0',
                category: '',
                title: '',
                type: TransactionType.Income,
                amount: Money.fromJSON('1 RUB'),
            };
            const day = Day.create('2020-05-01').upsertTransaction(tx);
            expect(day.summary).toEqual(<ISummary>{
                income: Money.fromJSON('1 RUB'),
                expense: Money.empty,
                balance: Money.fromJSON('1 RUB'),
            });
            expect(day.transactions).toEqual([tx]);
        });
        it('add expense 12 RUB tx', () => {
            const tx: ITransaction = {
                id: '0-0-0-0',
                category: '',
                title: '',
                type: TransactionType.Expense,
                amount: Money.fromJSON('2 RUB'),
            };
            const day = Day.create('2020-05-01').upsertTransaction(tx);
            expect(day.summary).toEqual(<ISummary>{
                income: Money.empty,
                expense: Money.fromJSON('2 RUB'),
                balance: Money.fromJSON('-2 RUB'),
            });
            expect(day.transactions).toEqual([tx]);
        });
        it('many transactions', () => {
            const tx1: ITransaction = {
                id: '0-0-0-0',
                category: '',
                title: '',
                type: TransactionType.Expense,
                amount: Money.fromJSON('1 RUB'),
            };
            const tx2: ITransaction = {
                id: '0-0-0-1',
                category: '',
                title: '',
                type: TransactionType.Income,
                amount: Money.fromJSON('2 RUB'),
            };
            const day = Day.create('2020-05-01')
                           .upsertTransaction(tx1)
                           .upsertTransaction(tx2);
            expect(day.summary).toEqual(<ISummary>{
                income: Money.fromJSON('2 RUB'),
                expense: Money.fromJSON('1 RUB'),
                balance: Money.fromJSON('1 RUB'),
            });
            expect(day.transactions).toEqual([tx1, tx2]);
        });
    });
    describe('packing', () => {
        it('base', () => {
            const tx = Transaction.createWithID(
                '0-0-0-0',
                TransactionType.Income,
                Money.fromJSON('1 RUB'),
            );
            const day = Day.create('2020-05-01').upsertTransaction(tx);

            expect(day.transactions[0]).toBeInstanceOf(Transaction);

            const json = day.toJSON();
            expect(json).toEqual({
                date: '2020-05-01',
                summary: {
                    balance: '1.00 RUB',
                    expense: '0 RUB',
                    income: '1.00 RUB',
                },
                transactions: [
                    {
                        amount: '1.00 RUB',
                        category: '',
                        createdAt: 0,
                        id: '0-0-0-0',
                        title: '',
                        type: 1,
                        updatedAt: 0,
                    },
                ],
            });
            const unpacked = Day.fromJSON(json);
            expect(unpacked).toStrictEqual(day);
        });
    });
});
