import { select, call, put, take, CallEffect, SimpleEffect } from 'redux-saga/effects';
import { UUID } from '../common/common.types';
import { Month } from '../month/month.class';
import { Map } from 'immutable';
import { Months } from '../months/months.atom';
import { loadMonths, loadMonthsFailed, loadMonthsSuccess } from '../months/months.actions';
import { Action } from '@reatom/core';

export const selectAtom = atom => select(getState => getState(atom));

export function getTimestampFn() {
    return new Date().getTime();
}

export const getTimestamp = () => call(getTimestampFn);

export function* getMonthsByIdsSaga(ids: UUID[]) {
    const months = yield selectAtom(Months);

    const notExists = ids.filter(id => !months.has(id));

    if (!notExists)
        return months;

    yield put(loadMonths(notExists));
    let action: Action<any>;
    do {
        action = yield take([loadMonthsSuccess, loadMonthsFailed]);
        if (action.type === loadMonthsSuccess.getType()) {
            if (action.payload.every((item, index) => item.id === notExists[index]))
                return yield selectAtom(Months);
        } else {
            if (action.payload.ids.every((item, index) => item === notExists[index]))
                throw action.payload.error;
        }
    } while (true);
}

export const getMonthsByIds = (ids: UUID[]) => call(getMonthsByIdsSaga, ids);
