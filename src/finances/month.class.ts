import { v1 as uuidGenerator } from 'uuid';
import { EmptyExtendSummary, EmptySummary, IExtendSummary, UUID } from './common.types';
import { IMonth } from './month.types';
import { Day, IDay } from './day.class';
import { getDaysInMonth } from 'date-fns';
import { parseMonthDate } from './date.utils';
import { DayDate, MonthDate } from './date.types';
import { addSummary } from './transactions.utils';
import { Money } from './money.class';

export class Month implements IMonth {
    public readonly id: UUID = '';
    public readonly wallet: UUID = '';
    public readonly month: MonthDate = '';
    public readonly summary: IExtendSummary = EmptyExtendSummary;
    public readonly days: Day[] = [];
    public readonly daysInMonth: number = 0;

    public static create(wallet: UUID, month: MonthDate, id?: UUID): Month {
        const daysInMonth = getDaysInMonth(parseMonthDate(month));

        return new Month({
            id: id || uuidGenerator(),
            wallet,
            month,
            daysInMonth,
        });
    }

    protected constructor(data: Partial<Month>) {
        Object.assign(this, data);
    }

    public createDay(day: number): Day {
        return Day.create(this.createDayDate(day));
    }

    public createDayDate(day: number): string {
        return this.month + '-' + day.toString().padStart(2, '0');
    }

    public isDateOfMonth(date: DayDate): boolean {
        return date.substr(0, 7) === this.month;
    }

    public recalculateWithNewStartBalance(startBalance: Money): Month {
        return new Month({
            ...this,
            summary: calculateSummaryFromStartBalance(startBalance, this.days),
        });
    }

    public updateDay(newDay: Day): Month {
        if (!newDay)
            throw new Error(`Cannot update month. Day is null`);

        if (!this.isDateOfMonth(newDay.date))
            throw new Error(`Day "${newDay.date}" not of month "${this.month}"`);

        const days = this.days.slice();
        const dayIndex = this.days.findIndex(item => item.date === newDay.date);
        if (dayIndex === -1) {
            days.push(newDay);
            days.sort((a, b) => {
                if (a.date > b.date) return 1;
                if (a.date < b.date) return -1;
                return 0;
            });
        } else {
            days.splice(dayIndex, 1, newDay);
        }

        const summary = calculateSummaryFromStartBalance(this.summary.balanceOnStart, days);

        return new Month({
            ...this,
            days,
            summary,
        });
    }


}

function calculateSummaryFromStartBalance(startBalance: Money, days: IDay[]): IExtendSummary {
    const baseSummary = days.reduce(
        (acc, day) => addSummary(acc, day.summary),
        EmptySummary,
    );

    return {
        ...baseSummary,
        balanceOnStart: startBalance,
        balanceOnEnd: startBalance.add(baseSummary.balance),
    };
}
