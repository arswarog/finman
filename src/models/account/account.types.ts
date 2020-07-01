import { UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { IMonthBrief } from '../month/month.types';

export interface IAccount {
    id: UUID;
    name: string;
    balance: Money;
    months: ReadonlyArray<Readonly<IMonthBrief>>;
    head: Readonly<IMonthBrief>;
}
