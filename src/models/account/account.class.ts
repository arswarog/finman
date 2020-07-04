import { ISummary, UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { IMonthBrief } from '../month/month.types';
import { IAccount } from './account.types';
import { v1 as uuidGenerator } from 'uuid';
import { Month } from '../month/month.class';
import { Map } from 'immutable';
import { findChain, RequiredMonthsError, updateMonthChain } from './chain.utils';
import { addSummary, EMPTY_SUMMARY } from '../transaction/transactions.utils';
import { MonthBrief } from '../month/month.brief';

/**
 * Contains information about Account
 */
export class Account implements IAccount, ISummary {
    public readonly id: UUID = '';
    public readonly name: string = '';
    public readonly balance: Money = Money.empty;
    public readonly income: Money = Money.empty;
    public readonly expense: Money = Money.empty;
    public readonly head: IMonthBrief | null = null;
    public readonly months: ReadonlyArray<Readonly<IMonthBrief>> = [];
    public readonly fullMonths: Map<UUID, Month> = Map();

    public static create(name: string, id?: UUID): Account {
        return new Account({
            id: id || uuidGenerator(),
            name,
        });
    }

    public static fromJSON(data: any): Account {
        return new Account({
            id: data.id,
            name: data.name,
            balance: Money.fromJSON(data.balance),
            income: Money.fromJSON(data.income),
            expense: Money.fromJSON(data.expense),
            months: data.months.map(MonthBrief.fromJSON),
            head: data.head ? MonthBrief.fromJSON(data.head) : null,
        });
    }

    private constructor(account: Partial<Account>) {
        return Object.assign(this, account);
    }

    public toJSON(): any {
        return {
            id: this.id,
            name: this.name,
            balance: this.balance.toJSON(),
            income: this.income.toJSON(),
            expense: this.expense.toJSON(),
            months: this.months.map(MonthBrief.toJSON),
            head: this.head ? MonthBrief.toJSON(this.head) : null,
        };
    }

    public forceSetHead_unsafe(head: Month, months: Month[]): Account {
        const {chain, completed} = findChain(head, months);

        if (!completed) {
            const last = chain.pop();
            const required = [
                ...last!.prevMonths,
                ...last!.prevVersions,
            ].filter(
                id => !months.find(item => item.id !== id),
            );

            throw new RequiredMonthsError(...required);
        }

        const {income, expense, balance} = chain.reduce((acc, item) => addSummary(acc, item.summary), EMPTY_SUMMARY);

        return new Account({
            ...this,
            head,
            months: chain.map(Month.getBrief),
            balance,
            income,
            expense,
        });
        // throw new Error('Not implements');
        // throw new RequiredMonthsError(['123123123']);
    }

    public updateHead(head: Month, additions: Month[] = []): Account {
        const chain = updateMonthChain(head, additions, this.months);

        const {income, expense, balance} = chain.reduce((acc, item) => addSummary(acc, item.summary), EMPTY_SUMMARY);

        return new Account({
            ...this,
            head: Month.getBrief(head),
            months: chain.map(Month.getBrief),
            balance,
            income,
            expense,
        });
    }

    public checkChain(): boolean {
        if (!this.head && this.months.length === 0)
            return true;

        const {chain, completed} = findChain(this.head!, this.months);

        if (!completed)
            return false;

        if (chain.length !== this.months.length)
            return false;

        return true;
    }
}

