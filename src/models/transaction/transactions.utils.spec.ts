import { addExtendSummary, addSummary, calculateExtendSummary, calculateSummary } from './transactions.utils';
import { IPeriodSummary, ISummary, UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { ITransaction, TransactionType } from './transaction.types';

describe('transactions utils', () => {
    describe('calculateSummary', () => {
        it('empty array', () => {
            expect(calculateSummary([])).toEqual(<ISummary>{
                balance: Money.empty,
                expense: Money.empty,
                income: Money.empty,
            });
        });
        it('1 expense tx', () => {
            const txs: ITransaction[] = [
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('1 RUB'),
                    type: TransactionType.Expense,
                    category: '1-1-1-1',
                    title: '',
                },
            ];
            expect(calculateSummary(txs)).toEqual(<ISummary>{
                balance: Money.fromJSON('-1 RUB'),
                expense: Money.fromJSON('1 RUB'),
                income: Money.empty,
            });
        });
        it('more txs', () => {
            const txs: ITransaction[] = [
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('1 RUB'),
                    type: TransactionType.Income,
                    category: '1-1-1-1',
                    title: '',
                },
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('10 RUB'),
                    type: TransactionType.Expense,
                    category: '1-1-1-1',
                    title: '',
                },
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('1 RUB'),
                    type: TransactionType.Removed,
                    category: '1-1-1-1',
                    title: '',
                },
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('20 RUB'),
                    type: TransactionType.Income,
                    category: '1-1-1-1',
                    title: '',
                },
            ];
            expect(calculateSummary(txs)).toEqual(<ISummary>{
                balance: Money.fromJSON('11 RUB'),
                expense: Money.fromJSON('10 RUB'),
                income: Money.fromJSON('21 RUB'),
            });
        });
    });
    describe('calculateExtendSummary', () => {
        it('empty array', () => {
            expect(calculateExtendSummary([])).toEqual(<IPeriodSummary>{
                balance: Money.empty,
                balanceOnStart: Money.empty,
                balanceOnEnd: Money.empty,
                expense: Money.empty,
                income: Money.empty,
            });
        });
        it('1 expense tx', () => {
            const txs: ITransaction[] = [
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('1 RUB'),
                    type: TransactionType.Expense,
                    category: '1-1-1-1',
                    title: '',
                },
            ];
            expect(calculateExtendSummary(txs)).toEqual(<IPeriodSummary>{
                balance: Money.fromJSON('-1 RUB'),
                balanceOnStart: Money.empty,
                balanceOnEnd: Money.fromJSON('-1 RUB'),
                expense: Money.fromJSON('1 RUB'),
                income: Money.empty,
            });
        });
        it('more txs', () => {
            const txs: ITransaction[] = [
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('1 RUB'),
                    type: TransactionType.Income,
                    category: '1-1-1-1',
                    title: '',
                },
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('10 RUB'),
                    type: TransactionType.Expense,
                    category: '1-1-1-1',
                    title: '',
                },
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('1 RUB'),
                    type: TransactionType.Removed,
                    category: '1-1-1-1',
                    title: '',
                },
                {
                    id: '0-0-0-0',
                    amount: Money.fromJSON('20 RUB'),
                    type: TransactionType.Income,
                    category: '1-1-1-1',
                    title: '',
                },
            ];
            expect(calculateExtendSummary(txs)).toEqual(<IPeriodSummary>{
                balance: Money.fromJSON('11 RUB'),
                balanceOnStart: Money.empty,
                balanceOnEnd: Money.fromJSON('11 RUB'),
                expense: Money.fromJSON('10 RUB'),
                income: Money.fromJSON('21 RUB'),
            });
        });
    });
    describe('addSummary', () => {
        it('add 0 and 1 RUB', () => {
            const start: ISummary = {
                balance: Money.fromJSON('20 RUB'),
                expense: Money.fromJSON('30 RUB'),
                income: Money.fromJSON('50 RUB'),
            };
            const add: ISummary = {
                balance: Money.fromJSON('-7 RUB'),
                expense: Money.fromJSON('30 RUB'),
                income: Money.fromJSON('23 RUB'),
            };
            const end: ISummary = {
                balance: Money.fromJSON('13 RUB'),
                expense: Money.fromJSON('60 RUB'),
                income: Money.fromJSON('73 RUB'),
            };
            expect(addSummary(start, add)).toEqual(end);
        });
        it('exception if sum incorrect', () => {
            const start: ISummary = {
                balance: Money.fromJSON('20 RUB'),
                expense: Money.fromJSON('30 RUB'),
                income: Money.fromJSON('50 RUB'),
            };
            const add: ISummary = {
                balance: Money.fromJSON('17 RUB'), // Invalid sum
                expense: Money.fromJSON('30 RUB'),
                income: Money.fromJSON('23 RUB'),
            };
            expect(() => addSummary(start, add)).toThrow();
        });
    });
    describe('addExtendSummary', () => {
        it('add 0 and 1 RUB', () => {
            const start: IPeriodSummary = {
                balance: Money.fromJSON('20 RUB'),
                balanceOnStart: Money.fromJSON('10 RUB'),
                balanceOnEnd: Money.fromJSON('30 RUB'),
                expense: Money.fromJSON('30 RUB'),
                income: Money.fromJSON('50 RUB'),
            };
            const add: IPeriodSummary = {
                balance: Money.fromJSON('-7 RUB'),
                balanceOnStart: Money.fromJSON('-10 RUB'),
                balanceOnEnd: Money.fromJSON('-17 RUB'),
                expense: Money.fromJSON('30 RUB'),
                income: Money.fromJSON('23 RUB'),
            };
            const end: IPeriodSummary = {
                balance: Money.fromJSON('13 RUB'),
                balanceOnStart: Money.fromJSON('10 RUB'),
                balanceOnEnd: Money.fromJSON('23 RUB'),
                expense: Money.fromJSON('60 RUB'),
                income: Money.fromJSON('73 RUB'),
            };
            expect(addExtendSummary(start, add)).toEqual(end);
        });
        it('exception if sum incorrect', () => {
            const start: IPeriodSummary = {
                balance: Money.fromJSON('20 RUB'),
                balanceOnStart: Money.fromJSON('10 RUB'),
                balanceOnEnd: Money.fromJSON('30 RUB'),
                expense: Money.fromJSON('30 RUB'),
                income: Money.fromJSON('50 RUB'),
            };
            const add: IPeriodSummary = {
                balance: Money.fromJSON('17 RUB'), // Invalid sum
                balanceOnStart: Money.fromJSON('-10 RUB'),
                balanceOnEnd: Money.fromJSON('-17 RUB'),
                expense: Money.fromJSON('30 RUB'),
                income: Money.fromJSON('23 RUB'),
            };
            expect(() => addExtendSummary(start, add)).toThrow();
        });
    });
});
