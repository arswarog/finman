import { declareAtom } from '@reatom/core';
import { Wallet } from '../wallet.class';
import { Map } from 'immutable';
import { UUID } from '../common.types';

export interface IWalletsState {
    wallets: Map<UUID, Wallet[]>
}

export const Wallets = declareAtom<IWalletsState>(
    ['wallets'],
    {
        wallets: Map(),
    },
    on => [],
);
