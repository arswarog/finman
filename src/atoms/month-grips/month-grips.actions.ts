import { UUID } from '../../models/common/common.types';
import { declareAction } from '@reatom/core';
import { Month } from '../../models/month/month.class';
import { AccountGrip } from '../../models/account-grip/grip.class';
import { AbstractMonthGrip } from '../../models/abstract-grip/month-grip.class';

const NS = 'grips/month';

export const updateMonthGrip = declareAction(NS + ':updateMonthGrip');
export const updateMonthGripSuccess = declareAction<AbstractMonthGrip>(NS + ':updateMonthGrip success');
export const updateMonthGripFailed = declareAction<any>(NS + ':updateMonthGrip failed');

export const updateMonthsGrip = declareAction(NS + ':updateMonthsGrip');
export const updateMonthsGripSuccess = declareAction<AbstractMonthGrip[]>(NS + ':updateMonthsGrip success');
export const updateMonthsGripFailed = declareAction<any>(NS + ':updateMonthsGrip failed');
