import { Map, Set } from 'immutable';
import { IDayGrip, ITransactionGrip } from './grip.types';
import { IAccount } from '../account/account.types';
import { UUID } from '../common/common.types';
import { IDay } from '../day/day.class';
import { ICategory } from '../category/category.types';
import { Money } from '../money/money.class';
import { DayDate } from '../common/date.types';
import { ITag, TagName } from '../tag/tag.types';
import { TransactionGrip } from './transaction-grip.class';

export abstract class AbstractDayGrip implements IDayGrip {
    readonly balance: Money;
    readonly balanceOnEnd: Money;
    readonly balanceOnStart: Money;
    readonly categories: Map<UUID, ICategory>;
    readonly date: DayDate;
    readonly expense: Money;
    readonly income: Money;
    readonly tags: Map<TagName, ITag>;
    readonly transactions: TransactionGrip[];

    protected constructor(date: DayDate,
                          balanceOnStart: Money,
                          gripTransactions: ITransactionGrip[]) {
        // base
        this.date = date;
        this.transactions = gripTransactions.map(item => new TransactionGrip(item));

        // categories and tags
        let categories: Map<UUID, ICategory> = Map();
        let tags = Map();

        this.transactions.forEach(tx => {
            categories = categories.set(tx.category.id, tx.category);
        });

        this.categories = categories;

        // balance
        this.balanceOnStart = balanceOnStart;
        this.balance = this.transactions.reduce(
            (sum, tx) => sum.add(tx.changeAmount),
            Money.empty,
        );
        this.balanceOnEnd = this.balanceOnStart.add(this.balance);
        this.income = this.transactions
                          .filter(tx => tx.changeAmount.isPositive())
                          .reduce(
                              (sum, tx) => sum.add(tx.changeAmount),
                              Money.empty,
                          );
        this.expense = this.transactions
                           .filter(tx => tx.changeAmount.isNegative())
                           .reduce(
                               (sum, tx) => sum.add(tx.changeAmount),
                               Money.empty,
                           )
                           .negative();

        // собрать информацию с транзакций, заполнить tags, categories, accounts(?), balance, balanceOnEnd
    }
}
