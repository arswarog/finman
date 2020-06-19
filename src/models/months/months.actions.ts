import { UUID } from '../common/common.types';
import { declareAction } from '@reatom/core';
import { Month } from '../month/month.class';

const NS = 'months';

export const loadMonths = declareAction<UUID[]>(NS + ':loadMonths');
export const loadMonthsSuccess = declareAction<Month[]>(NS + ':loadMonths success');
export const loadMonthsFailed = declareAction<{ ids: UUID[], error: any }>(NS + ':loadMonths failed');

export const saveMonths = declareAction<UUID[]>(NS + ':saveMonths');
export const saveMonthsSuccess = declareAction<UUID[]>(NS + ':saveMonths success');
export const saveMonthsFailed = declareAction<any>(NS + ':saveMonths failed');
