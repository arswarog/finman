import { runSaga } from 'redux-saga';
import { select, take } from 'redux-saga/effects';
import { sagaOptions } from '../../store/saga';
import { addTransaction } from './transaction.actions';
import { Accounts, IAccountsState } from '../accounts/accounts.atom';
import { IAccount } from '../account/account.types';

runSaga(sagaOptions, addTransactionSaga);

const selectAtom = atom => select(getState => getState(atom));

function* addTransactionSaga() {
    console.log('init saga');
    while (true) {
        const action = yield take(addTransaction.getType());
        console.log('add tx saga started', action);
        // const accounts: IAccountsState = yield selectAtom(Accounts) as any;

        // const account = accounts.accounts.get(action.account);

        // const x2 = yield take(addTransaction.getType());
        // console.log('add tx saga started 2');
        // console.log('x', x);
        //
        // const current = state.current;
        // console.log('current:', current);
        //
        // if (current.loaded) {
        //     console.log('not need to load');
        // } else {
        //     console.log('loading');
        //     yield put(chooseSubset(x.payload));
        // }
        // console.log('complete');
    }
}
