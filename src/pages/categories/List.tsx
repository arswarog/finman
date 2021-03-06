import React from 'react';
import { Header } from '../../components/Header';
import { Main } from '../../ui-kit/Main';
import { Link, paths } from '../../routes';
import { CategoryIcon } from '../../components/CategoryIcon';
import { useCategories, useCurrentAccount } from '../../hooks';
import { Icon, Icons } from '../../ui-kit/Icon';
import { categoriesMapToList } from '../../sagas/utils/categories';

export const CategoriesListPage = () => {
    const account = useCurrentAccount();
    const categoriesMap = useCategories(account?.id);

    const categories = categoriesMapToList(categoriesMap);

    if (!account)
        return (
            <>
                <Header title="Categories" back>
                    <Link to="/">
                        <Icon icon={Icons.addOutline}/>
                    </Link>
                </Header>
                <Main>
                    Loading
                </Main>
            </>
        );

    return (
        <>
            <Header title="Categories" back>
                <Link to={paths.categories.create(account.id, '')}>
                    <Icon icon={Icons.addOutline}/>
                </Link>
            </Header>
            <Main>
                <ul className="listview image-listview inset mt-2">
                    {categories.map(category => (
                        <li key={category.id}>
                            <Link to={paths.categories.view(account.id, category.id)} className="item">
                                <div className="icon-box">
                                    <CategoryIcon category={category}/>
                                </div>
                                <div className="in">
                                    <div>
                                        {category.name}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Main>
        </>
    );
};
