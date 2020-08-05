import { declareAction } from '@reatom/core';
import { loadAccounts, loadAccountsSuccess } from '../accounts/accounts.actions';
import { updateAccountGrips, updateAccountGripsSuccess } from '../account-grips/account-grips.actions';

const NS = 'client';

export const setOnlineStatus = declareAction<any>(NS + ':setOnlineStatus');
export const refresh = declareAction(NS + ':refresh');
