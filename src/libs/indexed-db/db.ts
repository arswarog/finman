import { DBStatus, DBStatusListener, IScheme } from './db.types';
import { Collection } from './collection';
import { eventLogger } from './db.utils';

export class IndexedDB {
    get status(): DBStatus {
        return this._status;
    }

    private listeners: DBStatusListener[] = [];

    private _status = DBStatus.Initializing;

    private db: IDBDatabase | null = null;

    constructor(dbName: string,
                public schemes: IScheme[],
                private onInstall: (objectStore: IndexedDB) => Promise<void>,
                private onUpgrade?: (objectStore: IndexedDB, oldVersion: number, newVersion: number) => Promise<void>,
    ) {
        if (!window.indexedDB)
            throw new Error('IndexedDB not supported');

        schemes.forEach(scheme => {
            const exists = schemes.find(item => item !== scheme && item.collection === scheme.collection);
            if (exists)
                throw new Error(`Collection "${scheme.collection}" used in different schemes.\nYou can use collection only in one scheme`);
        });

        const version = Math.max(1, ...schemes.map(model => model.dbVersion));

        console.log(`Start DB with version: ${version}, count of models: ${schemes.length}`);

        this.openDB(dbName, version).then(
            () => console.log('Successfully open DB'),
            event => console.error('Failed to open DB', event),
        );
    }

    public transaction<T>(scheme: IScheme<T>): Collection<T> {
        if (this._status !== DBStatus.Ready && this._status !== DBStatus.Migrating)
            throw new Error('Database not ready');

        return this.getAccessor(scheme);
    }

    public addStatusListener(fn: DBStatusListener): void {
        this.listeners.push(fn);
        setTimeout(() => fn(this.status));
    }

    public removeStatusListener(fn: DBStatusListener): void {
        this.listeners = this.listeners.filter(item => item !== fn);
    }

    private setStatus(status: DBStatus): void {
        console.log(`change DB status to "${DBStatus[status]}"`);
        if (status === this._status)
            return;
        console.log(`Change DB status from "${DBStatus[this._status]}" to "${DBStatus[status]}"`);
        this._status = status;
        this.listeners.forEach(fn => fn(status));
    }

    private getAccessor(scheme: IScheme): Collection {
        if (this.db)
            return new Collection(this.db, scheme);
        else
            throw new Error('Cannot create accessor for closed database');
    }

    private openDB(dbName: string, version: number): Promise<void> {
        this.setStatus(DBStatus.Initializing);
        return new Promise(((resolve, reject) => {
            const openRequest = window.indexedDB.open(dbName, version);
            eventLogger(
                openRequest,
                'openRequest',
                [
                    'upgradeneeded',
                    'blocked',
                    'error',
                    'success',
                ],
            );
            openRequest.addEventListener('upgradeneeded', (event: any) => {
                this.setStatus(DBStatus.Upgrading);
                const oldVersion: number = event.oldVersion;
                const newVersion: number = event.newVersion;
                if (oldVersion)
                    console.log(`Upgrade DB from version ${oldVersion}`);
                else
                    console.log('Initialize DB');

                const transaction: IDBTransaction = this.db = event.target.transaction;
                console.log(transaction);
                const db: IDBDatabase = this.db = event.target.result;

                console.log(Array.from(db.objectStoreNames));

                this.schemes.forEach(scheme => {
                    let objectStore: IDBObjectStore;
                    try {
                        objectStore = transaction.objectStore(scheme.collection);
                    } catch (e) {
                        console.warn(e);
                        objectStore = db.createObjectStore(scheme.collection, {keyPath: scheme.key});
                    }

                    console.log(objectStore);
                    if (scheme.upgrade) {
                        scheme.upgrade(objectStore!, oldVersion, newVersion);
                    }
                });

                openRequest.addEventListener('success', async (event: any) => {
                    this.setStatus(DBStatus.Migrating);

                    this.db = event.target.result;

                    if (!oldVersion)
                        await this.onInstall(this);
                    else if (this.onUpgrade)
                        await this.onUpgrade(this, oldVersion, newVersion);

                    this.setStatus(DBStatus.Ready);
                    resolve();
                });
                openRequest.addEventListener('error', (event: any) => {
                    console.log(event);
                    this.setStatus(DBStatus.Failed);
                    reject(event);
                });
            });
        }));
    }
}
