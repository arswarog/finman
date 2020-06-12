import { combine, createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { Client } from '../models/client/client.atom';
import { Accounts } from '../models/accounts/accounts.atom';

export const store = createStore(combine({
    Client,
    Accounts,
}));

connectReduxDevtools(store);
