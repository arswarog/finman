import { RouteProps } from 'react-router';
import { accountsRoutes } from './accounts';
import { transactionRoutes } from './transactions';
import { paths } from './index';
import { LicensesPage } from '../pages/LicensesPage';

export const routes: RouteProps[] = [
    // {
    //     path: '/finman/',
    //     exact: true,
    //     component: SubsetsPage,
    // },
    ...accountsRoutes,
    ...transactionRoutes,
    {
        path: paths.licenses(),
        component: LicensesPage,
    },
];
