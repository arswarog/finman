import { declareAction } from '@reatom/core';
import { UUID } from '../../models/common/common.types';
import { Account } from '../../models/account/account.class';
import { AccountGrip } from '../../models/account-grip/grip.class';

const NS = 'grips/account';
export const chooseAccountGrip = declareAction<UUID>(NS + ':chooseAccountGrip');

export const updateAccountGrip = declareAction<Account>(NS + ':updateAccountGrip');
export const updateAccountGripSuccess = declareAction<AccountGrip>(NS + ':updateAccountGrip success');
export const updateAccountGripFailed = declareAction<any>(NS + ':updateAccountGrip failed');

export const updateAccountGrips = declareAction<Account[]>(NS + ':updateAccountGrips');
export const updateAccountGripsSuccess = declareAction<AccountGrip[]>(NS + ':updateAccountGrips success');
export const updateAccountGripsFailed = declareAction<any>(NS + ':updateAccountGrips failed');
