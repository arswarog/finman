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

    constructor(dbName: string, public schemes: IScheme[]) {
        if (!window.indexedDB)
            throw new Error('IndexedDB not supported');

        const version = Math.max(1, ...schemes.map(model => model.dbVersion));

        console.log(`Start DB with version: ${version}, count of models: ${schemes.length}`);

        this.openDB(dbName, version).then(
            () => console.log('Successfully open DB'),
            event => console.error('Failed to open DB', event),
        );
    }

    public transaction<T>(scheme: IScheme<T>): Collection<T> {
        if (this._status !== DBStatus.Ready)
            throw new Error('Database not ready');

        return this.getAccessor(scheme);
    }

    public addStatusListener(fn: DBStatusListener): void {
        this.listeners.push(fn);
    }

    public removeStatusListener(fn: DBStatusListener): void {
        this.listeners = this.listeners.filter(item => item !== fn);
    }

    private setStatus(status: DBStatus): void {
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
            });
            openRequest.addEventListener('success', (event: any) => {
                this.db = event.target.result;
                this.setStatus(DBStatus.Ready);
                resolve();
            });
            openRequest.addEventListener('error', (event: any) => {
                console.log(event);
                this.setStatus(DBStatus.Failed);
                reject(event);
            });
        }));
    }
}
