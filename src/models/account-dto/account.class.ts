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
import { MonthLegacy } from '../month/month-legacy.class';

/**
 * Contains information about Account
 */
@PackableClass(data => new AccountDTO(data))
export class AccountDTO implements IAccount, ISummary {
    @Packable(String) public readonly id: UUID = '';
    @Packable(String) public readonly name: string = '';
    @Packable(Money) public readonly balance: Money = Money.empty;
    @Packable(Money) public readonly income: Money = Money.empty;
    @Packable(Money) public readonly expense: Money = Money.empty;
    @Packable(String) public readonly categoriesBlockId: string = 'default';
    @Packable(monthBriefPacker) public readonly head: IMonthBrief | null = null;
    @Packable([monthBriefPacker]) public readonly months: ReadonlyArray<Readonly<IMonthBrief>> = [];
    public readonly fullMonths: Map<UUID, MonthLegacy> = Map();

    public static create(name: string, id?: UUID): AccountDTO {
        return new AccountDTO({
            id: id || uuidGenerator(),
            name,
        });
    }

    public static fromJSON(data: any): AccountDTO {
        return Packer.get(AccountDTO).decode(data);
    }

    public static toJSON(account: AccountDTO): any {
        return account.toJSON();
    }

    private constructor(account: Partial<AccountDTO>) {
        return Object.assign(this, account);
    }

    public toJSON(): any {
        return Packer.get(AccountDTO).encode(this);
    }

    public UNSAFE_forceSetHead(head: MonthLegacy, months: MonthLegacy[]): AccountDTO {
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

        return new AccountDTO({
            ...this,
            head,
            months: chain.map(MonthLegacy.getBrief),
            balance,
            income,
            expense,
        });
        // throw new Error('Not implements');
        // throw new RequiredMonthsError(['123123123']);
    }

    public updateHead(head: MonthLegacy, additions: MonthLegacy[] = []): AccountDTO {
        const chain = updateMonthChain(head, additions, this.months);

        const {income, expense, balance} = chain.reduce((acc, item) => addSummary(acc, item.summary), EMPTY_SUMMARY);

        return new AccountDTO({
            ...this,
            head: MonthLegacy.getBrief(head),
            months: chain.map(MonthLegacy.getBrief),
            balance,
            income,
            expense,
        });
    }

    public UNSAFE_updateCategoriesBlock(block: CategoriesBlock): AccountDTO { // FIXME
        if (block.account !== this.id)
            throw new Error('CategoriesBlock.id must be equal to AccountDTO.id');

        return new AccountDTO({
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

