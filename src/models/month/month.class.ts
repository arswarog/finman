import sha1 from 'crypto-js/sha1';
import { EmptyExtendSummary, EmptySummary, IExtendSummary, UUID } from '../common/common.types';
import { IMonth, SyncStatus } from './month.types';
import { Day, IDay } from '../day/day.class';
import { getDaysInMonth } from 'date-fns';
import { parseMonthDate } from '../common/date.utils';
import { DayDate, MonthDate } from '../common/date.types';
import { addSummary } from '../transaction/transactions.utils';
import { Money } from '../money/money.class';

export class Month implements IMonth {
    public readonly id: UUID = '';
    public readonly version: number = 1;
    public readonly account: UUID = '';
    public readonly month: MonthDate = '';
    public readonly syncStatus: SyncStatus = SyncStatus.NoSynced;
    public readonly prevMonths: UUID[] = [];
    public readonly prevVersions: UUID[] = [];
    public readonly dataHash: string = '';
    public readonly timestamp: number = 0;
    public readonly updatedAt: Date = new Date(0);
    public readonly summary: IExtendSummary = EmptyExtendSummary;
    public readonly days: Day[] = [];
    public readonly daysInMonth: number = 0;

    /**
     * @param account
     * @param month
     * @param timestamp
     */
    public static createFirstBlock(account: UUID, month: MonthDate, timestamp: number): Month {
        const daysInMonth = getDaysInMonth(parseMonthDate(month));

        return new Month({
            timestamp,
            account,
            month,
            daysInMonth,
            days: [],
        });
    }

    public static generateID(month: Month, dataHash?: string): string {
        if (month.version !== 1)
            throw new Error(`Version ${month.version} not supported`);

        const data = {
            version: month.version,
            account: month.account,
            prevMonths: month.prevMonths,
            prevVersions: month.prevVersions,
            dataHash: dataHash || month.getDataHash(),
        };

        const hash = sha1(JSON.stringify(data)).toString();

        const date = parseMonthDate(month.month);
        const year = date.getFullYear() - 1970;
        const monthID = (year * 12 + date.getMonth()).toString(16).padStart(3, '0');

        const ts = (month.timestamp / 1000).toString(16)
                                           .substr(0, 11)
                                           .replace('.', '');

        let id = `${monthID}${ts}${hash}`.substr(0, 32);

        id = [
            id.substr(0, 8),
            id.substr(8, 4),
            id.substr(12, 4),
            id.substr(16, 4),
            id.substr(20, 12),
        ].join('-');

        return id;
    }

    /**
     * Создание мердж блока
     *
     * @param blocks Предыдущие блоки цепочки
     * @param revisions Предыдущие версии блока
     */
    public static merge(blocks: Month[], revisions: Month[]): Month {
        // отсортировать по алфавиту
        // проверить sync статус

        throw new Error();
    }

    protected constructor(value: Partial<Month>) {
        Object.assign(this, value);
        this.dataHash = this.getDataHash();
        this.id = Month.generateID(this, this.dataHash);
    }

    public getDataHash(): string {
        const data = {
            days: this.days!.map(day => day.toJSON()),
        };
        return sha1(JSON.stringify(data)).toString();
    }

    public changeSyncStatus(syncStatus: SyncStatus): Month {
        if (syncStatus === this.syncStatus)
            return this;

        switch (this.syncStatus) {
            case SyncStatus.NoSynced:
                if (syncStatus === SyncStatus.Prepared)
                    return new Month({...this, syncStatus});
                break;
            case SyncStatus.Prepared:
                if (syncStatus === SyncStatus.Syncing)
                    return new Month({...this, syncStatus});
                break;
            case SyncStatus.Syncing:
                if (syncStatus === SyncStatus.FullySynced)
                    return new Month({...this, syncStatus});
                break;
            case SyncStatus.FullySynced:
        }

        throw new Error(`Can not change sync status from "${SyncStatus[this.syncStatus]}" to "${SyncStatus[syncStatus]}"`);
    }

    public createDay(day: number): Day {
        return Day.create(this.createDayDate(day));
    }

    public createDayDate(day: number): string {
        return this.month + '-' + day.toString().padStart(2, '0');
    }

    public createNextBlock(month: MonthDate, timestamp: number): Month {
        const daysInMonth = getDaysInMonth(parseMonthDate(month));

        const summary: IExtendSummary = {
            balanceOnStart: this.summary.balanceOnEnd,
            income: Money.empty,
            expense: Money.empty,
            balanceOnEnd: this.summary.balanceOnEnd,
            balance: Money.empty,
        };

        return new Month({
            account: this.account,
            month,
            prevMonths: [this.id],
            prevVersions: [],
            timestamp,
            // updatedAt: timestamp, // TODO
            summary,
            days: [],
            daysInMonth,
        });
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
        if (!(newDay instanceof Day))
            throw new Error(`Cannot update month, newDay must be instance of Day`);

        if (!this.isDateOfMonth(newDay.date))
            throw new Error(`Day "${newDay.date}" not of month "${this.month}"`);

        const days = this.days.slice();
        const dayIndex = this.days.findIndex(item => item.date === newDay.date);
        if (dayIndex === -1) {
            days.push(newDay);
            days.sort((a, b) => a.date > b.date ? 1 : -1);
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
