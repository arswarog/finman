import { UUID } from '../common/common.types';
import { TransactionType } from '../transaction/transaction.types';

export type DefaultTransactionType = TransactionType.Income | TransactionType.Expense;

export interface ICategory {
    id: UUID;
    name: string;
    defaultTxType: DefaultTransactionType;
    image: string;
    parent: UUID | null;
    isInitial?: boolean;
}

export type IInitialCategoryTree = Array<{
    id: UUID;
    name: string;
    defaultType: DefaultTransactionType
    image: string;
    children: Array<{
        id: UUID;
        name: string;
        defaultType: DefaultTransactionType;
        image: string;
    }>
}>
