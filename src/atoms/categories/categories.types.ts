import { Map } from 'immutable';
import { Category, RootCategory } from '../../models/category/category.class';
import { UUID } from '../../models/common/common.types';

export type ICategoriesState = Map<UUID, ICategoriesForAccount>

export interface ICategoriesForAccount {
    tree: RootCategory[];
    list: Category[];
    map: Map<UUID, Category>;
}
