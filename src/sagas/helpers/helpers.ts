import { select, call, put, take, CallEffect, SimpleEffect } from 'redux-saga/effects';
import { UUID } from '../../models/common/common.types';
import { Month } from '../../models/month/month.class';
import { Map } from 'immutable';
import { Months } from '../../atoms/months/months.atom';
import {
    loadMonths,
    loadMonthsFailed,
    loadMonthsSuccess,
    saveMonths, saveMonthsFailed,
    saveMonthsSuccess,
} from '../../atoms/months/months.actions';
import { Action, Atom } from '@reatom/core';
import { Accounts, IAccountsState } from '../../atoms/accounts/accounts.atom';
import { Account } from '../../models/account/account.class';
import { saveAccount, saveAccountFailed, saveAccountSuccess } from '../../atoms/accounts/accounts.actions';
import { SagaPacker } from '../saga-launcher';

export const SagaUtils = {
    /**
     * Select atom from Store
     * @param atom
     */
    selectAtom: SagaPacker.call(selectAtomFn),
    /**
     * Get current timestamp
     */
    getTimestamp: SagaPacker.call(getTimestampFn),
};

/**
 * @deprecated
 * @param atom
 */
export const selectAtom = atom => call(selectAtomFn, atom);

export function* selectAtomFn(atom: Atom<any>) {
    return yield select(getState => getState(atom));
}

/**
 * @deprecated
 */
export const getTimestamp = () => call(getTimestampFn);

export function getTimestampFn() {
    return new Date().getTime();
}

export function delay(timeout = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
