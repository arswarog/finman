import { sagaLauncher } from '../saga-launcher';
import { ITransactionForm, TransactionType } from '../../models/transaction/transaction.types';
import { Action } from '@reatom/core';
import {
    addTransactionSuccess,
    updateTransaction,
    updateTransactionSuccess,
} from '../../models/transaction/transaction.actions';
import { put } from 'redux-saga/effects';
import { AccountUtils } from '../utils/account.saga';
import { MonthUtils } from '../utils/month.saga';
import { dayDateToMonth } from '../../models/common/date.utils';
import { updateAccountGrip } from '../../atoms/account-grips/account-grips.actions';
import { Money } from '../../models/money/money.class';

sagaLauncher.onAction(updateTransaction, transactionUpdateSaga);

function* transactionUpdateSaga(action: Action<ITransactionForm>) {
    console.log('*** updateTransactionSaga started');
    const payload: ITransactionForm = action.payload;
    const account = yield* AccountUtils.select(payload.account);
    const month = yield* MonthUtils.get(account, dayDateToMonth(payload.date));

    console.log('updateTransactionSaga', month.id, month.prevVersions);


    const foundTx = month.getDay(action.payload.lastTxData.date)
                         .transactions.find(item => item.id === payload.id);

    const removedTx = foundTx.setType(TransactionType.Removed);
    const oldDay = month.getDay(payload.lastTxData.date)
                        .upsertTransaction(removedTx);

    const monthWithoutOld = month.updateDay(oldDay);

    let tx = foundTx.setAmount(Money.create(payload.amount, 'RUB'))
                    .setType(payload.type)
                    .setCategory(payload.category)
                    .setTitle(payload.title);

    const day = monthWithoutOld.getDay(payload.date)
                               .upsertTransaction(tx);

    const updatedMonth = monthWithoutOld.updateDay(day);

    console.log('updatedMonth', updatedMonth.id, updatedMonth.prevVersions);

    const value = yield* AccountUtils.update(account, updatedMonth);
    console.log('*** addTransactionSaga complete');
    yield put(updateAccountGrip(value));
    yield put(addTransactionSuccess({
        ...payload,
        id: tx.id,
    }));
    yield put(updateTransactionSuccess(payload));
    return value;
}
