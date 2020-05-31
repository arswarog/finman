import { EmptySummary, ISummary } from '../common/common.types';
import { ITransaction } from '../transaction/transaction.types';
import { calculateSummary } from '../transaction/transactions.utils';
import { DayDate } from '../common/date.types';
import { parseDayDate } from '../common/date.utils';

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

    public toJSON(): IDay {
        return {
            date: this.date,
            summary: this.summary,
            transactions: this.transactions,
        };
    }
}
