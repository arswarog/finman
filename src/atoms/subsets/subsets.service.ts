import { declareAction } from '@reatom/core';
import { SubsetScheme } from '../../models/subset/subset.scheme';
import { ISubset } from '../../models/subset/subset.types';
import { db } from '../../store/db';

const NS = 'subsets/service';
export const refreshAllSuccess = declareAction<ISubset[]>(NS + ':refreshAll success');
export const refreshAllFailed = declareAction(NS + ':refreshAll failed');
export const refreshAll = declareAction(NS + ':refreshAll', (_, store) => {
    db.transaction(SubsetScheme).getAll().then(
        store.bind(refreshAllSuccess),
        store.bind(refreshAllFailed),
    );
});
