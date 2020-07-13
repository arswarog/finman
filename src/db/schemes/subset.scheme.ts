import { Subset } from '../../models/subset/subset.class';
import { IScheme } from '../../libs/indexed-db';

export const SubsetScheme: IScheme<Subset> = {
    collection: 'subsets',
    dbVersion: 1,
    key: 'id',
    upgrade(objectStore, oldVersion, newVersion): void {
        console.log('update subsets from ', oldVersion, newVersion);

        const defaultSubset = Subset.create('Default');

        objectStore.add(defaultSubset.toJSON());
    },
};