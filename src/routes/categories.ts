import { RouteProps } from 'react-router';
import { baseUrl } from './config';
import { CategoriesListPage } from '../pages/categories/List';
import { CategoriesViewPage } from '../pages/categories/View';
import { CategoriesEditPage } from '../pages/categories/Edit';
import { addQueryString } from './helper';
import { CategoriesCreatePage } from '../pages/categories/Create';

export const categories = {
    list: (accountId = ':accountId') => `${baseUrl}/categories`,
    view: (accountId = ':accountId', categoryId = ':categoryId') => `${baseUrl}/categories/${categoryId}`,
    edit: (accountId = ':accountId', categoryId = ':categoryId') => `${baseUrl}/categories/${categoryId}/edit`,
    create: (accountId = ':accountId', parent?: string) => `${baseUrl}/categories/create` + addQueryString({parent}),
};

export const categoriesRoutes: RouteProps[] = [
    {
        path: categories.list(),
        exact: true,
        component: CategoriesListPage,
    },
    {
        path: categories.edit(),
        exact: true,
        component: CategoriesEditPage,
    },
    {
        path: categories.create(),
        exact: true,
        component: CategoriesCreatePage,
    },
    {
        path: categories.view(),
        exact: true,
        component: CategoriesViewPage,
    },
];
