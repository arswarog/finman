import { ITransactionDTO } from '../transaction/transaction.dto';
import { DayDate } from '../common/date.types';

export interface IDayDTO {
    day: DayDate;
    transactions: ITransactionDTO[];
}
