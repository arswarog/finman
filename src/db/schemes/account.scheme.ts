import { IScheme } from '../../libs/indexed-db';
import { IAccount } from '../../models/account-dto/account.types';

export const AccountScheme: IScheme<IAccount> = {
    collection: 'accounts',
    dbVersion: 1,
    key: 'id',
    upgrade(objectStore, oldVersion, newVersion): void {
        console.log('update account from ', oldVersion, newVersion);
    },
};
