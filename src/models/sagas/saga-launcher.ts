import { runSaga, stdChannel, Saga } from 'redux-saga';
import { PayloadActionCreator, Store } from '@reatom/core';
import { takeEvery, call } from 'redux-saga/effects';

class SagaLauncher {
    private sagas: Saga[] = [];

    register(saga: Saga): void {
        this.sagas.push(saga);
    }

    onAction(actionCreator: PayloadActionCreator<any>,
             saga: Saga,
             sagaName = 'Some saga'): void {
        this.register(function* () {
            yield takeEvery(actionCreator.getType(), saga);
            // yield takeEvery(actionCreator.getType(), function* (...params) {
            //     try {
            //         console.log(`[Saga logger] Saga "${sagaName}" started`);
            //         yield* saga(...params);
            //         console.log(`[Saga logger] Saga "${sagaName}" completed`);
            //     } catch (e) {
            //         console.log(`[Saga logger] Saga "${sagaName}" failed`);
            //         console.error(e);
            //     }
            // });
        });
    }

    start(store: Store) {
        console.log(`Start ${this.sagas.length} sagas`);

        const sagaOptions = {
            dispatch: store.dispatch,
            getState: () => store.getState,
            channel: stdChannel(),
        };

        store.subscribe(sagaOptions.channel.put);

        this.sagas.forEach(saga => runSaga(sagaOptions, saga));
    }
}

export const sagaLauncher = new SagaLauncher();

type ExtractInner<T> = T extends Generator<any, infer R, any> ? R : never;

export interface PackedSaga<Fn extends (...args: any[]) => any> {
    (...args: Parameters<Fn>): Generator<any, ExtractInner<ReturnType<Fn>>, any>;

    originalSaga: (...args: Parameters<Fn>) => Generator<any, ExtractInner<ReturnType<Fn>>, any>;
}

function sagaCallPacker<Fn extends (...args: any[]) => any = any>(saga: Fn): PackedSaga<Fn> {
    const fn = function* PackedSaga<Fn extends (...args: any[]) => any = any>(...params: Parameters<Fn>): Generator<any, ExtractInner<Fn>, any> {
        return yield call(saga as any, ...params);
    };
    fn.originalSaga = saga;
    return fn;
}

export const SagaPacker = {
    call: sagaCallPacker,
};
