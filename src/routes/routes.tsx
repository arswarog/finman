import { RouteProps } from 'react-router';
import { accountsRoutes } from './accounts';
import { transactionRoutes } from './transactions';
import { paths } from './index';
import { LicensesPage } from '../pages/LicensesPage';
import { MainMenu } from '../pages/MainMenu';
import { categoriesRoutes } from './categories';

export const routes: RouteProps[] = [
    // {
    //     path: '/finman/',
    //     exact: true,
    //     component: SubsetsPage,
    // },
    ...accountsRoutes,
    ...transactionRoutes,
    ...categoriesRoutes,
    {
        path: paths.menu(),
        component: MainMenu,
    },
    {
        path: paths.licenses(),
        component: LicensesPage,
    },
];
