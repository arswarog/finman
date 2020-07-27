import { Set } from 'immutable';
import { ITransactionGrip } from './grip.types';
import { ITransaction, TransactionType } from '../transaction/transaction.types';
import { DayDate } from '../common/date.types';
import { IAccount } from '../account/account.types';
import { ICategory } from '../category/category.types';
import { Money } from '../money/money.class';
import { TagName } from '../tag/tag.types';

export class TransactionGrip implements ITransactionGrip {
    account: IAccount;
    amount: Money;
    category: ICategory;
    changeAmount: Money;
    createdAt: Date;
    date: DayDate;
    sourceTxs: ITransaction[];
    tags: Set<TagName>;
    title: string | '';
    type: TransactionType;
    updatedAt: Date;

    constructor(data: ITransactionGrip) {
        Object.assign(this, data);
    }
}
