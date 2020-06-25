import { take } from 'redux-saga/effects';
import { sagaLauncher } from '../saga-launcher';
import { loadAccountsSuccess } from '../../atoms/accounts/accounts.actions';

sagaLauncher.register(transactionUpdateSaga);

function* transactionUpdateSaga() {
    console.log('init transactionUpdateSaga');
    while (true) {
        const action = yield take(loadAccountsSuccess.getType());
        console.log('load successssssss', action);
    }
}
