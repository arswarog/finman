import { DayDate, MonthDate } from '../common/date.types';
import { IExtendSummary, ISummary, UUID } from '../common/common.types';
import { ITag, TagName } from '../tag/tag.types';
import { ICategory } from '../category/category.types';
import { Money } from '../money/money.class';
import { ITransaction, TransactionType } from '../transaction/transaction.types';
import { IAccount } from '../account/account.types';
import { Set, Map } from 'immutable';

export interface ITransactionGrip {
    date: DayDate;
    /**
     * Изменение баланса в рамках набора данных
     * Например, если это перевод в рамках двух аккаунтов,
     * оба которые входят в этот набор данных, то будет 0,
     * Если во вне: то сумма вывода с минусом или сумма прихода с плюсом
     * Если это Expense то сумма будет отрицательная
     */
    changeAmount: Money;
    /**
     * Сумма транзакции
     * Для Adjust: целевая сумма
     * Для Transfer: сумма перевода
     * Для остальных: просто сумма из транзакции
     */
    amount: Money;
    type: TransactionType;
    sourceTxs: ITransaction[];
    account: IAccount;
    category: ICategory;
    tags: Set<TagName>;
    title: string | '';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDayGrip extends IExtendSummary {
    date: DayDate;
    transactions: ITransactionGrip[];
    categories: Map<UUID, ICategory>;
    tags: Map<TagName, ITag>;
}

export interface IMonthGripBrief extends IExtendSummary {
    month: MonthDate;
    categories?: Map<UUID, ICategory>; // TODO Make it required
    tags?: Map<TagName, ITag>; // TODO Make it required
}

export interface IMonthGrip extends IMonthGripBrief {
    categories: Map<UUID, ICategory>;
    tags: Map<TagName, ITag>;
    days: IDayGrip[];
}

export interface IGrip extends ISummary {
    firstMonthDate: MonthDate;
    lastMonthDate: MonthDate;
    months: IMonthGrip[];

    categories: Map<UUID, ICategory>;
    tags: Map<TagName, ITag>;
}
