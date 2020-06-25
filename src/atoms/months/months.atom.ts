import { declareAtom } from '@reatom/core';
import { Map } from 'immutable';
import { IMonthsState } from './months.types';
import { loadMonthsSuccess, saveMonths } from './months.actions';

export const Months = declareAtom<IMonthsState>(
    ['months'],
    Map(),
    on => ({
        load: [
            on(loadMonthsSuccess, (months, items) => {
                return items.reduce((acc, item) => acc.set(item.id, item), months);
            }),
        ],
        save: [
            on(saveMonths, (state, months) => {
                return months.reduce(
                    (acc, month) => acc.set(month.id, month),
                    state,
                );
            }),
        ],
    }),
);
