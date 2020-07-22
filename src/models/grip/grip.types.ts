import { DayDate, MonthDate } from '../common/date.types';
import { IExtendSummary, UUID } from '../common/common.types';
import { ITag } from '../tag/tag.types';
import { ICategory } from '../category/category.types';
import { Money } from '../money/money.class';
import { ITransaction, TransactionType } from '../transaction/transaction.types';
import { IAccount } from '../account/account.types';

export interface ITransactionGrip {
    id: UUID;
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
    tags: Set<ITag>;
    title: string | '';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDayGrip extends IExtendSummary {
    day: DayDate;
    transactions: ITransactionGrip[];
    categories: Map<UUID, ICategory>;
    tags: Map<string, ITag>;
}

export interface IMonthGrip extends IExtendSummary {
    month: MonthDate;
    categories: Map<UUID, ICategory>;
    tags: Map<string, ITag>;
    days: IDayGrip[];
}

export interface IGrip {
    firstMonthDate: MonthDate;
    lastMonthDate: MonthDate;
    months: IMonthGrip[];

    accounts: Map<UUID, IAccount>;
    categories: Map<UUID, ICategory>;
    tags: Map<string, ITag>;
}
