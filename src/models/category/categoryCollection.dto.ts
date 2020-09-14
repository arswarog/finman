import { UUID } from '../common/common.types';
import { DefaultTransactionType } from './category.types';

export interface ICategoryDTO {
    id: UUID;
    name: string;
    defaultTxType: DefaultTransactionType;
    icon: string;
    parent: UUID | null;
    isInitial?: boolean;
}

export interface ICategoryCollectionDTO {
    list: ICategoryDTO[];
    dataHash: string;
}
