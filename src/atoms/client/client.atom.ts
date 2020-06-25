import { declareAtom } from '@reatom/core';
import { IClientState } from './client.types';
import { setOnlineStatus } from './client.actions';

export const Client = declareAtom<IClientState>(
    ['client'],
    {
        online: false,
    },
    on => ({
        online: [
            on(setOnlineStatus, (state, online) => ({...state, online})),
        ],
    }),
);
