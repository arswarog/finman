import { declareAtom } from '@reatom/core';
import { Map } from 'immutable';
import { IMonthGripsState } from './month-grips.types';
import {
    updateMonthGripSuccess,
    updateMonthsGripSuccess,
} from './month-grips.actions';

export const Months = declareAtom<IMonthGripsState>(
    ['grips/month'],
    Map(),
    on => ({
        update: [
            on(updateMonthGripSuccess, (state, month) => {
                return state.set(month.id, month);
            }),
            on(updateMonthsGripSuccess, (state, months) => {
                return months.reduce(
                    (acc, month) => acc.set(month.id, month),
                    state,
                );
            }),
        ],
    }),
);
