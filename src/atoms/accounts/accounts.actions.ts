import { declareAction } from '@reatom/core';
import { UUID } from '../../models/common/common.types';
import { Account } from '../../models/account/account.class';

const NS = 'accounts';
export const chooseAccount = declareAction<UUID>(NS + ':chooseAccount');

export const loadAccounts = declareAction(NS + ':loadAccounts');
export const loadAccountsSuccess = declareAction<{
    current?: UUID;
    accounts: Account[];
}>(NS + ':loadAccounts success');
export const loadAccountsFailed = declareAction<any>(NS + ':loadAccounts failed');

export const saveAccount = declareAction<Account>(NS + ':saveAccounts');
export const saveAccountSuccess = declareAction<UUID>(NS + ':saveAccounts success');
export const saveAccountFailed = declareAction<{ id: UUID, error: any }>(NS + ':saveAccounts failed');


