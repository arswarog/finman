import { ICategory, IInitialCategoryTree } from './category.types';
import { Category } from './category.class';

export function initialCategoriesToCategoryList(initial: IInitialCategoryTree): Category[] {
    return initial.flatMap(
        parent => [
            Category.createInitial(
                parent.name,
                parent.defaultType,
                null,
                parent.image,
                parent.id,
            ),
            ...parent.children.map(
                child => Category.createInitial(
                    child.name,
                    child.defaultType,
                    parent.id,
                    child.image,
                    child.id,
                ),
            ),
        ],
    );
}

export function checkUniqueCategoryList(list: ICategory[]): void {
    const ids = new Set();
    const name = new Set();
    for (const item of list) {
        if (ids.has(item.id))
            throw new Error(`Category "${item.id}" not unique`);
        ids.add(item.id);
    }
}

export function printCategoryTree(tree: IInitialCategoryTree) {
    console.log('Initial category tree');
    tree.map(parent => {
        console.log('+', parent.name);
        parent.children.forEach(item => console.log(' ', '-', item.name));
    });
}
