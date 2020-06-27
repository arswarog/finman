import { createStore, Store } from '@reatom/core';
import { stdChannel } from 'redux-saga';
import { CallEffect } from 'redux-saga/effects';
import { MonthUtils } from './month.saga';
import { Account } from '../../models/account/account.class';
import { Month } from '../../models/month/month.class';
import { Months } from '../../atoms/months/months.atom';
import { getTimestampFn, delay } from '../helpers/helpers';
import { expectCallEffect } from '../helpers/helpers.spec';
import { SagaTestBed } from '../helpers/saga-test-bed';
import {
    loadMonths,
    loadMonthsFailed,
    loadMonthsSuccess,
    saveMonths,
    saveMonthsSuccess,
} from '../../atoms/months/months.actions';
import { UUID } from '../../models/common/common.types';

describe('MonthUtils', () => {
    describe('getMonthsByIds', () => {
        let testBed: SagaTestBed;

        beforeEach(() => {
            testBed = new SagaTestBed();
        });
        const month1 = Month.createFirstBlock('test', '2020-01', 1592392083192);
        const month2 = month1.createNextBlock('2020-02', 1592392113315);

        beforeEach(() => {
            testBed.subscribe(Months);
            testBed.dispatch(loadMonthsSuccess([month1, month2]));

            const months = testBed.getState(Months);
            expect(months.has(month1.id)).toBeTruthy();
            expect(months.has(month2.id)).toBeTruthy();
        });

        it('already loaded, only return', async () => {
            function* test(ids: UUID[]) {
                return yield* MonthUtils.getByIds(ids);
            }

            // result
            testBed.run(test, [month1.id, month2.id]).then(
                (months: Map<UUID, Month>) => {
                    expect(months.has(month1.id)).toBeTruthy();
                    expect(months.has(month2.id)).toBeTruthy();
                },
                error => {
                    throw error;
                },
            );
        });

        it('needs loading (packer)', async () => {
            const month3 = month2.createNextBlock('2020-03', 1592392946647);

            function* test(ids: UUID[]) {
                return yield* MonthUtils.getByIds(ids);
            }

            const ids = [month2.id, month3.id];
            // result
            testBed.run(test, ids).then(
                (months: Map<UUID, Month>) => {
                    expect(months[0].id).toBe(month2.id);
                    expect(months[1].id).toBe(month3.id);
                },
                error => {
                    throw error;
                },
            );

            // step 1
            expect(testBed.actions.length).toBe(1);

            let action = testBed.actions.shift()!;
            expect(action.type).toEqual(loadMonths.getType());
            expect(action.payload).toEqual([month3.id]);

            // step 2: load another months (simulate concurrent loads)
            testBed.dispatch(loadMonthsSuccess([month3.createNextBlock('2020-04', 1592394279711)]));
            await delay();
            expect(testBed.isCompleted).toBeFalsy();

            // step 3. load month3, complete
            testBed.dispatch(loadMonthsSuccess([month3]));
            await delay();
            expect(testBed.isCompleted).toBeTruthy();
        });

        it('failed to load', async () => {
            const month3 = month2.createNextBlock('2020-03', 1592392946647);

            function* test(ids: UUID[]) {
                try {
                    yield* MonthUtils.getByIds(ids);
                    throw new Error('Must be error');
                } catch (error) {
                    expect(error.message).toBe('Not found');
                }
            }

            const ids = [month2.id, month3.id];
            // result
            testBed.run(test, ids);

            // step 1
            expect(testBed.actions.length).toBe(1);

            let action = testBed.actions.shift()!;
            expect(action.type).toEqual(loadMonths.getType());
            expect(action.payload).toEqual([month3.id]);

            // step 2: load another months (simulate concurrent loads)
            testBed.dispatch(loadMonthsFailed({
                ids: [month3.id],
                error: new Error('Not found'),
            }));
            await delay();
        });
    });
    describe('saveMonthsSaga', () => {
        let testBed: SagaTestBed;

        beforeEach(() => {
            testBed = new SagaTestBed();
        });
        it('base', async () => {
            const month = Month.createFirstBlock('test', '2020-01', 1592929735957);

            function* test(ids: UUID[]) {
                return yield* MonthUtils.save([month]);
            }

            // result
            testBed.run(test).then(
                () => null,
                error => {
                    throw error;
                },
            );

            // put action saveMonths
            expect(testBed.actions.length).toEqual(1);
            const putAction = testBed.actions.shift();
            expect(putAction).toEqual(saveMonths([month]));

            // dispatch another saveMonthsComplete
            testBed.dispatch(saveMonthsSuccess(['another-month-id']));
            await delay();
            expect(testBed.isRunning).toBeTruthy();

            // dispatch expected saveMonthsComplete
            testBed.dispatch(saveMonthsSuccess([month.id]));
            await delay();
            expect(testBed.isCompleted).toBeTruthy();
        });
    });
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
            const saga = MonthUtils.get.originalSaga(baseAccount, '2020-05');

            // 1. getTimestamp
            const r1 = saga.next().value as CallEffect<number>;
            expect(r1.type).toBe('CALL');

            // result
            const r2 = saga.next(1592057707159).value as Month;

            expect(r2.account).toEqual(baseAccount.id);
            expect(r2.timestamp).toEqual(1592057707159);
            expect(r2.month).toEqual('2020-05');
        });
        it('load exists month (packer)', () => {
            // act
            const saga = MonthUtils.get.originalSaga(account, '2020-02');

            // get months
            const r1 = saga.next().value as CallEffect<number>;
            console.log(r1);
            expectCallEffect(r1, MonthUtils.getByIds);
            expect(r1.payload.args).toEqual([[month04.id, month02.id]]);

            // load month 02 and 04
            const r2 = saga.next([month04, month02]).value as Month;
            expect(r2);

            console.log(r2);
            expect(r2).toStrictEqual(month02);
        });
        it('load exists month', () => {
            // act
            const saga = MonthUtils.get.originalSaga(account, '2020-02');

            // get months
            const r1 = saga.next().value as CallEffect<number>;
            console.log(r1);
            expectCallEffect(r1, MonthUtils.getByIds);
            expect(r1.payload.args).toEqual([[month04.id, month02.id]]);

            // load month 02 and 04
            const r2 = saga.next([month04, month02]).value as Month;
            expect(r2);

            console.log(r2);
            expect(r2).toStrictEqual(month02);
        });
        it('create next month', () => {
            // act
            const saga = MonthUtils.get.originalSaga(account, '2020-05');

            // get head
            const r1 = saga.next().value as CallEffect<number>;
            console.log(r1);
            expectCallEffect(r1, MonthUtils.getByIds);
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
});
