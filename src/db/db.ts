import { IndexedDB } from '../libs/indexed-db';
import { PayloadActionCreator, Store } from '@reatom/core';
import { AccountScheme, MonthScheme } from './schemes';
import { AccountDTO } from '../models/account-dto/account.class';
import { CategoriesBlock } from '../models/category/categoryBlock.class';
import { initialCategories } from './data/initialCategories';
import { CategoriesScheme } from './schemes/categories.scheme';

export const db = new IndexedDB(
    'finman',
    [
        CategoriesScheme,
        AccountScheme,
        MonthScheme,
    ],
    async (db) => {
        let defaultAccount = AccountDTO.create('Default');
        const categoriesBlock = CategoriesBlock.createInitialBlock(
            defaultAccount.id,
            initialCategories,
            new Date().getTime(),
        );
        defaultAccount = defaultAccount.UNSAFE_updateCategoriesBlock(categoriesBlock);

        await db.transaction(AccountScheme).add(defaultAccount.toJSON());
        await db.transaction(CategoriesScheme).add(categoriesBlock.toJSON());
    },
);

const handlers: { [action: string]: Function } = {};

export function addActionHandler<T>(action: PayloadActionCreator<T>, handler: (payload: T, store: Store) => void) {
    if (handlers[action.getType()])
        throw new Error(`Can not add new handler for action "${action.getType()}"`);

    handlers[action.getType()] = handler;
}

export function initIndexedDB(store: Store) {
    store.subscribe(action => {
        console.log(action);

        if (handlers[action.type])
            handlers[action.type](action.payload, store);
    });
}
