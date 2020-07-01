import { EmptySummary, ISummary } from '../common/common.types';
import { ITransaction } from '../transaction/transaction.types';
import { calculateSummary } from '../transaction/transactions.utils';
import { DayDate } from '../common/date.types';
import { parseDayDate } from '../common/date.utils';
import { Money } from '../money/money.class';
import { Transaction } from '../transaction/transaction.class';

export interface IDay {
    date: DayDate;
    summary: ISummary;
    transactions: ITransaction[];
}

export class Day implements IDay {
    public readonly date: DayDate = '';
    public readonly dateTime: Date = new Date();
    public readonly summary: ISummary = EmptySummary;
    public readonly transactions: Transaction[] = [];

    public static create(date: DayDate): Day {
        return new Day({date});
    }

    public static fromJSON(value: any): Day {
        return new Day({
            date: value.date,
            summary: {
                balance: Money.fromJSON(value.summary.balance),
                income: Money.fromJSON(value.summary.income),
                expense: Money.fromJSON(value.summary.expense),
            },
            transactions: value.transactions.map(Transaction.fromJSON),
        });
    }

    protected constructor(data: Partial<Day>) {
        Object.assign(this, data);
        this.dateTime = parseDayDate(this.date);
    }

    public toJSON(): any {
        return {
            date: this.date,
            summary: {
                balance: this.summary.balance.toJSON(),
                income: this.summary.income.toJSON(),
                expense: this.summary.expense.toJSON(),
            },
            transactions: this.transactions.map(tx => tx.toJSON()),
        };
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
