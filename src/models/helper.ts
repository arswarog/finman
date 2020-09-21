import { Action, PayloadActionCreator } from '@reatom/core';
import { store } from '../store';

export interface IFormFailed<T> {
    form: T;
    errors: Partial<{ [key in keyof T]: string }>;
    message: string;
}

export function dispatchAndWaitResult<T, S, F>(action: Action<T>,
                                               success: PayloadActionCreator<S>,
                                               failed: PayloadActionCreator<F>): Promise<S> {
    return new Promise<S>((resolve, reject) => {
        let successUnsubscribe: () => void;
        let failedUnsubscribe: () => void;

        function onComplete() {
            successUnsubscribe();
            failedUnsubscribe();
        }

        successUnsubscribe = store.subscribe(success, (payload) => {
            onComplete();
            resolve(payload);
        });
        failedUnsubscribe = store.subscribe(failed, (payload) => {
            onComplete();
            reject(payload);
        });

        store.dispatch(action);
    });
}
