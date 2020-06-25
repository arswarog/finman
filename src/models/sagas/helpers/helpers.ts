import { select, call, put, take, CallEffect, SimpleEffect } from 'redux-saga/effects';
import { UUID } from '../../common/common.types';
import { Month } from '../../month/month.class';
import { Map } from 'immutable';
import { Months } from '../../months/months.atom';
import {
    loadMonths,
    loadMonthsFailed,
    loadMonthsSuccess,
    saveMonths, saveMonthsFailed,
    saveMonthsSuccess,
} from '../../months/months.actions';
import { Action, Atom } from '@reatom/core';
import { Accounts, IAccountsState } from '../../accounts/accounts.atom';
import { Account } from '../../account/account.class';
import { saveAccount, saveAccountFailed, saveAccountSuccess } from '../../accounts/accounts.actions';
import { SagaPacker } from '../saga-launcher';

/**
 * Select atom from Store
 * @param atom
 */
export const selectAtom = atom => call(selectAtomFn, atom);

export function* selectAtomFn(atom: Atom<any>) {
    return yield select(getState => getState(atom));
}

/**
 * Get current timestamp
 */
export const getTimestamp = () => call(getTimestampFn);

export function getTimestampFn() {
    return new Date().getTime();
}

export function delay(timeout = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
