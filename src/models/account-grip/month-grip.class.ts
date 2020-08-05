import { Map, Set } from 'immutable';
import { AbstractMonthGrip } from '../abstract-grip/month-grip.class';
import { IMonth } from '../month/month.types';
import { IAccount } from '../account/account.types';
import { ICategory } from '../category/category.types';
import { UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { AccountDayGrip } from './day-grip.class';

export class AccountMonthGrip extends AbstractMonthGrip {
    constructor(balanceOnStart: Money,
                month: IMonth,
                account: IAccount,
                categories: Map<UUID, ICategory>) {
        const {days, balanceOnEnd} = month.days.reduce(
            ({days, balanceOnEnd}, day) => {
                const grip = new AccountDayGrip(
                    balanceOnEnd,
                    day,
                    account,
                    categories,
                );
                days.push(grip);
                return {
                    days,
                    balanceOnEnd: grip.balanceOnEnd,
                };
            }, {
                days: [],
                balanceOnEnd: balanceOnStart,
            });

        super(month.month, balanceOnStart, days);
        this.id = month.id;

        if (!this.balanceOnEnd.equal(balanceOnEnd))
            throw new Error(`Wrong balance on end: expected ${balanceOnEnd} but received ${this.balanceOnEnd}`);
    }
}
