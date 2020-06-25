import { HASH, ISummary, UUID } from '../common/common.types';
import { IDay } from '../day/day.class';
import { MonthDate } from '../common/date.types';

export enum SyncStatus {
    NoSynced,
    Prepared,
    Syncing,
    FullySynced,
    Fixed,
}

export interface IMonthBrief {
    id: UUID;
    month: MonthDate;
    summary: ISummary;
    prevMonths: UUID[];
    prevVersions: UUID[];
    dataHash: string;
}

export interface IMonth extends IMonthBrief {
    syncStatus: SyncStatus;
    timestamp: number;
    account: UUID;
    days: IDay[];
}
