import sha1 from 'crypto-js/sha1';
import { ICategory, ICategoryTree } from './category.types';
import { SyncStatus, UUID } from '../common/common.types';
import { Category } from './category.class';
import { Packable, PackableClass } from '../../libs/packable/decorator';
import { Packer } from '../../libs/packable/packable';

/**
 * ID является хешем от данных, при любом изменении создается новый экземпляр с новым ID
 * Класс гарантирует совпадение данных при совпадении ID
 */
@PackableClass(data => new CategoryBlock(data))
export class CategoryBlock {
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
    public static createInitialBlock(account: UUID, initialsCategories: ICategoryTree, timestamp: number): CategoryBlock {
        const list: Category [] = initialsCategories.flatMap(
            parent => [
                Category.createInitial(
                    parent.name,
                    parent.defaultType,
                    null,
                    parent.image,
                    parent.id,
                ),
                ...parent.children.map(
                    child => Category.createInitial(
                        child.name,
                        child.defaultType,
                        parent.id,
                        child.image,
                        child.id,
                    ),
                ),
            ],
        );

        return new CategoryBlock({
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

    public static generateID(block: CategoryBlock, dataHash?: string): string {
        if (block.version !== 1)
            throw new Error(`Version ${block.version} not supported`);

        if (!dataHash)
            dataHash = CategoryBlock.getDataHash(block);
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
    public static merge(blocks: CategoryBlock[]): CategoryBlock {
        throw new Error('Not implemented');
    }

    public static fromJSON(value: any): CategoryBlock {
        return Packer.get(CategoryBlock).decode(value);
    }

    public static toJSON(category: CategoryBlock): any {
        return category.toJSON();
    }

    protected constructor(value: Partial<CategoryBlock>) { // FIXME use all fields of Month
        Object.assign(this, value);
        this.dataHash = CategoryBlock.getDataHash(this);
        this.id = CategoryBlock.generateID(this, this.dataHash);
        this.updatedAt = new Date(this.timestamp);
    }

    public toJSON(): any {
        return Packer.get(CategoryBlock).encode(this);
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

    public changeSyncStatus(syncStatus: SyncStatus): CategoryBlock {
        if (syncStatus === this.syncStatus)
            return this;

        switch (this.syncStatus) {
            case SyncStatus.NoSynced:
                if (syncStatus === SyncStatus.Prepared)
                    return new CategoryBlock({...this, syncStatus});
                break;
            case SyncStatus.Prepared:
                if (syncStatus === SyncStatus.Syncing)
                    return new CategoryBlock({...this, syncStatus});
                break;
            case SyncStatus.Syncing:
                if (syncStatus === SyncStatus.FullySynced)
                    return new CategoryBlock({...this, syncStatus});
                break;
            case SyncStatus.FullySynced:
        }

        throw new Error(`Can not change sync status from "${SyncStatus[this.syncStatus]}" to "${SyncStatus[syncStatus]}"`);
    }

    public addCategory(category: Category): CategoryBlock {
        let exists = this.list.find(item => item.id === category.id);
        if (exists)
            throw new CategoryConflictError(`Category with this ID already exists`, this, category);
        exists = this.list.find(item => item.name.toLowerCase() === category.name.toLowerCase());
        if (exists)
            throw new CategoryConflictError(`Category with this Name already exists`, this, category);

        return new CategoryBlock({
            ...this,
            syncStatus: SyncStatus.NoSynced,
            list: [...this.list, category],
        });
    }

    public updateCategory(category: Category): CategoryBlock {
        if (this.list.find(
            item =>
                item.name.toLowerCase() === category.name.toLowerCase()
                && item.id !== category.id,
        ))
            throw new CategoryConflictError(`Category with name "${category.name}" already exists`);

        const toUpdate = this.list.find(item => item.id === category.id);

        if (!toUpdate)
            throw new Error(`Category "${category.name}" (${category.id}) not found`);

        return new CategoryBlock({
            ...this,
            syncStatus: SyncStatus.NoSynced,
            list: this.list.map(
                item => item.id === category.id
                    ? category
                    : item,
            ),
        });
    }

    public removeCategory(id: UUID): CategoryBlock {
        const toRemove = this.list.find(item => item.id === id);

        if (!toRemove)
            throw new Error(`Category ${id} not found`);

        return new CategoryBlock({
            ...this,
            syncStatus: SyncStatus.NoSynced,
            list: this.list.filter(item => item !== toRemove),
        });
    }
}

export class CategoryConflictError extends Error {
    constructor(message: string,
                public readonly block?: CategoryBlock,
                public readonly category?: Category) {
        super(message);
    }
}
