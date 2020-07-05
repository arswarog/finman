import { RouteProps } from 'react-router';
import { AccountsPage } from '../pages/AccountsPage';
import { AccountMonthsPage } from '../pages/AccountMonthsPage';
import { baseUrl } from './config';

export const account = {
    list: () => `${baseUrl}/accounts`,
    view: (account = ':account') => `${baseUrl}/account/${account}`,
    monthsList: (account = ':account') => `${baseUrl}/account/${account}/months`,
    months: (account = ':account', month = ':month') => `${baseUrl}/account/${account}/months/${month}`,
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
        path: account.months(),
        component: AccountMonthsPage,
    },
    {
        path: account.monthsList(),
        component: AccountMonthsPage,
    },
];
