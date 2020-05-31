import { Subset } from './subset.class';
import { IScheme } from '../../indexed-db';

export const SubsetScheme: IScheme<Subset> = {
    collection: 'subsets',
    dbVersion: 5,
    key: 'id',
    upgrade(objectStore, oldVersion, newVersion): void {
        console.log('update subsets from ', oldVersion, newVersion);

        const defaultSubset = Subset.create('Default');

        objectStore.add(defaultSubset.toJSON());
    },
};
