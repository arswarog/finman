import { IScheme } from '../../libs/indexed-db';
import { ICategoriesBlock } from '../../models/category/categoryBlock.types';

export const CategoriesScheme: IScheme<ICategoriesBlock> = {
    collection: 'categories',
    dbVersion: 1,
    key: 'id',
    upgrade(objectStore, oldVersion, newVersion): void {
        console.log('update categories from ', oldVersion, newVersion);
    },
};
