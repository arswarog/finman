import { declareAction } from '@reatom/core';
import { SubsetScheme } from '../subset/subset.scheme';
import { ISubset } from '../subset/subset.types';
import { db } from '../../store';

const NS = 'subsets/service';
export const refreshAll = declareAction(NS + ':refreshAll', (_, store) => {
    db.transaction(SubsetScheme).getAll().then(
        store.bind(refreshAllSuccess),
        store.bind(refreshAllFailed),
    );
});
export const refreshAllSuccess = declareAction<ISubset[]>(NS + ':refreshAll success');
export const refreshAllFailed = declareAction(NS + ':refreshAll failed');
