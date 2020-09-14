import { Day } from '../day/day.class';
import { Transaction } from '../transaction/transaction.class';
import { TransactionType } from '../transaction/transaction.types';
import { AccountDayGrip } from './day-grip.class';
import { AccountDTO } from '../account-dto/account.class';
import { ICategory } from '../category/category.types';
import { Map, Set } from 'immutable';
import { Money } from '../money/money.class';
import { UUID } from '../common/common.types';

describe('AccountDayGrip class', () => {
    it('TransactionTypes: Income and Expense', () => {
        const account = AccountDTO.create('test', 'acc1');

        const catDefault: ICategory = {
            id: 'default',
            name: 'Default Category',
            defaultTxType: TransactionType.Expense,
            image: 'default',
            parent: null,
        };

        const cat1: ICategory = {
            id: 'cat1',
            name: 'Category 1',
            defaultTxType: TransactionType.Expense,
            image: 'default',
            parent: null,
        };

        const cat2: ICategory = {
            id: 'cat2',
            name: 'Unused Category 2',
            defaultTxType: TransactionType.Expense,
            image: 'default',
            parent: null,
        };

        const tx1 = Transaction.createWithID('tx1', TransactionType.Income, 100, 'RUB')
                               .setCategory('cat1');

        const tx2 = Transaction.createWithID('tx2', TransactionType.Expense, 25, 'RUB');

        const day = Day.create('2020-01-01')
                       .addTransaction(tx1)
                       .addTransaction(tx2);

        const grip = new AccountDayGrip(
            Money.create(200, 'RUB'),
            day,
            account,
            Map<UUID, ICategory>([
                [cat1.id, cat1],
                [cat2.id, cat2],
                [catDefault.id, catDefault],
            ]) as any, // TODO: fix it
        );

        expect(grip.date).toBe(day.date);
        expect(grip.categories.get('default')).toEqual(catDefault);
        expect(grip.categories.get('cat1')).toEqual(cat1);
        expect(grip.categories.size).toBe(2);
        expect(grip.balanceOnStart).toEqual(Money.from('200 RUB'));
        expect(grip.balance).toEqual(Money.from('75 RUB'));
        expect(grip.balanceOnEnd).toEqual(Money.from('275 RUB'));
        expect(grip.income).toEqual(Money.from('100 RUB'));
        expect(grip.expense).toEqual(Money.from('25 RUB'));
        expect(grip.transactions.length).toBe(2);
        expect(grip.transactions[0].date).toBe('2020-01-01');
        expect(grip.transactions[0].type).toBe(TransactionType.Income);
        expect(grip.transactions[0].amount).toEqual(Money.from('100 RUB'));
        expect(grip.transactions[0].changeAmount).toEqual(Money.from('100 RUB'));
        expect(grip.transactions[0].sourceTxs).toEqual([tx1]);
        expect(grip.transactions[0].tags).toEqual(Set());
        expect(grip.transactions[1].date).toBe('2020-01-01');
        expect(grip.transactions[1].type).toBe(TransactionType.Expense);
        expect(grip.transactions[1].amount).toEqual(Money.from('25 RUB'));
        expect(grip.transactions[1].changeAmount).toEqual(Money.from('-25 RUB'));
        expect(grip.transactions[1].sourceTxs).toEqual([tx2]);
        expect(grip.transactions[1].tags).toEqual(Set());
    });
});
