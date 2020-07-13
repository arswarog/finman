import { DefaultTransactionType, ICategory } from './category.types';
import { UUID } from '../common/common.types';
import { TransactionType } from '../transaction/transaction.types';
import { v4 } from 'uuid';
import { Packable, PackableClass } from '../../libs/packable/decorator';
import { Packer } from '../../libs/packable/packable';

@PackableClass(data => new Category(data))
export class Category implements ICategory {
    @Packable(String) public readonly id: UUID = '';
    @Packable(String) public readonly name: string = '';
    @Packable(String) public readonly parent: UUID | null = null;
    @Packable(Number) public readonly defaultTxType: DefaultTransactionType = TransactionType.Expense;
    @Packable(String) public readonly image: string = 'default';
    @Packable(Boolean) public readonly isInitial = false;

    public static create(name: string,
                         defaultTransactionType: DefaultTransactionType,
                         parent: ICategory | UUID | null,
                         image: string = 'default',
                         id?: UUID): Category {
        return new Category({
            id: id || v4(),
            name,
            image,
            defaultTxType: defaultTransactionType,
        }).setParent(parent);
    }

    public static createInitial(name: string,
                                defaultTransactionType: DefaultTransactionType,
                                parent: ICategory | UUID | null,
                                image: string,
                                id: UUID): Category {
        if (!id) throw new Error('ID must be set');
        return new Category({
            ...Category.create(name, defaultTransactionType, parent, image, id),
            isInitial: true,
        });
    }

    public static fromJSON(data: any): Category {
        return Packer.get(Category).decode(data);
    }

    public static toJSON(category: Category): any {
        return category.toJSON();
    }

    protected constructor(data: Partial<ICategory>) {
        if (!data.name) throw new Error('Name must be set');
        Object.assign(this, data);
    }

    public toJSON(): any {
        return Packer.get(Category).encode(this);
    }

    public setName(name: string): Category {
        if (this.isInitial)
            throw new Error(`Can not set name to initial category`);

        return new Category({
            ...this,
            name,
        });
    }

    public setDefaultTransactionType(type: DefaultTransactionType): Category {
        return new Category({
            ...this,
            defaultTxType: type,
        });
    }

    public setImage(image: string): Category {
        return new Category({
            ...this,
            image,
        });
    }

    public setParent(parent: ICategory | UUID | null): Category {
        if (this.isInitial)
            throw new Error(`Can not set parent to initial category`);

        if (!parent)
            return new Category({
                ...this,
                parent: null,
            });
        if (typeof parent === 'string')
            return new Category({
                ...this,
                parent,
            });
        return new Category({
            ...this,
            parent: parent.id,
        });
    }
}

export class RootCategory extends Category {
    public readonly children: Category[] = [];

    constructor(parent: Category, children: ReadonlyArray<Category>) {
        super(parent);
        this.children = children.filter(item => item.parent === this.id);
    }
}
