import { Map } from 'immutable';
import { Category, RootCategory } from '../../models/category/category.class';
import { UUID } from '../../models/common/common.types';
import { CategoriesBlock } from '../../models/category/categoryBlock.class';

export type ICategoriesState = Map<UUID, ICategoriesForAccount>

export interface ICategoriesForAccount {
    block: CategoriesBlock;
    tree: RootCategory[];
    list: Category[];
    map: Map<UUID, Category>;
}
