import { Month } from './month.class';
import { EmptyExtendSummary, IExtendSummary, SyncStatus, UUID } from '../common/common.types';
import { Day } from '../day/day.class';
import { ITransaction, TransactionType } from '../transaction/transaction.types';
import { Money } from '../money/money.class';
import { Transaction } from '../transaction/transaction.class';

describe('Month class', () => {
    const accountID = '0-1-0-0';
    describe('generateID', () => {
        const wallet = '0-1-0-0';
        it('May, 2020', () => {
            const month = Month.createFirstBlock(wallet, '2020-05', 1590327753509);

            expect(month.id).toBe('25c5eca7-9c98-2293-ff84-95771b82db9d');
            expect(month.month).toBe('2020-05');
            expect(month.dataHash).toBe('0000000000000000000000000000000000000000');
            expect(month.syncStatus).not.toBe(SyncStatus.NoSynced);
        });
        it('February, 2010', () => {
            const month = Month.createFirstBlock(wallet, '2010-02', 1265014812127);

            expect(month.id).toBe('1e14b669-81c2-0293-ff84-95771b82db9d');
            expect(month.month).toBe('2010-02');
            expect(month.dataHash).toBe('0000000000000000000000000000000000000000');
            expect(month.syncStatus).not.toBe(SyncStatus.NoSynced);

            const day = Day.create('2010-02-01')
                           .addTransaction(Transaction.createWithID('0010', TransactionType.Income, 100, 'RUB'))
                           .addTransaction(Transaction.createWithID('0011', TransactionType.Expense, 50, 'RUB'));
            const month2 = month.updateDay(day);

            expect(month2.id).toBe('1e14b669-81c2-0dcb-8f2e-c9f89c073ee9');
            expect(month2.month).toBe('2010-02');
            expect(month2.dataHash).not.toBe('0000000000000000000000000000000000000000');
            expect(month2.syncStatus).toBe(SyncStatus.NoSynced);

            const day2 = day.addTransaction(Transaction.createWithID('0012', TransactionType.Expense, 25, 'RUB'));
            const month3 = month2.updateDay(day2);

            expect(month3.id).toBe('1e14b669-81c2-0b70-7589-be5200e61ffd');
            expect(month3.month).toBe('2010-02');
            expect(month3.dataHash).not.toBe('0000000000000000000000000000000000000000');
            expect(month3.dataHash).not.toBe(month2.dataHash);
            expect(month3.syncStatus).toBe(SyncStatus.NoSynced);
        });
        it('invalid version', () => {
            const month = Month.createFirstBlock(wallet, '2020-05', 1590327753509);
            Object.assign(month, {version: 2});

            expect(month.version).toBe(2);
            expect(() => Month.generateID(month))
                .toThrowError('Version 2 not supported');
        });
    });
    describe('getDataHash', () => {
        const wallet = '0-1-0-0';
        it('empty month', () => {
            const month = Month.createFirstBlock(wallet, '2020-05', 1590327753509);

            const hash = month.getDataHash();
            expect(hash).toBe('0000000000000000000000000000000000000000');
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
        it('first block must be fixed', () => {
            const month = Month.createFirstBlock(accountID, '2020-05', 1590327754509);

            expect(month.id).toBe('25c5eca7-9ca8-2293-ff84-95771b82db9d');
            expect(month.month).toBe('2020-05');
            expect(month.account).toBe(accountID);
            expect(month.dataHash).toBe('0000000000000000000000000000000000000000');
            expect(month.syncStatus).not.toBe(SyncStatus.NoSynced);
        });
        it('May, 2020', () => {
            const month = Month.createFirstBlock(accountID, '2020-05', 1590327754509);

            expect(month.id).toBe('25c5eca7-9ca8-2293-ff84-95771b82db9d');
            expect(month.month).toBe('2020-05');
            expect(month.account).toBe(accountID);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(31);
        });
        it('February, 2020', () => {
            const month = Month.createFirstBlock(accountID, '2020-02', 123151213235);
            expect(month.month).toBe('2020-02');
            expect(month.account).toBe(accountID);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(29);
        });
        it('February, 2022', () => {
            const month = Month.createFirstBlock(accountID, '2022-02', 123151213235);
            expect(month.month).toBe('2022-02');
            expect(month.account).toBe(accountID);
            expect(month.summary).toEqual(EmptyExtendSummary);
            expect(month.daysInMonth).toBe(28);
        });
    });
    describe('createDay', () => {
        const month = Month.createFirstBlock(accountID, '2022-02', 123151213235);
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

            const month1 = Month.createFirstBlock(accountID, '2020-05', 123151213235);

            const day = month1.createDay(5)
                              .addTransaction(tx);

            const month = month1.updateDay(day);
            expect(month.id).not.toEqual(month1.id);

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

            const month1 = Month.createFirstBlock(accountID, '2020-05', 123151213235);

            const day = Day.create('2010-01-01')
                           .addTransaction(tx);

            expect(() => month1.updateDay(day))
                .toThrowError(`Day "2010-01-01" not of month "2020-05"`);
        });
        it('invalid day', () => {
            const month1 = Month.createFirstBlock(accountID, '2020-05', 123151213235);

            expect(() => month1.updateDay({} as any))
                .toThrowError(`Cannot update month, newDay must be instance of Day`);
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

            const day = Day.create('2020-05-03')
                           .addTransaction(Transaction.createWithID('0110', TransactionType.Income, 115, 'RUB'))
                           .addTransaction(Transaction.createWithID('0111', TransactionType.Expense, 83, 'RUB'));

            describe('from NotSynced', () => {
                const base = Month.createFirstBlock(accountID, '2020-05', 123151213235)
                                  .updateDay(day);

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
                const base = Month.createFirstBlock(accountID, '2020-05', 123151213235)
                                  .updateDay(day)
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
                const base = Month.createFirstBlock(accountID, '2020-05', 123151213235)
                                  .updateDay(day)
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
                const base = Month.createFirstBlock(accountID, '2020-05', 123151213235)
                                  .updateDay(day)
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

                const month1 = Month.createFirstBlock(accountID, '2020-05', 123151213235);

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

                const month1 = Month.createFirstBlock(accountID, '2020-05', 123151213235);

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

        describe('next has link to previous block and fixed', () => {
            it('base', () => {
                const day = Day.create('2020-07-03')
                               .addTransaction(Transaction.createWithID('0110', TransactionType.Income, 115, 'RUB'))
                               .addTransaction(Transaction.createWithID('0111', TransactionType.Expense, 83, 'RUB'));

                const month = firstMonth.createNextBlock('2020-07', 1590347753509);

                expect(month.month).toBe('2020-07');
                expect(month.timestamp).toBe(1590347753509);
                expect(month.prevMonths).toEqual([firstMonth.id]);
                expect(month.prevVersions).toEqual([]);
                expect(month.syncStatus).not.toBe(SyncStatus.NoSynced);
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
    describe('updatePrevMonths', () => {
        const lastPrevMonth = Month.createFirstBlock('test', '2020-01', 1593225331366)
                                   .updateDay(Day.create('2020-01-05')
                                                 .addTransaction(Transaction.create(TransactionType.Income, 1, 'RUB')),
                                   );
        const baseMonth = lastPrevMonth.createNextBlock('2020-03', 1593225473070)
                                       .updateDay(Day.create('2020-03-01')
                                                     .addTransaction(Transaction.create(TransactionType.Income, 100, 'RUB')),
                                       );

        it('createNextBlock must create with start balance from prevMonth', () => {
            // expect
            expect(lastPrevMonth.summary.balanceOnEnd.toJSON()).toEqual(Money.create(1, 'RUB').toJSON());

            expect(baseMonth.summary.balanceOnStart.toJSON()).toEqual(lastPrevMonth.summary.balanceOnEnd.toJSON());
            expect(baseMonth.summary.balanceOnEnd.toJSON()).toEqual(Money.create(101, 'RUB').toJSON());
        });

        it('updatePrevMonths must do nothing if no new prevMonths', () => {
            // act
            const month = baseMonth.updatePrevMonths([lastPrevMonth], 1593226052164);

            // assert
            expect(month).toStrictEqual(baseMonth);
        });

        it('updatePrevMonths must update prevMonths and start balance', () => {
            // arrange
            const prevMonth = lastPrevMonth.updateDay(Day.create('2020-01-10')
                                                         .addTransaction(Transaction.create(TransactionType.Income, 4, 'RUB')));

            // act
            const month = baseMonth.updatePrevMonths([prevMonth], 1593226052164);

            // assert
            expect(month.prevMonths).toEqual([prevMonth.id]);
            expect(month.summary.balanceOnStart.toJSON()).toEqual(Money.create(5, 'RUB').toJSON());
            expect(month.summary.balance.toJSON()).toEqual(Money.create(100, 'RUB').toJSON());
            expect(month.summary.balanceOnEnd.toJSON()).toEqual(Money.create(105, 'RUB').toJSON());
        });

        it('updatePrevMonths can be new month in chain', () => {
            // arrange
            const prevMonth = lastPrevMonth.createNextBlock('2020-02', 1593252867289)
                                           .updateDay(Day.create('2020-02-10')
                                                         .addTransaction(Transaction.create(TransactionType.Income, 4, 'RUB')));

            // act
            const month = baseMonth.updatePrevMonths([prevMonth], 1593252886478);

            // assert
            expect(month.prevMonths).toEqual([prevMonth.id]);
            expect(month.summary.balanceOnStart.toJSON()).toEqual(Money.create(5, 'RUB').toJSON());
            expect(month.summary.balance.toJSON()).toEqual(Money.create(100, 'RUB').toJSON());
            expect(month.summary.balanceOnEnd.toJSON()).toEqual(Money.create(105, 'RUB').toJSON());
        });

        it('updatePrevMonths can not be older then this month', () => {
            // act
            expect(() => lastPrevMonth.updatePrevMonths([baseMonth], 1593226052164))
                .toThrow(`All prevMonths must be earlier then updating month`);
        });

        it('updatePrevMonths can not have same month number', () => {
            // arrange
            const prevMonth = lastPrevMonth.createNextBlock('2020-03', 1593253041423);

            // act
            expect(() => baseMonth.updatePrevMonths([prevMonth], 1593253041882))
                .toThrow(`All prevMonths must be earlier then updating month`);
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
            const month1 = Month.createFirstBlock(accountID, '2020-05', 123151213235);

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
    describe('chaining (user stories)', () => {
        const dayToUnfix1 = Day.create('2020-01-03')
                               .addTransaction(Transaction.createWithID('0110', TransactionType.Income, 115, 'RUB'))
                               .addTransaction(Transaction.createWithID('0111', TransactionType.Expense, 83, 'RUB'));
        const dayToUnfix3 = Day.create('2020-03-03')
                               .addTransaction(Transaction.createWithID('0110', TransactionType.Income, 115, 'RUB'))
                               .addTransaction(Transaction.createWithID('0111', TransactionType.Expense, 83, 'RUB'));

        it('update second month', () => {
            // arrange
            const firstMonth = Month.createFirstBlock(accountID, '2020-01', 1590905914218)
                                    .updateDay(dayToUnfix1)
                                    .changeSyncStatus(SyncStatus.Prepared);

            const secondMonth = firstMonth.createNextBlock('2020-03', 1590906019120)
                                          .updateDay(dayToUnfix3)
                                          .changeSyncStatus(SyncStatus.Prepared);

            // arrange 1
            const tx = Transaction.createWithID(
                '0-0-1-0',
                TransactionType.Income,
                1, 'RUB',
            );
            const day = secondMonth.createDay(5)
                                   .addTransaction(tx);

            // act 1
            const month = secondMonth.updateDay(day);

            // assert 1
            expect(month.syncStatus).toBe(SyncStatus.NoSynced);
            expect(month.id).not.toEqual(secondMonth.id);
            expect(month.prevMonths).toEqual([firstMonth.id]);
            expect(month.prevVersions).toEqual([secondMonth.id]);

            // arrange 2
            const tx2 = Transaction.createWithID(
                '0-0-2-0',
                TransactionType.Income,
                2, 'RUB',
            );
            const day2 = secondMonth.createDay(5)
                                    .addTransaction(tx2);

            // act 2
            const month2 = month.updateDay(day2);

            // assert 2
            expect(month2.syncStatus).toBe(SyncStatus.NoSynced);
            expect(month2.id).not.toEqual(secondMonth.id);
            expect(month2.id).not.toEqual(month.id);
            expect(month2.prevMonths).toEqual([firstMonth.id]);
            expect(month2.prevVersions).toEqual([secondMonth.id]);

            // arrange 3

            const tx3 = Transaction.createWithID(
                '0-0-3-0',
                TransactionType.Income,
                3, 'RUB',
            );
            const day3 = secondMonth.createDay(5)
                                    .addTransaction(tx3);

            // act 3
            const month3 = month2.changeSyncStatus(SyncStatus.Prepared)
                                 .updateDay(day3);

            // assert 3
            expect(month3.id).not.toEqual(secondMonth.id);
            expect(month3.id).not.toEqual(month.id);
            expect(month3.prevMonths).toEqual([firstMonth.id]);
            expect(month3.prevVersions).toEqual([month2.id]);
        });
    });
    describe('getBrief', () => {
        it('default', () => {
            const month = Month.createFirstBlock(accountID, '2020-05', 1590327754509);

            const brief = month.getBrief();

            expect(brief.id).toBe('25c5eca7-9ca8-2293-ff84-95771b82db9d');
            expect(brief.month).toBe('2020-05');
            expect(brief.summary).toEqual(EmptyExtendSummary);
            expect(brief.prevMonths).toEqual([]);
            expect(brief.prevVersions).toEqual([]);
            expect(brief.dataHash).toEqual('0000000000000000000000000000000000000000');
        });
    });
    describe('packing', () => {
        it('base', () => {
            const baseMonth = Month.createFirstBlock(accountID, '2022-02', 123151213235);
            const day = baseMonth.createDay(1);
            const month = baseMonth.updateDay(day);

            const json = month.toJSON();
            expect(json).toEqual({
                'account': '0-1-0-0',
                'dataHash': 'c647ee7de35f4b85910b83a57e0fa081e3a4a16b',
                'days': [
                    {
                        'date': '2022-02-01',
                        'summary': {
                            'balance': '0 RUB',
                            'expense': '0 RUB',
                            'income': '0 RUB',
                        },
                        'transactions': [],
                    },
                ],
                'daysInMonth': 28,
                'id': '27175723-6d3c-2a79-efd4-ce9c6447ad30',
                'month': '2022-02',
                'prevMonths': [],
                'prevVersions': [
                    '27175723-6d3c-2293-ff84-95771b82db9d',
                ],
                'summary': {
                    'balance': '0 RUB',
                    'balanceOnEnd': '0 RUB',
                    'balanceOnStart': '0 RUB',
                    'expense': '0 RUB',
                    'income': '0 RUB',
                },
                'syncStatus': 0,
                'timestamp': 123151213235,
                'version': 1,
            });
            const restored = Month.fromJSON(json);
            expect(restored).toStrictEqual(month);
        });
    });
});

export function emptyMonth1(accountId: UUID): Month {
    return Month.createFirstBlock(accountId, '2020-01', 123151213235);
}

export function makeTestMonth1(accountId: UUID): Month {
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

export function makeTestMonth2(accountId: UUID): Month {
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
