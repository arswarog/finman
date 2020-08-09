import { RouteProps } from 'react-router';
import { AccountsPage } from '../pages/AccountsPage';
import { AccountMonthsPage } from '../pages/AccountMonthsPage';
import { baseUrl } from './config';
import { MonthDate } from '../models/common/date.types';

export const account = {
    list: () => `${baseUrl}/accounts`,
    view: (account = ':account') => `${baseUrl}/accounts/${account}`,
    monthsList: (account = ':account') => `${baseUrl}/accounts/${account}/months`,
    month: (account = ':account', month: MonthDate = ':month') => `${baseUrl}/accounts/${account}/months/${month}`,
};

export const accountsRoutes: RouteProps[] = [
    {
        path: account.list(),
        exact: true,
        component: AccountsPage,
    },
    {
        path: account.view(),
        exact: true,
        component: AccountsPage,
    },
    {
        path: account.month(),
        component: AccountMonthsPage,
    },
    {
        path: account.monthsList(),
        component: AccountMonthsPage,
    },
];
