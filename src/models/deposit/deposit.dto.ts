import { MonthDate } from '../common/date.types';
import { Money } from '../money/money.class';
import { IMonthDTO } from '../month/month.dto';
import { ICategoryCollectionDTO } from '../category/categoryCollection.dto';

export interface IDepositDTO {
    months: Map<MonthDate, IMonthDTO>;
    balance: Money;
    dataHash: string;
    categoryCollection: ICategoryCollectionDTO;
}
