import { Store } from '@reatom/core';
import { loadMonths, loadMonthsSuccess, saveMonths, saveMonthsSuccess } from '../atoms/months/months.actions';
import { Months } from '../atoms/months/months.atom';
import { UUID } from '../models/common/common.types';
import { MonthLegacy } from '../models/month/month-legacy.class';
import { loadAccounts, loadAccountsSuccess, saveAccount, saveAccountSuccess } from '../atoms/accounts/accounts.actions';
import { AccountDTO } from '../models/account-dto/account.class';

export function initFakeIndexedDB(store: Store) {
    store.subscribe(action => {
        switch (action.type) {
            case loadAccounts.getType(): {
                setTimeout(() => {
                    store.dispatch(loadAccountsSuccess({
                        accounts: [
                            AccountDTO.create('test', '123123123'),
                            AccountDTO.create('test 2', '567567567567'),
                        ],
                    }));
                }, 500);
                break;
            }
            case saveAccount.getType(): {
                const account = action.payload as AccountDTO;
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
                const months = action.payload as MonthLegacy[];
                store.dispatch(saveMonthsSuccess(months.map(item => item.id)));
                break;
            }
        }
    });
}
