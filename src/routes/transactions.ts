import { RouteProps } from 'react-router';
import { TransactionAddPage } from '../pages/TransactionAddPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { addQueryString, baseUrl } from './config';
import { UUID } from '../models/common/common.types';
import { IAddTransactionForm } from '../models/transaction/transaction.types';
import { TransactionViewPage } from '../pages/TransactionViewPage';
import { DayDate, MonthDate } from '../models/common/date.types';

export const transactions = {
    list: () => `${baseUrl}/transactions`,
    add: (params?: Partial<IAddTransactionForm>) => `${baseUrl}/transaction/add` + addQueryString(params),
    view: (accountId: UUID = ':accountId',
           date: DayDate = ':date',
           txId: UUID = ':txId') => `${baseUrl}/accounts/${accountId}/day/${date}/${txId}`,
};

export const transactionRoutes: RouteProps[] = [
    {
        path: transactions.add(),
        component: TransactionAddPage,
    },
    {
        path: transactions.view(),
        component: TransactionViewPage,
    },
    {
        path: transactions.list(),
        component: TransactionsPage,
    },
];
