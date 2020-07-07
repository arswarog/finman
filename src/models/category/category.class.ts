import { DefaultTransactionType, ICategory } from './category.types';
import { UUID } from '../common/common.types';
import { TransactionType } from '../transaction/transaction.types';
import { v4 } from 'uuid';


export class Category implements ICategory {
    public readonly id: UUID = '';
    public readonly name: string = '';
    public readonly parent: UUID | null = null;
    public readonly defaultTransactionType: DefaultTransactionType = TransactionType.Expense;
    public readonly image: string = 'default';
    public readonly isInitial = false;

    public static create(name: string,
                         defaultTransactionType: DefaultTransactionType,
                         parent: ICategory | UUID | null,
                         image: string = 'default',
                         id?: UUID): Category {
        return new Category({
            id: id || v4(),
            name,
            image,
            defaultTransactionType,
        }).setParent(parent);
    }

    public static createInitial(name: string,
                                defaultTransactionType: DefaultTransactionType,
                                parent: ICategory | UUID | null,
                                image: string,
                                id: UUID): Category {
        return new Category({
            ...Category.create(name, defaultTransactionType, parent, image, id),
            isInitial: true,
        });
    }

    private constructor(data: Partial<ICategory>) {
        if (!data.id) throw new Error('ID must be set');
        if (!data.name) throw new Error('Name must be set');
        Object.assign(this, data);
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
            defaultTransactionType: type,
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
