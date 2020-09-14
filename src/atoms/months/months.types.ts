import { Map } from 'immutable';
import { MonthLegacy } from '../../models/month/month-legacy.class';
import { UUID } from '../../models/common/common.types';

export type MonthsMap = Map<UUID, MonthLegacy>;
export type IMonthsState = MonthsMap;
