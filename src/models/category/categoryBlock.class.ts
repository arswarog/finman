import sha1 from 'crypto-js/sha1';
import { ICategory, ICategoryTree } from './category.types';
import { SyncStatus, UUID } from '../common/common.types';

/**
 * ID является хешем от данных, при любом изменении создается новый экземпляр с новым ID
 * Класс гарантирует совпадение данных при совпадении ID
 */
export class CategoryBlock {
    public readonly id: UUID = '';
    public readonly account: UUID = '';
    public readonly version: number = 1;
    public readonly syncStatus: SyncStatus = SyncStatus.NoSynced;
    public readonly dataHash: string = '';
    public readonly timestamp: number = 0;

    public readonly prevVersions: UUID[] = [];
    public readonly updatedAt: Date = new Date(0);

    /**
     * @param account
     * @param initialsCategories
     * @param timestamp
     */
    public static createFirstBlock(account: UUID, initialsCategories: ICategoryTree, timestamp: number): CategoryBlock {
        throw new Error('Not implemented');
    }

    public static generateID(block: CategoryBlock, dataHash?: string): string {
        throw new Error('Not implemented');
    }

    /**
     * Создание мердж блока
     *
     * @param blocks Предыдущие блоки цепочки
     */
    public static merge(blocks: CategoryBlock[]): CategoryBlock {
        throw new Error('Not implemented');
    }

    public static fromJSON(value: any): CategoryBlock {
        throw new Error('Not implemented');
    }

    public toJSON(): any {
        throw new Error('Not implemented');
    }

    protected constructor(value: Partial<CategoryBlock>) { // FIXME use all fields of Month
        Object.assign(this, value);
        this.dataHash = this.getDataHash();
        this.id = CategoryBlock.generateID(this, this.dataHash);
    }

    public getDataHash(): string {
        throw new Error('Not implemented');
        // if (!this.days.length)
        //     return '0000000000000000000000000000000000000000';
        //
        // const data = {
        //     days: this.days!.map(day => day.toJSON()),
        // };
        // return sha1(JSON.stringify(data)).toString();
    }

    public changeSyncStatus(syncStatus: SyncStatus): CategoryBlock {
        // if (syncStatus === this.syncStatus)
        //     return this;
        //
        // switch (this.syncStatus) {
        //     case SyncStatus.NoSynced:
        //         if (syncStatus === SyncStatus.Prepared)
        //             return new Month({...this, syncStatus});
        //         break;
        //     case SyncStatus.Prepared:
        //         if (syncStatus === SyncStatus.Syncing)
        //             return new Month({...this, syncStatus});
        //         break;
        //     case SyncStatus.Syncing:
        //         if (syncStatus === SyncStatus.FullySynced)
        //             return new Month({...this, syncStatus});
        //         break;
        //     case SyncStatus.FullySynced:
        // }

        throw new Error(`Can not change sync status from "${SyncStatus[this.syncStatus]}" to "${SyncStatus[syncStatus]}"`);
    }

    public addCategory(category: ICategory): CategoryBlock {
        throw new Error('Not implemented');
    }

    public removeCategory(id: UUID): CategoryBlock {
        throw new Error('Not implemented');
    }

    public updateCategory(category: ICategory): CategoryBlock {
        throw new Error('Not implemented');
    }
}
