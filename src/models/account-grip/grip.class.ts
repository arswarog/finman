import { AbstractGrip } from '../abstract-grip/grip.class';
import { IAccount } from '../account/account.types';
import { CategoriesBlock } from '../category/categoryBlock.class';
import { IMonth } from '../month/month.types';
import { AccountMonthGrip } from './month-grip.class';
import { Map } from 'immutable';
import { Money } from '../money/money.class';

export class AccountGrip extends AbstractGrip {
    public readonly account: IAccount;

    constructor(account: IAccount, categoriesBlock: CategoriesBlock) {
        const categories = Map(categoriesBlock.list.map(item => [item.id, item]));
        super([account], categories);
        this.account = account;
        if (!account.head)
            return;

        this.lastMonthDate = account.head.month;
        this.firstMonthDate = account.months[account.months.length - 1].month;
        this.months = []; // FIXME
        this.balance = account.head.summary.balanceOnEnd;
        this.income = Money.empty; // FIXME
        this.expense = Money.empty; // FIXME
    }

    public makeMonth(month: IMonth): AccountMonthGrip {
        return new AccountMonthGrip(month.summary.balanceOnStart, month, this.account, this.categories);
    }
}
