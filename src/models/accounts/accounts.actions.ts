import { declareAction } from '@reatom/core';
import { UUID } from '../common/common.types';
import { Account } from '../account/account.class';

const NS = 'accounts';
export const chooseAccount = declareAction<UUID>(NS + ':chooseAccount');

export const loadAccounts = declareAction(NS + ':loadAccounts', (_, store) => {
    setTimeout(() => {
        store.dispatch(loadAccountsSuccess([
            Account.create('test', '123123123'),
            Account.create('test 2', '567567567567'),
        ]));
    }, 500);
});
export const loadAccountsSuccess = declareAction<Account[]>(NS + ':loadAccounts success');
export const loadAccountsFailed = declareAction(NS + ':loadAccounts failed');
