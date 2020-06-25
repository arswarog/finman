import { Months } from '../../months/months.atom';
import {
    getTimestamp,
} from './helpers';
import { UUID } from '../../common/common.types';
import { Month } from '../../month/month.class';
import {
    loadMonths,
    loadMonthsFailed,
    loadMonthsSuccess,
    saveMonths,
    saveMonthsSuccess,
} from '../../months/months.actions';
import { SagaTestBed } from './saga-test-bed';
import { CallEffect } from 'redux-saga/effects';
import { PackedSaga } from '../saga-launcher';

describe('saga helpers', () => {
    let testBed: SagaTestBed;

    beforeEach(() => {
        testBed = new SagaTestBed();
    });

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

            const ts = await testBed.run(transactionUpdateSaga);
            console.log('timestamp', ts);
            expect(ts).toBeCloseTo(new Date().getTime(), -2);
        });
    });

});

// TODO return typed params
export function expectCallEffect(value: CallEffect<any>,
                                 packedSaga: PackedSaga<any>,
                                 ...expectedArgs: any[]): any[] {
    expect(value.type).toBe('CALL');
    expect(value.payload.fn).toBe(packedSaga.originalSaga);
    if (expectedArgs.length)
        expect(value.payload.args).toEqual(expectedArgs);
    return value.payload.args;
}
