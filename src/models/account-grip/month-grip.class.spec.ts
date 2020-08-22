import { Map, Set } from 'immutable';
import { Day } from '../day/day.class';
import { Transaction } from '../transaction/transaction.class';
import { TransactionType } from '../transaction/transaction.types';
import { ICategory } from '../category/category.types';
import { Account } from '../account/account.class';
import { Month } from '../month/month.class';
import { AccountMonthGrip } from './month-grip.class';
import { Money } from '../money/money.class';

describe('AccountMonthGrip class', () => {
    const account = Account.create('test', 'acc1');

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

    const categories = Map({cat1, cat2, default: catDefault});

    const tx1 = Transaction.createWithID('tx1', TransactionType.Income, 100, 'RUB')
                           .setCategory('cat1');

    const tx2 = Transaction.createWithID('tx2', TransactionType.Expense, 25, 'RUB');

    const tx3 = Transaction.createWithID('tx3', TransactionType.Income, 500, 'RUB')
                           .setCategory('cat1');

    const tx4 = Transaction.createWithID('tx4', TransactionType.Expense, 250, 'RUB');

    it('base', () => {
        const day1 = Day.create('2020-01-01')
                        .addTransaction(tx1)
                        .addTransaction(tx2);

        const day2 = Day.create('2020-01-02')
                        .addTransaction(tx3)
                        .addTransaction(tx4);

        const month = Month.createFirstBlock(account.id, '2020-01', 1596426439966)
                           .updateDay(day2)
                           .updateDay(day1);

        const grip = new AccountMonthGrip(
            Money.create(200, 'RUB'),
            month, account, categories,
        );

        expect(grip.month).toBe(month.month);
        expect(grip.balance).toEqual(Money.from('325 RUB'));
        expect(grip.balanceOnStart).toEqual(Money.from('200 RUB'));
        expect(grip.balanceOnEnd).toEqual(Money.from('525 RUB'));
        expect(grip.income).toEqual(Money.from('600 RUB'));
        expect(grip.expense).toEqual(Money.from('275 RUB'));
        expect(grip.categories.size).toBe(2);
        console.log('' + grip);
    });
});
