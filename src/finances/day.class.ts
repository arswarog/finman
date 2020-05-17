import { EmptySummary, ISummary } from './common.types';
import { ITransaction } from './transaction.types';
import { calculateSummary } from './transactions.utils';
import { DayDate } from './date.types';
import { parseDayDate } from './date.utils';

export interface IDay {
    date: DayDate;
    summary: ISummary;
    transactions: ITransaction[];
}

export class Day implements IDay {
    public readonly date: DayDate = '';
    public readonly dateTime: Date = new Date();
    public readonly summary: ISummary = EmptySummary;
    public readonly transactions: ITransaction[] = [];

    public static create(date: DayDate): Day {
        return new Day({date, dateTime: parseDayDate(date)});
    }

    protected constructor(data: Partial<Day>) {
        Object.assign(this, data);
    }

    public addTransaction(tx: ITransaction): Day {
        const transactions: ITransaction[] = [
            ...this.transactions,
            tx,
        ];

        const summary: ISummary = calculateSummary(transactions);

        return new Day({
            ...this,
            summary,
            transactions,
        });
    }
}
