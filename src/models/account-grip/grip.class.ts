import { AbstractGrip } from '../abstract-grip/grip.class';
import { IAccount } from '../account/account.types';
import { CategoriesBlock } from '../category/categoryBlock.class';
import { IMonth, IMonthBrief } from '../month/month-legacy.types';
import { AccountMonthGrip } from './month-grip.class';
import { Map } from 'immutable';
import { Money } from '../money/money.class';
import { IMonthGripBrief } from '../abstract-grip/grip.types';

export class AccountGrip extends AbstractGrip {
    public readonly account: IAccount;

    constructor(account: IAccount, categoriesBlock: CategoriesBlock) {
        const categories = Map(categoriesBlock.list.map(item => [item.id, item]));
        super([account], categories);

        this.id = account.id;
        this.account = account;
        this.name = account.name;

        if (!account.head)
            return;

        this.lastMonthDate = account.head.month;
        this.firstMonthDate = account.months[account.months.length - 1].month;
        this.months = account.months.map(makeMonthGripBriefFromMonthBrief);
        this.balance = account.head.summary.balanceOnEnd;
        this.income = Money.empty; // FIXME
        this.expense = Money.empty; // FIXME
    }

    public makeMonth(month: IMonth): AccountMonthGrip {
        return new AccountMonthGrip(month.summary.balanceOnStart, month, this.account, this.categories);
    }
}

function makeMonthGripBriefFromMonthBrief(month: IMonthBrief): IMonthGripBrief {
    return {
        id: month.id,
        month: month.month,
        balanceOnStart: month.summary.balanceOnStart,
        balanceOnEnd: month.summary.balanceOnEnd,
        balance: month.summary.balance,
        income: month.summary.income,
        expense: month.summary.expense,
        categories: Map(),
        tags: Map(),
    };
}
