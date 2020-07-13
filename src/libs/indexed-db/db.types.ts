export enum DBStatus {
    Initializing,
    Upgrading,
    Migrating,
    Ready,
    Failed,
}

export interface IScheme<T = any, K extends keyof T = any> {
    collection: string;
    dbVersion: number;
    key: K;

    upgrade?(objectStore: IDBObjectStore, oldVersion: number, newVersion: number): void;
}

export type DBStatusListener = (status: DBStatus) => void;
