import { ITransaction, TransactionType } from '../models/transaction/transaction.types';
import { format } from 'date-fns';
import { Money } from '../models/money/money.class';
import { DayDate } from '../models/common/date.types';

export interface IDisplayedTransaction {
    first: string;
    second: string;
    amount: Money;
    date: string;
}

export function makeTxList(list: ITransaction[], dayDate?: DayDate): IDisplayedTransaction[] {
    return list.map(item => {

        let amount: Money;

        switch (item.type) {
            case TransactionType.Income:
                amount = item.amount;
                break;
            case TransactionType.Expense:
                amount = item.amount.negative();
                break;
            default:
                throw new Error('Unprocessed TxType ' + TransactionType[item.type]);
        }

        return {
            first: item.category,
            second: item.title,
            amount,
            date: dayDate
                ? format(new Date(dayDate), 'PP')
                : '',
        };
    });
}
