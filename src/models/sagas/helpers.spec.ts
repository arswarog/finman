import { Action, createStore, Store } from '@reatom/core';
import { Months } from '../months/months.atom';
import { runSaga, Saga, stdChannel } from 'redux-saga';
import { getMonthsByIds, getTimestamp } from './helpers';
import { UUID } from '../common/common.types';
import { Month } from '../month/month.class';
import { loadMonths, loadMonthsFailed, loadMonthsSuccess } from '../months/months.actions';

describe('saga helpers', () => {
    let subscriptions: Array<() => void> = [];
    let actions: Action<any>[] = [];
    let store: Store;
    let run: (saga: Saga, ...params: any[]) => Promise<any>;

    beforeEach(() => {
        actions = [];
        subscriptions = [];
        store = createStore();

        const sagaOptions = {
            dispatch: store.dispatch,
            getState: () => store.getState,
            channel: stdChannel(),
        };

        store.subscribe(sagaOptions.channel.put);
        store.subscribe(action => actions.push(action));

        run = (saga, ...params) => runSaga(sagaOptions, saga, ...params).toPromise();
    });

    afterEach(() => subscriptions.forEach(func => func()));

    describe('getTimestamp', () => {
        it('base', async () => {
            function* transactionUpdateSaga() {
                return yield getTimestamp();
            }

            const gen = transactionUpdateSaga();

            // call getTimestamp
            const r1 = gen.next();
            console.log(r1);

            // result
            const result = gen.next(123);
            console.log('timestamp', result);
            expect(result).toEqual({
                done: true,
                value: 123,
            });
        });
        it('full', async () => {
            function* transactionUpdateSaga() {
                return yield getTimestamp();
            }

            const ts = await run(transactionUpdateSaga);
            console.log('timestamp', ts);
            expect(ts).toBeCloseTo(new Date().getTime(), -2);
        });
    });

    describe('getMonthsByIds', () => {
        const month1 = Month.createFirstBlock('test', '2020-01', 1592392083192);
        const month2 = month1.createNextBlock('2020-02', 1592392113315);

        beforeEach(() => {
            subscriptions.push(store.subscribe(Months, () => void 0));
            store.dispatch(loadMonthsSuccess([month1, month2]));

            const months = store.getState(Months);
            expect(months.has(month1.id)).toBeTruthy();
            expect(months.has(month2.id)).toBeTruthy();

            actions = [];
        });

        it('already loaded, only return', async () => {
            function* test(ids: UUID[]) {
                return yield getMonthsByIds(ids);
            }

            const ids = [month1.id, month2.id];
            // result
            run(test, [month1.id, month2.id]).then(
                (months: Map<UUID, Month>) => {
                    expect(months.has(month1.id)).toBeTruthy();
                    expect(months.has(month2.id)).toBeTruthy();
                },
                error => {
                    throw error;
                },
            );
        });

        it('needs loading', async () => {
            const month3 = month2.createNextBlock('2020-03', 1592392946647);

            function* test(ids: UUID[]) {
                return yield getMonthsByIds(ids);
            }

            const ids = [month2.id, month3.id];
            let isCompleted = false;
            // result
            run(test, ids).then(
                (months: Map<UUID, Month>) => {
                    isCompleted = true;
                    expect(months.has(month2.id)).toBeTruthy();
                    expect(months.has(month3.id)).toBeTruthy();
                },
                error => {
                    throw error;
                },
            );

            // step 1
            expect(actions.length).toBe(1);

            let action = actions.shift()!;
            expect(action.type).toEqual(loadMonths.getType());
            expect(action.payload).toEqual([month3.id]);

            // step 2: load another months (simulate concurrent loads)
            store.dispatch(loadMonthsSuccess([month3.createNextBlock('2020-04', 1592394279711)]));
            await delay();
            expect(isCompleted).toBeFalsy();

            // step 3. load month3, complete
            store.dispatch(loadMonthsSuccess([month3]));
            await delay();
            expect(isCompleted).toBeTruthy();
        });

        it('failed to load', async () => {
            const month3 = month2.createNextBlock('2020-03', 1592392946647);

            function* test(ids: UUID[]) {
                try {
                    yield getMonthsByIds(ids);
                    throw new Error('Must be error');
                } catch (error) {
                    expect(error.message).toBe('Not found');
                }
            }

            const ids = [month2.id, month3.id];
            // result
            run(test, ids);

            // step 1
            expect(actions.length).toBe(1);

            let action = actions.shift()!;
            expect(action.type).toEqual(loadMonths.getType());
            expect(action.payload).toEqual([month3.id]);

            // step 2: load another months (simulate concurrent loads)
            store.dispatch(loadMonthsFailed({
                ids: [month3.id],
                error: new Error('Not found'),
            }));
            await delay();
        });
    });
});

function delay(timeout = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
