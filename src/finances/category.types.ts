import { UUID } from './common.types';
import { TransactionType } from './transaction.types';

export interface ICategory {
    id: UUID;
    name: string;
    defaultTransactionType: TransactionType;
    parent: UUID | null;
}

export interface ICategoriesState {
    root: ICategory[];
    all: ICategory[];
}
