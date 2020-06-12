import { runSaga, stdChannel } from 'redux-saga';
import { take, select, put } from 'redux-saga/effects';
import { store } from './store';
import { Subsets } from '../models/subsets/subsets.atom';
import { chooseAccount } from '../models/accounts/accounts.actions';
import { chooseSubset } from '../models/subsets/subsets.actions';

export const sagaOptions = {
    dispatch: store.dispatch,
    getState: () => store.getState,
    channel: stdChannel(),
};

store.subscribe(sagaOptions.channel.put);

runSaga(sagaOptions, logCounterSaga);

const selectAtom = atom => select(getState => getState(atom));

function* logCounterSaga() {
    while (true) {
        const x = yield take(chooseAccount.getType());
        console.log('x', x);

        const state = yield selectAtom(Subsets);
        const current = state.current;
        console.log('current:', current);

        if (current.loaded) {
            console.log('not need to load');
        } else {
            console.log('loading');
            yield put(chooseSubset(x.payload));
        }
        console.log('complete');
    }
}
