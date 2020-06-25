import { put, take } from 'redux-saga/effects';
import { Action } from '@reatom/core';
import { MonthDate } from '../../common/date.types';
import { Account } from '../../account/account.class';
import { Month } from '../../month/month.class';
import { getTimestamp, selectAtom } from '../helpers/helpers';
import { SagaPacker } from '../saga-launcher';
import {
    saveMonths,
    saveMonthsSuccess,
    saveMonthsFailed,
    loadMonths,
    loadMonthsSuccess,
    loadMonthsFailed,
} from '../../months/months.actions';
import { UUID } from '../../common/common.types';
import { Months } from '../../months/months.atom';

export const MonthUtils = {
    /**
     * Get or create Month of Account's chain
     */
    get: SagaPacker.call(getMonthSaga),
    /**
     * Get months from DB
     */
    getByIds: SagaPacker.call(getMonthsByIdsSaga),
    /**
     * Save months to DB
     */
    save: SagaPacker.call(saveMonthsSaga),
};

function* getMonthsByIdsSaga(ids: UUID[]): Generator<any, Month[], any> {
    const months: Map<UUID, Month> = yield selectAtom(Months);

    console.log(months);
    const notExists = ids.filter(id => !months.has(id));

    if (!notExists)
        return ids.map(id => months.get(id));

    yield put(loadMonths(notExists));
    let action: Action<any>;
    do {
        action = yield take([loadMonthsSuccess, loadMonthsFailed]);
        if (action.type === loadMonthsSuccess.getType()) {
            if (action.payload.every((item, index) => item.id === notExists[index])) {
                const months = yield selectAtom(Months);
                return ids.map(id => months.get(id))
            }
        } else {
            if (action.payload.ids.every((item, index) => item === notExists[index]))
                throw action.payload.error;
        }
    } while (true);
}

function* getMonthSaga(account: Account, monthDate: MonthDate) {
    if (!account.head) {
        const timestamp: number = yield getTimestamp();
        console.log('timestamp', timestamp);
        return Month.createFirstBlock(account.id, monthDate, timestamp);
    }

    if (monthDate > account.head.month) { // create next block
        const [head]: Month[] = yield* MonthUtils.getByIds([account.head.id]);
        const timestamp: number = yield getTimestamp();
        return head.createNextBlock(monthDate, timestamp);
    }

    const indexOfMonth = account.months.findIndex(item => item.month === monthDate);
    if (indexOfMonth > -1) {
        const monthsIds = account.months
                                 .slice(0, indexOfMonth + 1)
                                 .map(item => item.id);
        const months = yield* MonthUtils.getByIds(monthsIds);
        return months.pop();
    }

    return null;
}

function* saveMonthsSaga(months: Month[]) {
    yield put(saveMonths(months));
    for (; ;) {
        const action = yield take([saveMonthsSuccess, saveMonthsFailed]);
        if (action.type === saveMonthsSuccess.getType()) {
            if (months.every((item, index) => action.payload[index] === item.id))
                return;
        } else {
            if (months.every((item, index) => action.payload.ids[index] === item.id))
                throw action.payload.error;
        }
    }
}
