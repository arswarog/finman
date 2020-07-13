import { SyncStatus, UUID } from '../common/common.types';
import { ICategory } from './category.types';

export interface ICategoriesBlock {
    id: UUID;
    account: UUID;
    version: number;
    syncStatus: SyncStatus;
    dataHash: string;
    timestamp: number;
    prevVersions: UUID[];
    list: ReadonlyArray<ICategory>;
}
