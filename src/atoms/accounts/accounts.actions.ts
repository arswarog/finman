import { declareAction } from '@reatom/core';
import { UUID } from '../../models/common/common.types';
import { AccountDTO } from '../../models/account-dto/account.class';

const NS = 'accounts';
/**
 * @deprecated
 */
export const chooseAccount = declareAction<UUID>(NS + ':chooseAccount');

export const loadAccounts = declareAction(NS + ':loadAccounts');
export const loadAccountsSuccess = declareAction<{
    current?: UUID;
    accounts: AccountDTO[];
}>(NS + ':loadAccounts success');
export const loadAccountsFailed = declareAction<any>(NS + ':loadAccounts failed');

export const saveAccount = declareAction<AccountDTO>(NS + ':saveAccounts');
export const saveAccountSuccess = declareAction<UUID>(NS + ':saveAccounts success');
export const saveAccountFailed = declareAction<{ id: UUID, error: any }>(NS + ':saveAccounts failed');


