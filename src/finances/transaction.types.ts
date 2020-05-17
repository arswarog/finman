import { UUID } from './common.types';
import { Money } from './money.class';

export enum TransactionType {
    Removed,
    Income,
    Expense,
    Adjust,
    AdjustTo,
}

export interface ITransaction {
    id: UUID;
    amount: Money;
    type: TransactionType;
    category: UUID | '';
    title: string | '';
    createdAt?: number;
    updatedAt?: number;
}
