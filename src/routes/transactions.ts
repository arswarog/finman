import { RouteProps } from 'react-router';
import { TransactionAddPage } from '../pages/TransactionAddPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { addQueryString, baseUrl } from './config';
import { UUID } from '../models/common/common.types';
import { IAddTransactionForm } from '../models/transaction/transaction.types';

export const transactions = {
    list: () => `${baseUrl}/transactions`,
    add: (params?: Partial<IAddTransactionForm>) => `${baseUrl}/transaction/add` + addQueryString(params),
    view: (txId: UUID) => `${baseUrl}`,
};

export const transactionRoutes: RouteProps[] = [
    {
        path: transactions.add(),
        component: TransactionAddPage,
    },
    {
        path: transactions.list(),
        component: TransactionsPage,
    },
];
