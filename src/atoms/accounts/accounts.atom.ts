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
            on(loadAccountsSuccess, (state, {current, accounts}) => {
                const list: Array<[string, Account]> = accounts.map(account => [account.id, account]);
                const map = Map(list);
                return {
                    ...state,
                    current: map.has(current) ? map.get(current) : accounts[0],
                    accounts: map,
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
