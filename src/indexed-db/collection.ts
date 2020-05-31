import { eventLogger } from './db.utils';

export class Collection<T = any> {
    private readonly transaction: IDBTransaction;
    private readonly storage: IDBObjectStore;

    constructor(private db: IDBDatabase, private scheme: any) {
        this.transaction = db.transaction(scheme.collection, 'readwrite');
        eventLogger(
            this.transaction,
            'transaction',
            [
                'abort',
                'complete',
                'error',
            ],
        );
        this.storage = this.transaction.objectStore(scheme.collection);
    }

    //
    // public commit(): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         // this.transaction.commit();
    //     });
    // }


    // Returns an IDBRequest object, and, in a separate thread, creates a structured clone of the value, and stores the cloned value in the object store. This is for adding new records to an object store.
    public add(value: T, key?: string): Promise<T> {
        return new Promise((resolve, reject) => {

        });
        // return this.storage.add(value, key);
    }

    // Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread. This is for deleting all current records out of an object store.
    // IDBObjectStore.clear()
    // Returns an IDBRequest object, and, in a separate thread, returns the total number of records that match the provided key or IDBKeyRange. If no arguments are provided, it returns the total number of records in the store.
    // IDBObjectStore.count()
    // Creates a new index during a version upgrade, returning a new IDBIndex object in the connected database.
    // IDBObjectStore.createIndex()
    // returns an IDBRequest object, and, in a separate thread, deletes the store object selected by the specified key. This is for deleting individual records out of an object store.
    // IDBObjectStore.delete()
    // Destroys the specified index in the connected database, used during a version upgrade.
    // IDBObjectStore.deleteIndex()
    // Returns an IDBRequest object, and, in a separate thread, returns the store object store selected by the specified key. This is for retrieving specific records from an object store.
    // IDBObjectStore.get()
    // Returns an IDBRequest object, and, in a separate thread retrieves and returns the record key for the object in the object stored matching the specified parameter.
    // IDBObjectStore.getKey()

    // Returns an IDBRequest object retrieves all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
    public getAll(query?: IDBValidKey | IDBKeyRange | null, count?: number): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const request = this.storage.getAll();

            eventLogger(request, 'request', [
                'error',
                'success',
            ]);

            request.onsuccess = (event: any) => resolve(event.target.result);
            request.onerror = error => reject(error);
        });
    }


    // Returns an IDBRequest object retrieves record keys for all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
    // IDBObjectStore.getAllKeys()
    // Opens an index from this object store after which it can, for example, be used to return a sequence of records sorted by that index using a cursor.
    // IDBObjectStore.index()
    // Returns an IDBRequest object, and, in a separate thread, returns a new IDBCursorWithValue object. Used for iterating through an object store by primary key with a cursor.
    // IDBObjectStore.openCursor()
    // Returns an IDBRequest object, and, in a separate thread, returns a new IDBCursor. Used for iterating through an object store with a key.
    // IDBObjectStore.openKeyCursor()
    // Returns an IDBRequest object, and, in a separate thread, creates a structured clone of the value, and stores the cloned value in the object store. This is for updating existing records in an object store when the transaction's mode is readwrite.
    // IDBObjectStore.put()
}
