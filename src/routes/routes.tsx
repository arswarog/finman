import { RouteProps } from 'react-router';
import { accountsRoutes } from './accounts';
import { transactionRoutes } from './transactions';

export const routes: RouteProps[] = [
    // {
    //     path: '/finman/',
    //     exact: true,
    //     component: SubsetsPage,
    // },
    ...accountsRoutes,
    ...transactionRoutes,
];
