import sha1 from 'crypto-js/sha1';
import { IInitialCategoryTree } from './category.types';
import { SyncStatus, UUID } from '../common/common.types';
import { Category } from './category.class';
import { Packable, PackableClass } from '../../libs/packable/decorator';
import { Packer } from '../../libs/packable/packable';
import { ICategoriesBlock } from './categoryBlock.types';
import { initialCategoriesToCategoryList } from './category.helper';

/**
 * ID является хешем от данных, при любом изменении создается новый экземпляр с новым ID
 * Класс гарантирует совпадение данных при совпадении ID
 */
@PackableClass(data => new CategoriesBlock(data))
export class CategoriesBlock implements ICategoriesBlock {
    @Packable(String) public readonly id: UUID = '';
    @Packable(String) public readonly account: UUID = '';
    @Packable(Number) public readonly version: number = 1;
    @Packable(Number) public readonly syncStatus: SyncStatus = SyncStatus.NoSynced;
    @Packable(String) public readonly dataHash: string = '';
    @Packable(Number) public readonly timestamp: number = 0;

    @Packable([String]) public readonly prevVersions: UUID[] = [];
    public readonly updatedAt: Date = new Date(0);

    @Packable([Category]) public readonly list: ReadonlyArray<Category>;

    /**
     * @param account
     * @param initialsCategories
     * @param timestamp
     */
    public static createInitialBlock(account: UUID, initialsCategories: IInitialCategoryTree, timestamp: number): CategoriesBlock {
        const list: Category [] = initialCategoriesToCategoryList(initialsCategories);

        return new CategoriesBlock({
            account,
            syncStatus: SyncStatus.Prepared,
            timestamp,
            prevVersions: [],
            list,
        });
    }

    public static getDataHash(target: { list: ReadonlyArray<Category> }): string {
        if (!target.list.length)
            return '0000000000000000000000000000000000000000';

        const data = {
            list: target.list.map(item => item.toJSON()),
        };

        return sha1(JSON.stringify(data)).toString();
    }

    public static generateID(block: CategoriesBlock, dataHash?: string): string {
        if (block.version !== 1)
            throw new Error(`Version ${block.version} not supported`);

        if (!dataHash)
            dataHash = CategoriesBlock.getDataHash(block);
        if (dataHash === '0000000000000000000000000000000000000000')
            return '00000000-0000-0000-0000-000000000000';

        const data = {
            version: block.version,
            account: block.account,
            prevVersions: block.prevVersions,
            dataHash,
        };

        const hash = sha1(JSON.stringify(data)).toString();

        // const ts = (block.timestamp / 1000).toString(16)
        //                                    .substr(0, 11)
        //                                    .replace('.', '');

        // let id = `${ts}${hash}`.substr(0, 32);
        let id = `${hash}`.substr(0, 32);

        id = [
            id.substr(0, 8),
            id.substr(8, 4),
            id.substr(12, 4),
            id.substr(16, 4),
            id.substr(20, 12),
        ].join('-');

        return id;
    }

    /**
     * Создание мердж блока
     *
     * @param blocks Предыдущие блоки цепочки
     */
    public static merge(blocks: CategoriesBlock[]): CategoriesBlock {
        throw new Error('Not implemented');
    }

    public static fromJSON(value: any): CategoriesBlock {
        return Packer.get(CategoriesBlock).decode(value);
    }

    public static toJSON(category: CategoriesBlock): any {
        return category.toJSON();
    }

    protected constructor(value: Partial<CategoriesBlock>) { // FIXME use all fields of MonthLegacy
        Object.assign(this, value);
        this.dataHash = CategoriesBlock.getDataHash(this);
        this.id = CategoriesBlock.generateID(this, this.dataHash);
        this.updatedAt = new Date(this.timestamp);
    }

    public toJSON(): any {
        return Packer.get(CategoriesBlock).encode(this);
    }

    public get(id: UUID): Category {
        return this.list.find(item => item.id === id);
    }

    public getList(parent?: UUID): ReadonlyArray<Category> {
        if (!parent)
            return this.list;
        else
            return this.list.filter(item => item.parent === parent);
    }

    public changeSyncStatus(syncStatus: SyncStatus): CategoriesBlock {
        if (syncStatus === this.syncStatus)
            return this;

        switch (this.syncStatus) {
            case SyncStatus.NoSynced:
                if (syncStatus === SyncStatus.Prepared)
                    return new CategoriesBlock({...this, syncStatus});
                break;
            case SyncStatus.Prepared:
                if (syncStatus === SyncStatus.Syncing)
                    return new CategoriesBlock({...this, syncStatus});
                break;
            case SyncStatus.Syncing:
                if (syncStatus === SyncStatus.FullySynced)
                    return new CategoriesBlock({...this, syncStatus});
                break;
            case SyncStatus.FullySynced:
        }

        throw new Error(`Can not change sync status from "${SyncStatus[this.syncStatus]}" to "${SyncStatus[syncStatus]}"`);
    }

    public addCategory(category: Category): CategoriesBlock {
        let exists = this.list.find(item => item.id === category.id);
        if (exists)
            throw new CategoryConflictError(`Category with this ID already exists`, this, category);
        exists = this.list.find(item => item.name.toLowerCase() === category.name.toLowerCase());
        if (exists)
            throw new CategoryConflictError(`Category with this Name already exists`, this, category);

        return new CategoriesBlock({
            ...this,
            syncStatus: SyncStatus.NoSynced,
            list: [...this.list, category],
        });
    }

    public updateCategory(category: Category): CategoriesBlock {
        if (this.list.find(
            item =>
                item.name.toLowerCase() === category.name.toLowerCase()
                && item.id !== category.id,
        ))
            throw new CategoryConflictError(`Category with name "${category.name}" already exists`);

        const toUpdate = this.list.find(item => item.id === category.id);

        if (!toUpdate)
            throw new Error(`Category "${category.name}" (${category.id}) not found`);

        return new CategoriesBlock({
            ...this,
            syncStatus: SyncStatus.NoSynced,
            list: this.list.map(
                item => item.id === category.id
                    ? category
                    : item,
            ),
        });
    }

    public removeCategory(id: UUID): CategoriesBlock {
        const toRemove = this.list.find(item => item.id === id);

        if (!toRemove)
            throw new Error(`Category ${id} not found`);

        return new CategoriesBlock({
            ...this,
            syncStatus: SyncStatus.NoSynced,
            list: this.list.filter(item => item !== toRemove),
        });
    }
}

export class CategoryConflictError extends Error {
    constructor(message: string,
                public readonly block?: CategoriesBlock,
                public readonly category?: Category) {
        super(message);
    }
}
