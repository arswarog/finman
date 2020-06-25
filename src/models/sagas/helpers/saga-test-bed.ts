import { Action, createStore, Store } from '@reatom/core';
import { runSaga, Saga, stdChannel } from 'redux-saga';
import { Atom } from '@reatom/core/build/declareAtom';
import { PayloadActionCreator } from '@reatom/core/build/declareAction';
import { State } from '@reatom/core/build/kernel';

export enum TestBedStatus {
    Initialing,
    Started,
    Completed,
    Failed,
}

export class SagaTestBed {
    public subscriptions: Array<() => void> = [];
    public actions: Action<any>[] = [];
    public store: Store = createStore();

    private _status: TestBedStatus = TestBedStatus.Initialing;

    public get isRunning(): boolean {
        return this._status === TestBedStatus.Started;
    }

    public get isCompleted(): boolean {
        return this._status === TestBedStatus.Completed;
    }

    public get isFailed(): boolean {
        return this._status === TestBedStatus.Failed;
    }

    public run(saga: Saga, ...params: any[]): Promise<any> {
        if (this._status !== TestBedStatus.Initialing)
            throw new Error('TestBed can run only one time');

        const sagaOptions = {
            dispatch: this.store.dispatch,
            getState: () => this.store.getState,
            channel: stdChannel(),
        };

        this.store.subscribe(sagaOptions.channel.put);
        this.store.subscribe(action => this.actions.push(action));
        this._status = TestBedStatus.Started;
        return runSaga(sagaOptions, saga, ...params)
            .toPromise()
            .then(
                result => {
                    this._status = TestBedStatus.Completed;
                    this.unsubscribe();
                    return result;
                },
                error => {
                    this._status = TestBedStatus.Failed;
                    this.unsubscribe();
                    throw error;
                },
            );
    }

    public getState(): State;
    public getState<T>(target: Atom<T>): T;
    public getState<T>(target?: Atom<T>): T | State {
        return this.store.getState(target);
    }

    public dispatch<T>(action: Action<T>): void {
        this.store.dispatch(action);
    }

    public subscribe<T>(target: Atom<T> | PayloadActionCreator<T>, listener: (state: T) => any = (() => void 0)): () => void {
        const subscription = this.store.subscribe(target, listener);
        this.subscriptions.push(subscription);
        return subscription;
    }

    public unsubscribe() {
        this.subscriptions.forEach(func => func());
    }
}
