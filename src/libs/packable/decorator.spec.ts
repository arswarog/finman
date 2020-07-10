import { Packer } from './packable';
import { Fields, Type } from './packable.types';
import { Packable, PackableClass, SelfPackableClass } from './decorator';

describe('Packable', () => {
    describe('decorators', () => {
        it('base', () => {
            console.log('--- Pos ---');

            @PackableClass(data => new Pos(data as any))
            class Pos {
                @Packable(Number) x: number;
                @Packable(Number) y: number;

                constructor(data: Fields<Pos>) {
                    Object.assign(this, data);
                }
            }

            console.log('--- Money ---');

            @SelfPackableClass((target: Type<Money>) => {
                console.log(target);
                console.log(target.fromJSON);
                console.log(target.toJSON);
                return new Packer(target.fromJSON, target.toJSON);
            })
            class Money {
                amount: number;
                currency: string;

                static fromJSON(data: any): Money {
                    if (typeof data !== 'string')
                        throw new Error(`Data must be a string`);

                    const [amount, currency] = data.split(' ', 2);

                    return new Money({
                        amount: +amount,
                        currency,
                    });
                }

                static toJSON(money: Money): any {
                    return money.toJSON();
                }

                constructor(data: Partial<Fields<Money>>) {
                    Object.assign(this, data);
                }

                toJSON(): any {
                    return this.amount + ' ' + this.currency;
                }
            }

            Packer.for(Money);

            console.log('--- Data ---');

            @PackableClass(data => new Data(data as any))
            class Data {
                @Packable(String)
                name: string;

                @Packable(Money)
                amount: Money;

                @Packable([Pos])
                positions: Pos[];

                non: boolean = false;

                constructor(data: Fields<Data>) {
                    Object.assign(this, data);
                }
            }

            console.log('--- Proc ---');

            const amount = new Money({amount: 100, currency: 'BTC'});
            const data = new Data({
                name: '12',
                amount,
                positions: [
                    new Pos({x: 0, y: 0}),
                    new Pos({x: 5, y: 5}),
                    new Pos({x: 10, y: 10}),
                ],
                non: false,
            });

            const packer = Packer.for(Data);
            const packed = packer.encode(data);
            expect(packed).toEqual({
                name: '12',
                amount: '100 BTC',
                positions: [
                    {x: 0, y: 0},
                    {x: 5, y: 5},
                    {x: 10, y: 10},
                ],
            });
            expect(Object.keys(packed)).toEqual([
                'name', 'amount', 'positions',
            ]);
            const restored = packer.decode(packed);
            expect(restored).toStrictEqual(data);
        });
    });
});
