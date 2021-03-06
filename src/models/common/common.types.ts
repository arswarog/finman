import { Money } from '../money/money.class';
import { Packer } from '../../libs/packable/packable';

export type UUID = string;
export type HASH = string;

export enum SyncStatus {
    NoSynced,
    Prepared,
    Syncing,
    FullySynced,
    Fixed,
}

export interface ISummary {
    balance: Money;
    income: Money;
    expense: Money;
}

export const summaryPacker = Packer.forObject<ISummary>({
    balance: Money,
    income: Money,
    expense: Money,
});

export interface IPeriodSummary extends ISummary {
    balanceOnStart: Money;
    balanceOnEnd: Money;
}

export const extendSummaryPacker = Packer.forObject<IPeriodSummary>({
    balance: Money,
    income: Money,
    expense: Money,
    balanceOnStart: Money,
    balanceOnEnd: Money,
});

export const EmptySummary: ISummary = {
    balance: Money.empty,
    income: Money.empty,
    expense: Money.empty,
};

export const EmptyExtendSummary: IPeriodSummary = {
    ...EmptySummary,
    balanceOnStart: Money.empty,
    balanceOnEnd: Money.empty,
};

Object.freeze(EmptySummary);
Object.freeze(EmptyExtendSummary);

export interface IExtendSummary extends ISummary {
    statsByCategories: Map<UUID, ISummary>;
    statsByTags: Map<UUID, ISummary>;
}
