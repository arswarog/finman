import { extendSummaryPacker, IExtendSummary, SyncStatus, UUID } from '../common/common.types';
import { IDay } from '../day/day.class';
import { MonthDate } from '../common/date.types';
import { Packer } from '../../libs/packable/packable';

export interface IMonthBrief {
    id: UUID;
    month: MonthDate;
    summary: IExtendSummary;
    prevMonths: UUID[];
    prevVersions: UUID[];
    dataHash: string;
}

export const monthBriefPacker = Packer.maybe(Packer.forObject<IMonthBrief>({
    id: String,
    month: String,
    summary: extendSummaryPacker,
    prevMonths: [String],
    prevVersions: [String],
    dataHash: String,
}));

export interface IMonth extends IMonthBrief {
    syncStatus: SyncStatus;
    timestamp: number;
    account: UUID;
    days: IDay[];
}
