import { MonthDate } from '../common/date.types';
import { SyncStatus, UUID } from '../common/common.types';
import { ISubsetDTO, ISubsetMeta } from '../subset/subset.dto';

export interface IMonthMeta extends ISubsetMeta {
    month: MonthDate;
    prevMonths: UUID[];
    prevVersions: UUID[];
}

export interface IMonthDTO extends ISubsetDTO, IMonthMeta {
    syncStatus: SyncStatus;
}
