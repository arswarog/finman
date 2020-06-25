import { Store } from '@reatom/core';
import { setOnlineStatus } from './client.actions';

export function startListenOnlineStatus(store: Store) {
    store.dispatch(setOnlineStatus(navigator.onLine));

    window.addEventListener('online',
        () => store.dispatch(setOnlineStatus(true)),
    );
    window.addEventListener('offline',
        () => store.dispatch(setOnlineStatus(false)),
    );
}
