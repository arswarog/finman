import { UUID } from '../../models/common/common.types';
import { declareAction } from '@reatom/core';
import { CategoriesBlock } from '../../models/category/categoryBlock.class';
import { ICategoryForm } from '../../models/category/category.types';

const NS = 'categories';

export const loadCategories = declareAction<UUID>(NS + ':loadCategories');
export const loadCategoriesSuccess = declareAction<CategoriesBlock>(NS + ':loadCategories success');
export const loadCategoriesFailed = declareAction<{ ids: UUID, error: any }>(NS + ':loadCategories failed');

export const saveCategories = declareAction<CategoriesBlock>(NS + ':saveCategories');
export const saveCategoriesSuccess = declareAction<UUID>(NS + ':saveCategories success');
export const saveCategoriesFailed = declareAction<{ ids: UUID, error: any }>(NS + ':saveCategories failed');

export const addCategory = declareAction<ICategoryForm>(NS + ':addCategory');
export const updateCategory = declareAction<ICategoryForm>(NS + ':updateCategory');
export const removeCategory = declareAction<UUID>(NS + ':removeCategory');
