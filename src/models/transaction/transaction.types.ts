import { UUID } from '../common/common.types';
import { Money } from '../money/money.class';

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

export interface ITransactionForm {
    id?: UUID;
    account: UUID;
    amount: string;
    type: TransactionType;
    category: UUID | '';
    title: string | '';
    date: string;
    lastTxData?: ITransactionForm;
}
