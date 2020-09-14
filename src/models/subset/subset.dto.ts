import { UUID } from '../common/common.types';
import { DayDate } from '../common/date.types';
import { IDayDTO } from '../day/day.dto';

export interface ISubsetMeta {
    id: UUID;
    startDate: DayDate;
    endDate: DayDate;
}

export interface ISubsetDTO extends ISubsetMeta {
    depositIds: UUID[];
    dataHash: string;
    days: IDayDTO[]
}
