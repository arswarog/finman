const DEFAULT_CURRENCY = 'RUB';

export interface ICurrency {
    code: string;
    symbol: string;
    precision: number;
}

export const currencies: { [key: string]: ICurrency } = {
    RUB: {code: 'RUB', symbol: '₽', precision: 2},
};

export class Money {
    public readonly amount: string;
    public readonly subunits: number;
    public readonly currency: ICurrency;

    public static fromJSON(data: any): Money {
        return new Money(data as string);
    }

    public static readonly empty = new Money('0 ' + DEFAULT_CURRENCY);

    constructor(money: string | Money);
    constructor(currency: Money, subunits: number);
    constructor(amount: string | number, currency: string);
    constructor(amount: Money | string | number, currency?: string | number) {
        if (amount instanceof Money) {
            if (typeof currency === 'number') {
                this.currency = amount.currency;
                this.subunits = currency;
                this.amount = (this.subunits / 10 ** this.currency.precision).toFixed(2);
            } else {
                this.currency = amount.currency;
                this.subunits = amount.subunits;
                this.amount = amount.amount;
            }
            return;
        }
        if (amount && typeof amount === 'object')
            throw new Error(`Argument "${JSON.stringify(amount)}" must be valid Money`);

        if (!currency) {
            if (amount && typeof amount === 'string') {
                let parts = amount.trim().split(' ');
                if (!parts || parts.length !== 2)
                    throw new Error(`Money "${amount}" must have invalid format`);

                amount = parts[0];
                currency = parts[1];
            } else
                throw new Error(`Amount "${amount}" must be a string if currency not specified`);
        }

        if (typeof currency !== 'string')
            throw new Error(`Invalid currency "${currency}"`);

        if (typeof amount === 'number')
            amount = '' + amount;

        currency = currency.toUpperCase();

        this.currency = currencies[currency];
        if (!this.currency)
            throw new Error(`Unsupported currency "${currency}"`);

        const units = +amount;
        if (Number.isNaN(units))
            throw new Error(`Invalid amount "${amount}"`);

        this.subunits = Math.round(units * 10 ** this.currency.precision);
        this.amount = (this.subunits / 10 ** this.currency.precision).toFixed(2);
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
        return new Money(this, this.subunits + money.subunits);
    }

    public sub(money: Money): Money {
        if (this.currency.code !== money.currency.code)
            throw new Error(`Can not do any operations with different currencies`);
        return new Money(this, this.subunits - money.subunits);
    }

    public equal(money: Money): boolean {
        if (this.currency.code !== money.currency.code)
            return false;
        return this.subunits === money.subunits;
    }
}
