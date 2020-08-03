import { Map, Set } from 'immutable';
import { AbstractDayGrip } from '../abstract-grip/day-grip.class';
import { UUID } from '../common/common.types';
import { IDay } from '../day/day.class';
import { IAccount } from '../account/account.types';
import { ICategory } from '../category/category.types';
import { Money } from '../money/money.class';
import { ITransactionGrip } from '../abstract-grip/grip.types';
import { TransactionType } from '../transaction/transaction.types';

export class AccountDayGrip extends AbstractDayGrip {
    constructor(balanceOnStart: Money,
                day: IDay,
                account: IAccount,
                categories: Map<UUID, ICategory>) {
        const transactions: ITransactionGrip[] = day.transactions.map(tx => {
            const category = categories.get(tx.category || 'default');
            if (!category)
                throw new Error(`Category "${tx.category}" not found`);

            const grip = {
                account,
                amount: tx.amount,
                changeAmount: tx.amount,
                title: tx.title,
                type: tx.type,
                category,
                createdAt: tx.createdAt ? new Date(tx.createdAt) : null,
                updatedAt: tx.updatedAt ? new Date(tx.updatedAt) : null,
                date: day.date,
                sourceTxs: [tx],
                tags: Set(),
            };

            switch (tx.type) {
                case TransactionType.Income:
                    return grip;
                case TransactionType.Expense:
                    return {
                        ...grip,
                        changeAmount: tx.amount.negative(),
                    };
                default:
                    throw new Error(`Unsupported type "${TransactionType[tx.type]}"`);
            }
        });

        super(day.date, balanceOnStart, transactions);
    }
}
