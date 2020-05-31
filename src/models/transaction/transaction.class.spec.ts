import { Transaction } from './transaction.class';
import { TransactionType } from './transaction.types';
import { Money } from '../money/money.class';

describe('Transaction', () => {
    describe('create', () => {
        it('empty', () => {
            const tx = Transaction.create();

            const id = tx.id;

            expect(tx.toJSON()).toEqual({
                id,
                amount: '0 RUB',
                type: TransactionType.Removed,
                category: '',
                title: '',
                createdAt: 0,
                updatedAt: 0,
            });
        });
        it('expense', () => {
            const tx = Transaction.create(TransactionType.Expense);

            const id = tx.id;

            expect(tx.toJSON()).toEqual({
                id,
                amount: '0 RUB',
                type: TransactionType.Expense,
                category: '',
                title: '',
                createdAt: 0,
                updatedAt: 0,
            });
        });
        it('100 RUB', () => {
            const tx = Transaction.create(TransactionType.Income, 100, 'RUB');

            const id = tx.id;

            expect(tx.toJSON()).toEqual({
                id,
                amount: Money.from('100 RUB').toJSON(),
                type: TransactionType.Income,
                category: '',
                title: '',
                createdAt: 0,
                updatedAt: 0,
            });
        });
    });
    describe('setters', () => {
        it('setAmount (Money)', () => {
            const base = Transaction.create(TransactionType.Income);

            const tx = base.setAmount(Money.create(100, 'RUB'));

            const id = tx.id;

            expect(tx.toJSON()).toEqual({
                id,
                amount: Money.from('100 RUB').toJSON(),
                type: TransactionType.Income,
                category: '',
                title: '',
                createdAt: 0,
                updatedAt: 0,
            });
        });
        it('setAmount (157, "RUB")', () => {
            const base = Transaction.create();

            const tx = base.setAmount(157, 'RUB');

            const id = tx.id;

            expect(tx.toJSON()).toEqual({
                id,
                amount: Money.from('157 RUB').toJSON(),
                type: TransactionType.Removed,
                category: '',
                title: '',
                createdAt: 0,
                updatedAt: 0,
            });
        });
        it('setType (157, "RUB")', () => {
            const base = Transaction.create();

            const tx = base.setType(TransactionType.Adjust);

            const id = tx.id;

            expect(tx === base).toBeFalsy();
            expect(tx.toJSON()).toEqual({
                id,
                amount: Money.empty.toJSON(),
                type: TransactionType.Adjust,
                category: '',
                title: '',
                createdAt: 0,
                updatedAt: 0,
            });
        });
        it('setCategory', () => {
            const base = Transaction.create();

            const tx = base.setCategory('0100-1010');

            const id = tx.id;

            expect(tx === base).toBeFalsy();
            expect(tx.toJSON()).toEqual({
                id,
                amount: Money.empty.toJSON(),
                type: TransactionType.Removed,
                category: '0100-1010',
                title: '',
                createdAt: 0,
                updatedAt: 0,
            });
        });
        it('setTitle', () => {
            const base = Transaction.create();

            const tx = base.setTitle('title');

            const id = tx.id;

            expect(tx === base).toBeFalsy();
            expect(tx.toJSON()).toEqual({
                id,
                amount: Money.empty.toJSON(),
                type: TransactionType.Removed,
                category: '',
                title: 'title',
                createdAt: 0,
                updatedAt: 0,
            });
        });
        it('setCreatedAt', () => {
            const base = Transaction.create();

            const tx = base.setCreatedAt(123123122123);

            const id = tx.id;

            expect(tx === base).toBeFalsy();
            expect(tx.toJSON()).toEqual({
                id,
                amount: Money.empty.toJSON(),
                type: TransactionType.Removed,
                category: '',
                title: '',
                createdAt: 123123122123,
                updatedAt: 0,
            });
        });
        it('setUpdatedAt', () => {
            const base = Transaction.create();

            const tx = base.setUpdatedAt(123123122123);

            const id = tx.id;

            expect(tx === base).toBeFalsy();
            expect(tx.toJSON()).toEqual({
                id,
                amount: Money.empty.toJSON(),
                type: TransactionType.Removed,
                category: '',
                title: '',
                createdAt: 0,
                updatedAt: 123123122123,
            });
        });
    });
    describe('import, export', () => {
        it('import, export', () => {
            const base = Transaction.create(TransactionType.Income, 100, 'RUB')
                                    .setCategory('0100-0010')
                                    .setTitle('Some title')
                                    .setCreatedAt(123123121)
                                    .setUpdatedAt(345345345);
            const id = base.id;

            const json = JSON.stringify(base, null, 2);

            expect(json).toBe([
                '{',
                `  "id": "${id}",`,
                '  "amount": "100.00 RUB",',
                '  "type": 1,',
                '  "category": "0100-0010",',
                '  "title": "Some title",',
                '  "createdAt": 123123121,',
                '  "updatedAt": 345345345',
                '}',
            ].join('\n'));

            const tx = Transaction.fromJSON(JSON.parse(json));

            expect(tx).toEqual(base);
        });
    });
});
