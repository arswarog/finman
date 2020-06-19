import { declareAtom } from '@reatom/core';
import { Account } from '../account/account.class';
import { Map } from 'immutable';
import { UUID } from '../common/common.types';
import { chooseAccount, loadAccountsSuccess } from './accounts.actions';

export interface IAccountsState {
    current: Account | null;
    accounts: Map<UUID, Account>;
}

export const Accounts = declareAtom<IAccountsState>(
    ['accounts'],
    {
        current: null,
        accounts: Map(),
    },
    on => [
        on(chooseAccount, (state, id) => {
            const current = state.accounts.get(id);
            if (current)
                return {
                    ...state,
                    current,
                };
            else
                return state;
        }),
        on(loadAccountsSuccess, (state, accounts) => {
            const map: Array<[string, Account]> = accounts.map(account => [account.id, account]);
            return {
                current: accounts[0] || null,
                accounts: Map(map),
            };
        }),
    ],
);
