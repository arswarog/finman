import { UUID } from '../../models/common/common.types';
import { declareAction } from '@reatom/core';
import { MonthLegacy } from '../../models/month/month-legacy.class';

const NS = 'months';

export const loadMonths = declareAction<UUID[]>(NS + ':loadMonths');
export const loadMonthsSuccess = declareAction<MonthLegacy[]>(NS + ':loadMonths success');
export const loadMonthsFailed = declareAction<{ ids: UUID[], error: any }>(NS + ':loadMonths failed');

export const saveMonths = declareAction<MonthLegacy[]>(NS + ':saveMonths');
export const saveMonthsSuccess = declareAction<UUID[]>(NS + ':saveMonths success');
export const saveMonthsFailed = declareAction<{ ids: UUID[], error: any }>(NS + ':saveMonths failed');
