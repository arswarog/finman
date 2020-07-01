import { IScheme } from '../../indexed-db';
import { Account } from './account.class';
import { IAccount } from './account.types';

export const AccountScheme: IScheme<IAccount> = {
    collection: 'accounts',
    dbVersion: 1,
    key: 'id',
    upgrade(objectStore, oldVersion, newVersion): void {
        console.log('update account from ', oldVersion, newVersion);

        const defaultAccount = Account.create('Default');

        objectStore.add(defaultAccount.toJSON());
    },
};
