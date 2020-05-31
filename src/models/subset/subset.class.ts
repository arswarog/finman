import { ISubset } from './subset.types';
import { UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { IMonthBrief } from '../month/month.types';
import { v1 } from 'uuid';
import { Month } from '../month/month.class';

export class Subset implements ISubset {
    public id: UUID = '';
    public name: string = '';
    public balance: Money = Money.empty;
    public months: IMonthBrief[] = [];
    public loaded = false;

    private constructor(subset: Partial<Subset>) {
        Object.assign(this, subset);

        const month = Month.createFirstBlock('123', '2020-10', 123151213235);
    }

    public static create(name: string): Subset {
        const id = v1();
        return new Subset({
            id,
            name,
        });
    }

    public static fromJSON(data: ISubset): Subset {
        return new Subset({
            id: data.id,
            name: data.name,
            balance: Money.from(data.balance),
        });
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            balance: this.balance.toJSON(),
        };
    }
}
