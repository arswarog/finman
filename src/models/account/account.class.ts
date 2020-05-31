import { ISummary, UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { IMonthBrief } from '../month/month.types';
import { IAccount } from './account.types';
import { v1 as uuidGenerator } from 'uuid';
import { Month } from '../month/month.class';
import { Map } from 'immutable';

export class Account implements IAccount, ISummary {
    public readonly id: UUID = '';
    public readonly name: string = '';
    public readonly balance: Money = Money.empty;
    public readonly income: Money = Money.empty;
    public readonly expense: Money = Money.empty;
    public readonly months: IMonthBrief[] = [];
    public readonly fullMonths: Map<UUID, Month> = Map();

    public static create(name: string, id?: UUID): Account {
        return new Account({
            id: id || uuidGenerator(),
            name,
        });
    }

    public static fromJSON(data: IAccount): Account {
        return new Account({
            //     id: id || uuidGenerator(),
            //     name,
        });
    }

    private constructor(account: Partial<Account>) {
        return Object.assign(this, account);
    }

    public updateMonth(month: Month): Account {
        // throw new RequiredMonthsError(['123123123']);
        return this;
    }

    public recalculate(): Account {
        // throw new RequiredMonthsError(['123123123']);
        return this;
    }
}

export class RequiredMonthsError extends Error {
    constructor(public ids: UUID[]) {
        super('Required months');
    }
}
