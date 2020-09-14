import { sagaLauncher } from '../saga-launcher';
import { loadMonthsSuccess } from '../../atoms/months/months.actions';
import { Action } from '@reatom/core';
import { Month } from '../../models/month/month-legacy.class';
import { put, fork } from 'redux-saga/effects';
import { Account } from '../../models/account/account.class';
import { AccountUtils } from '../utils/account.saga';
import { updateMonthGripSuccess } from '../../atoms/month-grips/month-grips.actions';

sagaLauncher.onAction(loadMonthsSuccess, updateMonthGripsSaga);

export function* updateMonthGripsSaga(action: Action<Month[]>) {
    console.log('update Month grips saga');
    const months = action.payload;

    for (let month of months)
        yield fork(updateMonthGripSaga, month);
}

export function* updateMonthGripSaga(month: Month) {
    console.log(`update Month grip saga for ${month.month}`);
    console.log('123456');

    const accountGrip = yield* AccountUtils.getGrip(month.account);
    console.log('123');
    const grip = accountGrip.makeMonth(month);
    console.log('234');

    yield put(updateMonthGripSuccess(grip));
    console.log('345');
}
