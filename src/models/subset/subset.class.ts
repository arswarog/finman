import { ISubset } from './subset.types';
import { IExtendSummary, ISummary, UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { v1 } from 'uuid';
import { ISubsetDTO, ISubsetMeta } from './subset.dto';

export class Subset implements ISummary, IExtendSummary {
    balance: Money;
    expense: Money;
    income: Money;

    statsByCategories: Map<string, ISummary>;
    statsByTags: Map<string, ISummary>;

    getMeta(): ISubsetMeta {
        return null;
    };

    toDTO(): ISubsetDTO {
        return null;
    };

    static fromDTO(data: ISubsetDTO): Subset {
        return null;
    };
}
