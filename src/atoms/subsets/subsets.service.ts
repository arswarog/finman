import { declareAction } from '@reatom/core';
import { ISubset } from '../../models/subset/subset.types';
import { loadAccounts } from '../accounts/accounts.actions';

const NS = 'subsets/service';
export const refreshAllSuccess = declareAction<ISubset[]>(NS + ':refreshAll success');
export const refreshAllFailed = declareAction(NS + ':refreshAll failed');
export const refreshAll = declareAction(NS + ':refreshAll', (_, store) => {
    store.dispatch(loadAccounts());
});
