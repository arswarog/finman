import { Map } from 'immutable';
import { UUID } from '../../models/common/common.types';
import { AbstractMonthGrip } from '../../models/abstract-grip/month-grip.class';

export type MonthGripsMap = Map<UUID, AbstractMonthGrip>;
export type IMonthGripsState = MonthGripsMap;
