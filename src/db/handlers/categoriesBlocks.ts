import { addActionHandler, db } from '../db';
import { loadCategories, loadCategoriesFailed, loadCategoriesSuccess } from '../../atoms/categories/categories.actions';
import { CategoriesScheme } from '../schemes/categories.scheme';
import { CategoriesBlock } from '../../models/category/categoryBlock.class';

addActionHandler(loadCategories, (id, store) => {
    db.transaction(CategoriesScheme)
      .get(id).then(
        result => store.dispatch(loadCategoriesSuccess(CategoriesBlock.fromJSON(result))),
        error => store.dispatch(loadCategoriesFailed(error)),
    );
});
