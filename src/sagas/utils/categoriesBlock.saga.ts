import { put, take } from 'redux-saga/effects';
import { Action } from '@reatom/core';
import { SagaUtils } from '../helpers/helpers';
import { SagaPacker } from '../saga-launcher';
import { UUID } from '../../models/common/common.types';
import { CategoriesBlock } from '../../models/category/categoryBlock.class';
import { Categories } from '../../atoms/categories/categories.atom';
import { ICategoriesState } from '../../atoms/categories/categories.types';
import {
    loadCategories,
    loadCategoriesFailed,
    loadCategoriesSuccess,
    saveCategories, saveCategoriesFailed, saveCategoriesSuccess,
} from '../../atoms/categories/categories.actions';

export const CategoriesBlockUtils = {
    /**
     * Get or load CategoriesBlock
     */
    get: SagaPacker.call(getCategoriesBlockSaga),
    /**
     * Save CategoriesBlock
     */
    save: SagaPacker.call(saveCategoriesBlockSaga),
};

function* getCategoriesBlockSaga(id: UUID): Generator<any, CategoriesBlock, any> {
    const categoriesBlocks: ICategoriesState = yield SagaUtils.selectAtom(Categories);

    if (categoriesBlocks.has(id))
        return categoriesBlocks.get(id)?.block;

    yield put(loadCategories(id));
    let action: Action<any>;
    do {
        action = yield take([loadCategoriesSuccess.getType(), loadCategoriesFailed.getType()]);
        if (action.type === loadCategoriesSuccess.getType()) {
            if (action.payload.id === id) {
                const categories = yield SagaUtils.selectAtom(Categories);
                return categories.get(id);
            }
        } else {
            if (action.payload.id === id)
                throw action.payload.error;
        }
    } while (true);
}

function* saveCategoriesBlockSaga(categoriesBlock: CategoriesBlock): Generator<any, CategoriesBlock, any> {
    const categoriesBlocks: ICategoriesState = yield SagaUtils.selectAtom(Categories);

    const id = categoriesBlock.id;
    yield put(saveCategories(categoriesBlock));
    let action: Action<any>;
    do {
        action = yield take([saveCategoriesSuccess.getType(), saveCategoriesFailed.getType()]);
        if (action.type === saveCategoriesSuccess.getType()) {
            if (action.payload === id) {
                return categoriesBlock;
            }
        } else {
            if (action.payload.id === id)
                throw action.payload.error;
        }
    } while (true);
}
