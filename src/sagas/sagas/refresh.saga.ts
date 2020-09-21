import { Action } from '@reatom/core';
import { put, take } from 'redux-saga/effects';
import { sagaLauncher } from '../saga-launcher';
import { ITransactionForm } from '../../models/transaction/transaction.types';
import { refresh } from '../../atoms/client/client.actions';
import { loadAccounts, loadAccountsFailed, loadAccountsSuccess } from '../../atoms/accounts/accounts.actions';
import { updateAccountGrips } from '../../atoms/account-grips/account-grips.actions';
import { AccountDTO } from '../../models/account-dto/account.class';

sagaLauncher.onAction(refresh, refreshSaga);

export function* refreshSaga(action: Action<null>) {
    console.log('*** refreshSaga started');

    yield put(loadAccounts());
    const resultAction = yield take([loadAccountsSuccess.getType(), loadAccountsFailed.getType()]);
    if (resultAction.type === loadAccountsFailed.getType())
        return;

    const accounts: AccountDTO[] = (resultAction as any).payload.accounts;
    yield put(updateAccountGrips(accounts));
}
