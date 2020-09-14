import { IAccount } from '../account-dto/account.types';
import { UUID } from '../common/common.types';
import { CategoriesBlock } from '../category/categoryBlock.class';
import { IGrip, IMonthGripBrief } from './grip.types';
import { ICategory } from '../category/category.types';
import { MonthDate } from '../common/date.types';
import { ITag, TagName } from '../tag/tag.types';
import { Map } from 'immutable';
import { Money } from '../money/money.class';
import { AbstractMonthGrip } from './month-grip.class';
import { IMonth } from '../month/month-legacy.types';
import { AccountMonthGrip } from '../account-grip/month-grip.class';


/**
 * TODO: Grip must know about categories and tags in months from IMonthBrief
 */
export abstract class AbstractGrip implements IGrip {
    id: UUID;
    name: string;
    categories: Map<UUID, ICategory> = Map();
    firstMonthDate: MonthDate = null;
    lastMonthDate: MonthDate = null;
    months: IMonthGripBrief[] = [];
    tags: Map<TagName, ITag> = Map();

    balance: Money = Money.empty;
    expense: Money = Money.empty;
    income: Money = Money.empty;

    protected constructor(accounts: IAccount[],
                          categories: Map<UUID, ICategory>) {
        this.categories = categories;
    }

    public abstract makeMonth(month: IMonth): AbstractMonthGrip;
}
