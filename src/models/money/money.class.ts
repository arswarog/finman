import { SelfPackableClass } from '../../libs/packable/decorator';
import { Packer } from '../../libs/packable/packable';

const DEFAULT_CURRENCY = 'RUB';

export interface ICurrency {
    code: string;
    symbol: string;
    precision: number;
}

export const currencies: { [key: string]: ICurrency } = {
    RUB: {code: 'RUB', symbol: '₽', precision: 2},
};

@SelfPackableClass(target => new Packer(target.fromJSON, target.toJSON))
export class Money {
    public readonly amount: string = '';

    public static from(value: Money | string): Money {
        if (typeof value === 'string')
            return Money.fromJSON(value);
        if (value instanceof Money)
            return value.clone();
        throw new Error('Can not convert invalid data to Money');
    }

    public static fromJSON(data: any): Money {
        if (typeof data === 'object'
            && typeof data.subunits === 'number'
            && typeof data.currency === 'object'
            && typeof data.currency.code === 'string')
            return new Money(data.subunits, data.currency);

        if (typeof data !== 'string')
            throw new Error(`Amount "${data}" must be a string`);

        let parts = data.trim().split(' ');
        if (!parts || parts.length !== 2)
            throw new Error(`Money "${data}" must have valid format`);

        const amountText = parts[0];
        const currencyName = parts[1].toUpperCase();

        const currency = currencies[currencyName];
        if (!currency)
            throw new Error(`Unsupported currency "${currencyName}"`);

        const units = +amountText;
        if (Number.isNaN(units))
            throw new Error(`Invalid amount "${amountText}" when parse "${data}"`);

        const subunits = Math.round(units * 10 ** currency.precision);

        return new Money(subunits, currency);
    }

    public static toJSON(money: Money): any {
        return money.toJSON();
    }

    public static create(amount: string | number, currencyName: string): Money {
        if (typeof currencyName !== 'string')
            throw new Error(`Invalid currency "${currencyName}"`);
        currencyName = currencyName.toUpperCase();

        if (typeof amount === 'string') {
            if (!amount || Number.isNaN(+amount))
                throw new Error(`Amount must be valid number but received "${amount}"`);

            amount = +amount;
        }

        const currency = currencies[currencyName];
        if (!currency)
            throw new Error(`Unsupported currency "${currencyName}"`);

        const units = +amount;
        if (Number.isNaN(units))
            throw new Error(`Invalid amount "${amount}"`);

        const subunits = Math.round(units * 10 ** currency.precision);
        return new Money(subunits, currency);
    }

    public static empty: Money;

    private constructor(public readonly subunits: number,
                        public readonly currency: ICurrency) {
        this.amount = (subunits / 10 ** currency.precision).toFixed(2);
    }

    public clone(): Money {
        return new Money(this.subunits, this.currency);
    }

    public toString() {
        if (this.subunits)
            return this.amount + ' ' + this.currency.symbol;
        else
            return '0 ' + this.currency.symbol;
    }

    public toJSON() {
        if (this.subunits)
            return this.amount + ' ' + this.currency.code;
        else
            return '0 ' + this.currency.code;
    }

    public add(money: Money): Money {
        if (this.currency.code !== money.currency.code)
            throw new Error(`Can not do any operations with different currencies`);
        return new Money(this.subunits + money.subunits, this.currency);
    }

    public sub(money: Money): Money {
        if (this.currency.code !== money.currency.code)
            throw new Error(`Can not do any operations with different currencies`);
        return new Money(this.subunits - money.subunits, this.currency);
    }

    public equal(money: Money): boolean {
        if (this.currency.code !== money.currency.code)
            return false;
        return this.subunits === money.subunits;
    }

    public getEntire(): string {
        return Math.floor(this.subunits / 10 ** this.currency.precision).toString();
    }

    public getFractional(): string {
        return (this.subunits / 10 ** this.currency.precision)
            .toFixed(this.currency.precision)
            .substr(-this.currency.precision);
    }

    public getSymbol(): string {
        return this.currency.symbol;
    }

    public negative(): Money {// TODO rename
        return new Money(-this.subunits, this.currency);
    }

    public isPositive() {
        return this.subunits > 0;
    }

    public isNegative() {
        return this.subunits < 0;
    }
}

Money.empty = Money.create(0, DEFAULT_CURRENCY);
