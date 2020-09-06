import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Main } from '../../ui-kit/Main';
import { Link, paths } from '../../routes';
import { useCategories, useCurrentAccount } from '../../hooks';
import { Icon, Icons } from '../../ui-kit/Icon';
import { UUID } from '../../models/common/common.types';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router';
import { Section } from '../../ui-kit/Section';
import { Card } from '../../ui-kit/Card';
import { CategoryForm } from './Form';
import { store } from '../../store';
import { ICategoryForm } from '../../models/category/category.types';
import { ErrorPage } from '../ErrorPage';
import { addCategory, updateCategory } from '../../atoms/categories/categories.actions';
import { TransactionType } from '../../models/transaction/transaction.types';
import { parseQueryString } from '../../routes/helper';
import { useQueryParams } from '../../hooks/router';

interface IQueryParams {
    parent?: string;
}

interface IParams {
    accountId?: UUID;
    categoryId: UUID;
}

export const CategoriesCreatePage = () => {
    const history = useHistory();
    const query = useQueryParams<IQueryParams>();

    const account = useCurrentAccount();
    const categoriesMap = useCategories(account?.id);
    const categories = Array.from(categoriesMap.values());

    const [data, setData] = useState({
        accountId: account?.id,
        name: '',
        image: 'default',
        parent: query.parent || null,
        defaultTxType: TransactionType.Expense,
    } as ICategoryForm);

    const save = (dataToSave: ICategoryForm) => {
        store.dispatch(addCategory({
            ...dataToSave,
            accountId: account.id,
        }));
        history.goBack();
    };

    const submitHandler = (formData: ICategoryForm) => {
        setData(formData);
        save(formData);
    };

    const saveHandler = () => save(data);

    function validate(data: ICategoryForm) {
        const errors: Partial<{ [key in keyof ICategoryForm]: string }> = {};
        // if (!data.name) // TODO
        //     errors.name = 'Required';
        // if (!data.accountId)
        //     errors.accountId = 'Required';
        return errors;
    }

    if (!account)
        return (
            <ErrorPage title="Category">
                Loading...
            </ErrorPage>
        );

    return (
        <>
            <Header title="Create category" back={2}>
                <a onClick={saveHandler}>
                    <Icon icon={Icons.saveOutline}/>
                </a>
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
