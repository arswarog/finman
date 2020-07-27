import { Map } from 'immutable';
import { IMonthGrip } from './grip.types';
import { UUID } from '../common/common.types';
import { ICategory } from '../category/category.types';
import { Money } from '../money/money.class';
import { MonthDate } from '../common/date.types';
import { ITag, TagName } from '../tag/tag.types';
import { AbstractDayGrip } from './day-grip.class';

export abstract class AbstractMonthGrip implements IMonthGrip {
    readonly balance: Money;
    readonly balanceOnEnd: Money;
    readonly balanceOnStart: Money;
    readonly categories: Map<UUID, ICategory>;
    readonly days: AbstractDayGrip[];
    readonly expense: Money;
    readonly income: Money;
    readonly month: MonthDate;
    readonly tags: Map<TagName, ITag>;

    [Symbol.toStringTag] = 'AbstractMonthGrip';

    constructor(month: MonthDate,
                balanceOnStart: Money,
                days: AbstractDayGrip[],
    ) {
        this.month = month;
        if (days.length)
            days.reduce(
                (last, next) => {
                    if (last.date >= next.date)
                        throw new Error(`Days must be sorted`);
                    return next;
                },
            );
        this.days = days;

        // categories and tags
        let categories: Map<UUID, ICategory> = Map();
        let tags = Map();

        this.days.forEach(day => day.categories.forEach(
            category => categories = categories.set(category.id, category),
        ));

        this.categories = categories;

        // balance
        this.balanceOnStart = balanceOnStart;
        this.balanceOnEnd = this.days.reduce(
            (lastSum, day) => {
                const sum = lastSum.add(day.balance);
                if (!day.balanceOnStart.equal(lastSum))
                    throw new Error(`Start balance on day ${day.date} must be ${lastSum} but received ${day.balanceOnStart}`);
                if (!day.balanceOnEnd.equal(sum))
                    throw new Error(`End balance on day ${day.date} must be ${sum} but received ${day.balanceOnEnd}`);
                if (!day.balance.equal(day.balanceOnEnd.sub(day.balanceOnStart)))
                    throw new Error(`Balance on day ${day.date} must be ${day.balanceOnEnd.sub(day.balanceOnStart)} but received ${day.balance}`);
                return sum;
            },
            this.balanceOnStart,
        );
        this.balance = this.balanceOnEnd.sub(this.balanceOnStart);

        this.income = this.days
                          .reduce(
                              (sum, tx) => sum.add(tx.income),
                              Money.empty,
                          );
        this.expense = this.days
                           .reduce(
                               (sum, tx) => sum.add(tx.expense),
                               Money.empty,
                           );
    }
}
