import { declareAtom } from '@reatom/core';
import { ICategoriesState } from './categories.types';
import { loadCategoriesSuccess, saveCategories } from './categories.actions';
import { Map } from 'immutable';
import { RootCategory } from '../../models/category/category.class';

export const Categories = declareAtom<ICategoriesState>(
    ['categories'],
    Map(),
    on => ({
        load: [
            on(loadCategoriesSuccess, (collection, block) => {
                const tree = block.list
                                  .filter(category => !category.parent)
                                  .map(category => new RootCategory(category, block.list));

                const list = tree.flatMap(parent => [parent, ...parent.children]);

                const map = Map(list.map(category => [category.id, category]));

                collection = collection.set(block.id, {block, tree, list, map}); // FIXME need create CategoriesBlocksAtom
                return collection.set(block.account, {block, tree, list, map});
            }),
        ],
        save: [
            on(saveCategories, (collection, block) => {
                const tree = block.list
                                  .filter(category => !category.parent)
                                  .map(category => new RootCategory(category, block.list));

                const list = tree.flatMap(parent => [parent, ...parent.children]);

                const map = Map(list.map(category => [category.id, category]));

                collection = collection.set(block.id, {block, tree, list, map}); // FIXME need create CategoriesBlocksAtom
                return collection.set(block.account, {block, tree, list, map});
            }),
        ],
    }),
);
