import { runSaga, stdChannel } from 'redux-saga';
import { take, select, put } from 'redux-saga/effects';
import { store } from './store';
import { Subsets } from '../models/subsets/subsets.atom';
import { chooseSubset, chooseSubsetX } from '../models/subsets/subsets.actions';

export const options = {
    dispatch: store.dispatch,
    getState: () => store.getState,
    channel: stdChannel(),
};

store.subscribe(options.channel.put);

runSaga(options, logCounterSaga);

const selectAtom = atom => select(getState => getState(atom));

function* logCounterSaga() {
    while (true) {
        const x = yield take(chooseSubset.getType());
        console.log('x', x);

        const state = yield selectAtom(Subsets);
        const current = state.current;
        console.log('current:', current);

        if (current.loaded) {
            console.log('not need to load');
        } else {
            console.log('loading');
            yield put(chooseSubsetX({id: x.payload, x: 1}));
        }
        console.log('complete');
    }
}
