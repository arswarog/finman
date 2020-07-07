import { UUID } from '../common/common.types';
import { TransactionType } from '../transaction/transaction.types';

export type DefaultTransactionType = TransactionType.Income | TransactionType.Expense;

export interface ICategory {
    id: UUID;
    name: string;
    defaultTransactionType: DefaultTransactionType;
    image: string;
    parent: UUID | null;
    isInitial?: boolean;
}

export interface ICategoryTree {
    id: UUID;
    name: string;
    defaultTransactionType: TransactionType
    image: string;
    children: Array<{
        id: UUID;
        name: string;
        defaultTransactionType: TransactionType;
        image: string;
    }>
}
