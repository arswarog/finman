import { IScheme } from '../../libs/indexed-db';
import { IMonth } from '../../models/month/month.types';

export const MonthScheme: IScheme<IMonth> = {
    collection: 'months',
    dbVersion: 1,
    key: 'id',
    upgrade(objectStore, oldVersion, newVersion): void {
        console.log('update months from ', oldVersion, newVersion);
    },
};
