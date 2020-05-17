import { UUID } from './common.types';
import { Money } from './money.class';
import { IMonthBrief } from './month.types';

export interface IWallet {
    id: UUID;
    name: string;
    balance: Money;
    months: IMonthBrief[];
}

export class Wallet implements IWallet {
    public id: UUID = '';
    public name: string = '';
    public balance: Money = Money.empty;
    public months: IMonthBrief[] = [];

    constructor(wallet: IWallet) {}
}
