import React from 'react';
import { Header } from '../../components/Header';
import { Main } from '../../ui-kit/Main';
import { Link, paths } from '../../routes';
import { CategoryIcon } from '../../components/CategoryIcon';
import { useAccount, useCategories, useCurrentAccount, useCurrentAccountId } from '../../hooks';
import { Icon, Icons } from '../../ui-kit/Icon';
import { UUID } from '../../models/common/common.types';
import { useRouteMatch } from 'react-router';
import { TransactionType } from '../../models/transaction/transaction.types';
import { useAction } from '@reatom/react';

interface IParams {
    accountId: UUID;
    categoryId: UUID;
}

export const CategoriesViewPage = () => {
    const {categoryId} = useRouteMatch<IParams>().params;
    const account = useCurrentAccount();
    const categoriesMap = useCategories(account?.id);

    const handleRemove = useAction(
        () => ({type: 'REMOVE CATEGORY', categoryId} as any),
        [categoryId],
    );

    const category = categoriesMap.get(categoryId);

    console.log(account, category);
    if (!account || !category)
        return (
            <>
                <Header title="Category" back/>
                <Main>
                    Loading
                </Main>
            </>
        );


    return (
        <>
            <Header title={`Category ${category.name}`} back>
                <Link to={paths.categories.edit(account.id, categoryId)}>
                    <Icon icon={Icons.settingsOutline}/>
                </Link>
            </Header>
            <Main>
                <div className="section mt-2 mb-2">
                    <div className="card inner" style={{padding: 16}}>
                        <div className="listed-detail mt-3">
                            <div className="icon-wrapper">
                                <div className="iconbox">
                                    <CategoryIcon category={category} size="large"/>
                                    {/*<Icon icon={Icons.arrowForwardOutline} role="img" className="md hydrated"/>*/}
                                </div>
                            </div>
                        </div>

                        <ul className="listview flush transparent simple-listview no-space mt-3">
                            <li>
                                <strong>Category name</strong>
                                <span>{category.name}</span>
                            </li>
                            <li>
                                <strong>Deposit</strong>
                                <span><Link to={paths.account.view(account.id)}>{account.name}</Link></span>
                            </li>
                            <li>
                                <strong>Default type</strong>
                                <span>{TransactionType[category.defaultTxType]}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Main>
        </>
    );
};
