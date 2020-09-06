import { sagaLauncher } from '../saga-launcher';
import { Action } from '@reatom/core';
import { AccountUtils } from '../utils/account.saga';
import { put } from 'redux-saga/effects';
import { updateAccountGrip } from '../../atoms/account-grips/account-grips.actions';
import { ICategoryForm } from '../../models/category/category.types';
import { CategoriesBlockUtils } from '../utils/categoriesBlock.saga';
import { Category } from '../../models/category/category.class';
import { addCategory, updateCategory } from '../../atoms/categories/categories.actions';

sagaLauncher.onAction(addCategory, addCategorySaga);
sagaLauncher.onAction(updateCategory, updateCategorySaga);

export function* addCategorySaga(action: Action<ICategoryForm>) {
    console.log('*** addCategorySaga started');
    const payload = action.payload;
    const account = yield* AccountUtils.select(payload.accountId);
    const categoriesBlock = yield* CategoriesBlockUtils.get(account.categoriesBlockId);

    const category = Category.create(payload.name,
        payload.defaultTxType,
        payload.parent,
        payload.image,
    );

    const newCategoriesBlock = categoriesBlock.addCategory(category);
    const newAccount = account.UNSAFE_updateCategoriesBlock(newCategoriesBlock);

    yield* CategoriesBlockUtils.save(newCategoriesBlock);
    yield* AccountUtils.save(newAccount);
    console.log('*** updateCategorySaga complete');
    yield put(updateAccountGrip(newAccount));
    return newCategoriesBlock;
}


export function* updateCategorySaga(action: Action<ICategoryForm>) {
    console.log('*** updateCategorySaga started');
    const payload = action.payload;
    const account = yield* AccountUtils.select(payload.accountId);
    const categoriesBlock = yield* CategoriesBlockUtils.get(account.categoriesBlockId);

    const foundCategory = categoriesBlock.get(payload.id!);

    if (!foundCategory)
        throw new Error(`Category ${payload.id} not found`);

    const category = foundCategory.isInitial
        ? foundCategory.setImage(payload.image)
                       .setDefaultTransactionType(payload.defaultTxType)
        : foundCategory.setName(payload.name)
                       .setImage(payload.image)
                       .setParent(payload.parent)
                       .setDefaultTransactionType(payload.defaultTxType);

    console.log('update', category);

    const newCategoriesBlock = categoriesBlock.updateCategory(category);
    const newAccount = account.UNSAFE_updateCategoriesBlock(newCategoriesBlock);

    yield* CategoriesBlockUtils.save(newCategoriesBlock);
    yield* AccountUtils.save(newAccount);
    console.log('*** updateCategorySaga complete');
    yield put(updateAccountGrip(newAccount));
    return newCategoriesBlock;
}
