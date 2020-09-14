import { AccountDTO } from '../account-dto/account.class';
import { ICategory } from '../category/category.types';
import { TransactionType } from '../transaction/transaction.types';
import { Map } from 'immutable';
import { Transaction } from '../transaction/transaction.class';
import { Day } from '../day/day.class';
import { MonthLegacy } from '../month/month-legacy.class';
import { AccountMonthGrip } from './month-grip.class';
import { Money } from '../money/money.class';
import { AccountGrip } from './grip.class';
import { CategoriesBlock } from '../category/categoryBlock.class';

describe('AccountGrip class', () => {
    const baseAccount = AccountDTO.create('test', 'acc1');

    const categoriesBlock = CategoriesBlock.createInitialBlock(baseAccount.id, [
        {
            id: 'default',
            name: 'Default Category',
            defaultType: TransactionType.Expense,
            image: 'default',
            children: [],
        },
        {
            id: 'cat1',
            name: 'Category 1',
            defaultType: TransactionType.Expense,
            image: 'default',
            children: [],
        },
        {
            id: 'cat2',
            name: 'Unused Category 2',
            defaultType: TransactionType.Expense,
            image: 'default',
            children: [],
        },
    ], 1596388775860);

    const categories = Map(categoriesBlock.list.map(item => [item.id, item]));

    const tx1 = Transaction.createWithID('tx1', TransactionType.Income, 100, 'RUB')
                           .setCategory('cat1');

    const tx2 = Transaction.createWithID('tx2', TransactionType.Expense, 25, 'RUB');

    const tx3 = Transaction.createWithID('tx3', TransactionType.Income, 500, 'RUB')
                           .setCategory('cat1');

    const tx4 = Transaction.createWithID('tx4', TransactionType.Expense, 250, 'RUB');

    const day1 = Day.create('2020-01-01')
                    .addTransaction(tx1)
                    .addTransaction(tx2);

    const day2 = Day.create('2020-01-02')
                    .addTransaction(tx3)
                    .addTransaction(tx4);

    const month = MonthLegacy.createFirstBlock(baseAccount.id, '2020-01', 12312312)
                             .updateDay(day2)
                             .updateDay(day1);

    it('constructor', () => {
        const account = baseAccount.updateHead(month);

        const grip = new AccountGrip(account, categoriesBlock);

        expect(grip.firstMonthDate).toBe(month.month);
        expect(grip.lastMonthDate).toBe(month.month);
        expect(grip.months.length).toBe(1);

        expect(grip.categories.size).toBe(2);

        expect(grip.balance).toEqual(Money.from('325 RUB'));
        expect(grip.income).toEqual(Money.from('600 RUB'));
        expect(grip.expense).toEqual(Money.from('275 RUB'));
    });

    it('makeMonth', () => {
        // arrange
        const account = baseAccount.updateHead(month);
        const accountGrip = new AccountGrip(account, categoriesBlock);

        // act
        const grip = accountGrip.makeMonth(month);

        // assert
        expect(grip.month).toBe(month.month);
        expect(grip.balance).toEqual(Money.from('325 RUB'));
        expect(grip.balanceOnStart).toEqual(Money.from('0 RUB'));
        expect(grip.balanceOnEnd).toEqual(Money.from('325 RUB'));
        expect(grip.income).toEqual(Money.from('600 RUB'));
        expect(grip.expense).toEqual(Money.from('275 RUB'));
        expect(grip.categories.size).toBe(2);
    });
});
