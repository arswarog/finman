import { EmptySummary, ISummary, summaryPacker } from '../common/common.types';
import { ITransaction } from '../transaction/transaction.types';
import { calculateSummary } from '../transaction/transactions.utils';
import { DayDate } from '../common/date.types';
import { parseDayDate } from '../common/date.utils';
import { Transaction } from '../transaction/transaction.class';
import { Packable, PackableClass } from '../../libs/packable/decorator';
import { Packer } from '../../libs/packable/packable';

export interface IDay {
    date: DayDate;
    summary: ISummary;
    transactions: ITransaction[];
}

@PackableClass(data => new Day(data))
export class Day implements IDay {
    @Packable(String) public readonly date: DayDate = '';
    @Packable(summaryPacker) public readonly summary: ISummary = EmptySummary;
    @Packable([Transaction]) public readonly transactions: Transaction[] = [];
    public readonly dateTime: Date = new Date();

    public static create(date: DayDate): Day {
        return new Day({date});
    }

    public static fromJSON(value: any): Day {
        return Packer.get(Day).decode(value);
    }

    protected constructor(data: Partial<Day>) {
        Object.assign(this, data);
        this.dateTime = parseDayDate(this.date);
    }

    public toJSON(): any {
        return Packer.get(Day).encode(this);
    }

    // FIXME remove interface or make transaction by data
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
