import { getMonthSaga } from './get-month.saga';
import { Account } from '../../account/account.class';
import { CallEffect } from 'redux-saga/effects';
import { Month } from '../../month/month.class';
import { createStore, Store } from '@reatom/core';
import { Months } from '../../months/months.atom';
import { stdChannel } from 'redux-saga';
import { getMonthsByIdsSaga, getTimestampFn } from '../helpers';

describe('getMonthSaga', () => {
    let store: Store;
    const baseAccount = Account.create('test');
    const month01 = Month.createFirstBlock(baseAccount.id, '2020-01', 1592247158848);
    const month02 = month01.createNextBlock('2020-02', 1592247187258);
    const month04 = month02.createNextBlock('2020-04', 1592247202511);
    const account = baseAccount.updateHead(month04, [month01, month02]);

    beforeEach(() => {
        store = createStore(Months);
        console.log(store.getState());

        const sagaOptions = {
            dispatch: store.dispatch,
            getState: () => store.getState,
            channel: stdChannel(),
        };

        store.subscribe(sagaOptions.channel.put);
    });

    it('create first month', () => {
        // act
        const saga = getMonthSaga(baseAccount, '2020-05');

        // 1. getTimestamp
        const r1 = saga.next().value as CallEffect<number>;
        expect(r1.type).toBe('CALL');

        // result
        const r2 = saga.next(1592057707159).value as Month;

        expect(r2.account).toEqual(baseAccount.id);
        expect(r2.timestamp).toEqual(1592057707159);
        expect(r2.month).toEqual('2020-05');
    });
    it('load exists month', () => {
        // act
        const saga = getMonthSaga(account, '2020-02');

        // get months
        const r1 = saga.next().value as CallEffect<number>;
        console.log(r1);
        expect(r1.type).toBe('CALL');
        expect(r1.payload.fn).toBe(getMonthsByIdsSaga);
        expect(r1.payload.args).toEqual([[month04.id, month02.id]]);

        // load month 02 and 04
        const r2 = saga.next([month04, month02]).value as Month;
        expect(r2);

        console.log(r2);
        expect(r2).toStrictEqual(month02);
    });
    it('create next month', () => {
        // act
        const saga = getMonthSaga(account, '2020-05');

        // get head
        const r1 = saga.next().value as CallEffect<number>;
        console.log(r1);
        expect(r1.type).toBe('CALL');
        expect(r1.payload.fn).toBe(getMonthsByIdsSaga);
        expect(r1.payload.args).toEqual([[month04.id]]);

        // get timestamp
        const r2 = saga.next([month04]).value as CallEffect<number>;
        console.log(r2);
        expect(r2.type).toBe('CALL');
        expect(r2.payload.fn).toBe(getTimestampFn);

        // load month 02 and 04
        const r3 = saga.next(1592057707159).value as Month;
        expect(r3);

        console.log(r3);
        expect(r3.account).toEqual(account.id);
        expect(r3.timestamp).toEqual(1592057707159);
        expect(r3.month).toEqual('2020-05');
        expect(r3.prevMonths).toEqual([month04.id]);
    });
    it('create month in the middle of chain', () => {
        throw new Error('not implements');
    });
});
