import { UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { TransactionType } from './transaction.types';

export interface ITransactionDTO {
    id: UUID;
    amount: Money;
    type: TransactionType;
    category: UUID | '';
    title: string | '';
    tags: string[];
    // TODO additional options ?
}
