import { combine, createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { Client } from '../models/client/client.atom';
import { Accounts } from '../models/accounts/accounts.atom';
import { Months } from '../models/months/months.atom';

export const store = createStore(combine({
    Client,
    Accounts,
    Months,
}));

connectReduxDevtools(store);
