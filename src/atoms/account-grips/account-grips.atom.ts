import { declareAtom } from '@reatom/core';
import { Map } from 'immutable';
import { UUID } from '../../models/common/common.types';
import { AccountGrip } from '../../models/account-grip/grip.class';
import { chooseAccountGrip, updateAccountGripSuccess } from './account-grips.actions';

export interface IAccountGripsState {
    current: AccountGrip | null;
    accounts: Map<UUID, AccountGrip>;
}

export const AccountGrips = declareAtom<IAccountGripsState>(
    ['grips/account'],
    {
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
                        current,
                    };
                else
                    return state;
            }),
        ],
        update: [
            on(updateAccountGripSuccess, (state, grip) => {
                return {
                    ...state,
                    accounts: state.accounts.set(grip.id, grip),
                };
            }),
        ],
    }),
);
