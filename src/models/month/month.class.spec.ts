import { Month } from './month.class';
import { EmptyExtendSummary, IExtendSummary, UUID } from '../common/common.types';
import { Day } from '../day/day.class';
import { ITransaction, TransactionType } from '../transaction/transaction.types';
import { Money } from '../money/money.class';
import { Transaction } from '../transaction/transaction.class';
import { SyncStatus } from './month.types';

describe('Month class', () => {
    const wallet = '0-1-0-0';
    describe('generateID', () => {
        const wallet = '0-1-0-0';
        it('May, 2020', () => {
            const month = Month.createFirstBlock(wallet, '2020-05', 1590327753509);

            expect(month.id).toBe('25c5eca7-9c98-2c49-aed3-88ceb7caecd5');
            expect(month.month).toBe('2020-05');
        });
        it('February, 2010', () => {
            const month = Month.createFirstBlock(wallet, '2010-02', 1265014812127);

            expect(month.id).toBe('1e14b669-81c2-0c49-aed3-88ceb7caecd5');
            expect(month.month).toBe('2010-02');

            const day = Day.create('2010-02-01')
                           .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                           .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
            const month2 = month.updateDay(day);

            expect(month2.id).toBe('1e14b669-81c2-0976-536b-6d40e252c19f');
            expect(month2.month).toBe('2010-02');

            const day2 = day.addTransaction(Transaction.createWithID('0012', TransactionType.Expense, 25, 'RUB'));
            const month3 = month2.updateDay(day2);

            expect(month3.id).toBe('1e14b669-81c2-0866-260f-15923d707111');
            expect(month3.month).toBe('2010-02');
        });
        it('invalid version', () => {
            const month = Month.createFirstBlock(wallet, '2020-05', 1590327753509);
            Object.assign(month, {version: 2});

            expect(month.version).toBe(2);
            expect(() => Month.generateID(month))
                .toThrowError('Version 2 not supported')
        });
    });
    describe('getDataHash', () => {
        const wallet = '0-1-0-0';
        it('empty month', () => {
            const month = Month.createFirstBlock(wallet, '2020-05', 1590327753509);

            const hash = month.getDataHash();
            expect(hash).toBe('f2b9a177cea1906826f971984a0e741a6c542a32');
        });
        it('two different months with one copy of data', () => {
            const day = Day.create('2010-02-01')
                           .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                           .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));

            const month1 = Month.createFirstBlock(wallet, '2010-02', 1265014812127)
                                .updateDay(day);
            const month2 = Month.createFirstBlock(wallet, '2010-02', 1265027052127)
                                .updateDay(day);

            const hash1 = month1.getDataHash();
            const hash2 = month2.getDataHash();

            expect(hash1).toBe(hash2);
        });
        it('two different months with same data', () => {
            const day1 = Day.create('2010-02-01')
                            .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                            .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
            const month1 = Month.createFirstBlock(wallet, '2010-02', 1265014812127)
                                .updateDay(day1);

            const day2 = Day.create('2010-02-01')
                            .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                            .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
            const month2 = Month.createFirstBlock(wallet, '2010-02', 1265027052127)
                                .updateDay(day2);

            const hash1 = month1.getDataHash();
            const hash2 = month2.getDataHash();

            expect(hash1).toBe(hash2);
        });
        it('two different months with a bit different data', () => {
            const day1 = Day.create('2010-02-01')
                            .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                            .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
            const month1 = Month.createFirstBlock(wallet, '2010-02', 1265014812127)
                                .updateDay(day1);

            const day2 = Day.create('2010-02-01')
                            .addTransaction(Transaction.createWithID('0012', TransactionType.Income, 100, 'RUB'))
                            .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
            const month2 = Month.createFirstBlock(wallet, '2010-02', 1265027052127)
                                .updateDay(day2);

            const hash1 = month1.getDataHash();
            const hash2 = month2.getDataHash();

            expect(hash1).not.toBe(hash2);
        });
        it('two different months with another order of transactions', () => {
            const day1 = Day.create('2010-02-01')
                            .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                            .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
            const month1 = Month.createFirstBlock(wallet, '2010-02', 1265014812127)
                                .updateDay(day1);

            const day2 = Day.create('2010-02-01')
                            .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'))
                            .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'));
            const month2 = Month.createFirstBlock(wallet, '2010-02', 1265027052127)
                                .updateDay(day2);

            const hash1 = month1.getDataHash();
            const hash2 = month2.getDataHash();

            expect(hash1).not.toBe(hash2);
        });
        it('two completely different months with with same data', () => {
            const day = Day.create('2010-02-01')
                           .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                           .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
            const month1 = Month.createFirstBlock('1-1-1-1', '2010-02', 1265014812127)
                                .updateDay(day);

            const month2 = Month.createFirstBlock('0-1-0-1', '2010-02', 1265027052127)
                                .updateDay(day);

            const hash1 = month1.getDataHash();
            const hash2 = month2.getDataHash();

            expect(hash1).toBe(hash2);
        });
    });
    describe('static createFirstBlock', () => {
        it('May, 2020', () => {
            const month = Month.createFirstBlock(wallet, '2020-05', 1590327754509);

            expect(month.id).toBe('25c5eca7-9ca8-2c49-aed3-88ceb7caecd5');
            expect(month.month).toBe('2020-05');
            expect(month.account).toBe(wallet);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(31);
        });
        it('February, 2020', () => {
            const month = Month.createFirstBlock(wallet, '2020-02', 123151213235);
            expect(month.month).toBe('2020-02');
            expect(month.account).toBe(wallet);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(29);
        });
        it('February, 2022', () => {
            const month = Month.createFirstBlock(wallet, '2022-02', 123151213235);
            expect(month.month).toBe('2022-02');
            expect(month.account).toBe(wallet);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(28);
        });
    });
    describe('createDay', () => {
        const month = Month.createFirstBlock(wallet, '2022-02', 123151213235);
        it('1 (valid)', () => {
            const day = month.createDay(1);
            expect(day).toEqual(Day.create('2022-02-01'));
        });
        it('31 (invalid because february)', () => {
            expect(() => month.createDay(31))
                .toThrowError('Invalid month in "2022-02-31"');
        });
    });
    describe('updateDay', () => {
        it('add first day', () => {
            const tx: ITransaction = {
                id: '0-0-0-0',
                category: '',
                title: '',
                type: TransactionType.Income,
                amount: Money.fromJSON('1 RUB'),
            };

            const month1 = Month.createFirstBlock(wallet, '2020-05', 123151213235);

            const day = month1.createDay(5)
                              .addTransaction(tx);

            const month = month1.updateDay(day);

            expect(month.summary).toEqual(<IExtendSummary>{
                balance: Money.fromJSON('1 RUB'),
                expense: Money.empty,
                income: Money.fromJSON('1 RUB'),
                balanceOnStart: Money.empty,
                balanceOnEnd: Money.fromJSON('1 RUB'),
            });
            expect(month.days).toEqual([day]);
        });
        it('add day from another month', () => {
            const tx: ITransaction = {
                id: '0-0-0-0',
                category: '',
                title: '',
                type: TransactionType.Income,
                amount: Money.fromJSON('1 RUB'),
            };

            const month1 = Month.createFirstBlock(wallet, '2020-05', 123151213235);

            const day = Day.create('2010-01-01')
                           .addTransaction(tx);

            expect(() => month1.updateDay(day))
                .toThrowError(`Day "2010-01-01" not of month "2020-05"`)
        });
        it('invalid day', () => {
            const month1 = Month.createFirstBlock(wallet, '2020-05', 123151213235);

            expect(() => month1.updateDay({} as any))
                .toThrowError(`Cannot update month, newDay must be instance of Day`)
        });
    });
    describe('syncStatus', () => {
        describe('change', () => {
            function checkForFailingToChangeStatus(month: Month, baseStatus: SyncStatus, statuses: SyncStatus[]) {
                it(`to ${SyncStatus[baseStatus]} (not changed)`, () => {
                    expect(month.syncStatus).toEqual(baseStatus);

                    const newMonth = month.changeSyncStatus(baseStatus);

                    expect(newMonth.syncStatus).toEqual(baseStatus);
                    expect(newMonth === month).toBeTruthy();
                });

                statuses.forEach(status =>
                    it(`to ${SyncStatus[status]} (not accepted)`, () => {
                        expect(month.syncStatus).toEqual(baseStatus);

                        expect(() => month.changeSyncStatus(status))
                            .toThrowError(/Can not change sync status from "\w+" to "\w+"/);
                    }),
                );
            }

            describe('from NotSynced', () => {
                const base = Month.createFirstBlock(wallet, '2020-05', 123151213235);

                checkForFailingToChangeStatus(
                    base,
                    SyncStatus.NoSynced,
                    [
                        // SyncStatus.NoSynced,
                        SyncStatus.Syncing,
                        SyncStatus.FullySynced,
                    ],
                );

                it('to Prepared', () => {
                    expect(base.syncStatus).toEqual(SyncStatus.NoSynced);

                    const month = base.changeSyncStatus(SyncStatus.Prepared);

                    expect(month.syncStatus).toBe(SyncStatus.Prepared);
                });
            });
            describe('from Prepared', () => {
                const base = Month.createFirstBlock(wallet, '2020-05', 123151213235)
                                  .changeSyncStatus(SyncStatus.Prepared);

                checkForFailingToChangeStatus(
                    base,
                    SyncStatus.Prepared,
                    [
                        SyncStatus.NoSynced,
                        // SyncStatus.Prepared,
                        SyncStatus.FullySynced,
                    ],
                );

                it('to Syncing', () => {
                    expect(base.syncStatus).toEqual(SyncStatus.Prepared);

                    const month = base.changeSyncStatus(SyncStatus.Syncing);

                    expect(month.syncStatus).toBe(SyncStatus.Syncing);
                });
            });
            describe('from Syncing', () => {
                const base = Month.createFirstBlock(wallet, '2020-05', 123151213235)
                                  .changeSyncStatus(SyncStatus.Prepared)
                                  .changeSyncStatus(SyncStatus.Syncing);

                checkForFailingToChangeStatus(
                    base,
                    SyncStatus.Syncing,
                    [
                        SyncStatus.NoSynced,
                        SyncStatus.Prepared,
                        // SyncStatus.Syncing,
                    ],
                );

                it('to FullySynced', () => {
                    expect(base.syncStatus).toEqual(SyncStatus.Syncing);

                    const month = base.changeSyncStatus(SyncStatus.FullySynced);

                    expect(month.syncStatus).toBe(SyncStatus.FullySynced);
                });
            });
            describe('from FullySynced', () => {
                const base = Month.createFirstBlock(wallet, '2020-05', 123151213235)
                                  .changeSyncStatus(SyncStatus.Prepared)
                                  .changeSyncStatus(SyncStatus.Syncing)
                                  .changeSyncStatus(SyncStatus.FullySynced);

                checkForFailingToChangeStatus(
                    base,
                    SyncStatus.FullySynced,
                    [
                        SyncStatus.NoSynced,
                        SyncStatus.Prepared,
                        SyncStatus.Syncing,
                        // SyncStatus.FullySynced,
                    ],
                );
            });
        });
        describe('=== noSynced', () => {
            it('add transactions', () => {
                const tx: ITransaction = {
                    id: '0-0-0-0',
                    category: '',
                    title: '',
                    type: TransactionType.Income,
                    amount: Money.fromJSON('1 RUB'),
                };

                const month1 = Month.createFirstBlock(wallet, '2020-05', 123151213235);

                const day = month1.createDay(5)
                                  .addTransaction(tx);

                const month = month1.updateDay(day);

                expect(month.id).not.toEqual(month1.id);
                expect(month.dataHash).not.toEqual(month1.dataHash);
            });
        });
        describe('!== noSynced', () => {
            it('add first day', () => {
                const tx: ITransaction = {
                    id: '0-0-0-0',
                    category: '',
                    title: '',
                    type: TransactionType.Income,
                    amount: Money.fromJSON('1 RUB'),
                };

                const month1 = Month.createFirstBlock(wallet, '2020-05', 123151213235);

                const day = month1.createDay(5)
                                  .addTransaction(tx);

                const month = month1.updateDay(day);

                expect(month.summary).toEqual(<IExtendSummary>{
                    balance: Money.fromJSON('1 RUB'),
                    expense: Money.empty,
                    income: Money.fromJSON('1 RUB'),
                    balanceOnStart: Money.empty,
                    balanceOnEnd: Money.fromJSON('1 RUB'),
                });
                expect(month.days).toEqual([day]);
            });
        });
    });
    describe('createNextBlock', () => {
        const wallet = '0-1-0-0';
        const firstMonthsDay = Day.create('2020-05-10')
                                  .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                                  .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
        const firstMonth = Month.createFirstBlock(wallet, '2020-05', 1590327753509)
                                .updateDay(firstMonthsDay);

        describe('next has link to previous block', () => {
            it('base', () => {
                const day = Day.create('2020-07-03')
                               .addTransaction(Transaction.createWithID('0110', TransactionType.Income, 115, 'RUB'))
                               .addTransaction(Transaction.createWithID('0111', TransactionType.Expense, 83, 'RUB'));

                const month = firstMonth.createNextBlock('2020-07', 1590347753509);

                expect(month.month).toBe('2020-07');
                expect(month.timestamp).toBe(1590347753509);
                expect(month.prevMonths).toEqual([firstMonth.id]);
                expect(month.prevVersions).toEqual([]);
            });
        });
        describe('next has start balance from previous block', () => {
            it('base', () => {
                const day = Day.create('2020-07-03')
                               .addTransaction(Transaction.createWithID('0110', TransactionType.Income, 115, 'RUB'))
                               .addTransaction(Transaction.createWithID('0111', TransactionType.Expense, 83, 'RUB'));

                const month = firstMonth.createNextBlock('2020-07', 1590347753509);


                expect(month.summary.balanceOnStart).toEqual(Money.create(50, 'RUB'));
            });
        });
    });
    describe('recalculateWithNewStartBalance', () => {
        let month: Month;
        beforeEach(() => {
            const tx: ITransaction = {
                id: '0-0-0-0',
                category: '',
                title: '',
                type: TransactionType.Income,
                amount: Money.fromJSON('1 RUB'),
            };
            const month1 = Month.createFirstBlock(wallet, '2020-05', 123151213235);

            const day = month1.createDay(5)
                              .addTransaction(tx);

            month = month1.updateDay(day);

            expect(month.summary).toEqual(<IExtendSummary>{
                balance: Money.fromJSON('1 RUB'),
                expense: Money.empty,
                income: Money.fromJSON('1 RUB'),
                balanceOnStart: Money.empty,
                balanceOnEnd: Money.fromJSON('1 RUB'),
            });
        });

        it('add first day', () => {
            const month1 = month.recalculateWithNewStartBalance(Money.fromJSON('5 RUB'));
            expect(month1.summary).toEqual(<IExtendSummary>{
                balance: Money.fromJSON('1 RUB'),
                expense: Money.empty,
                income: Money.fromJSON('1 RUB'),
                balanceOnStart: Money.fromJSON('5 RUB'),
                balanceOnEnd: Money.fromJSON('6 RUB'),
            });
        });
    });
});

export function emptyMonth1(accountId: UUID): Month {
    return Month.createFirstBlock(accountId, '2020-01', 123151213235);
}

export function month1(accountId: UUID): Month {
    const day1 = Day.create('2020-01-01')
                    .addTransaction({
                        id: '23ef9df2-e73e-4b85-8657-8635d9b8815f',
                        amount: Money.create(12, 'RUB'),
                        type: TransactionType.Income,
                        title: 'Some income',
                        category: '',
                    });

    const day2 = Day.create('2020-01-02')
                    .addTransaction({
                        id: '3844e7f5-8ae2-499a-b031-6286d46a55b3',
                        amount: Money.create(7, 'RUB'),
                        type: TransactionType.Expense,
                        title: 'Some expense',
                        category: '',
                    });

    return emptyMonth1(accountId).updateDay(day1)
                                 .updateDay(day2);
}

export function emptyMonth2(accountId: UUID): Month {
    return Month.createFirstBlock(accountId, '2020-02', 123151213235);
}

export function month2(accountId: UUID): Month {
    const day1 = Day.create('2020-02-01')
                    .addTransaction({
                        id: 'f38e02d8-86f1-407b-8462-a3bfb93dccd3',
                        amount: Money.create(147, 'RUB'),
                        type: TransactionType.Income,
                        title: 'Other income',
                        category: '',
                    });

    const day2 = Day.create('2020-02-02')
                    .addTransaction({
                        id: 'c7c16a63-5a32-41c9-844e-2f22abb765a3',
                        amount: Money.create(148, 'RUB'),
                        type: TransactionType.Expense,
                        title: 'Other expense',
                        category: '',
                    });

    return emptyMonth2(accountId).updateDay(day1)
                                 .updateDay(day2);
}
