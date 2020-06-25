import { combine, createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { Client } from '../atoms/client/client.atom';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { Months } from '../atoms/months/months.atom';
import { initFakeIndexedDB } from '../sagas/fakeIndexedDB';

export const store = createStore(combine({
    Client,
    Accounts,
    Months,
}));

connectReduxDevtools(store);

initFakeIndexedDB(store);
