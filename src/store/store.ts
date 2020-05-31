import { combine, createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { Client } from '../models/client/client.atom';
import { Subsets } from '../models/subsets/subsets.atom';

export const store = createStore(combine({
    Client,
}));

connectReduxDevtools(store);
