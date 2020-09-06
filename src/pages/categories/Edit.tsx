import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Main } from '../../ui-kit/Main';
import { Link, paths } from '../../routes';
import { useCategories, useCurrentAccount } from '../../hooks';
import { Icon, Icons } from '../../ui-kit/Icon';
import { UUID } from '../../models/common/common.types';
import { useHistory, useRouteMatch } from 'react-router';
import { Section } from '../../ui-kit/Section';
import { Card } from '../../ui-kit/Card';
import { CategoryForm } from './Form';
import { store } from '../../store';
import { ICategoryForm } from '../../models/category/category.types';
import { ErrorPage } from '../ErrorPage';
import { addCategory, updateCategory } from '../../atoms/categories/categories.actions';
import { TransactionType } from '../../models/transaction/transaction.types';

interface IParams {
    accountId?: UUID;
    categoryId: UUID;
}

export const CategoriesEditPage = () => {
    const {categoryId} = useRouteMatch<IParams>().params;
    const history = useHistory();

    const account = useCurrentAccount();
    const categoriesMap = useCategories(account?.id);
    const categories = Array.from(categoriesMap.values());

    const category = categoriesMap.get(categoryId);

    const [data, setData] = useState({
        id: categoryId,
        accountId: account?.id,
        name: category?.name,
        image: category?.image || 'default',
        parent: category?.parent,
        defaultTxType: category?.defaultTxType || TransactionType.Expense,
    } as ICategoryForm);

    const submitHandler = (data: ICategoryForm) => {
        console.log(data);
        setData(data);
        store.dispatch(updateCategory(data));
        history.goBack();
    };

    function validate(data: ICategoryForm) {
        const errors: Partial<{ [key in keyof ICategoryForm]: string }> = {};
        // if (!data.account)
        //     errors.account = 'Required';
        return errors;
    }

    if (!categoriesMap.has(categoryId))
        return (
            <ErrorPage title="Category">
                Category not found
            </ErrorPage>
        );

    return (
        <>
            <Header title="Edit category" back>
                <Link to={paths.categories.edit(account.id, categoryId)}>
                    <Icon icon={Icons.saveOutline}/>
                </Link>
            </Header>
            <Main>
                <Section full>
                    <Card>
                        <CategoryForm value={data}
                                      onSubmit={submitHandler}
                                      validate={validate}
                                      categories={categories}
                        />
                    </Card>
                </Section>
            </Main>
        </>
    );
};
