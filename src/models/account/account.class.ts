import { ISummary, UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { IAccount } from './account.types';
import { v1 as uuidGenerator } from 'uuid';
import { Map } from 'immutable';
import { findChain, RequiredMonthsError, updateMonthChain } from './chain.utils';
import { addSummary, EMPTY_SUMMARY } from '../transaction/transactions.utils';
import { Packable, PackableClass } from '../../libs/packable/decorator';
import { Packer } from '../../libs/packable/packable';
import { CategoriesBlock } from '../category/categoryBlock.class';
import { IMonthBrief, monthBriefPacker } from '../month/month-legacy.types';
import { Month } from '../month/month-legacy.class';

/**
 * Contains information about Account
 */
@PackableClass(data => new Account(data))
export class Account implements IAccount, ISummary {
    @Packable(String) public readonly id: UUID = '';
    @Packable(String) public readonly name: string = '';
    @Packable(Money) public readonly balance: Money = Money.empty;
    @Packable(Money) public readonly income: Money = Money.empty;
    @Packable(Money) public readonly expense: Money = Money.empty;
    @Packable(String) public readonly categoriesBlockId: string = 'default';
    @Packable(monthBriefPacker) public readonly head: IMonthBrief | null = null;
    @Packable([monthBriefPacker]) public readonly months: ReadonlyArray<Readonly<IMonthBrief>> = [];
    public readonly fullMonths: Map<UUID, Month> = Map();

    public static create(name: string, id?: UUID): Account {
        return new Account({
            id: id || uuidGenerator(),
            name,
        });
    }

    public static fromJSON(data: any): Account {
        return Packer.get(Account).decode(data);
    }

    public static toJSON(account: Account): any {
        return account.toJSON();
    }

    private constructor(account: Partial<Account>) {
        return Object.assign(this, account);
    }

    public toJSON(): any {
        return Packer.get(Account).encode(this);
    }

    public UNSAFE_forceSetHead(head: Month, months: Month[]): Account {
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

    public UNSAFE_updateCategoriesBlock(block: CategoriesBlock): Account { // FIXME
        if (block.account !== this.id)
            throw new Error('CategoriesBlock.id must be equal to Account.id');

        return new Account({
            ...this,
            categoriesBlockId: block.id,
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

