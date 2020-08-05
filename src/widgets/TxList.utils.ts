import { ITransaction, TransactionType } from '../models/transaction/transaction.types';
import { format } from 'date-fns';
import { Money } from '../models/money/money.class';
import { DayDate } from '../models/common/date.types';
import { ITransactionGrip } from '../models/abstract-grip/grip.types';

export interface IDisplayedTransaction extends ITransactionGrip {
    first: string;
    second: string;
    dateString: string;
}

export function makeTxList(list: ITransactionGrip[]): IDisplayedTransaction[] {
    return list.map(item => {
        return {
            ...item,
            first: item.category.name,
            second: item.title,
            dateString: item.date
                ? format(new Date(item.date), 'PP')
                : '',
        };
    });
}
