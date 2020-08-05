import { put, take } from 'redux-saga/effects';
import { Action } from '@reatom/core';
import { MonthDate } from '../../models/common/date.types';
import { Account } from '../../models/account/account.class';
import { Month } from '../../models/month/month.class';
import { getTimestamp, SagaUtils, selectAtom } from '../helpers/helpers';
import { SagaPacker } from '../saga-launcher';
import {
    saveMonths,
    saveMonthsSuccess,
    saveMonthsFailed,
    loadMonths,
    loadMonthsSuccess,
    loadMonthsFailed,
} from '../../atoms/months/months.actions';
import { UUID } from '../../models/common/common.types';
import { Months } from '../../atoms/months/months.atom';
import { CategoriesBlock } from '../../models/category/categoryBlock.class';
import { Categories } from '../../atoms/categories/categories.atom';
import { ICategoriesState } from '../../atoms/categories/categories.types';
import { loadCategories, loadCategoriesFailed, loadCategoriesSuccess } from '../../atoms/categories/categories.actions';

export const CategoriesBlockUtils = {
    /**
     * Get or load CategoriesBlock
     */
    get: SagaPacker.call(getCategoriesBlockSaga),
};

function* getCategoriesBlockSaga(id: UUID): Generator<any, CategoriesBlock, any> {
    const categoriesBlocks: ICategoriesState = yield selectAtom(Categories);

    if (categoriesBlocks.has(id))
        return categoriesBlocks.get(id)?.block;

    yield put(loadCategories(id));
    let action: Action<any>;
    do {
        action = yield take([loadCategoriesSuccess.getType(), loadCategoriesFailed.getType()]);
        if (action.type === loadCategoriesSuccess.getType()) {
            if (action.payload.id === id) {
                const categories = yield selectAtom(Categories);
                return categories.get(id);
            }
        } else {
            if (action.payload.id === id)
                throw action.payload.error;
        }
    } while (true);
}
