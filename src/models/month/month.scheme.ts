import { IScheme } from '../../indexed-db';
import { IMonth } from './month.types';

export const MonthScheme: IScheme<IMonth> = {
    collection: 'months',
    dbVersion: 1,
    key: 'id',
    upgrade(objectStore, oldVersion, newVersion): void {
        console.log('update months from ', oldVersion, newVersion);

        // const defaultAccount = Month.create('Default');
        //
        // objectStore.add(defaultAccount.toJSON());
    },
};
