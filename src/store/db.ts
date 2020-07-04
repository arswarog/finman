import { DBStatus, IndexedDB } from '../indexed-db';
import { useEffect } from 'react';
import { SubsetScheme } from '../models/subset/subset.scheme';
import { Action, Store, PayloadActionCreator } from '@reatom/core';
import {
    chooseAccount,
    loadAccounts,
    loadAccountsFailed,
    loadAccountsSuccess,
    saveAccount, saveAccountFailed,
    saveAccountSuccess,
} from '../atoms/accounts/accounts.actions';
import { Account } from '../models/account/account.class';
import {
    loadMonths,
    loadMonthsFailed,
    loadMonthsSuccess,
    saveMonths, saveMonthsFailed,
    saveMonthsSuccess,
} from '../atoms/months/months.actions';
import { UUID } from '../models/common/common.types';
import { Month } from '../models/month/month.class';
import { AccountScheme } from '../models/account/account.scheme';
import { MonthScheme } from '../models/month/month.scheme';
import { Accounts } from '../atoms/accounts/accounts.atom';

const CURRENT_ACCOUNT_KEY = 'currentAccount';

export const db = new IndexedDB('test', [
    SubsetScheme,
    AccountScheme,
    MonthScheme,
]);

export function useDBReady(onReady: () => void) {
    console.log('useDBReady');

    const onChangeStatusEvent = (status: DBStatus) => {
        console.log(DBStatus[status]);
        if (status === DBStatus.Ready)
            onReady();
    };

    useEffect(() => {
        db.addStatusListener(onChangeStatusEvent);
        return () => db.removeStatusListener(onChangeStatusEvent);
    });
}

const handlers: { [action: string]: Function } = {};

function addActionHandler<T>(action: PayloadActionCreator<T>, handler: (payload: T, store: Store) => void) {
    if (handlers[action.getType()])
        throw new Error(`Can not add new handler for action "${action.getType()}"`);

    handlers[action.getType()] = handler;
}

addActionHandler(chooseAccount, payload => {
    localStorage.setItem(CURRENT_ACCOUNT_KEY, payload);
});

addActionHandler(loadAccounts, (_, store) => {
    db.transaction(AccountScheme)
      .getAll().then(
        result => {
            if (!result.length)
                return console.warn('No accounts exists');

            store.dispatch(loadAccountsSuccess(result.map(Account.fromJSON)));

            const accounts = store.getState(Accounts);
            let currentAccount = localStorage.getItem(CURRENT_ACCOUNT_KEY);
            if (!accounts.accounts.has(currentAccount))
                currentAccount = result[0].id;
            store.dispatch(chooseAccount(currentAccount));
        },
        error => store.dispatch(loadAccountsFailed(error)),
    );
});

export function initIndexedDB(store: Store) {
    store.subscribe(action => {
        console.log(action);

        if (handlers[action.type])
            handlers[action.type](action.payload, store);

        switch (action.type) {
            case saveAccount.getType(): {
                const account = action.payload as Account;
                db.transaction(AccountScheme)
                  .update(account.toJSON() as any).then(
                    result => store.dispatch(saveAccountSuccess(account.id)),
                    error => store.dispatch(saveAccountFailed({id: account.id, error})),
                );
                break;
            }
            case loadMonths.getType(): {
                const ids = action.payload as UUID[];

                db.transaction(MonthScheme)
                  .getAll(ids).then(
                    result => {
                        console.log(ids);
                        console.log(result);
                        const months = result.map(Month.fromJSON);
                        store.dispatch(loadMonthsSuccess(months));
                    },
                    error => store.dispatch(loadMonthsFailed({ids, error})),
                );
                break;
            }
            case saveMonths.getType(): {
                const months = (action.payload as Month[]).map(month => month.toJSON());
                const ids = months.map(item => item.id);
                const tx = db.transaction(MonthScheme);
                Promise.all(months.map(month => tx.update(month)))
                       .then(
                           () => store.dispatch(saveMonthsSuccess(ids)),
                           error => store.dispatch(saveMonthsFailed({ids, error})),
                       );
                break;
            }
        }
    });
}
