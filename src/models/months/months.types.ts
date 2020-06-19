import { Map } from 'immutable';
import { Month } from '../month/month.class';
import { UUID } from '../common/common.types';

export type IMonthsState = Map<UUID, Month>
