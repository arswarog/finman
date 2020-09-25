import { format } from 'date-fns';
import { ITransactionGrip } from '../models/abstract-grip/grip.types';

export interface IDisplayedTransaction extends ITransactionGrip {
    first: string;
    second: string;
    dateString: string;
}

export function makeTxList(list: ITransactionGrip[], reverse = false): IDisplayedTransaction[] {
    const result = list.map(item => {
        return {
            ...item,
            first: item.category.name,
            second: item.title,
            dateString: item.date
                ? format(new Date(item.date), 'PP')
                : '',
        };
    });
    if (reverse)
        result.reverse();
    return result;
}
