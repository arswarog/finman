import { ISummary, UUID } from './common.types';
import { IDay } from './day.class';
import { MonthDate } from './date.types';

export interface IMonthBrief {
    id: UUID;
    month: MonthDate;
    summary: ISummary;
}

export interface IMonth extends IMonthBrief {
    wallet: UUID;
    days: IDay[];
}
