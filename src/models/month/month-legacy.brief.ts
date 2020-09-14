import { Money } from '../money/money.class';
import { Day } from '../day/day.class';
import { IMonthBrief } from './month-legacy.types';

export class MonthBrief {
    public static fromJSON(value: any): IMonthBrief {
        return {
            id: value.id,
            month: value.month,
            prevMonths: value.prevMonths,
            prevVersions: value.prevVersions,
            dataHash: value.dataHash,
            summary: {
                balance: Money.fromJSON(value.summary.balance),
                income: Money.fromJSON(value.summary.income),
                expense: Money.fromJSON(value.summary.expense),
                balanceOnStart: Money.fromJSON(value.summary.balanceOnStart),
                balanceOnEnd: Money.fromJSON(value.summary.balanceOnEnd),
            },
        };
    }

    public static toJSON(value: IMonthBrief): any {
        return {
            id: value.id,
            month: value.month,
            prevMonths: value.prevMonths,
            prevVersions: value.prevVersions,
            dataHash: value.dataHash,
            summary: {
                balance: value.summary.balance.toJSON(),
                income: value.summary.income.toJSON(),
                expense: value.summary.expense.toJSON(),
                balanceOnStart: value.summary.balanceOnStart.toJSON(),
                balanceOnEnd: value.summary.balanceOnEnd.toJSON(),
            },
        };
    }
}
