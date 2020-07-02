import { select, call } from 'redux-saga/effects';
import { Atom } from '@reatom/core';
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
