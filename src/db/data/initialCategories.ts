import { IInitialCategoryTree } from '../../models/category/category.types';
import { TransactionType } from '../../models/transaction/transaction.types';

export const initialCategories: IInitialCategoryTree = [
    {
        id: 'default',
        name: 'Default',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [],
    },
    {
        id: '0000-111',
        name: 'Home',
        image: 'default',
        defaultType: TransactionType.Income,
        children: [],
    },
];
