import { combine, createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { Client } from '../atoms/client/client.atom';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { Months } from '../atoms/months/months.atom';

export const store = createStore(combine({
    Client,
    Accounts,
    Months,
}));

connectReduxDevtools(store);

export function useStore() {
    return store;
}

store.subscribe((action, state) => {
    console.group('*** action', action.type);
    console.log(action.payload);
    console.log(state);
    console.groupEnd();
});
