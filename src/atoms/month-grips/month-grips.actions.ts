import { declareAction } from '@reatom/core';
import { AbstractMonthGrip } from '../../models/abstract-grip/month-grip.class';

const NS = 'grips/month';

export const updateMonthGrip = declareAction(NS + ':updateMonthGrip');
export const updateMonthGripSuccess = declareAction<AbstractMonthGrip>(NS + ':updateMonthGrip success');
export const updateMonthGripFailed = declareAction<any>(NS + ':updateMonthGrip failed');

export const updateMonthGrips = declareAction(NS + ':updateMonthGrips');
export const updateMonthGripsSuccess = declareAction<AbstractMonthGrip[]>(NS + ':updateMonthGrips success');
export const updateMonthGripsFailed = declareAction<any>(NS + ':updateMonthGrips failed');
