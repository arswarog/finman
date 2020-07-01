import { Map } from 'immutable';
import { Month } from '../../models/month/month.class';
import { UUID } from '../../models/common/common.types';

export type MonthsMap = Map<UUID, Month>;
export type IMonthsState = MonthsMap;
