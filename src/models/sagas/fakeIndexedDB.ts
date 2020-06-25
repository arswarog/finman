import { Store } from '@reatom/core';
import { loadMonths, loadMonthsSuccess, saveMonths, saveMonthsSuccess } from '../months/months.actions';
import { Months } from '../months/months.atom';
import { UUID } from '../common/common.types';
import { Month } from '../month/month.class';
import { loadAccounts, loadAccountsSuccess, saveAccount, saveAccountSuccess } from '../accounts/accounts.actions';
import { Account } from '../account/account.class';

export function initFakeIndexedDB(store: Store) {
    store.subscribe(action => {
        switch (action.type) {
            case loadAccounts.getType(): {
                setTimeout(() => {
                    store.dispatch(loadAccountsSuccess([
                        Account.create('test', '123123123'),
                        Account.create('test 2', '567567567567'),
                    ]));
                }, 500);
                break;
            }
            case saveAccount.getType(): {
                const account = action.payload as Account;
                store.dispatch(saveAccountSuccess(account.id));
                break;
            }
            case loadMonths.getType(): {
                const ids = action.payload as UUID[];
                const months = store.getState(Months);
                store.dispatch(loadMonthsSuccess(ids.map(id => months.get(id))));
                break;
            }
            case saveMonths.getType(): {
                const months = action.payload as Month[];
                store.dispatch(saveMonthsSuccess(months.map(item => item.id)));
                break;
            }
        }
    });
}
