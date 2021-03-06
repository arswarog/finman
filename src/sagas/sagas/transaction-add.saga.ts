import { addTransaction, addTransactionSuccess } from '../../models/transaction/transaction.actions';
import { sagaLauncher } from '../saga-launcher';
import { ITransactionForm } from '../../models/transaction/transaction.types';
import { dayDateToMonth } from '../../models/common/date.utils';
import { Action } from '@reatom/core';
import { AccountUtils } from '../utils/account.saga';
import { MonthUtils } from '../utils/month.saga';
import { Transaction } from '../../models/transaction/transaction.class';
import { put } from 'redux-saga/effects';
import { updateAccountGrip } from '../../atoms/account-grips/account-grips.actions';

sagaLauncher.onAction(addTransaction, addTransactionSaga);

export function* addTransactionSaga(action: Action<ITransactionForm>) {
    console.log('*** addTransactionSaga started');
    const payload: ITransactionForm = action.payload;
    const account = yield* AccountUtils.select(payload.account);
    const month = yield* MonthUtils.get(account, dayDateToMonth(payload.date));

    console.log('addTransactionSaga', month.id, month.prevVersions);

    let tx = Transaction.create(
        payload.type,
        payload.amount,
        'RUB',
    );

    if (payload.title) tx = tx.setTitle(payload.title);
    if (payload.category) tx = tx.setCategory(payload.category);

    const day = month.getDay(payload.date)
                     .upsertTransaction(tx);

    const updatedMonth = month.updateDay(day);

    console.log('updatedMonth', updatedMonth.id, updatedMonth.prevVersions);

    const value = yield* AccountUtils.update(account, updatedMonth);
    console.log('*** addTransactionSaga complete');
    yield put(updateAccountGrip(value));
    yield put(addTransactionSuccess({
        ...payload,
        id: tx.id,
    }));
    return value;
}
