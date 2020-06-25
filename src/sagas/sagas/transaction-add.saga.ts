import { addTransaction } from '../../models/transaction/transaction.actions';
import { sagaLauncher } from '../saga-launcher';
import { IAddTransactionForm } from '../../models/transaction/transaction.types';
import { dayDateToMonth } from '../../models/common/date.utils';
import { Action } from '@reatom/core';
import { AccountUtils } from '../utils/account.saga';
import { MonthUtils } from '../utils/month.saga';
import { Transaction } from '../../models/transaction/transaction.class';

sagaLauncher.onAction(addTransaction, addTransactionSaga);

export function* addTransactionSaga(action: Action<IAddTransactionForm>) {
    console.log('*** addTransactionSaga started');
    const payload: IAddTransactionForm = action.payload;
    const account = yield* AccountUtils.select(payload.account);
    const month = yield* MonthUtils.get(account, dayDateToMonth(payload.date));

    console.log('addTransactionSaga', month.id, month.prevVersions);

    const tx = Transaction.create(
        payload.type,
        payload.amount,
        'RUB',
    );

    const day = month.getDay(payload.date)
                     .addTransaction(tx);

    const updatedMonth = month.updateDay(day);

    console.log('updatedMonth', updatedMonth.id, updatedMonth.prevVersions);

    const value = yield* AccountUtils.update(account, updatedMonth);
    console.log('*** addTransactionSaga complete');
    return value;
}
