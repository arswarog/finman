import { declareAtom } from '@reatom/core';
import { Map } from 'immutable';
import { UUID } from '../../models/common/common.types';
import { AccountGrip } from '../../models/account-grip/grip.class';
import { chooseAccountGrip, updateAccountGripsSuccess, updateAccountGripSuccess } from './account-grips.actions';
import { chooseAccount } from '../accounts/accounts.actions';

export interface IAccountGripsState {
    currentID: UUID | null;
    current: AccountGrip | null;
    accounts: Map<UUID, AccountGrip>;
}

export const AccountGrips = declareAtom<IAccountGripsState>(
    ['grips/account'],
    {
        currentID: null,
        current: null,
        accounts: Map(),
    },
    on => ({
        choose: [
            on(chooseAccountGrip, (state, id) => {
                const current = state.accounts.get(id);
                if (current)
                    return {
                        ...state,
                        currentID: id,
                        current,
                    };
                else
                    return {
                        ...state,
                        currentID: id,
                    };
            }),
        ],
        update: [
            on(updateAccountGripSuccess, (state, grip) => {
                const accounts = state.accounts.set(grip.id, grip);

                let current = accounts.get(state.currentID);

                if (!current)
                    current = accounts.get(grip.id);

                return {
                    ...state,
                    accounts,
                    current,
                    currentID: current.id,
                };
            }),
            on(updateAccountGripsSuccess, (state, grips) => {
                const accounts = grips.reduce(
                    (acc, grip) => acc.set(grip.id, grip),
                    state.accounts,
                );

                let current = accounts.get(state.currentID);

                if (!current)
                    current = accounts.get(grips[0].id);

                return {
                    ...state,
                    accounts,
                    current,
                    currentID: current.id,
                };
            }),
        ],
    }),
);
