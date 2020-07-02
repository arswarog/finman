import { DBStatus, IndexedDB } from '../indexed-db';
import { useEffect } from 'react';
import { SubsetScheme } from '../models/subset/subset.scheme';
import { Store } from '@reatom/core';
import {
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

export function initIndexedDB(store: Store) {
    store.subscribe(action => {
        console.log(action);
        switch (action.type) {
            case loadAccounts.getType(): {
                db.transaction(AccountScheme)
                  .getAll().then(
                    result => store.dispatch(loadAccountsSuccess(result.map(Account.fromJSON))),
                    error => store.dispatch(loadAccountsFailed(error)),
                );
                break;
            }
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
