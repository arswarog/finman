import { combine, createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { Client } from '../atoms/client/client.atom';
import { Accounts } from '../atoms/accounts/accounts.atom';
import { Months } from '../atoms/months/months.atom';
import { Categories } from '../atoms/categories/categories.atom';
import { AccountGrips } from '../atoms/account-grips/account-grips.atom';
import { MonthGrips } from '../atoms/month-grips/month-grips.atom';

export const store = createStore(combine({
    Client,
    Accounts,
    Categories,
    Months,
    AccountGrips,
    MonthGrips,
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
