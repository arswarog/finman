import { Account } from './account.class';
import { Money } from '../money/money.class';
import { Month } from '../month/month.class';
import { makeTestMonth1, makeTestMonth2 } from '../month/month.class.spec';
import { Day } from '../day/day.class';
import { TransactionType } from '../transaction/transaction.types';
import { SyncStatus } from '../common/common.types';

describe('Account class', () => {
    describe('forceSetHead', () => {
        it('base', () => {
            // arrange
            const prepareAccount = Account.create('test');
            const baseMonth = makeTestMonth1(prepareAccount.id);
            const baseAccount = prepareAccount.UNSAFE_forceSetHead(baseMonth, []);
            expect(baseAccount.months).toEqual([
                baseMonth.getBrief(),
            ]);
            expect(baseAccount).toHaveProperty('balance', baseMonth.summary.balance);
            expect(baseAccount).toHaveProperty('income', baseMonth.summary.income);
            expect(baseAccount).toHaveProperty('expense', baseMonth.summary.expense);

            // act
            const month = makeTestMonth2(prepareAccount.id);
            const account = baseAccount.UNSAFE_forceSetHead(month, []);

            // assert
            expect(account.months).toEqual([
                month.getBrief(),
            ]);
            expect(account).toHaveProperty('balance', month.summary.balance);
            expect(account).toHaveProperty('income', month.summary.income);
            expect(account).toHaveProperty('expense', month.summary.expense);
        });
        it('incomplete chain', () => {
            // arrange
            const prepareAccount = Account.create('test');
            const baseMonth = makeTestMonth1(prepareAccount.id);
            const baseAccount = prepareAccount.UNSAFE_forceSetHead(baseMonth, []);
            expect(baseAccount.months).toEqual([
                baseMonth.getBrief(),
            ]);
            expect(baseAccount).toHaveProperty('balance', baseMonth.summary.balance);
            expect(baseAccount).toHaveProperty('income', baseMonth.summary.income);
            expect(baseAccount).toHaveProperty('expense', baseMonth.summary.expense);

            // act
            const month = makeTestMonth2(prepareAccount.id);
            const nextMonth = month.createNextBlock('2020-03', 1591879518572);
            expect(() => baseAccount.UNSAFE_forceSetHead(nextMonth, []))
                .toThrow(`Required months: ${month.id}`);
        });
    });
    describe('updateHead', () => {
        it('set any first month', () => {
            // arrange
            const baseAccount = Account.create('test');
            const month = makeTestMonth1(baseAccount.id);

            // act
            const account = baseAccount.updateHead(month);

            // assert
            expect(account).toHaveProperty('balance', Money.from(month.summary.balance));
            expect(account).toHaveProperty('income', Money.from(month.summary.income));
            expect(account).toHaveProperty('expense', Money.from(month.summary.expense));

            // act
            const month2 = makeTestMonth2(baseAccount.id);
            const account2 = baseAccount.updateHead(month2);

            // assert
            expect(account2.months.length).toBe(1);
            expect(account2).toHaveProperty('balance', Money.from(month2.summary.balance));
            expect(account2).toHaveProperty('income', Money.from(month2.summary.income));
            expect(account2).toHaveProperty('expense', Money.from(month2.summary.expense));
        });
        it('update first month (month is prepared)', () => {
            // arrange: create first chain
            const prepareAccount = Account.create('test');
            const baseMonth = makeTestMonth1(prepareAccount.id).changeSyncStatus(SyncStatus.Prepared);
            const baseAccount = prepareAccount.updateHead(baseMonth, []);
            expect(baseAccount.months).toEqual([
                baseMonth.getBrief(),
            ]);
            expect(baseAccount).toHaveProperty('balance', baseMonth.summary.balance);
            expect(baseAccount).toHaveProperty('income', baseMonth.summary.income);
            expect(baseAccount).toHaveProperty('expense', baseMonth.summary.expense);

            // arrange: update chain
            const day1 = Day.create('2020-01-01')
                            .addTransaction({
                                id: '23ef9df2-e73e-4b85-8657-8635d9b8815f',
                                amount: Money.create(12, 'RUB'),
                                type: TransactionType.Income,
                                title: 'Some income',
                                category: '',
                            });
            const month = baseMonth.updateDay(day1);
            expect(month.id).not.toEqual(baseMonth.id);

            // act: update account
            const account = baseAccount.updateHead(month, [month]);

            // assets
            expect(JSON.stringify(account.months, null, 2)).toEqual(JSON.stringify([
                month.getBrief(),
            ], null, 2));
            expect(account.months).toEqual([
                month.getBrief(),
            ]);
            expect(account).toHaveProperty('balance', month.summary.balance);
            expect(account).toHaveProperty('income', month.summary.income);
            expect(account).toHaveProperty('expense', month.summary.expense);
        });
        it('update first month (month is not synced)', () => {
            // arrange: create first chain
            const prepareAccount = Account.create('test');
            const baseMonth = makeTestMonth1(prepareAccount.id);
            const baseAccount = prepareAccount.updateHead(baseMonth, []);
            expect(baseAccount.months).toEqual([
                baseMonth.getBrief(),
            ]);
            expect(baseAccount).toHaveProperty('balance', baseMonth.summary.balance);
            expect(baseAccount).toHaveProperty('income', baseMonth.summary.income);
            expect(baseAccount).toHaveProperty('expense', baseMonth.summary.expense);

            // arrange: update chain
            const day1 = Day.create('2020-01-01')
                            .addTransaction({
                                id: '0725cf6e-8851-43cf-88fa-7d87771e5767',
                                amount: Money.create(12, 'RUB'),
                                type: TransactionType.Income,
                                title: 'Some income',
                                category: '',
                            });
            const month = baseMonth.updateDay(day1);
            expect(month).not.toEqual(baseMonth);
            expect(month.id).not.toEqual(baseMonth.id);

            // act: update account
            const account = baseAccount.updateHead(month, [month]);

            // assets
            expect(JSON.stringify(account.months, null, 2)).toEqual(JSON.stringify([
                month.getBrief(),
            ], null, 2));
            expect(account.months).toEqual([
                month.getBrief(),
            ]);
            expect(account).toHaveProperty('balance', month.summary.balance);
            expect(account).toHaveProperty('income', month.summary.income);
            expect(account).toHaveProperty('expense', month.summary.expense);
        });
        it('update chain in the middle', () => {
            // arrange: create first chain
            const prepareAccount = Account.create('test');
            const baseMonth = makeTestMonth1(prepareAccount.id).changeSyncStatus(SyncStatus.Prepared);
            const baseAccount = prepareAccount.updateHead(baseMonth, []);
            expect(baseAccount.months).toEqual([
                baseMonth.getBrief(),
            ]);
            expect(baseAccount).toHaveProperty('balance', baseMonth.summary.balance);
            expect(baseAccount).toHaveProperty('income', baseMonth.summary.income);
            expect(baseAccount).toHaveProperty('expense', baseMonth.summary.expense);

            // arrange: update chain
            const day1 = Day.create('2020-01-01')
                            .addTransaction({
                                id: '23ef9df2-e73e-4b85-8657-8635d9b8815f',
                                amount: Money.create(12, 'RUB'),
                                type: TransactionType.Income,
                                title: 'Some income',
                                category: '',
                            });
            const month = baseMonth.updateDay(day1);
            const nextMonth = month.createNextBlock('2020-02', 1591879518572);
            expect(month.id).not.toEqual(baseMonth.id);
            expect(nextMonth.prevMonths).toEqual([month.id]);

            // act 1: incomplete chain
            expect(() => baseAccount.updateHead(nextMonth, []))
                .toThrow(`Required months: ${month.id}`);

            // act 2: update account
            const account = baseAccount.updateHead(nextMonth, [month]);

            // assets
            expect(JSON.stringify(account.months, null, 2)).toEqual(JSON.stringify([
                nextMonth.getBrief(),
                month.getBrief(),
            ], null, 2));
            expect(account.months).toEqual([
                nextMonth.getBrief(),
                month.getBrief(),
            ]);
            expect(account).toHaveProperty('balance', month.summary.balance);
            expect(account).toHaveProperty('income', month.summary.income);
            expect(account).toHaveProperty('expense', month.summary.expense);
        });
        it('deny to force set header', () => {
            // arrange
            const prepareAccount = Account.create('test');
            const baseMonth = makeTestMonth1(prepareAccount.id);
            const baseAccount = prepareAccount.updateHead(baseMonth, []);
            expect(baseAccount.months).toEqual([
                baseMonth.getBrief(),
            ]);

            // act
            const month = makeTestMonth2(prepareAccount.id);
            expect(() => baseAccount.updateHead(month, []))
                .toThrow(``);
        });
    });
    describe('checkChain', () => {
        it('no months', () => {
            // arrange
            const account = Account.create('test');

            // act
            expect(account.checkChain()).toBeTruthy();
        });
        it('1 month', () => {
            // arrange
            const baseAccount = Account.create('test');
            const month = Month.createFirstBlock(baseAccount.id, '2020-05', 1415124234);
            const account = baseAccount.updateHead(month);
            expect(account.months.length).toBe(1);

            // act
            expect(account.checkChain()).toBeTruthy();
        });
        it('invalid chain', () => {
            // arrange
            const baseAccount = Account.create('test');
            const month = Month.createFirstBlock(baseAccount.id, '2020-01', 1415124234);
            const nextMonth = month.createNextBlock('2020-02', 1591891143948);
            const account = baseAccount.updateHead(nextMonth, [month]);

            (account.months[0].prevMonths as any) = [];
            expect(account.months[0].prevMonths).toEqual([]);

            // act
            expect(account.checkChain()).toBeTruthy();
        });
    });
    describe('packable', () => {
        it('base', () => {
            const prepareAccount = Account.create('test');
            const baseMonth = makeTestMonth1(prepareAccount.id).changeSyncStatus(SyncStatus.Prepared);
            const account = prepareAccount.updateHead(baseMonth, []);

            const json = Account.toJSON(account);
            const restored = Account.fromJSON(json);
            expect(restored).toStrictEqual(account);
        });
    });
});
