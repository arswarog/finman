import { ITransaction } from '../finances/transaction.types';
import { format } from 'date-fns';
import { Money } from '../finances/money.class';

export interface IDisplayedTransaction {
    first: string;
    second: string;
    amount: Money;
    date: string;
}

export function makeTxList(list: ITransaction[]): IDisplayedTransaction[] {
    return list.map(item => {
        return {
            first: Math.random().toString(36).substr(2),
            second:  Math.random().toString(36).substr(2),
            amount: new Money(Math.floor(Math.random() * 100000) / 100 + ' RUB'),
            date: format(new Date().getTime() - Math.floor(Math.random() * 100000000000), 'PP'),
        };
    });
}
