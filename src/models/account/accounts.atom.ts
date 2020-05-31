import { declareAtom } from '@reatom/core';
import { Account } from './account.class';
import { Map } from 'immutable';
import { UUID } from '../common/common.types';

export interface IAccountsState {
    accounts: Map<UUID, Account[]>
}

export const Accounts = declareAtom<IAccountsState>(
    ['accounts'],
    {
        accounts: Map(),
    },
    on => [],
);
