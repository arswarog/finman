import { RouteProps } from 'react-router';
import { TransactionAddPage } from '../pages/TransactionAddPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { addQueryString, baseUrl } from './config';
import { UUID } from '../models/common/common.types';

export const transactions = {
    add: (params?: {
        account?: UUID;
    }) => `${baseUrl}/transaction/add` + addQueryString(params),
    list: () => `${baseUrl}/transactions`,
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
