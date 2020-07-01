import { declareAction } from '@reatom/core';
import { loadAccounts } from '../accounts/accounts.actions';

const NS = 'client';

export const setOnlineStatus = declareAction<any>(NS + ':setOnlineStatus');
export const refresh = declareAction(NS + ':refresh', (_, {dispatch}) => {
    dispatch(loadAccounts());
});
