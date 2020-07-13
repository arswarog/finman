import { IScheme } from '../../libs/indexed-db';
import { IMonth } from '../../models/month/month.types';
import { ICategoriesBlock } from '../../models/category/categoryBlock.types';
import { CategoriesBlock } from '../../models/category/categoryBlock.class';

export const CategoriesScheme: IScheme<ICategoriesBlock> = {
    collection: 'categories',
    dbVersion: 1,
    key: 'id',
    upgrade(objectStore, oldVersion, newVersion): void {
        console.log('update categories from ', oldVersion, newVersion);
    },
};
