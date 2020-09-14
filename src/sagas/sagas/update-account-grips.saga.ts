import { Action } from '@reatom/core';
import { put, take, fork } from 'redux-saga/effects';
import { sagaLauncher } from '../saga-launcher';
import { IAddTransactionForm } from '../../models/transaction/transaction.types';
import { refresh } from '../../atoms/client/client.actions';
import { loadAccounts, loadAccountsSuccess } from '../../atoms/accounts/accounts.actions';
import {
    updateAccountGrip,
    updateAccountGrips,
    updateAccountGripSuccess,
} from '../../atoms/account-grips/account-grips.actions';
import { AccountDTO } from '../../models/account-dto/account.class';
import { loadCategories, loadCategoriesSuccess } from '../../atoms/categories/categories.actions';
import { CategoriesBlockUtils } from '../utils/categoriesBlock.saga';
import { AccountGrip } from '../../models/account-grip/grip.class';

sagaLauncher.onAction(updateAccountGrips, updateAccountGripsSaga);
sagaLauncher.onAction(updateAccountGrip, updateAccountGripSaga);

export function* updateAccountGripsSaga(action: Action<AccountDTO[]>) {
    console.log('*** updateAccountGripsSaga started');
    const accounts = action.payload;

    for (let account of accounts)
        yield fork(updateAccountGripSaga, updateAccountGrip(account));
}

export function* updateAccountGripSaga(action: Action<AccountDTO>) {
    const account = action.payload;

    console.log(`*** updateAccountGripSaga started for account ${account.name}`);

    const block = yield* CategoriesBlockUtils.get(account.categoriesBlockId);

    console.log('loadCategories', block);

    const grip = new AccountGrip(account, block);

    yield put(updateAccountGripSuccess(grip));
}
