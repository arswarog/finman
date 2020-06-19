import { runSaga, stdChannel, Saga } from 'redux-saga';
import { Store } from '@reatom/core';

class SagaLauncher {
    private sagas: Saga[] = [];

    register(saga: Saga) {
        this.sagas.push(saga);
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
