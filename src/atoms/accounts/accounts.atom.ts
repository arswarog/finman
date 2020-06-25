import { declareAtom } from '@reatom/core';
import { Account } from '../../models/account/account.class';
import { Map } from 'immutable';
import { UUID } from '../../models/common/common.types';
import { chooseAccount, loadAccountsSuccess, saveAccount } from './accounts.actions';

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
    on => ({
        choose: [
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
        ],
        load: [
            on(loadAccountsSuccess, (state, accounts) => {
                const map: Array<[string, Account]> = accounts.map(account => [account.id, account]);
                return {
                    current: accounts[0] || null,
                    accounts: Map(map),
                };
            }),
        ],
        save: [
            on(saveAccount, (state, account) => {
                return {
                    accounts: state.accounts.set(account.id, account),
                    current: account.id === state.current?.id
                        ? account
                        : state.current,
                };
            }),
        ],
    }),
);
