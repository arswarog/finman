import { RouteProps } from 'react-router';
import { TransactionAddPage } from '../pages/transaction/AddPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { addQueryString, baseUrl } from './config';
import { UUID } from '../models/common/common.types';
import { ITransactionForm } from '../models/transaction/transaction.types';
import { TransactionViewPage } from '../pages/transaction/ViewPage';
import { DayDate, MonthDate } from '../models/common/date.types';
import { TransactionUpdatePage } from '../pages/transaction/UpdatePage';

export const transactions = {
    list: () => `${baseUrl}/transactions`,
    add: (params?: Partial<ITransactionForm>) => `${baseUrl}/transaction/add` + addQueryString(params),
    view: (accountId: UUID = ':accountId',
           date: DayDate = ':date',
           txId: UUID = ':txId') => `${baseUrl}/accounts/${accountId}/day/${date}/${txId}`,
    update: (accountId: UUID = ':accountId',
             date: DayDate = ':date',
             txId: UUID = ':txId') => `${baseUrl}/accounts/${accountId}/day/${date}/${txId}/update`,
};

export const transactionRoutes: RouteProps[] = [
    {
        path: transactions.add(),
        component: TransactionAddPage,
    },
    {
        path: transactions.update(),
        component: TransactionUpdatePage,
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
