import { declareAtom } from '@reatom/core';
import { ISubsetsState } from './subsets.types';
import { Subset } from '../subset/subset.class';
import { Money } from '../money/money.class';
import { refreshAllSuccess } from './subsets.service';
import { chooseSubset } from './subsets.actions';

export const Subsets = declareAtom<ISubsetsState>(
    ['subsets'],
    {
        all: [],
        current: Subset.fromJSON({
            id: '123123123',
            balance: Money.create(123, 'RUB'),
            name: 'Main subset',
            months: [],
        }),
    },
    on => ({
        subsets: [
            on(refreshAllSuccess, (state, payload) => {
                console.log(payload);
                const all = payload.map(data => Subset.fromJSON(data));
                console.log(all);
                return {
                    ...state,
                    all,
                    current: all[1],
                };
            }),
            on(chooseSubset, (state, id) => {
                const current = Object.assign(state.current, {loaded: true});

                if (current)
                    return {
                        ...state,
                        current,
                    };
                else
                    return state;
            }),
        ],
    }),
);
