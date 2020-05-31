import { Money } from '../money/money.class';

export type UUID = string;
export type HASH = string;

export interface ISummary {
    balance: Money;
    income: Money;
    expense: Money;
}

export interface IExtendSummary extends ISummary {
    balanceOnStart: Money;
    balanceOnEnd: Money;
}

export const EmptySummary: ISummary = {
    balance: Money.empty,
    income: Money.empty,
    expense: Money.empty,
};

export const EmptyExtendSummary: IExtendSummary = {
    ...EmptySummary,
    balanceOnStart: Money.empty,
    balanceOnEnd: Money.empty,
};

Object.freeze(EmptySummary);
Object.freeze(EmptyExtendSummary);
