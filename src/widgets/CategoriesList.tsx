import React from 'react';
import { Icon, Icons } from '../ui-kit/Icon';
import { CategoryIcon } from '../components/CategoryIcon';
import { ICategory } from '../models/category/category.types';
import { TransactionType } from '../models/transaction/transaction.types';
import { Money } from '../models/money/money.class';
import { MoneyView } from '../components/MoneyView';

export const CategoriesList = () => {
    const categories: (ICategory & { amount: Money })[] = [
        {
            id: '0000-111',
            name: 'Home',
            image: 'essentials-01',
            parent: null,
            defaultTxType: TransactionType.Income,
            amount: Money.create('1584', 'RUB'),
        },
        {
            id: '0000-111',
            name: 'Car',
            image: 'essentials-08',
            parent: null,
            defaultTxType: TransactionType.Income,
            amount: Money.create('-23', 'RUB'),
        },
        {
            id: '0000-111',
            name: 'Home',
            image: 'essentials-01',
            parent: null,
            defaultTxType: TransactionType.Income,
            amount: Money.create('1584', 'RUB'),
        },
        {
            id: '0000-111',
            name: 'Car',
            image: 'essentials-08',
            parent: null,
            defaultTxType: TransactionType.Income,
            amount: Money.create('-23', 'RUB'),
        },
        {
            id: '0000-111',
            name: 'Car',
            image: 'essentials-08',
            parent: null,
            defaultTxType: TransactionType.Income,
            amount: Money.create('-23', 'RUB'),
        },
    ];
    return (
        <ul className="listview image-listview inset mt-2 mb-2" style={{
            margin: '0',
        }}>
            {categories.map(category => (
                <li>
                    <a href="#" className="item">
                        <div className="icon-box">
                            <CategoryIcon category={category}/>
                        </div>
                        <div className="in">
                            <div>{category.name}</div>
                            <span className="text-muted"><MoneyView money={category.amount}/></span>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    );
};
