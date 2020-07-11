import { v1 as uuidGenerator } from 'uuid';
import { ITransaction, TransactionType } from './transaction.types';
import { UUID } from '../common/common.types';
import { Money } from '../money/money.class';
import { Packable, PackableClass } from '../../libs/packable/decorator';
import { Packer } from '../../libs/packable/packable';

@PackableClass(data => new Transaction(data))
export class Transaction implements ITransaction {
    @Packable(String) public id: UUID = '';
    @Packable(Money) public amount: Money = Money.empty;
    @Packable(Number) public type: TransactionType = TransactionType.Removed;
    @Packable(String) public category: UUID | '' = '';
    @Packable(String) public title: string | '' = '';
    @Packable(Number) public createdAt: number = 0;
    @Packable(Number) public updatedAt: number = 0;

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

    public static fromJSON(data: any): Transaction { // TODO больше валидации
        return Packer.get(Transaction).decode(data);
    }

    public static toJSON(tx: Transaction): any {
        return tx.toJSON();
    }

    private constructor(data: unknown) {
        Object.assign(this, data);
    }

    public toJSON(): object {
        return Packer.get(Transaction).encode(this);
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
