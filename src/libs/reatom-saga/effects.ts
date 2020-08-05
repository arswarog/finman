import * as ReduxSagaEffects from 'redux-saga/effects';
import { PayloadActionCreator } from '@reatom/core';

export function* take(actionCreators: PayloadActionCreator<any> | PayloadActionCreator<any>[]) {
    if (!Array.isArray(actionCreators))
        actionCreators = [actionCreators];

    return ReduxSagaEffects.take(actionCreators.map(item => item.getType()));
}
