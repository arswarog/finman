import styled from 'styled-components';
import { CategoryIcon } from '../components/CategoryIcon';
import React from 'react';
import { ICategory } from '../models/category/category.types';
import { TransactionType } from '../models/transaction/transaction.types';
import { Link, paths } from '../routes';
import { IAccount } from '../models/account/account.types';

const QuickCategoriesBox = styled.div`
  display: flex;
  margin-top: 16px;
  overflow-x: hidden;
  
  > * {
    margin: 0 6px;
    display: flex; // TODO fix it
  }
`;

interface IProps {
    account: IAccount;
}

export const QuickCategories = ({account}: IProps) => {
    const categories: ICategory[] = [
        {
            id: '0000-111',
            name: 'Home',
            image: 'essentials-01',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: 'default',
            name: 'Default',
            image: '',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: '0000-111',
            name: 'Home',
            image: 'essentials-01',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: 'default',
            name: 'Default',
            image: '',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: '0000-111',
            name: 'Home',
            image: 'essentials-01',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: 'default',
            name: 'Default',
            image: '',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: '0000-111',
            name: 'Home',
            image: 'essentials-01',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: 'default',
            name: 'Default',
            image: '',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: '0000-111',
            name: 'Home',
            image: 'essentials-01',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
        {
            id: 'default',
            name: 'Default',
            image: '',
            parent: null,
            defaultTxType: TransactionType.Income,
        },
    ];
    return (
        <QuickCategoriesBox>
            {categories.map(category =>
                <Link to={paths.transactions.add({
                    account: account.id,
                    category: category.id,
                })}>
                    <CategoryIcon category={category} size={'large'}/>
                </Link>,
            )}
        </QuickCategoriesBox>
    );
};
