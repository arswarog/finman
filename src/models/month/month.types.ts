import { HASH, ISummary, UUID } from '../common/common.types';
import { IDay } from '../day/day.class';
import { MonthDate } from '../common/date.types';

export enum SyncStatus {
    NoSynced,
    Prepared,
    Syncing,
    FullySynced,
}

export interface IMonthBrief {
    id: UUID;
    month: MonthDate;
    syncStatus: SyncStatus;
    summary: ISummary;
    prevMonths: UUID[];
    prevVersions: UUID[];
    dataHash: string;
}

export interface IMonth extends IMonthBrief {
    timestamp: number;
    account: UUID;
    days: IDay[];
}
