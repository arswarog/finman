import { v1 as uuidGenerator } from 'uuid';
import { ITransaction, TransactionType } from './transaction.types';
import { UUID } from '../common/common.types';
import { Money } from '../money/money.class';

export class Transaction implements ITransaction {
    public id: UUID = '';
    public amount: Money = Money.empty;
    public type: TransactionType = TransactionType.Removed;
    public category: UUID | '' = '';
    public title: string | '' = '';
    public createdAt: number = 0;
    public updatedAt: number = 0;

    public static createWithID(id: UUID, type?: TransactionType,
                               amount?: Money): Transaction;
    public static createWithID(id: UUID, type: TransactionType,
                               amount: string | number,
                               currencyName: string): Transaction;
    public static createWithID(id: UUID, type: TransactionType = TransactionType.Removed,
                               amount?: string | number | Money,
                               currencyName?: string): Transaction {
        const tx = new Transaction({
            id,
            amount: Money.empty,
            type,
            category: '',
            title: '',
            createdAt: 0,
            updatedAt: 0,
        });

        if (amount)
            return tx.setAmount(amount as any, currencyName as any);
        else
            return tx;
    }

    public static create(type?: TransactionType,
                         amount?: Money): Transaction;
    public static create(type: TransactionType,
                         amount: string | number,
                         currencyName: string): Transaction;
    public static create(type: TransactionType = TransactionType.Removed,
                         amount?: string | number | Money,
                         currencyName?: string): Transaction {
        const id = uuidGenerator();

        const tx = new Transaction({
            id,
            amount: Money.empty,
            type,
            category: '',
            title: '',
            createdAt: 0,
            updatedAt: 0,
        });

        if (amount)
            return tx.setAmount(amount as any, currencyName as any);
        else
            return tx;
    }

    public static fromJSON(data: ITransaction): Transaction { // TODO больше валидации
        return new Transaction({
            id: data.id,
            amount: Money.from(data.amount),
            type: data.type,
            category: data.category,
            title: data.title,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    private constructor(data: ITransaction) {
        Object.assign(this, data);
    }

    public toJSON(): object {
        return {
            id: this.id,
            amount: this.amount.toJSON(),
            type: this.type,
            category: this.category,
            title: this.title,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    public setAmount(money: Money): Transaction;
    public setAmount(amount: string | number, currencyName: string): Transaction;
    public setAmount(amount: string | number | Money, currencyName?: string): Transaction {
        let money: Money;
        if ((typeof amount === 'string' || typeof amount === 'number') && typeof currencyName === 'string')
            money = Money.create(amount, currencyName);
        else
            money = Money.from(amount as (string | Money));

        return new Transaction({
            ...this,
            amount: money,
        });
    }

    public setType(type: TransactionType): Transaction {
        return new Transaction({
            ...this,
            type,
        });
    }

    public setCategory(category: UUID | ''): Transaction {
        return new Transaction({
            ...this,
            category,
        });
    }

    public setTitle(title: string | ''): Transaction {
        return new Transaction({
            ...this,
            title,
        });
    }

    public setCreatedAt(createdAt: number): Transaction {
        return new Transaction({
            ...this,
            createdAt,
        });
    }

    public setUpdatedAt(updatedAt: number): Transaction {
        return new Transaction({
            ...this,
            updatedAt,
        });
    }
}
