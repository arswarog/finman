import { runSaga, stdChannel, Saga } from 'redux-saga';
import { PayloadActionCreator, Store } from '@reatom/core';
import { takeEvery } from 'redux-saga/effects';

class SagaLauncher {
    private sagas: Saga[] = [];

    register(saga: Saga): void {
        this.sagas.push(saga);
    }

    onAction(actionCreator: PayloadActionCreator<any>, saga: Saga): void {
        this.register(function* () {
            yield takeEvery(actionCreator.getType(), saga);
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
