import { declareAction } from '@reatom/core';
import { UUID } from '../common/common.types';
import { Account } from '../account/account.class';

const NS = 'accounts';
export const chooseAccount = declareAction<UUID>(NS + ':chooseAccount');

export const loadAccounts = declareAction(NS + ':loadAccounts');
export const loadAccountsSuccess = declareAction<Account[]>(NS + ':loadAccounts success');
export const loadAccountsFailed = declareAction(NS + ':loadAccounts failed');

export const saveAccount = declareAction<Account>(NS + ':saveAccounts');
export const saveAccountSuccess = declareAction<UUID>(NS + ':saveAccounts success');
export const saveAccountFailed = declareAction<{ id: UUID, error: any }>(NS + ':saveAccounts failed');


